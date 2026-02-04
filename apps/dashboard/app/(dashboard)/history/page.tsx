'use client';

import { useState, useEffect } from 'react';

interface ExecutionResult {
  id: string;
  taskId: string;
  taskTitle: string;
  status: 'success' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt: string;
  duration: number;
  output?: string;
  error?: string;
  stepsCompleted: number;
  totalSteps: number;
}

export default function HistoryPage() {
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - in real app, call gm_list_results
    setResults([
      {
        id: 'res-1',
        taskId: 'task-1',
        taskTitle: 'Weekly inventory check',
        status: 'success',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3000000).toISOString(),
        duration: 600,
        output: 'Inventory check completed. 15 items below reorder threshold identified.',
        stepsCompleted: 5,
        totalSteps: 5
      },
      {
        id: 'res-2',
        taskId: 'task-2',
        taskTitle: 'Email campaign analysis',
        status: 'success',
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 6600000).toISOString(),
        duration: 600,
        output: 'Campaign performance: 24% open rate, 3.2% CTR. Above industry average.',
        stepsCompleted: 4,
        totalSteps: 4
      },
      {
        id: 'res-3',
        taskId: 'task-3',
        taskTitle: 'Database backup',
        status: 'failed',
        startedAt: new Date(Date.now() - 10800000).toISOString(),
        completedAt: new Date(Date.now() - 10200000).toISOString(),
        duration: 600,
        error: 'Connection timeout to backup storage. Retrying recommended.',
        stepsCompleted: 2,
        totalSteps: 4
      },
      {
        id: 'res-4',
        taskId: 'task-4',
        taskTitle: 'Customer churn analysis',
        status: 'success',
        startedAt: new Date(Date.now() - 14400000).toISOString(),
        completedAt: new Date(Date.now() - 13200000).toISOString(),
        duration: 1200,
        output: 'Churn rate: 2.3% (down from 2.8%). Top factors: pricing changes, feature gaps.',
        stepsCompleted: 8,
        totalSteps: 8
      },
      {
        id: 'res-5',
        taskId: 'task-5',
        taskTitle: 'Bulk email send',
        status: 'cancelled',
        startedAt: new Date(Date.now() - 18000000).toISOString(),
        completedAt: new Date(Date.now() - 17400000).toISOString(),
        duration: 600,
        output: 'Cancelled by user after 250 emails sent.',
        stepsCompleted: 1,
        totalSteps: 4
      }
    ]);
    setLoading(false);
  }, []);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Execution History</h1>
        <p className="text-gray-500">View past task executions and results</p>
      </header>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {results.map(result => (
          <div key={result.id} className="p-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
            >
              <div className="flex items-center gap-4">
                <StatusIcon status={result.status} />
                <div>
                  <h3 className="font-medium text-gray-900">{result.taskTitle}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{new Date(result.startedAt).toLocaleString()}</span>
                    <span>Duration: {formatDuration(result.duration)}</span>
                    <span>Steps: {result.stepsCompleted}/{result.totalSteps}</span>
                  </div>
                </div>
              </div>
              <span className="text-gray-400">
                {expandedId === result.id ? '▼' : '▶'}
              </span>
            </div>

            {expandedId === result.id && (
              <div className="mt-4 ml-10 p-4 bg-gray-50 rounded-lg">
                {result.output && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Output:</p>
                    <p className="text-sm text-gray-600">{result.output}</p>
                  </div>
                )}
                {result.error && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-red-700 mb-1">Error:</p>
                    <p className="text-sm text-red-600">{result.error}</p>
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100">
                    View Full Log
                  </button>
                  {result.status === 'failed' && (
                    <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      Retry Task
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {results.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No execution history yet.
          </div>
        )}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: 'success' | 'failed' | 'cancelled' }) {
  const config = {
    success: { icon: '✓', bg: 'bg-green-100', text: 'text-green-600' },
    failed: { icon: '✕', bg: 'bg-red-100', text: 'text-red-600' },
    cancelled: { icon: '—', bg: 'bg-gray-100', text: 'text-gray-600' }
  };

  const { icon, bg, text } = config[status];

  return (
    <div className={`w-8 h-8 rounded-full ${bg} ${text} flex items-center justify-center font-bold`}>
      {icon}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
