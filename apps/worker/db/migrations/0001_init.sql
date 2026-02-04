-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  notification_prefs TEXT DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT,
  horizon TEXT NOT NULL CHECK (horizon IN ('short-term', 'medium-term', 'long-term')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'queued', 'executing', 'paused', 'completed', 'failed', 'rejected', 'cancelled')),
  category TEXT,
  params TEXT DEFAULT '{}',
  cron_expression TEXT,
  scheduled_at TEXT,
  next_run_at TEXT,
  progress INTEGER DEFAULT 0,
  current_step TEXT,
  referenced_skills TEXT DEFAULT '[]',
  referenced_commands TEXT DEFAULT '[]',
  referenced_connectors TEXT DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_org_status ON tasks(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_org_horizon ON tasks(organization_id, horizon);
CREATE INDEX IF NOT EXISTS idx_tasks_scheduled ON tasks(organization_id, status, scheduled_at);

-- Task Results
CREATE TABLE IF NOT EXISTS task_results (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id),
  executed_by TEXT REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'cancelled')),
  result TEXT,
  error TEXT,
  started_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_task_results_task ON task_results(task_id);

-- Approvals
CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id),
  decided_by TEXT REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  feedback TEXT,
  requested_at TEXT NOT NULL,
  decided_at TEXT,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_approvals_task ON approvals(task_id);
CREATE INDEX IF NOT EXISTS idx_approvals_org_pending ON approvals(status) WHERE status = 'pending';

-- Suggestions
CREATE TABLE IF NOT EXISTS suggestions (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  type TEXT NOT NULL CHECK (type IN ('reactive', 'scheduled', 'analytical')),
  title TEXT NOT NULL,
  description TEXT,
  metadata TEXT DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'dismissed', 'expired')),
  converted_task_id TEXT REFERENCES tasks(id),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_suggestions_org_status ON suggestions(organization_id, status);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL UNIQUE REFERENCES organizations(id),
  autonomy_overrides TEXT DEFAULT '{}',
  notification_prefs TEXT DEFAULT '{}',
  updated_at TEXT NOT NULL
);

-- OAuth Tokens
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  token_hash TEXT NOT NULL,
  token_type TEXT NOT NULL CHECK (token_type IN ('access', 'refresh')),
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_oauth_tokens_hash ON oauth_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_user ON oauth_tokens(user_id);

-- Task Progress Logs (for real-time progress tracking)
CREATE TABLE IF NOT EXISTS task_progress_logs (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id),
  timestamp TEXT NOT NULL,
  message TEXT NOT NULL,
  progress INTEGER
);

CREATE INDEX IF NOT EXISTS idx_task_progress_logs_task ON task_progress_logs(task_id);
