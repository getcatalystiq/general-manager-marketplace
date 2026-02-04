import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { HonoEnv, Env } from './types.js';
import { createMcpServer, handleMcpRequest, type ExtendedMcpServer } from './mcp.js';
import { oauthRoutes } from '../auth/oauth.js';
import { discoveryRoutes } from '../auth/discovery.js';
import { userRoutes } from '../auth/users.js';
import { authMiddleware } from '../auth/middleware.js';
import { McpSession } from './session.js';
import { OrchestratorClient } from '../services/orchestrator.js';

const app = new Hono<HonoEnv>();

// Global middleware
app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Mcp-Session-Id'],
  exposeHeaders: ['Mcp-Session-Id'],
  maxAge: 86400
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// OAuth discovery endpoints (public)
app.route('/.well-known', discoveryRoutes);

// OAuth endpoints (public)
app.route('/oauth', oauthRoutes);

// User endpoints (public - registration/login)
app.route('/api/users', userRoutes);

// Registration page
app.get('/register', (c) => {
  return c.html(getRegisterPage());
});

// MCP endpoints (authenticated)
app.post('/mcp', authMiddleware, async (c) => {
  const env = c.env;
  const organizationId = c.get('organizationId');
  const userId = c.get('userId');

  // Get or create session using Durable Object
  const sessionId = c.req.header('Mcp-Session-Id') || crypto.randomUUID();
  const sessionStub = env.SESSIONS.get(env.SESSIONS.idFromName(`org:${organizationId}:${sessionId}`));

  // Create MCP server with org context
  const mcpServer = createMcpServer(env, organizationId, userId);

  // Handle the MCP request
  const response = await handleMcpRequest(c.req.raw, mcpServer, sessionStub, sessionId);

  return response;
});

// SSE endpoint for streaming (authenticated)
app.get('/mcp/sse', authMiddleware, async (c) => {
  const organizationId = c.get('organizationId');
  const sessionId = c.req.query('sessionId');

  if (!sessionId) {
    return c.json({ error: 'Session ID required' }, 400);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(': heartbeat\n\n'));
      }, 30000);

      c.req.raw.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Mcp-Session-Id': sessionId
    }
  });
});

