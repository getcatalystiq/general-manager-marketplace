import type { ToolRegistry } from './tasks.js';
import { z } from 'zod';
import { AutonomyLevel, SettingsUpdate } from '@gm/shared';
import type { Env } from '../src/types.js';

interface ToolContext {
  env: Env;
  organizationId: string;
  userId: string;
}

export function registerSettingsTools(registry: ToolRegistry, ctx: ToolContext) {
  // gm_get_settings
  registry.register(
    'gm_get_settings',
    'Get current organization settings',
    {},
    async () => {
      const settings = await ctx.env.DB.prepare(`
        SELECT * FROM settings WHERE organization_id = ?
      `).bind(ctx.organizationId).first();

      if (!settings) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Settings not found',
              suggestion: 'This should not happen - contact support'
            })
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            settings: {
              id: settings.id,
              organizationId: settings.organization_id,
              autonomyOverrides: JSON.parse(settings.autonomy_overrides as string || '{}'),
              notificationPrefs: JSON.parse(settings.notification_prefs as string || '{}'),
              updatedAt: settings.updated_at
            }
          })
        }]
      };
    }
  );

  // gm_update_settings
  registry.register(
    'gm_update_settings',
    'Update organization settings',
    {
      autonomyOverrides: z.record(AutonomyLevel).optional().describe('Override autonomy level per task category'),
      notificationPrefs: z.object({
        emailDigest: z.enum(['immediate', 'daily', 'weekly', 'none']).optional(),
        approvalAlerts: z.boolean().optional(),
        failureAlerts: z.boolean().optional()
      }).optional().describe('Notification preferences')
    },
    async (input) => {
      const settings = await ctx.env.DB.prepare(`
        SELECT * FROM settings WHERE organization_id = ?
      `).bind(ctx.organizationId).first();

      if (!settings) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Settings not found',
              suggestion: 'This should not happen - contact support'
            })
          }],
          isError: true
        };
      }

      const currentAutonomy = JSON.parse(settings.autonomy_overrides as string || '{}');
      const currentNotifications = JSON.parse(settings.notification_prefs as string || '{}');

      const newAutonomy = input.autonomyOverrides
        ? { ...currentAutonomy, ...input.autonomyOverrides }
        : currentAutonomy;

      const newNotifications = input.notificationPrefs
        ? { ...currentNotifications, ...input.notificationPrefs }
        : currentNotifications;

      const now = new Date().toISOString();

      await ctx.env.DB.prepare(`
        UPDATE settings
        SET autonomy_overrides = ?, notification_prefs = ?, updated_at = ?
        WHERE organization_id = ?
      `).bind(
        JSON.stringify(newAutonomy),
        JSON.stringify(newNotifications),
        now,
        ctx.organizationId
      ).run();

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            settings: {
              id: settings.id,
              organizationId: ctx.organizationId,
              autonomyOverrides: newAutonomy,
              notificationPrefs: newNotifications,
              updatedAt: now
            },
            message: 'Settings updated successfully'
          })
        }]
      };
    }
  );
}
