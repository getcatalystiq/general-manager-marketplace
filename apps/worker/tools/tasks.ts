import { z } from 'zod';
import {
  TaskHorizon,
  TaskStatus,
  CreateTaskInput,
  isValidTransition
} from '@gm/shared';
import type { Env } from '../src/types.js';

interface ToolContext {
  env: Env;
  organizationId: string;
  userId: string;
}

interface ToolContent {
  type: 'text';
  text: string;
}

interface ToolResult {
  content: ToolContent[];
  isError?: boolean;
}

export interface ToolRegistry {
  register(
    name: string,
    description: string,
    schema: z.ZodRawShape,
    handler: (args: Record<string, unknown>) => Promise<ToolResult>,
    meta?: { ui?: { resourceUri: string } }
  ): void;
}

export type { ToolContext };

export function registerTaskTools(registry: ToolRegistry, ctx: ToolContext) {
  // gm_list_tasks
  registry.register(
    'gm_list_tasks',
    'List tasks with optional filters',
    {
      horizon: z.enum(['short-term', 'medium-term', 'long-term']).optional().describe('Filter by task horizon'),
      status: TaskStatus.optional().describe('Filter by task status'),
      category: z.string().optional().describe('Filter by task category'),
      limit: z.number().default(50).describe('Maximum number of tasks to return'),
      cursor: z.string().optional().describe('Cursor for pagination (task ID to start after)')
    },
    async ({ horizon, status, category, limit, cursor }) => {
      let query = `
        SELECT * FROM tasks
        WHERE organization_id = ?
      `;
      const params: unknown[] = [ctx.organizationId];

      if (horizon) {
        query += ` AND horizon = ?`;
        params.push(horizon);
      }

      if (status) {
        query += ` AND status = ?`;
        params.push(status);
      }

      if (category) {
        query += ` AND category = ?`;
        params.push(category);
      }

      if (cursor) {
        query += ` AND id > ?`;
        params.push(cursor);
      }

      query += ` ORDER BY created_at DESC LIMIT ?`;
      params.push(limit);

      const results = await ctx.env.DB.prepare(query).bind(...params).all();

      // Get total count
      let countQuery = `SELECT COUNT(*) as total FROM tasks WHERE organization_id = ?`;
      const countParams: unknown[] = [ctx.organizationId];

      if (horizon) {
        countQuery += ` AND horizon = ?`;
        countParams.push(horizon);
      }
      if (status) {
        countQuery += ` AND status = ?`;
        countParams.push(status);
      }
      if (category) {
        countQuery += ` AND category = ?`;
        countParams.push(category);
      }

      const countResult = await ctx.env.DB.prepare(countQuery).bind(...countParams).first();

      const tasks = (results.results || []).map(row => ({
        id: row.id,
        organizationId: row.organization_id,
        title: row.title,
        description: row.description,
        horizon: row.horizon,
        status: row.status,
        category: row.category,
        params: JSON.parse(row.params as string || '{}'),
        cronExpression: row.cron_expression,
        scheduledAt: row.scheduled_at,
        progress: row.progress,
        currentStep: row.current_step,
        referencedSkills: JSON.parse(row.referenced_skills as string || '[]'),
        referencedCommands: JSON.parse(row.referenced_commands as string || '[]'),
        referencedConnectors: JSON.parse(row.referenced_connectors as string || '[]'),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            tasks,
            total: countResult?.total || 0,
            nextCursor: tasks.length === limit ? tasks[tasks.length - 1]?.id : null
          })
        }]
      };
    }
  );

  // gm_create_task
  registry.register(
    'gm_create_task',
    'Create a new task',
    {
      title: z.string().min(1).max(200).describe('Task title'),
      description: z.string().optional().describe('Task description'),
      horizon: TaskHorizon.describe('Task horizon: short-term, medium-term, or long-term'),
      category: z.string().optional().describe('Task category for autonomy rules'),
      params: z.record(z.unknown()).optional().describe('Task parameters as JSON'),
      scheduledAt: z.string().datetime().optional().describe('When to execute the task'),
      cronExpression: z.string().optional().describe('Cron expression for recurring tasks')
    },
    async (input) => {
      const parsed = CreateTaskInput.parse(input);
      const now = new Date().toISOString();
      const id = crypto.randomUUID();

      // Extract plugin references from description
      const refs = extractPluginReferences(parsed.description || '');

      await ctx.env.DB.prepare(`
        INSERT INTO tasks (
          id, organization_id, title, description, horizon, status,
          category, params, cron_expression, scheduled_at, progress,
          referenced_skills, referenced_commands, referenced_connectors,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        ctx.organizationId,
        parsed.title,
        parsed.description || null,
        parsed.horizon,
        'draft',
        parsed.category || null,
        JSON.stringify(parsed.params || {}),
        parsed.cronExpression || null,
        parsed.scheduledAt || null,
        0,
        JSON.stringify(refs.skills),
        JSON.stringify(refs.commands),
        JSON.stringify(refs.connectors),
        now,
        now
      ).run();

      const task = await ctx.env.DB.prepare(
        `SELECT * FROM tasks WHERE id = ?`
      ).bind(id).first();

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            task: formatTask(task),
            message: 'Task created successfully'
          })
        }]
      };
    }
  );

  // gm_update_task
  registry.register(
    'gm_update_task',
    'Update an existing task',
    {
      taskId: z.string().uuid().describe('ID of the task to update'),
      title: z.string().min(1).max(200).optional().describe('New task title'),
      description: z.string().optional().describe('New task description'),
      horizon: TaskHorizon.optional().describe('New task horizon'),
      category: z.string().optional().describe('New task category'),
      params: z.record(z.unknown()).optional().describe('New task parameters'),
      scheduledAt: z.string().datetime().optional().describe('New scheduled time'),
      cronExpression: z.string().optional().describe('New cron expression')
    },
    async (input) => {
      const { taskId, ...updates } = input;

      // Verify task exists and belongs to org
      const existing = await ctx.env.DB.prepare(
        `SELECT * FROM tasks WHERE id = ? AND organization_id = ?`
      ).bind(taskId, ctx.organizationId).first();

      if (!existing) {
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

      // Build update query
      const setClauses: string[] = ['updated_at = ?'];
      const params: unknown[] = [new Date().toISOString()];

      if (updates.title !== undefined) {
        setClauses.push('title = ?');
        params.push(updates.title);
      }
      if (updates.description !== undefined) {
        setClauses.push('description = ?');
        params.push(updates.description);

        // Re-extract plugin references
        const refs = extractPluginReferences(updates.description as string || '');
        setClauses.push('referenced_skills = ?', 'referenced_commands = ?', 'referenced_connectors = ?');
        params.push(JSON.stringify(refs.skills), JSON.stringify(refs.commands), JSON.stringify(refs.connectors));
      }
      if (updates.horizon !== undefined) {
        setClauses.push('horizon = ?');
        params.push(updates.horizon);
      }
      if (updates.category !== undefined) {
        setClauses.push('category = ?');
        params.push(updates.category);
      }
      if (updates.params !== undefined) {
        setClauses.push('params = ?');
        params.push(JSON.stringify(updates.params));
      }
      if (updates.scheduledAt !== undefined) {
        setClauses.push('scheduled_at = ?');
        params.push(updates.scheduledAt);
      }
      if (updates.cronExpression !== undefined) {
        setClauses.push('cron_expression = ?');
        params.push(updates.cronExpression);
      }

      params.push(taskId, ctx.organizationId);

      await ctx.env.DB.prepare(`
        UPDATE tasks SET ${setClauses.join(', ')}
        WHERE id = ? AND organization_id = ?
      `).bind(...params).run();

      const task = await ctx.env.DB.prepare(
        `SELECT * FROM tasks WHERE id = ?`
      ).bind(taskId).first();

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            task: formatTask(task),
            message: 'Task updated successfully'
          })
        }]
      };
    }
  );

  // gm_delete_task
  registry.register(
    'gm_delete_task',
    'Delete a task',
    {
      taskId: z.string().uuid().describe('ID of the task to delete')
    },
    async ({ taskId }) => {
      // Verify task exists and belongs to org
      const existing = await ctx.env.DB.prepare(
        `SELECT * FROM tasks WHERE id = ? AND organization_id = ?`
      ).bind(taskId, ctx.organizationId).first();

      if (!existing) {
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

      // Delete task and related records
      await ctx.env.DB.batch([
        ctx.env.DB.prepare(`DELETE FROM task_progress_logs WHERE task_id = ?`).bind(taskId),
        ctx.env.DB.prepare(`DELETE FROM task_results WHERE task_id = ?`).bind(taskId),
        ctx.env.DB.prepare(`DELETE FROM approvals WHERE task_id = ?`).bind(taskId),
        ctx.env.DB.prepare(`DELETE FROM tasks WHERE id = ? AND organization_id = ?`).bind(taskId, ctx.organizationId)
      ]);

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            message: `Task ${taskId} deleted successfully`
          })
        }]
      };
    }
  );

  // gm_run_task
  registry.register(
    'gm_run_task',
    'Manually trigger a task execution',
    {
      taskId: z.string().uuid().describe('ID of the task to run')
    },
    async ({ taskId }) => {
      // Verify task exists and is in a runnable state
      const task = await ctx.env.DB.prepare(
        `SELECT * FROM tasks WHERE id = ? AND organization_id = ?`
      ).bind(taskId, ctx.organizationId).first();

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
      if (!['draft', 'approved', 'paused'].includes(currentStatus)) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: `Cannot run task in status: ${currentStatus}`,
              suggestion: 'Task must be in draft, approved, or paused status to run'
            })
          }],
          isError: true
        };
      }

      // Create execution record
      const executionId = crypto.randomUUID();
      const now = new Date().toISOString();

      await ctx.env.DB.batch([
        ctx.env.DB.prepare(`
          UPDATE tasks SET status = 'queued', updated_at = ? WHERE id = ?
        `).bind(now, taskId),
        ctx.env.DB.prepare(`
          INSERT INTO task_results (id, task_id, executed_by, status, started_at)
          VALUES (?, ?, ?, 'success', ?)
        `).bind(executionId, taskId, ctx.userId, now)
      ]);

      // Queue task for execution
      await ctx.env.TASK_QUEUE.send({ taskId, organizationId: ctx.organizationId });

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            executionId,
            taskId,
            message: 'Task queued for execution',
            suggestion: 'Use gm_get_task_progress to monitor execution'
          })
        }]
      };
    }
  );
}

// Helper functions
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
    params: JSON.parse(row.params as string || '{}'),
    cronExpression: row.cron_expression,
    scheduledAt: row.scheduled_at,
    progress: row.progress,
    currentStep: row.current_step,
    referencedSkills: JSON.parse(row.referenced_skills as string || '[]'),
    referencedCommands: JSON.parse(row.referenced_commands as string || '[]'),
    referencedConnectors: JSON.parse(row.referenced_connectors as string || '[]'),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function extractPluginReferences(description: string): {
  skills: string[];
  commands: string[];
  connectors: string[];
} {
  const skills: string[] = [];
  const commands: string[] = [];
  const connectors: string[] = [];

  // Extract /name patterns
  const slashPattern = /\/([a-z][a-z0-9-]*)/g;
  let match;
  while ((match = slashPattern.exec(description)) !== null) {
    // Could be skill or command - we'll determine later based on registry
    // For now, treat as command if it has params, skill otherwise
    const name = match[1];
    const hasParams = description.slice(match.index).match(/^\/[a-z][a-z0-9-]*\s+--/);
    if (hasParams) {
      commands.push(name);
    } else {
      skills.push(name);
    }
  }

  // Extract connector:name patterns
  const connectorPattern = /connector:([a-z][a-z0-9-]*)/g;
  while ((match = connectorPattern.exec(description)) !== null) {
    connectors.push(match[1]);
  }

  return { skills, commands, connectors };
}
