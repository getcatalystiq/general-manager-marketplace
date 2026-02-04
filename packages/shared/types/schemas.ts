import { z } from 'zod';

// Branded types for type-safe IDs
export type TaskId = string & { readonly __brand: 'TaskId' };
export type OrganizationId = string & { readonly __brand: 'OrganizationId' };
export type UserId = string & { readonly __brand: 'UserId' };
export type ApprovalId = string & { readonly __brand: 'ApprovalId' };
export type SuggestionId = string & { readonly __brand: 'SuggestionId' };
export type TaskResultId = string & { readonly __brand: 'TaskResultId' };

export const createTaskId = (id: string): TaskId => id as TaskId;
export const createOrganizationId = (id: string): OrganizationId => id as OrganizationId;
export const createUserId = (id: string): UserId => id as UserId;
export const createApprovalId = (id: string): ApprovalId => id as ApprovalId;
export const createSuggestionId = (id: string): SuggestionId => id as SuggestionId;
export const createTaskResultId = (id: string): TaskResultId => id as TaskResultId;

// Enums
export const TaskHorizon = z.enum(['short-term', 'medium-term', 'long-term']);
export type TaskHorizon = z.infer<typeof TaskHorizon>;

export const TaskStatus = z.enum([
  'draft',
  'pending',
  'approved',
  'queued',
  'executing',
  'paused',
  'completed',
  'failed',
  'rejected',
  'cancelled'
]);
export type TaskStatus = z.infer<typeof TaskStatus>;

export const AutonomyLevel = z.enum(['high', 'medium', 'low']);
export type AutonomyLevel = z.infer<typeof AutonomyLevel>;

export const ApprovalStatus = z.enum(['pending', 'approved', 'rejected', 'expired']);
export type ApprovalStatus = z.infer<typeof ApprovalStatus>;

export const SuggestionStatus = z.enum(['pending', 'accepted', 'dismissed', 'expired']);
export type SuggestionStatus = z.infer<typeof SuggestionStatus>;

export const SuggestionType = z.enum(['reactive', 'scheduled', 'analytical']);
export type SuggestionType = z.infer<typeof SuggestionType>;

// Core Schemas
export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  createdAt: z.string().datetime()
});
export type Organization = z.infer<typeof OrganizationSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['owner', 'admin', 'member']),
  notificationPrefs: z.object({
    emailDigest: z.enum(['immediate', 'daily', 'weekly', 'none']).default('daily'),
    approvalAlerts: z.boolean().default(true),
    failureAlerts: z.boolean().default(true)
  }).optional(),
  createdAt: z.string().datetime()
});
export type User = z.infer<typeof UserSchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  horizon: TaskHorizon,
  status: TaskStatus,
  category: z.string().optional(),
  params: z.record(z.unknown()).optional(),
  cronExpression: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  progress: z.number().min(0).max(100).default(0),
  currentStep: z.string().optional(),
  referencedSkills: z.array(z.string()).optional(),
  referencedCommands: z.array(z.string()).optional(),
  referencedConnectors: z.array(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Task = z.infer<typeof TaskSchema>;

export const TaskResultSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  executedBy: z.string().uuid().optional(),
  status: z.enum(['success', 'failed', 'cancelled']),
  result: z.record(z.unknown()).optional(),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.record(z.unknown()).optional()
  }).optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional()
});
export type TaskResult = z.infer<typeof TaskResultSchema>;

export const ApprovalSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  decidedBy: z.string().uuid().optional(),
  status: ApprovalStatus,
  feedback: z.string().optional(),
  requestedAt: z.string().datetime(),
  decidedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime()
});
export type Approval = z.infer<typeof ApprovalSchema>;

export const SuggestionSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  type: SuggestionType,
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  status: SuggestionStatus,
  convertedTaskId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime()
});
export type Suggestion = z.infer<typeof SuggestionSchema>;

export const SettingsSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  autonomyOverrides: z.record(AutonomyLevel).default({}),
  notificationPrefs: z.object({
    emailDigest: z.enum(['immediate', 'daily', 'weekly', 'none']).default('daily'),
    approvalAlerts: z.boolean().default(true),
    failureAlerts: z.boolean().default(true)
  }).default({}),
  updatedAt: z.string().datetime()
});
export type Settings = z.infer<typeof SettingsSchema>;

// Input Schemas
export const CreateTaskInput = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  horizon: TaskHorizon,
  category: z.string().optional(),
  params: z.record(z.unknown()).optional(),
  scheduledAt: z.string().datetime().optional(),
  cronExpression: z.string().optional()
});
export type CreateTaskInput = z.infer<typeof CreateTaskInput>;

