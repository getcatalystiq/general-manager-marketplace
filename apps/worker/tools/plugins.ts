import type { ToolRegistry } from './tasks.js';
import { z } from 'zod';
import type { Env } from '../src/types.js';

interface ToolContext {
  env: Env;
  organizationId: string;
  userId: string;
}

export function registerPluginTools(registry: ToolRegistry, ctx: ToolContext) {
  // gm_list_plugin_elements
  registry.register(
    'gm_list_plugin_elements',
    'List available skills, commands, and connectors from registered plugins',
    {
      type: z.enum(['skills', 'commands', 'connectors', 'all']).default('all').describe('Filter by element type'),
      search: z.string().optional().describe('Search by name or description'),
      pluginId: z.string().optional().describe('Filter by specific plugin')
    },
    async (args) => {
      const { type, search, pluginId } = args as { type?: string; search?: string; pluginId?: string };
      // Fetch from orchestrator
      const registry = await fetchPluginRegistry(ctx.env, ctx.organizationId);

      let plugins = registry.plugins;

      // Filter by plugin ID
      if (pluginId) {
        plugins = plugins.filter(p => p.id === pluginId);
      }

      // Aggregate elements
      let skills = plugins.flatMap(p => p.skills.map(s => ({ ...s, pluginId: p.id })));
      let commands = plugins.flatMap(p => p.commands.map(c => ({ ...c, pluginId: p.id })));
      let connectors = registry.connectors || [];

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        skills = skills.filter(s =>
          s.name.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower)
        );
        commands = commands.filter(c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
        );
        connectors = connectors.filter(c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
        );
      }

      // Filter by type
      const result: {
        plugins: { id: string; name: string; version: string; description: string }[];
        skills: typeof skills;
        commands: typeof commands;
        connectors: typeof connectors;
      } = {
        plugins: plugins.map(p => ({
          id: p.id,
          name: p.name,
          version: p.version,
          description: p.description
        })),
        skills: type === 'all' || type === 'skills' ? skills : [],
        commands: type === 'all' || type === 'commands' ? commands : [],
        connectors: type === 'all' || type === 'connectors' ? connectors : []
      };

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(result)
        }]
      };
    }
  );

  // gm_get_command_details
  registry.register(
    'gm_get_command_details',
    'Get full details and parameter schema for a specific command',
    {
      commandId: z.string().describe('ID of the command')
    },
    async (args) => {
      const { commandId } = args as { commandId: string };
      const registry = await fetchPluginRegistry(ctx.env, ctx.organizationId);

      // Find command across all plugins
      let foundCommand = null;
      let foundPlugin = null;

      for (const plugin of registry.plugins) {
        const command = plugin.commands.find(c => c.id === commandId);
        if (command) {
          foundCommand = command;
          foundPlugin = plugin;
          break;
        }
      }

      if (!foundCommand) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: `Command not found: ${commandId}`,
              suggestion: 'Use gm_list_plugin_elements to see available commands'
            })
          }],
          isError: true
        };
      }

      // Get connector statuses for required connectors
      const connectorStatuses = registry.connectors.filter(c =>
        foundCommand.requiredConnectors.includes(c.id)
      );

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            command: {
              id: foundCommand.id,
              pluginId: foundPlugin!.id,
              name: foundCommand.name,
              description: foundCommand.description,
              parameters: foundCommand.parameters,
              requiredConnectors: connectorStatuses
            }
          })
        }]
      };
    }
  );

  // gm_get_skill_details
  registry.register(
    'gm_get_skill_details',
    'Get full details for a specific skill including triggers',
    {
      skillId: z.string().describe('ID of the skill')
    },
    async (args) => {
      const { skillId } = args as { skillId: string };
      const registry = await fetchPluginRegistry(ctx.env, ctx.organizationId);

      // Find skill across all plugins
      let foundSkill = null;
      let foundPlugin = null;

      for (const plugin of registry.plugins) {
        const skill = plugin.skills.find(s => s.id === skillId);
        if (skill) {
          foundSkill = skill;
          foundPlugin = plugin;
          break;
        }
      }

      if (!foundSkill) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              error: `Skill not found: ${skillId}`,
              suggestion: 'Use gm_list_plugin_elements to see available skills'
            })
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            skill: {
              id: foundSkill.id,
              pluginId: foundPlugin!.id,
              name: foundSkill.name,
              description: foundSkill.description,
              triggers: foundSkill.triggers,
              category: foundSkill.category
            }
          })
        }]
      };
    }
  );
}

