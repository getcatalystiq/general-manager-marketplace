'use client';

import { useState, useEffect } from 'react';

interface Overview {
  pendingApprovals: number;
  activeTasks: number;
  queuedTasks: number;
  suggestions: Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
  }>;
  recentResults: Array<{
    id: string;
    taskId: string;
    taskTitle: string;
    status: string;
    startedAt: string;
    completedAt?: string;
  }>;
  systemHealth: {
    queueDepth: number;
    lastError: string | null;
    orchestratorStatus: 'healthy' | 'degraded' | 'unavailable';
  };
}

export default function OverviewPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would call the MCP tool gm_get_overview
    // For now, use mock data
    setOverview({
      pendingApprovals: 3,
      activeTasks: 2,
      queuedTasks: 5,
      suggestions: [
        { id: '1', type: 'scheduled', title: 'Monthly report due in 3 days' },
        { id: '2', type: 'reactive', title: 'Customer inquiry received' },
        { id: '3', type: 'analytical', title: 'Sales down 15% vs last month' }
      ],
      recentResults: [
        { id: '1', taskId: 'task-1', taskTitle: 'Weekly inventory check', status: 'success', startedAt: new Date().toISOString(), completedAt: new Date().toISOString() },
        { id: '2', taskId: 'task-2', taskTitle: 'Email campaign analysis', status: 'success', startedAt: new Date().toISOString(), completedAt: new Date().toISOString() }
      ],
      systemHealth: {
        queueDepth: 5,
        lastError: null,
        orchestratorStatus: 'healthy'
      }
    });
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (!overview) {
    return <div className="p-8">Failed to load overview</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Pending Approvals"
          value={overview.pendingApprovals}
          icon="✅"
          href="/approvals"
          color="yellow"
        />
        <StatCard
          title="Active Tasks"
          value={overview.activeTasks}
          icon="⚡"
          color="blue"
        />
        <StatCard
          title="Queued Tasks"
          value={overview.queuedTasks}
          icon="📋"
          color="purple"
        />
        <StatCard
          title="System Health"
          value={overview.systemHealth.orchestratorStatus}
          icon="💚"
          color={overview.systemHealth.orchestratorStatus === 'healthy' ? 'green' : 'red'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Suggestions */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Suggestions</h2>
            <a href="/suggestions" className="text-sm text-blue-600 hover:text-blue-800">View all</a>
          </div>
          <div className="space-y-3">
            {overview.suggestions.map(suggestion => (
              <div key={suggestion.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">
                  {suggestion.type === 'reactive' ? '⚡' : suggestion.type === 'scheduled' ? '📅' : '📊'}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{suggestion.title}</p>
                  <p className="text-sm text-gray-500">{suggestion.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <a href="/history" className="text-sm text-blue-600 hover:text-blue-800">View all</a>
          </div>
          <div className="space-y-3">
            {overview.recentResults.map(result => (
              <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${result.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-medium text-gray-900">{result.taskTitle}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(result.startedAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  href,
  color
}: {
  title: string;
  value: number | string;
  icon: string;
  href?: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-50 border-yellow-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200'
  };

  const content = (
    <div className={`p-6 rounded-lg border ${colorClasses[color]} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {href && <span className="text-gray-400">→</span>}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}

function LoadingState() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
