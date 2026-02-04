/**
 * MCP Client for two-way communication between dashboard and MCP host
 *
 * This module provides:
 * - postMessage communication with MCP host (Claude Desktop, OpenAI, etc.)
 * - Type-safe tool invocation
 * - Event handling for host notifications
 */

import type {
  Task,
  TaskStatus,
  TaskHorizon,
  Suggestion,
  ApprovalRequest,
  ExecutionResult,
  Settings
} from '@gm/shared';

// MCP Tool Response types
interface MCPToolResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Overview response from gm_get_overview
interface OverviewResponse {
  pendingApprovals: number;
  activeTasks: number;
  queuedTasks: number;
  suggestions: Suggestion[];
  recentResults: ExecutionResult[];
  systemHealth: {
    queueDepth: number;
    lastError: string | null;
    orchestratorStatus: 'healthy' | 'degraded' | 'unavailable';
  };
}

// Plugin elements response from gm_list_plugin_elements
interface PluginElementsResponse {
  plugins: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    pluginId: string;
    name: string;
    description: string;
    triggers: string[];
  }>;
  commands: Array<{
    id: string;
    pluginId: string;
    name: string;
    description: string;
    requiredConnectors: string[];
  }>;
  connectors: Array<{
    id: string;
    name: string;
    description: string;
    status: 'connected' | 'disconnected' | 'error';
  }>;
}

// MCP Message types
interface MCPRequest {
  type: 'tool_call';
  id: string;
  tool: string;
  arguments: Record<string, unknown>;
}

interface MCPResponse {
  type: 'tool_result';
  id: string;
  result?: unknown;
  error?: string;
}

interface MCPNotification {
  type: 'notification';
  event: string;
  data: unknown;
}

type MCPMessage = MCPRequest | MCPResponse | MCPNotification;

// Event handlers
type EventHandler<T = unknown> = (data: T) => void;

