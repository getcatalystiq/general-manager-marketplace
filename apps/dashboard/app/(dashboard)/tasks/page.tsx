'use client';

import { useState, useEffect } from 'react';
import type { Task, TaskStatus, TaskHorizon } from '@gm/shared';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ horizon?: string; status?: string }>({});

  useEffect(() => {
    // Mock data - in real app, call gm_list_tasks
    setTasks([
      {
        id: '1',
        organizationId: 'org-1',
        title: 'Monthly SaaS metrics review',
        description: 'Analyze MRR, churn, and LTV using /saas-metrics',
        horizon: 'medium-term',
        status: 'approved',
        category: 'analytics',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        organizationId: 'org-1',
        title: 'Respond to customer inquiry',
        description: 'Customer asked about pricing',
        horizon: 'short-term',
        status: 'pending',
        category: 'support',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        organizationId: 'org-1',
        title: 'Q1 market analysis',
        description: 'Strategic review of market position',
        horizon: 'long-term',
        status: 'draft',
        category: 'strategy',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ] as Task[]);
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500">Manage your tasks across all horizons</p>
        </div>
        <a
          href="/tasks/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Task
        </a>
      </header>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filter.horizon || ''}
          onChange={(e) => setFilter({ ...filter, horizon: e.target.value || undefined })}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Horizons</option>
          <option value="short-term">Short-term</option>
          <option value="medium-term">Medium-term</option>
          <option value="long-term">Long-term</option>
        </select>

        <select
          value={filter.status || ''}
          onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="executing">Executing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {tasks
          .filter(t => !filter.horizon || t.horizon === filter.horizon)
          .filter(t => !filter.status || t.status === filter.status)
          .map(task => (
            <TaskRow key={task.id} task={task} />
          ))}

        {tasks.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No tasks found. Create your first task to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <span className={`px-2 py-0.5 text-xs rounded-full horizon-${task.horizon}`}>
              {task.horizon}
            </span>
            <span className={`px-2 py-0.5 text-xs rounded-full status-${task.status}`}>
              {task.status}
            </span>
          </div>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
          )}
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
            {task.category && <span>Category: {task.category}</span>}
            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.status === 'approved' && (
            <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
              Run
            </button>
          )}
          <a
            href={`/tasks/${task.id}`}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Edit
          </a>
        </div>
      </div>

      {task.status === 'executing' && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">{task.currentStep || 'Processing...'}</span>
            <span className="text-gray-600">{task.progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
