import type { ToolRegistry, ToolContext } from './tasks.js';

// UI Resource HTML templates
// These are served when the host requests the ui:// resources

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>General Manager Dashboard</title>
  <script type="module">
    import { App } from 'https://esm.sh/@modelcontextprotocol/ext-apps@1.0.1';

    const app = new App({ name: 'GM Dashboard', version: '1.0.0' });
    app.connect();

    // Handle initial tool result
    app.ontoolresult = (result) => {
      const text = result.content?.find(c => c.type === 'text')?.text;
      if (text) {
        try {
          const data = JSON.parse(text);
          renderDashboard(data);
        } catch (e) {
          document.getElementById('content').innerHTML = '<p>Error loading dashboard data</p>';
        }
      }
    };

    window.refreshDashboard = async () => {
      const result = await app.callServerTool({ name: 'gm_show_dashboard', arguments: {} });
      const text = result.content?.find(c => c.type === 'text')?.text;
      if (text) {
        const data = JSON.parse(text);
        renderDashboard(data);
      }
    };

    window.showTasks = async () => {
      await app.callServerTool({ name: 'gm_show_tasks', arguments: {} });
    };

    window.showApprovals = async () => {
      await app.callServerTool({ name: 'gm_show_approvals', arguments: {} });
    };

    function renderDashboard(data) {
      document.getElementById('org-name').textContent = data.orgName || 'Your Organization';
      document.getElementById('pending-count').textContent = data.pendingTasks;
      document.getElementById('progress-count').textContent = data.inProgressTasks;
      document.getElementById('completed-count').textContent = data.completedTasks;
      document.getElementById('approvals-count').textContent = data.pendingApprovals;

      const taskList = document.getElementById('task-list');
      if (data.tasks && data.tasks.length > 0) {
        taskList.innerHTML = data.tasks.map(task => \`
          <div class="task-item priority-\${task.priority || 'medium'}">
            <div>
              <div class="task-title">\${escapeHtml(task.title)}</div>
              <div class="task-meta">\${task.due_date ? 'Due: ' + task.due_date : 'No due date'}</div>
            </div>
            <span class="status-badge status-\${task.status}">\${task.status.replace('_', ' ')}</span>
          </div>
        \`).join('');
      } else {
        taskList.innerHTML = '<div class="empty-state">No tasks yet</div>';
      }

      const approvalList = document.getElementById('approval-list');
      if (data.approvals && data.approvals.length > 0) {
        approvalList.innerHTML = data.approvals.map(approval => \`
          <div class="approval-item">
            <div>
              <div class="task-title">\${escapeHtml(approval.title || approval.type)}</div>
              <div class="task-meta">\${approval.type}</div>
            </div>
          </div>
        \`).join('');
      } else {
        approvalList.innerHTML = '<div class="empty-state">No pending approvals</div>';
      }
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  </script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #e4e4e7;
      padding: 24px;
      min-height: 100vh;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      background: linear-gradient(90deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .header .org-name {
      color: #a1a1aa;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .stat-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .stat-card .number {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .stat-card .label {
      font-size: 12px;
      color: #a1a1aa;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-card.pending .number { color: #fbbf24; }
    .stat-card.progress .number { color: #3b82f6; }
    .stat-card.completed .number { color: #10b981; }
    .stat-card.approvals .number { color: #f472b6; }
    .grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    @media (max-width: 800px) {
      .grid { grid-template-columns: 1fr; }
    }
    .card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 20px;
    }
    .card h2 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .task-list, .approval-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .task-item, .approval-item {
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .task-title {
      font-size: 14px;
      font-weight: 500;
    }
    .task-meta {
      font-size: 12px;
      color: #a1a1aa;
      margin-top: 4px;
    }
    .status-badge {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }
    .status-pending { background: rgba(251,191,36,0.2); color: #fbbf24; }
    .status-in_progress { background: rgba(59,130,246,0.2); color: #3b82f6; }
    .status-completed { background: rgba(16,185,129,0.2); color: #10b981; }
    .priority-high { border-left: 3px solid #ef4444; }
    .priority-medium { border-left: 3px solid #f59e0b; }
    .priority-low { border-left: 3px solid #6b7280; }
    .empty-state {
      text-align: center;
      padding: 32px;
      color: #71717a;
    }
    .btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      margin-right: 8px;
      margin-top: 16px;
    }
    .btn:hover {
      opacity: 0.9;
    }
    .btn-secondary {
      background: rgba(255,255,255,0.1);
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>General Manager</h1>
      <div class="org-name" id="org-name">Loading...</div>
    </div>
  </div>

  <div class="stats-grid">
    <div class="stat-card pending">
      <div class="number" id="pending-count">-</div>
      <div class="label">Pending</div>
    </div>
    <div class="stat-card progress">
      <div class="number" id="progress-count">-</div>
      <div class="label">In Progress</div>
    </div>
    <div class="stat-card completed">
      <div class="number" id="completed-count">-</div>
      <div class="label">Completed</div>
    </div>
    <div class="stat-card approvals">
      <div class="number" id="approvals-count">-</div>
      <div class="label">Approvals</div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Recent Tasks</h2>
      <div class="task-list" id="task-list">
        <div class="empty-state">Loading...</div>
      </div>
      <button class="btn" onclick="showTasks()">View All Tasks</button>
    </div>

    <div class="card">
      <h2>Pending Approvals</h2>
      <div class="approval-list" id="approval-list">
        <div class="empty-state">Loading...</div>
      </div>
      <button class="btn" onclick="showApprovals()">View All</button>
    </div>
  </div>

  <button class="btn btn-secondary" onclick="refreshDashboard()" style="margin-top: 24px;">Refresh</button>
</body>
</html>`;

const TASKS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tasks - General Manager</title>
  <script type="module">
    import { App } from 'https://esm.sh/@modelcontextprotocol/ext-apps@1.0.1';

    const app = new App({ name: 'GM Tasks', version: '1.0.0' });
    app.connect();

    let allTasks = [];

    app.ontoolresult = (result) => {
      const text = result.content?.find(c => c.type === 'text')?.text;
      if (text) {
        try {
          const data = JSON.parse(text);
          allTasks = data.tasks || [];
          renderTasks(allTasks);
        } catch (e) {
          document.getElementById('task-table').innerHTML = '<p>Error loading tasks</p>';
        }
      }
    };

    window.filterTasks = (status) => {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

      const filtered = status === 'all' ? allTasks : allTasks.filter(t => t.status === status);
      renderTasks(filtered);
    };

    window.completeTask = async (taskId) => {
      await app.callServerTool({
        name: 'gm_update_task',
        arguments: { task_id: taskId, status: 'completed' }
      });
      // Refresh
      await app.callServerTool({ name: 'gm_show_tasks', arguments: {} });
    };

    function renderTasks(tasks) {
      const container = document.getElementById('task-table');
      if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state">No tasks found</div>';
        return;
      }

      container.innerHTML = \`
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            \${tasks.map(task => \`
              <tr>
                <td>
                  <span class="priority-dot priority-\${task.priority || 'medium'}"></span>
                  \${escapeHtml(task.title)}
                </td>
                <td><span class="status-badge status-\${task.status}">\${task.status.replace('_', ' ')}</span></td>
                <td>\${task.priority || 'medium'}</td>
                <td>\${task.due_date || '-'}</td>
                <td>
                  \${task.status !== 'completed' ? \`<button class="action-btn" onclick="completeTask('\${task.id}')">Complete</button>\` : ''}
                </td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
      \`;
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  </script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f23;
      color: #e4e4e7;
      padding: 24px;
    }
    h1 { font-size: 20px; margin-bottom: 20px; }
    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filter-btn {
      background: rgba(255,255,255,0.1);
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      color: #a1a1aa;
      cursor: pointer;
      font-size: 13px;
    }
    .filter-btn.active {
      background: #667eea;
      color: white;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      text-align: left;
      padding: 12px;
      font-size: 12px;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    td {
      padding: 16px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 14px;
    }
    tr:hover { background: rgba(255,255,255,0.03); }
    .status-badge {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }
    .status-pending { background: rgba(251,191,36,0.2); color: #fbbf24; }
    .status-in_progress { background: rgba(59,130,246,0.2); color: #3b82f6; }
    .status-completed { background: rgba(16,185,129,0.2); color: #10b981; }
    .priority-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
    }
    .priority-high { background: #ef4444; }
    .priority-medium { background: #f59e0b; }
    .priority-low { background: #6b7280; }
    .action-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: #a1a1aa;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
    }
    .action-btn:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }
    .empty-state {
      text-align: center;
      padding: 48px;
      color: #71717a;
    }
  </style>
</head>
<body>
  <h1>Tasks</h1>
  <div class="filters">
    <button class="filter-btn active" onclick="filterTasks('all')">All</button>
    <button class="filter-btn" onclick="filterTasks('pending')">Pending</button>
    <button class="filter-btn" onclick="filterTasks('in_progress')">In Progress</button>
    <button class="filter-btn" onclick="filterTasks('completed')">Completed</button>
  </div>
  <div id="task-table">
    <div class="empty-state">Loading...</div>
  </div>
</body>
</html>`;

const APPROVALS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Approvals - General Manager</title>
  <script type="module">
    import { App } from 'https://esm.sh/@modelcontextprotocol/ext-apps@1.0.1';

    const app = new App({ name: 'GM Approvals', version: '1.0.0' });
    app.connect();

    app.ontoolresult = (result) => {
      const text = result.content?.find(c => c.type === 'text')?.text;
      if (text) {
        try {
          const data = JSON.parse(text);
          renderApprovals(data.approvals || []);
        } catch (e) {
          document.getElementById('approvals').innerHTML = '<p>Error loading approvals</p>';
        }
      }
    };

    window.approveItem = async (approvalId) => {
      await app.callServerTool({
        name: 'gm_resolve_approval',
        arguments: { approval_id: approvalId, action: 'approve' }
      });
      await app.callServerTool({ name: 'gm_show_approvals', arguments: {} });
    };

    window.rejectItem = async (approvalId) => {
      await app.callServerTool({
        name: 'gm_resolve_approval',
        arguments: { approval_id: approvalId, action: 'reject' }
      });
      await app.callServerTool({ name: 'gm_show_approvals', arguments: {} });
    };

    function renderApprovals(approvals) {
      const container = document.getElementById('approvals');
      document.getElementById('count').textContent = approvals.length;

      if (approvals.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div class="icon">✓</div>
            <div>All caught up! No pending approvals.</div>
          </div>
        \`;
        return;
      }

      container.innerHTML = approvals.map(approval => \`
        <div class="approval-card">
          <div class="approval-header">
            <div class="approval-title">\${escapeHtml(approval.title || 'Approval Request')}</div>
            <span class="approval-type">\${escapeHtml(approval.type)}</span>
          </div>
          <div class="approval-desc">\${escapeHtml(approval.description || 'No description')}</div>
          <div class="approval-meta">Requested on \${new Date(approval.created_at).toLocaleDateString()}</div>
          <div class="approval-actions">
            <button class="btn btn-approve" onclick="approveItem('\${approval.id}')">Approve</button>
            <button class="btn btn-reject" onclick="rejectItem('\${approval.id}')">Reject</button>
          </div>
        </div>
      \`).join('');
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  </script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f23;
      color: #e4e4e7;
      padding: 24px;
    }
    h1 { font-size: 20px; margin-bottom: 20px; }
    .approval-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .approval-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .approval-title { font-size: 16px; font-weight: 600; }
    .approval-type {
      font-size: 11px;
      padding: 4px 8px;
      background: rgba(139,92,246,0.2);
      color: #a78bfa;
      border-radius: 4px;
    }
    .approval-desc {
      color: #a1a1aa;
      font-size: 14px;
      margin-bottom: 16px;
      line-height: 1.5;
    }
    .approval-meta {
      font-size: 12px;
      color: #71717a;
      margin-bottom: 16px;
    }
    .approval-actions { display: flex; gap: 12px; }
    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: none;
    }
    .btn-approve { background: #10b981; color: white; }
    .btn-approve:hover { background: #059669; }
    .btn-reject {
      background: transparent;
      border: 1px solid #ef4444;
      color: #ef4444;
    }
    .btn-reject:hover { background: rgba(239,68,68,0.1); }
    .empty-state {
      text-align: center;
      padding: 48px;
      color: #71717a;
    }
    .empty-state .icon { font-size: 48px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <h1>Pending Approvals (<span id="count">0</span>)</h1>
  <div id="approvals">
    <div class="empty-state">Loading...</div>
  </div>
</body>
</html>`;

// Resource URIs
const DASHBOARD_RESOURCE_URI = 'ui://gm/dashboard.html';
const TASKS_RESOURCE_URI = 'ui://gm/tasks.html';
const APPROVALS_RESOURCE_URI = 'ui://gm/approvals.html';

// Store UI resources for the resource handler
export const UI_RESOURCES: Record<string, string> = {
  [DASHBOARD_RESOURCE_URI]: DASHBOARD_HTML,
  [TASKS_RESOURCE_URI]: TASKS_HTML,
  [APPROVALS_RESOURCE_URI]: APPROVALS_HTML,
};

export function registerUITools(registry: ToolRegistry, ctx: ToolContext) {
  // Dashboard tool with UI resource
  registry.register(
    'gm_show_dashboard',
    'Display an interactive dashboard showing tasks, approvals, and organization overview',
    {},
    async () => {
      // Fetch data for the dashboard
      const [tasks, approvals, org] = await Promise.all([
        ctx.env.DB.prepare(`
          SELECT id, title, status, priority, due_date
          FROM tasks
          WHERE organization_id = ?
          ORDER BY created_at DESC
          LIMIT 10
        `).bind(ctx.organizationId).all(),
        ctx.env.DB.prepare(`
          SELECT id, type, title, status, created_at
          FROM approvals
          WHERE organization_id = ? AND status = 'pending'
          ORDER BY created_at DESC
          LIMIT 5
        `).bind(ctx.organizationId).all(),
        ctx.env.DB.prepare(`
          SELECT name FROM organizations WHERE id = ?
        `).bind(ctx.organizationId).first()
      ]);

      const taskList = tasks.results || [];
      const approvalList = approvals.results || [];

      const data = {
        orgName: org?.name || 'Your Organization',
        pendingTasks: taskList.filter((t: any) => t.status === 'pending').length,
        inProgressTasks: taskList.filter((t: any) => t.status === 'in_progress').length,
        completedTasks: taskList.filter((t: any) => t.status === 'completed').length,
        pendingApprovals: approvalList.length,
        tasks: taskList,
        approvals: approvalList,
      };

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(data)
        }]
      };
    },
    { ui: { resourceUri: DASHBOARD_RESOURCE_URI } }
  );

  // Tasks tool with UI resource
  registry.register(
    'gm_show_tasks',
    'Display an interactive task management interface',
    {},
    async () => {
      const tasks = await ctx.env.DB.prepare(`
        SELECT id, title, description, status, priority, due_date, created_at
        FROM tasks
        WHERE organization_id = ?
        ORDER BY
          CASE status WHEN 'pending' THEN 1 WHEN 'in_progress' THEN 2 ELSE 3 END,
          CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
          created_at DESC
        LIMIT 50
      `).bind(ctx.organizationId).all();

      const data = {
        tasks: tasks.results || []
      };

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(data)
        }]
      };
    },
    { ui: { resourceUri: TASKS_RESOURCE_URI } }
  );

  // Approvals tool with UI resource
  registry.register(
    'gm_show_approvals',
    'Display pending approvals that need your attention',
    {},
    async () => {
      const approvals = await ctx.env.DB.prepare(`
        SELECT id, type, title, description, status, metadata, created_at
        FROM approvals
        WHERE organization_id = ? AND status = 'pending'
        ORDER BY created_at DESC
        LIMIT 20
      `).bind(ctx.organizationId).all();

      const data = {
        approvals: approvals.results || []
      };

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(data)
        }]
      };
    },
    { ui: { resourceUri: APPROVALS_RESOURCE_URI } }
  );
}
