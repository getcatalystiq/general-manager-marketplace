import type { ToolRegistry } from './tasks.js';
import { z } from 'zod';
import { TaskStatus } from '@gm/shared';
import type { Env } from '../src/types.js';

interface ToolContext {
  env: Env;
  organizationId: string;
  userId: string;
}

export function registerOverviewTools(registry: ToolRegistry, ctx: ToolContext) {
  // gm_get_overview
  registry.register(
    'gm_get_overview',
    'Get complete dashboard overview in one call',
    {},
    async () => {
      // Get counts and data in parallel
      const [
        pendingApprovalsResult,
        activeTasksResult,
        queuedTasksResult,
        suggestionsResult,
        recentResultsResult
      ] = await Promise.all([
        ctx.env.DB.prepare(`
          SELECT COUNT(*) as count FROM approvals a
          JOIN tasks t ON a.task_id = t.id
          WHERE t.organization_id = ? AND a.status = 'pending'
        `).bind(ctx.organizationId).first(),

        ctx.env.DB.prepare(`
          SELECT COUNT(*) as count FROM tasks
          WHERE organization_id = ? AND status = 'executing'
        `).bind(ctx.organizationId).first(),

        ctx.env.DB.prepare(`
          SELECT COUNT(*) as count FROM tasks
          WHERE organization_id = ? AND status = 'queued'
        `).bind(ctx.organizationId).first(),

        ctx.env.DB.prepare(`
          SELECT * FROM suggestions
          WHERE organization_id = ? AND status = 'pending'
          ORDER BY created_at DESC LIMIT 5
        `).bind(ctx.organizationId).all(),

        ctx.env.DB.prepare(`
          SELECT tr.*, t.title as task_title
          FROM task_results tr
          JOIN tasks t ON tr.task_id = t.id
          WHERE t.organization_id = ?
          ORDER BY tr.started_at DESC LIMIT 10
        `).bind(ctx.organizationId).all()
      ]);

      // Check orchestrator health (simplified)
      let orchestratorStatus: 'healthy' | 'degraded' | 'unavailable' = 'healthy';
      if (ctx.env.ORCHESTRATOR_URL) {
        try {
          const response = await fetch(`${ctx.env.ORCHESTRATOR_URL}/health`, {
            signal: AbortSignal.timeout(5000)
          });
          if (!response.ok) {
            orchestratorStatus = 'degraded';
          }
        } catch {
          orchestratorStatus = 'unavailable';
        }
      }

      const suggestions = (suggestionsResult.results || []).map(row => ({
        id: row.id,
        type: row.type,
        title: row.title,
        description: row.description,
        status: row.status,
        createdAt: row.created_at,
        expiresAt: row.expires_at
      }));

      const recentResults = (recentResultsResult.results || []).map(row => ({
        id: row.id,
        taskId: row.task_id,
        taskTitle: row.task_title,
        status: row.status,
        startedAt: row.started_at,
        completedAt: row.completed_at
      }));

      // Get last error from failed results
      const lastError = recentResults.find(r => r.status === 'failed');

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            pendingApprovals: pendingApprovalsResult?.count || 0,
            activeTasks: activeTasksResult?.count || 0,
            queuedTasks: queuedTasksResult?.count || 0,
            suggestions,
            recentResults,
            systemHealth: {
              queueDepth: (queuedTasksResult?.count || 0) as number,
              lastError: lastError ? `Task ${lastError.taskId} failed` : null,
              orchestratorStatus
            }
          })
        }]
      };
    }
  );

  // gm_get_task_progress
  registry.register(
    'gm_get_task_progress',
    'Get current progress of an executing task',
    {
      taskId: z.string().uuid().describe('ID of the task to check')
    },
    async ({ taskId }) => {
      // Get task
      const task = await ctx.env.DB.prepare(`
        SELECT * FROM tasks WHERE id = ? AND organization_id = ?
      `).bind(taskId, ctx.organizationId).first();

      if (!task) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Task not found',
              suggestion: 'Use gm_list_tasks to find available tasks'
            })
          }],
          isError: true
        };
      }

      // Get progress logs
      const logsResult = await ctx.env.DB.prepare(`
        SELECT * FROM task_progress_logs
        WHERE task_id = ?
        ORDER BY timestamp DESC LIMIT 20
      `).bind(taskId).all();

      const logs = (logsResult.results || []).map(row => ({
        timestamp: row.timestamp,
        message: row.message
      }));

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            taskId,
            status: task.status,
            progress: task.progress || 0,
            currentStep: task.current_step,
            estimatedCompletion: null, // Would be calculated based on progress
            logs
          })
        }]
      };
    }
  );

  // gm_cancel_task
  registry.register(
    'gm_cancel_task',
    'Cancel a running or queued task',
    {
      taskId: z.string().uuid().describe('ID of the task to cancel'),
      reason: z.string().optional().describe('Reason for cancellation')
    },
    async ({ taskId, reason }) => {
      // Get task
      const task = await ctx.env.DB.prepare(`
        SELECT * FROM tasks WHERE id = ? AND organization_id = ?
      `).bind(taskId, ctx.organizationId).first();

      if (!task) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Task not found',
              suggestion: 'Use gm_list_tasks to find available tasks'
            })
          }],
          isError: true
        };
      }

      const currentStatus = task.status as TaskStatus;
      const cancellableStatuses: TaskStatus[] = ['queued', 'executing', 'paused', 'approved'];

      if (!cancellableStatuses.includes(currentStatus)) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: `Cannot cancel task in status: ${currentStatus}`,
              suggestion: 'Task must be in queued, executing, paused, or approved status to cancel'
            })
          }],
          isError: true
        };
      }

      const now = new Date().toISOString();

      // Update task status
      await ctx.env.DB.batch([
        ctx.env.DB.prepare(`
          UPDATE tasks SET status = 'cancelled', updated_at = ? WHERE id = ?
        `).bind(now, taskId),
        ctx.env.DB.prepare(`
          INSERT INTO task_progress_logs (id, task_id, timestamp, message)
          VALUES (?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(),
          taskId,
          now,
          reason ? `Cancelled: ${reason}` : 'Task cancelled by user'
        )
      ]);

      // TODO: If task is executing, signal orchestrator to stop

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            finalStatus: 'cancelled',
            message: `Task ${taskId} cancelled`,
            reason
          })
        }]
      };
    }
  );
}