class MCPClient {
  private pendingRequests: Map<string, {
    resolve: (value: unknown) => void;
    reject: (error: Error) => void;
  }> = new Map();

  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private requestIdCounter = 0;
  private isConnected = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage.bind(this));
      this.isConnected = true;
    }
  }

  private generateRequestId(): string {
    return `req_${++this.requestIdCounter}_${Date.now()}`;
  }

  private handleMessage(event: MessageEvent) {
    // Validate origin if needed
    const message = event.data as MCPMessage;

    if (!message || !message.type) return;

    if (message.type === 'tool_result') {
      const pending = this.pendingRequests.get(message.id);
      if (pending) {
        this.pendingRequests.delete(message.id);
        if (message.error) {
          pending.reject(new Error(message.error));
        } else {
          pending.resolve(message.result);
        }
      }
    } else if (message.type === 'notification') {
      const handlers = this.eventHandlers.get(message.event);
      if (handlers) {
        handlers.forEach(handler => handler(message.data));
      }
    }
  }

  private async callTool<T>(tool: string, args: Record<string, unknown>): Promise<T> {
    if (!this.isConnected) {
      throw new Error('MCP client not connected');
    }

    const id = this.generateRequestId();
    const request: MCPRequest = {
      type: 'tool_call',
      id,
      tool,
      arguments: args
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject
      });

      // Set timeout
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Tool call timeout'));
        }
      }, 30000);

      // Send message to parent
      window.parent.postMessage(request, '*');
    });
  }

  // Event subscription
  on<T = unknown>(event: string, handler: EventHandler<T>): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler as EventHandler);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(event)?.delete(handler as EventHandler);
    };
  }

  // ============================================
  // Task Tools
  // ============================================

  async listTasks(params?: {
    horizon?: TaskHorizon;
    status?: TaskStatus;
    limit?: number;
    offset?: number;
  }): Promise<MCPToolResponse<Task[]>> {
    try {
      const data = await this.callTool<Task[]>('gm_list_tasks', params || {});
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async createTask(params: {
    title: string;
    description?: string;
    horizon: TaskHorizon;
    category?: string;
    scheduledAt?: string;
  }): Promise<MCPToolResponse<Task>> {
    try {
      const data = await this.callTool<Task>('gm_create_task', params);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async updateTask(params: {
    taskId: string;
    title?: string;
    description?: string;
    horizon?: TaskHorizon;
    category?: string;
    status?: TaskStatus;
  }): Promise<MCPToolResponse<Task>> {
    try {
      const data = await this.callTool<Task>('gm_update_task', params);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async deleteTask(taskId: string): Promise<MCPToolResponse<void>> {
    try {
      await this.callTool<void>('gm_delete_task', { taskId });
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async runTask(taskId: string): Promise<MCPToolResponse<{ executionId: string }>> {
    try {
      const data = await this.callTool<{ executionId: string }>('gm_run_task', { taskId });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async getTaskProgress(taskId: string): Promise<MCPToolResponse<{
    status: TaskStatus;
    progress: number;
    currentStep?: string;
    output?: string;
  }>> {
    try {
      const data = await this.callTool<{
        status: TaskStatus;
        progress: number;
        currentStep?: string;
        output?: string;
      }>('gm_get_task_progress', { taskId });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async cancelTask(taskId: string): Promise<MCPToolResponse<void>> {
    try {
      await this.callTool<void>('gm_cancel_task', { taskId });
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // ============================================
  // Approval Tools
  // ============================================

  async approveTask(taskId: string): Promise<MCPToolResponse<void>> {
    try {
      await this.callTool<void>('gm_approve_task', { taskId });
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async rejectTask(taskId: string, reason?: string): Promise<MCPToolResponse<void>> {
    try {
      await this.callTool<void>('gm_reject_task', { taskId, reason });
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // ============================================
  // Overview & Dashboard Tools
  // ============================================

  async getOverview(): Promise<MCPToolResponse<OverviewResponse>> {
    try {
      const data = await this.callTool<OverviewResponse>('gm_get_overview', {});
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // ============================================
  // Plugin Tools
  // ============================================

  async listPluginElements(): Promise<MCPToolResponse<PluginElementsResponse>> {
    try {
      const data = await this.callTool<PluginElementsResponse>('gm_list_plugin_elements', {});
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async getCommandDetails(commandId: string): Promise<MCPToolResponse<{
    id: string;
    name: string;
    description: string;
    parameters: Record<string, unknown>;
    requiredConnectors: string[];
  }>> {
    try {
      const data = await this.callTool<{
        id: string;
        name: string;
        description: string;
        parameters: Record<string, unknown>;
        requiredConnectors: string[];
      }>('gm_get_command_details', { commandId });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async getSkillDetails(skillId: string): Promise<MCPToolResponse<{
    id: string;
    name: string;
    description: string;
    triggers: string[];
  }>> {
    try {
      const data = await this.callTool<{
        id: string;
        name: string;
        description: string;
        triggers: string[];
      }>('gm_get_skill_details', { skillId });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // ============================================
  // Settings Tools
  // ============================================

  async getSettings(): Promise<MCPToolResponse<Settings>> {
    try {
      const data = await this.callTool<Settings>('gm_get_settings', {});
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async updateSettings(settings: Partial<Settings>): Promise<MCPToolResponse<Settings>> {
    try {
      const data = await this.callTool<Settings>('gm_update_settings', settings);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // ============================================
  // Suggestion Tools
  // ============================================

  async listSuggestions(): Promise<MCPToolResponse<Suggestion[]>> {
    try {
      const data = await this.callTool<Suggestion[]>('gm_list_suggestions', {});
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async dismissSuggestion(suggestionId: string): Promise<MCPToolResponse<void>> {
    try {
      await this.callTool<void>('gm_dismiss_suggestion', { suggestionId });
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // ============================================
  // History Tools
  // ============================================

  async listResults(params?: {
    taskId?: string;
    limit?: number;
    offset?: number;
  }): Promise<MCPToolResponse<ExecutionResult[]>> {
    try {
      const data = await this.callTool<ExecutionResult[]>('gm_list_results', params || {});
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}

// Singleton instance
let mcpClient: MCPClient | null = null;

export function getMCPClient(): MCPClient {
  if (!mcpClient) {
    mcpClient = new MCPClient();
  }
  return mcpClient;
}

// React hook for using MCP client
export function useMCPClient(): MCPClient {
  return getMCPClient();
}

// Export types
export type {
  MCPToolResponse,
  OverviewResponse,
  PluginElementsResponse,
  MCPClient
};