export const UpdateTaskInput = z.object({
  taskId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  horizon: TaskHorizon.optional(),
  category: z.string().optional(),
  params: z.record(z.unknown()).optional(),
  scheduledAt: z.string().datetime().optional(),
  cronExpression: z.string().optional()
});
export type UpdateTaskInput = z.infer<typeof UpdateTaskInput>;

export const ApprovalDecision = z.object({
  taskId: z.string().uuid(),
  decision: z.enum(['approve', 'reject']),
  feedback: z.string().optional()
});
export type ApprovalDecision = z.infer<typeof ApprovalDecision>;

export const SettingsUpdate = z.object({
  autonomyOverrides: z.record(AutonomyLevel).optional(),
  notificationPrefs: z.object({
    emailDigest: z.enum(['immediate', 'daily', 'weekly', 'none']),
    approvalAlerts: z.boolean(),
    failureAlerts: z.boolean()
  }).partial().optional()
});
export type SettingsUpdate = z.infer<typeof SettingsUpdate>;

// Plugin Schemas
export const CommandParameterSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'date']),
  required: z.boolean(),
  default: z.unknown().optional()
});
export type CommandParameter = z.infer<typeof CommandParameterSchema>;

export const SkillSchema = z.object({
  id: z.string(),
  pluginId: z.string(),
  name: z.string(),
  description: z.string(),
  triggers: z.array(z.string()),
  category: z.string().optional()
});
export type Skill = z.infer<typeof SkillSchema>;

export const CommandSchema = z.object({
  id: z.string(),
  pluginId: z.string(),
  name: z.string(),
  description: z.string(),
  parameters: z.array(CommandParameterSchema),
  requiredConnectors: z.array(z.string())
});
export type Command = z.infer<typeof CommandSchema>;

export const ConnectorSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  authType: z.enum(['oauth2', 'api_key', 'basic']),
  status: z.enum(['connected', 'disconnected', 'error'])
});
export type Connector = z.infer<typeof ConnectorSchema>;

export const PluginSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string(),
  skills: z.array(SkillSchema.omit({ pluginId: true })),
  commands: z.array(CommandSchema.omit({ pluginId: true })),
  connectors: z.array(ConnectorSchema)
});
export type Plugin = z.infer<typeof PluginSchema>;

export const PluginRegistrySchema = z.object({
  plugins: z.array(PluginSchema),
  lastUpdated: z.string().datetime()
});
export type PluginRegistry = z.infer<typeof PluginRegistrySchema>;

// Overview Schema (for gm_get_overview)
export const SystemHealthSchema = z.object({
  queueDepth: z.number(),
  lastError: z.string().nullable(),
  orchestratorStatus: z.enum(['healthy', 'degraded', 'unavailable'])
});
export type SystemHealth = z.infer<typeof SystemHealthSchema>;

export const OverviewSchema = z.object({
  pendingApprovals: z.number(),
  activeTasks: z.number(),
  queuedTasks: z.number(),
  suggestions: z.array(SuggestionSchema),
  recentResults: z.array(TaskResultSchema),
  systemHealth: SystemHealthSchema
});
export type Overview = z.infer<typeof OverviewSchema>;

// Task Progress Schema
export const TaskProgressSchema = z.object({
  taskId: z.string().uuid(),
  status: TaskStatus,
  progress: z.number().min(0).max(100),
  currentStep: z.string().optional(),
  estimatedCompletion: z.string().datetime().optional(),
  logs: z.array(z.object({
    timestamp: z.string().datetime(),
    message: z.string()
  }))
});
export type TaskProgress = z.infer<typeof TaskProgressSchema>;

// Approval Request Schema (for dashboard display)
export const ApprovalRequestSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  taskTitle: z.string(),
  taskDescription: z.string().optional(),
  horizon: TaskHorizon,
  requestedAt: z.string().datetime(),
  requestedBy: z.string(),
  actionType: z.enum(['execute', 'high_impact']),
  riskLevel: z.enum(['low', 'medium', 'high']),
  estimatedImpact: z.string().optional()
});
export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>;

// Execution Result Schema (for history display)
export const ExecutionResultSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  taskTitle: z.string(),
  status: z.enum(['success', 'failed', 'cancelled']),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  duration: z.number(),
  output: z.string().optional(),
  error: z.string().optional(),
  stepsCompleted: z.number(),
  totalSteps: z.number()
});
export type ExecutionResult = z.infer<typeof ExecutionResultSchema>;

// State machine validation
export const VALID_TASK_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  draft: ['pending'],
  pending: ['approved', 'rejected'],
  approved: ['queued', 'cancelled'],
  queued: ['executing', 'cancelled'],
  executing: ['completed', 'failed', 'paused'],
  paused: ['executing', 'cancelled'],
  completed: [],
  failed: [],
  rejected: [],
  cancelled: []
};

export function isValidTransition(from: TaskStatus, to: TaskStatus): boolean {
  return VALID_TASK_TRANSITIONS[from].includes(to);
}
