import { z } from 'zod';
import type { Env } from '../src/types.js';
import type { ToolRegistry } from './tasks.js';

interface ToolContext {
  env: Env;
  organizationId: string;
  userId: string;
}

export function registerApprovalTools(registry: ToolRegistry, ctx: ToolContext) {
  // gm_list_pending
  registry.register(
    'gm_list_pending',
    'List items awaiting approval',
    {
      limit: z.number().default(20).describe('Maximum number of approvals to return')
    },
    async ({ limit }) => {
      const results = await ctx.env.DB.prepare(`
        SELECT a.*, t.title as task_title, t.description as task_description, t.horizon, t.category
        FROM approvals a
        JOIN tasks t ON a.task_id = t.id
        WHERE t.organization_id = ? AND a.status = 'pending'
        ORDER BY a.requested_at DESC
        LIMIT ?
      `).bind(ctx.organizationId, limit as number).all();

      const approvals = (results.results || []).map(row => ({
        id: row.id,
        taskId: row.task_id,
        taskTitle: row.task_title,
        taskDescription: row.task_description,
        taskHorizon: row.horizon,
        taskCategory: row.category,
        status: row.status,
        requestedAt: row.requested_at,
        expiresAt: row.expires_at
      }));

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            approvals,
            count: approvals.length,
            suggestion: approvals.length > 0
              ? 'Use gm_approve_task or gm_reject_task to process these items'
              : 'No pending approvals'
          })
        }]
      };
    }
  );

  // gm_approve_task
  registry.register(
    'gm_approve_task',
    'Approve a pending action',
    {
      taskId: z.string().uuid().describe('ID of the task to approve')
    },
    async ({ taskId }) => {
      // Find pending approval
      const approval = await ctx.env.DB.prepare(`
        SELECT a.*, t.organization_id
        FROM approvals a
        JOIN tasks t ON a.task_id = t.id
        WHERE a.task_id = ? AND t.organization_id = ? AND a.status = 'pending'
      `).bind(taskId, ctx.organizationId).first();

      if (!approval) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'No pending approval found for this task',
              suggestion: 'Use gm_list_pending to see available approvals'
            })
          }],
          isError: true
        };
      }

      const now = new Date().toISOString();

      // Update approval and task
      await ctx.env.DB.batch([
        ctx.env.DB.prepare(`
          UPDATE approvals SET status = 'approved', decided_by = ?, decided_at = ?
          WHERE id = ?
        `).bind(ctx.userId, now, approval.id),
        ctx.env.DB.prepare(`
          UPDATE tasks SET status = 'approved', updated_at = ?
          WHERE id = ?
        `).bind(now, taskId)
      ]);

      const task = await ctx.env.DB.prepare(
        `SELECT * FROM tasks WHERE id = ?`
      ).bind(taskId).first();

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            task: formatTask(task),
            message: 'Task approved. Use gm_run_task to execute it.',
            suggestion: 'The task is now approved. Run gm_run_task to execute it.'
          })
        }]
      };
    }
  );

  // gm_reject_task
  registry.register(
    'gm_reject_task',
    'Reject a pending action',
    {
      taskId: z.string().uuid().describe('ID of the task to reject'),
      feedback: z.string().optional().describe('Reason for rejection')
    },
    async ({ taskId, feedback }) => {
      // Find pending approval
      const approval = await ctx.env.DB.prepare(`
        SELECT a.*, t.organization_id
        FROM approvals a
        JOIN tasks t ON a.task_id = t.id
        WHERE a.task_id = ? AND t.organization_id = ? AND a.status = 'pending'
      `).bind(taskId, ctx.organizationId).first();

      if (!approval) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'No pending approval found for this task',
              suggestion: 'Use gm_list_pending to see available approvals'
            })
          }],
          isError: true
        };
      }

      const now = new Date().toISOString();

      // Update approval and task
      await ctx.env.DB.batch([
        ctx.env.DB.prepare(`
          UPDATE approvals SET status = 'rejected', decided_by = ?, decided_at = ?, feedback = ?
          WHERE id = ?
        `).bind(ctx.userId, now, feedback || null, approval.id),
        ctx.env.DB.prepare(`
          UPDATE tasks SET status = 'rejected', updated_at = ?
          WHERE id = ?
        `).bind(now, taskId)
      ]);

      const task = await ctx.env.DB.prepare(
        `SELECT * FROM tasks WHERE id = ?`
      ).bind(taskId).first();

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            task: formatTask(task),
            message: 'Task rejected',
            feedback: feedback || null
          })
        }]
      };
    }
  );

  // gm_bulk_approve
  registry.register(
    'gm_bulk_approve',
    'Approve multiple pending tasks at once',
    {
      taskIds: z.array(z.string().uuid()).min(1).max(50).describe('IDs of tasks to approve')
    },
    async ({ taskIds }) => {
      const approved: string[] = [];
      const failed: { taskId: string; error: string }[] = [];
      const ids = taskIds as string[];

      for (const taskId of ids) {
        try {
          const approval = await ctx.env.DB.prepare(`
            SELECT a.*, t.organization_id
            FROM approvals a
            JOIN tasks t ON a.task_id = t.id
            WHERE a.task_id = ? AND t.organization_id = ? AND a.status = 'pending'
          `).bind(taskId, ctx.organizationId).first();

          if (!approval) {
            failed.push({ taskId, error: 'No pending approval found' });
            continue;
          }

          const now = new Date().toISOString();
          await ctx.env.DB.batch([
            ctx.env.DB.prepare(`
              UPDATE approvals SET status = 'approved', decided_by = ?, decided_at = ?
              WHERE id = ?
            `).bind(ctx.userId, now, approval.id),
            ctx.env.DB.prepare(`
              UPDATE tasks SET status = 'approved', updated_at = ?
              WHERE id = ?
            `).bind(now, taskId)
          ]);

          approved.push(taskId);
        } catch (error) {
          failed.push({ taskId, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            approved,
            failed,
            message: `Approved ${approved.length} tasks, ${failed.length} failed`
          })
        }]
      };
    }
  );
}

function formatTask(row: Record<string, unknown> | null) {
  if (!row) return null;
  return {
    id: row.id,
    organizationId: row.organization_id,
    title: row.title,
    description: row.description,
    horizon: row.horizon,
    status: row.status,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