interface PluginRegistry {
  plugins: Array<{
    id: string;
    name: string;
    version: string;
    description: string;
    skills: Array<{
      id: string;
      name: string;
      description: string;
      triggers: string[];
      category?: string;
    }>;
    commands: Array<{
      id: string;
      name: string;
      description: string;
      parameters: Array<{
        name: string;
        description: string;
        type: string;
        required: boolean;
        default?: unknown;
      }>;
      requiredConnectors: string[];
    }>;
  }>;
  connectors: Array<{
    id: string;
    name: string;
    description: string;
    authType: string;
    status: 'connected' | 'disconnected' | 'error';
  }>;
  lastUpdated: string;
}

async function fetchPluginRegistry(env: Env, organizationId: string): Promise<PluginRegistry> {
  // If orchestrator URL is configured, fetch from there
  if (env.ORCHESTRATOR_URL) {
    try {
      const response = await fetch(`${env.ORCHESTRATOR_URL}/api/plugins`, {
        headers: {
          'Authorization': `Bearer ${env.ORCHESTRATOR_API_KEY}`,
          'X-Organization-Id': organizationId
        },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch plugin registry from orchestrator:', error);
    }
  }

  // Return mock data if orchestrator unavailable
  return getMockPluginRegistry(organizationId);
}

function getMockPluginRegistry(organizationId: string): PluginRegistry {
  return {
    plugins: [
      {
        id: 'general-manager-online-business',
        name: 'Online Business',
        version: '0.1.2',
        description: 'Manage your online business with AI-powered analysis',
        skills: [
          {
            id: 'saas-metrics',
            name: 'SaaS Metrics',
            description: 'Calculate MRR, churn, LTV, and other SaaS metrics',
            triggers: ['MRR', 'churn', 'LTV', 'ARR', 'CAC'],
            category: 'analytics'
          },
          {
            id: 'pricing-strategy',
            name: 'Pricing Strategy',
            description: 'Analyze and optimize pricing strategies',
            triggers: ['pricing', 'discount', 'revenue optimization'],
            category: 'strategy'
          },
          {
            id: 'customer-success',
            name: 'Customer Success',
            description: 'Track customer health and engagement',
            triggers: ['customer health', 'engagement', 'retention'],
            category: 'customer'
          }
        ],
        commands: [
          {
            id: 'analyze-ads',
            name: 'Analyze Ads',
            description: 'Evaluate Google Ads performance and identify optimizations',
            parameters: [
              { name: '--from', description: 'Start date', type: 'date', required: false },
              { name: '--to', description: 'End date', type: 'date', required: false },
              { name: '--campaign', description: 'Campaign name', type: 'string', required: false }
            ],
            requiredConnectors: ['google-ads']
          },
          {
            id: 'analyze-content',
            name: 'Analyze Content',
            description: 'Evaluate content performance metrics',
            parameters: [
              { name: '--url', description: 'Content URL', type: 'string', required: false }
            ],
            requiredConnectors: ['google-analytics']
          },
          {
            id: 'analyze-funnel',
            name: 'Analyze Funnel',
            description: 'Analyze conversion funnel performance',
            parameters: [],
            requiredConnectors: ['google-analytics', 'stripe']
          },
          {
            id: 'track-growth',
            name: 'Track Growth',
            description: 'Monitor business growth metrics',
            parameters: [
              { name: '--period', description: 'Time period', type: 'string', required: false, default: '30d' }
            ],
            requiredConnectors: ['stripe']
          }
        ]
      }
    ],
    connectors: [
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Payment and subscription data',
        authType: 'api_key',
        status: 'connected'
      },
      {
        id: 'google-ads',
        name: 'Google Ads',
        description: 'Advertising performance data',
        authType: 'oauth2',
        status: 'connected'
      },
      {
        id: 'google-analytics',
        name: 'Google Analytics',
        description: 'Website traffic and conversion data',
        authType: 'oauth2',
        status: 'disconnected'
      },
      {
        id: 'postgres',
        name: 'PostgreSQL',
        description: 'Custom database connection',
        authType: 'basic',
        status: 'connected'
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}
