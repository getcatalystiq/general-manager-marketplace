import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Env } from './types.js';
import { registerTaskTools, type ToolRegistry } from '../tools/tasks.js';
import { registerApprovalTools } from '../tools/approvals.js';
import { registerSuggestionTools } from '../tools/suggestions.js';
import { registerSettingsTools } from '../tools/settings.js';
import { registerOverviewTools } from '../tools/overview.js';
import { registerPluginTools } from '../tools/plugins.js';
import { registerUITools, UI_RESOURCES } from '../tools/ui.js';
import { z } from 'zod';

// Tool registry to track registered tools for JSON-RPC handling
interface ToolContent {
  type: 'text';
  text: string;
}

interface ToolResult {
  content: ToolContent[];
  isError?: boolean;
  _meta?: {
    ui?: {
      resourceUri: string;
    };
  };
}

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<ToolResult>;
  _meta?: { ui?: { resourceUri: string } };
}

// Global tool registry
const toolRegistry = new Map<string, ToolDefinition>();

export interface ExtendedMcpServer {
  server: McpServer;
  tools: Map<string, ToolDefinition>;
}

export function createMcpServer(env: Env, organizationId: string, userId: string): ExtendedMcpServer {
  const mcpServer = new McpServer({
    name: 'general-manager',
    version: '0.0.1'
  });

  // Clear registry for this server instance
  toolRegistry.clear();

  // Create context for tools
  const ctx = { env, organizationId, userId };

  // Create tool registry interface
  const registry: ToolRegistry = {
    register(name, description, schema, handler, meta?) {
      // Register with MCP server using the correct signature
      // The SDK expects: (name, description, schema, callback)
      // Using 'any' cast because SDK's return type is overly strict
      mcpServer.tool(
        name,
        description,
        schema,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (args: Record<string, unknown>) => handler(args) as any
      );

      // Also track in our registry for JSON-RPC handling
      toolRegistry.set(name, {
        name,
        description,
        inputSchema: convertToJsonSchema(schema),
        handler: handler as (args: Record<string, unknown>) => Promise<ToolResult>,
        _meta: meta
      });
    }
  };

  // Register all tools
  registerTaskTools(registry, ctx);
  registerApprovalTools(registry, ctx);
  registerSuggestionTools(registry, ctx);
  registerSettingsTools(registry, ctx);
  registerOverviewTools(registry, ctx);
  registerPluginTools(registry, ctx);
  registerUITools(registry, ctx);

  // Register gm_ping health check tool
  registry.register('gm_ping', 'Health check - verify the GM server is responding', {}, async () => {
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          organizationId,
          environment: env.ENVIRONMENT
        })
      }]
    };
  });

  return {
    server: mcpServer,
    tools: toolRegistry
  };
}

function convertToJsonSchema(schema: z.ZodRawShape | Record<string, unknown>): Record<string, unknown> {
  // Simple conversion - in production would use zod-to-json-schema
  if (!schema || Object.keys(schema).length === 0) {
    return { type: 'object', properties: {} };
  }

  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const [key, value] of Object.entries(schema)) {
    if (value && typeof value === 'object' && '_def' in value) {
      // It's a Zod type
      const zodType = value as z.ZodTypeAny;
      properties[key] = zodTypeToJsonSchema(zodType);

      // Check if required (not optional)
      if (!zodType.isOptional()) {
        required.push(key);
      }
    } else {
      properties[key] = value;
    }
  }

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined
  };
}

function zodTypeToJsonSchema(zodType: z.ZodTypeAny): Record<string, unknown> {
  const def = zodType._def;
  const typeName = def.typeName;

  switch (typeName) {
    case 'ZodString':
      return { type: 'string', description: def.description };
    case 'ZodNumber':
      return { type: 'number', description: def.description };
    case 'ZodBoolean':
      return { type: 'boolean', description: def.description };
    case 'ZodEnum':
      return { type: 'string', enum: def.values, description: def.description };
    case 'ZodOptional':
      return zodTypeToJsonSchema(def.innerType);
    case 'ZodDefault':
      return { ...zodTypeToJsonSchema(def.innerType), default: def.defaultValue() };
    case 'ZodObject':
      return convertToJsonSchema(def.shape());
    case 'ZodArray':
      return { type: 'array', items: zodTypeToJsonSchema(def.type), description: def.description };
    case 'ZodRecord':
      return { type: 'object', additionalProperties: true, description: def.description };
    default:
      return { type: 'string', description: def.description };
  }
}

export async function handleMcpRequest(
  request: Request,
  mcpServer: ExtendedMcpServer,
  sessionStub: DurableObjectStub,
  sessionId: string
): Promise<Response> {
  try {
    const body = await request.json();

    // Handle JSON-RPC request
    // The MCP SDK expects transport-level handling, but for HTTP we process directly
    const result = await processJsonRpc(mcpServer, body);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Mcp-Session-Id': sessionId
      }
    });
  } catch (error) {
    console.error('MCP request error:', error);
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error'
      },
      id: null
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function processJsonRpc(mcpServer: ExtendedMcpServer, body: unknown): Promise<unknown> {
  // Handle MCP JSON-RPC messages
  // This is a simplified handler - the SDK normally handles this via transport
  const message = body as { jsonrpc: string; method: string; params?: unknown; id?: string | number };

  if (message.method === 'initialize') {
    return {
      jsonrpc: '2.0',
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {}
        },
        serverInfo: {
          name: 'general-manager',
          version: '0.0.1'
        }
      },
      id: message.id
    };
  }

  if (message.method === 'tools/list') {
    // Get tools from our registry
    const tools = Array.from(mcpServer.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      ...(tool._meta && { _meta: tool._meta })
    }));
    return {
      jsonrpc: '2.0',
      result: { tools },
      id: message.id
    };
  }

  if (message.method === 'resources/list') {
    // List available UI resources
    const resources = Object.keys(UI_RESOURCES).map(uri => ({
      uri,
      name: uri.replace('ui://gm/', ''),
      mimeType: 'text/html'
    }));
    return {
      jsonrpc: '2.0',
      result: { resources },
      id: message.id
    };
  }

  if (message.method === 'resources/read') {
    const { uri } = message.params as { uri: string };
    const html = UI_RESOURCES[uri];

    if (!html) {
      return {
        jsonrpc: '2.0',
        error: {
          code: -32602,
          message: `Resource not found: ${uri}`
        },
        id: message.id
      };
    }

    return {
      jsonrpc: '2.0',
      result: {
        contents: [{
          uri,
          mimeType: 'text/html',
          text: html
        }]
      },
      id: message.id
    };
  }

  if (message.method === 'tools/call') {
    const { name, arguments: args } = message.params as { name: string; arguments?: Record<string, unknown> };

    const tool = mcpServer.tools.get(name);
    if (!tool) {
      return {
        jsonrpc: '2.0',
        error: {
          code: -32602,
          message: `Unknown tool: ${name}`
        },
        id: message.id
      };
    }

    try {
      const result = await tool.handler(args || {});
      return {
        jsonrpc: '2.0',
        result,
        id: message.id
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Tool execution failed'
        },
        id: message.id
      };
    }
  }

  return {
    jsonrpc: '2.0',
    error: {
      code: -32601,
      message: `Method not found: ${message.method}`
    },
    id: message.id
  };
}
