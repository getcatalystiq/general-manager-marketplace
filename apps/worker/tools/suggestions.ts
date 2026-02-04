import type { ToolRegistry } from './tasks.js';
import { z } from 'zod';
import type { Env } from '../src/types.js';

interface ToolContext {
  env: Env;
  organizationId: string;
  userId: string;
}

export function registerSuggestionTools(registry: ToolRegistry, ctx: ToolContext) {
  // gm_list_suggestions
  registry.register(
    'gm_list_suggestions',
    'List proactive suggestions',
    {
      limit: z.number().default(10).describe('Maximum number of suggestions to return')
    },
    async ({ limit }) => {
      const results = await ctx.env.DB.prepare(`
        SELECT * FROM suggestions
        WHERE organization_id = ? AND status = 'pending'
        ORDER BY created_at DESC
        LIMIT ?
      `).bind(ctx.organizationId, limit).all();

      const suggestions = (results.results || []).map(row => ({
        id: row.id,
        organizationId: row.organization_id,
        type: row.type,
        title: row.title,
        description: row.description,
        metadata: JSON.parse(row.metadata as string || '{}'),
        status: row.status,
        createdAt: row.created_at,
        expiresAt: row.expires_at
      }));

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            suggestions,
            count: suggestions.length,
            suggestion: suggestions.length > 0
              ? 'Use gm_accept_suggestion to convert to a task, or gm_dismiss_suggestion to remove'
              : 'No pending suggestions'
          })
        }]
      };
    }
  );

  // gm_accept_suggestion
  registry.register(
    'gm_accept_suggestion',
    'Accept a suggestion and convert it to a task',
    {
      suggestionId: z.string().uuid().describe('ID of the suggestion to accept')
    },
    async ({ suggestionId }) => {
      // Find pending suggestion
      const suggestion = await ctx.env.DB.prepare(`
        SELECT * FROM suggestions
        WHERE id = ? AND organization_id = ? AND status = 'pending'
      `).bind(suggestionId, ctx.organizationId).first();

      if (!suggestion) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Suggestion not found or already processed',
              suggestion: 'Use gm_list_suggestions to see available suggestions'
            })
          }],
          isError: true
        };
      }

      const now = new Date().toISOString();
      const taskId = crypto.randomUUID();

      // Create task from suggestion
      await ctx.env.DB.batch([
        ctx.env.DB.prepare(`
          INSERT INTO tasks (
            id, organization_id, title, description, horizon, status,
            category, params, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          taskId,
          ctx.organizationId,
          suggestion.title,
          suggestion.description,
          'short-term', // Default horizon for suggestions
          'draft',
          null,
          suggestion.metadata || '{}',
          now,
          now
        ),
        ctx.env.DB.prepare(`
          UPDATE suggestions SET status = 'accepted', converted_task_id = ?
          WHERE id = ?
        `).bind(taskId, suggestionId)
      ]);

      const task = await ctx.env.DB.prepare(
        `SELECT * FROM tasks WHERE id = ?`
      ).bind(taskId).first();

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            task: formatTask(task),
            message: 'Suggestion accepted and converted to task',
            suggestion: 'Use gm_update_task to modify the task, or gm_run_task to execute it'
          })
        }]
      };
    }
  );

  // gm_dismiss_suggestion
  registry.register(
    'gm_dismiss_suggestion',
    'Dismiss a suggestion',
    {
      suggestionId: z.string().uuid().describe('ID of the suggestion to dismiss')
    },
    async ({ suggestionId }) => {
      // Find pending suggestion
      const suggestion = await ctx.env.DB.prepare(`
        SELECT * FROM suggestions
        WHERE id = ? AND organization_id = ? AND status = 'pending'
      `).bind(suggestionId, ctx.organizationId).first();

      if (!suggestion) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Suggestion not found or already processed',
              suggestion: 'Use gm_list_suggestions to see available suggestions'
            })
          }],
          isError: true
        };
      }

      await ctx.env.DB.prepare(`
        UPDATE suggestions SET status = 'dismissed'
        WHERE id = ?
      `).bind(suggestionId).run();

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            message: 'Suggestion dismissed'
          })
        }]
      };
    }
  );

  // gm_bulk_dismiss
  registry.register(
    'gm_bulk_dismiss',
    'Dismiss multiple suggestions at once',
    {
      suggestionIds: z.array(z.string().uuid()).min(1).max(50).describe('IDs of suggestions to dismiss')
    },
    async (args) => {
      const { suggestionIds } = args as { suggestionIds: string[] };
      const dismissed: string[] = [];
      const failed: { suggestionId: string; error: string }[] = [];

      for (const suggestionId of suggestionIds) {
        try {
          const suggestion = await ctx.env.DB.prepare(`
            SELECT * FROM suggestions
            WHERE id = ? AND organization_id = ? AND status = 'pending'
          `).bind(suggestionId, ctx.organizationId).first();

          if (!suggestion) {
            failed.push({ suggestionId, error: 'Not found or already processed' });
            continue;
          }

          await ctx.env.DB.prepare(`
            UPDATE suggestions SET status = 'dismissed'
            WHERE id = ?
          `).bind(suggestionId).run();

          dismissed.push(suggestionId);
        } catch (error) {
          failed.push({ suggestionId, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            dismissed,
            failed,
            message: `Dismissed ${dismissed.length} suggestions, ${failed.length} failed`
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