// Export for Cloudflare Workers
export default {
  fetch: app.fetch,

  // Queue consumer
  async queue(batch: MessageBatch<{ taskId: string; organizationId: string }>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        const { taskId, organizationId } = message.body;
        console.log(`Processing task: ${taskId} for org: ${organizationId}`);

        // Get task details
        const taskResult = await env.DB.prepare(`
          SELECT id, title, description, category, params, status
          FROM tasks WHERE id = ? AND organization_id = ?
        `).bind(taskId, organizationId).first();

        if (!taskResult) {
          console.error(`Task not found: ${taskId}`);
          message.ack();
          continue;
        }

        // Update status to executing
        await env.DB.prepare(`
          UPDATE tasks SET status = 'executing', updated_at = ? WHERE id = ?
        `).bind(new Date().toISOString(), taskId).run();

        // Execute via orchestrator
        const orchestrator = new OrchestratorClient(env, organizationId);
        const params = taskResult.params ? JSON.parse(taskResult.params as string) : {};

        const result = await orchestrator.executeTask(
          taskId,
          taskResult.category as string | null,
          params,
          async (event) => {
            // Update task progress
            if (event.type === 'progress') {
              await env.DB.prepare(`
                UPDATE tasks
                SET progress = ?, current_step = ?, updated_at = ?
                WHERE id = ?
              `).bind(event.progress, event.message, new Date().toISOString(), taskId).run();
            }
          }
        );

        // Create result record
        const resultId = crypto.randomUUID();
        const now = new Date().toISOString();

        await env.DB.prepare(`
          INSERT INTO task_results (id, task_id, status, result, error, started_at, completed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          resultId,
          taskId,
          result.success ? 'success' : 'failed',
          result.result ? JSON.stringify(result.result) : null,
          result.error ? JSON.stringify(result.error) : null,
          now,
          now
        ).run();

        // Update task final status
        await env.DB.prepare(`
          UPDATE tasks SET status = ?, progress = 100, updated_at = ? WHERE id = ?
        `).bind(result.success ? 'completed' : 'failed', now, taskId).run();

        message.ack();
      } catch (error) {
        console.error(`Failed to process task:`, error);
        message.retry();
      }
    }
  },

  // Scheduled worker (cron)
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    console.log(`Cron triggered at ${event.scheduledTime}`);

    // Check for due recurring tasks
    const now = new Date().toISOString();
    const results = await env.DB.prepare(`
      SELECT id, organization_id, title, cron_expression
      FROM tasks
      WHERE status = 'approved'
        AND cron_expression IS NOT NULL
        AND (next_run_at IS NULL OR next_run_at <= ?)
    `).bind(now).all();

    for (const task of results.results || []) {
      await env.TASK_QUEUE.send({
        taskId: task.id as string
      });
      console.log(`Queued recurring task: ${task.id}`);
    }
  }
};

// Export Durable Object
export { McpSession };

function getRegisterPage(error?: string, success?: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign up - General Manager</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo h1 { font-size: 24px; color: #1a1a2e; margin-bottom: 8px; }
    .logo p { color: #666; font-size: 14px; }
    .error {
      background: #fee2e2; border: 1px solid #fecaca; color: #dc2626;
      padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;
    }
    .success {
      background: #dcfce7; border: 1px solid #bbf7d0; color: #16a34a;
      padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;
    }
    .form-group { margin-bottom: 20px; }
    label { display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px; }
    input[type="email"], input[type="password"], input[type="text"] {
      width: 100%; padding: 12px 16px; border: 1px solid #d1d5db;
      border-radius: 8px; font-size: 16px; transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    button {
      width: 100%; padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; border: none; border-radius: 8px;
      font-size: 16px; font-weight: 600; cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    button:active { transform: translateY(0); }
    .footer { text-align: center; margin-top: 24px; color: #666; font-size: 14px; }
    .footer a { color: #667eea; text-decoration: none; font-weight: 500; }
    .footer a:hover { text-decoration: underline; }
    .hint { font-size: 12px; color: #6b7280; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <h1>General Manager</h1>
      <p>Create your account</p>
    </div>

    ${error ? `<div class="error">${error}</div>` : ''}
    ${success ? `<div class="success">Account created! <a href="/oauth/authorize">Sign in</a> to continue.</div>` : ''}

    <form id="registerForm">
      <div class="form-group">
        <label for="organizationName">Organization Name</label>
        <input type="text" id="organizationName" name="organizationName" required placeholder="My Company">
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required autocomplete="email" placeholder="you@example.com">
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required autocomplete="new-password" minlength="8">
        <p class="hint">At least 8 characters</p>
      </div>

      <button type="submit">Create Account</button>
    </form>

    <div class="footer">
      Already have an account? <a href="/oauth/authorize?client_id=dashboard&redirect_uri=${encodeURIComponent('https://gm-dashboard.pages.dev')}&response_type=code&code_challenge=placeholder&code_challenge_method=S256">Sign in</a>
    </div>
  </div>

  <script>
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const btn = form.querySelector('button');
      btn.disabled = true;
      btn.textContent = 'Creating...';

      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationName: form.organizationName.value,
            email: form.email.value,
            password: form.password.value
          })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Show success and redirect to login
        document.querySelector('.card').innerHTML = \`
          <div class="logo">
            <h1>General Manager</h1>
            <p>Account Created!</p>
          </div>
          <div class="success">
            Your account has been created successfully.
          </div>
          <p style="text-align: center; margin-bottom: 20px;">You can now connect your MCP client using OAuth.</p>
          <a href="/" style="display: block; text-align: center; color: #667eea;">Go to home</a>
        \`;
      } catch (err) {
        const errorDiv = document.querySelector('.error') || document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = err.message;
        if (!document.querySelector('.error')) {
          form.insertBefore(errorDiv, form.firstChild);
        }
        btn.disabled = false;
        btn.textContent = 'Create Account';
      }
    });
  </script>
</body>
</html>`;
}
