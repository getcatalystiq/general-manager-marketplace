import type { D1Database, Queue, DurableObjectNamespace } from '@cloudflare/workers-types';

export interface Env {
  // Cloudflare bindings
  DB: D1Database;
  TASK_QUEUE: Queue;
  TASK_DLQ: Queue;
  SESSIONS: DurableObjectNamespace;

  // Environment variables
  ENVIRONMENT: string;
  ORCHESTRATOR_URL?: string;
  ORCHESTRATOR_API_KEY?: string;
  ENCRYPTION_KEY?: string;

  // OAuth
  OAUTH_CLIENT_ID?: string;
  OAUTH_CLIENT_SECRET?: string;
}

export interface Variables {
  organizationId: string;
  userId: string;
  user: {
    id: string;
    email: string;
    organizationId: string;
    role: string;
  };
}

export type HonoEnv = {
  Bindings: Env;
  Variables: Variables;
};
