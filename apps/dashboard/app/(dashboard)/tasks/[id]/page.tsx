'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Task } from '@gm/shared';

interface Plugin {
  id: string;
  name: string;
  description: string;
}

interface Skill {
  id: string;
  pluginId: string;
  name: string;
  description: string;
  triggers: string[];
}

interface Command {
  id: string;
  pluginId: string;
  name: string;
  description: string;
  requiredConnectors: string[];
}

interface Connector {
  id: string;
  name: string;
  description: string;
}

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [horizon, setHorizon] = useState<'short-term' | 'medium-term' | 'long-term'>('short-term');
  const [category, setCategory] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [status, setStatus] = useState<string>('draft');

  const [plugins, setPlugins] = useState<{
    plugins: Plugin[];
    skills: Skill[];
    commands: Command[];
    connectors: Connector[];
  }>({ plugins: [], skills: [], commands: [], connectors: [] });

  const [pluginTab, setPluginTab] = useState<'skills' | 'commands' | 'connectors'>('skills');

  useEffect(() => {
    // Mock data - in real app, call gm_list_tasks and find by id
    const mockTasks: Task[] = [
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
    ];

    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setHorizon(task.horizon);
      setCategory(task.category || '');
      setStatus(task.status);
      if (task.scheduledAt) {
        setScheduledAt(new Date(task.scheduledAt).toISOString().slice(0, 16));
      }
    }
    setLoading(false);

    // Mock plugin data
    setPlugins({
      plugins: [
        { id: 'online-business', name: 'Online Business', description: 'Business analytics' }
      ],
      skills: [
        { id: 'saas-metrics', pluginId: 'online-business', name: 'SaaS Metrics', description: 'Calculate MRR, churn, LTV', triggers: ['MRR', 'churn'] },
        { id: 'pricing-strategy', pluginId: 'online-business', name: 'Pricing Strategy', description: 'Analyze pricing', triggers: ['pricing'] },
        { id: 'customer-success', pluginId: 'online-business', name: 'Customer Success', description: 'Track customer health', triggers: ['retention'] }
      ],
      commands: [
        { id: 'analyze-ads', pluginId: 'online-business', name: 'Analyze Ads', description: 'Evaluate Google Ads performance', requiredConnectors: ['google-ads'] },
        { id: 'analyze-content', pluginId: 'online-business', name: 'Analyze Content', description: 'Evaluate content metrics', requiredConnectors: ['google-analytics'] },
        { id: 'analyze-funnel', pluginId: 'online-business', name: 'Analyze Funnel', description: 'Analyze conversion funnel', requiredConnectors: ['google-analytics', 'stripe'] },
        { id: 'track-growth', pluginId: 'online-business', name: 'Track Growth', description: 'Monitor growth metrics', requiredConnectors: ['stripe'] }
      ],
      connectors: [
        { id: 'stripe', name: 'Stripe', description: 'Payment data' },
        { id: 'google-ads', name: 'Google Ads', description: 'Ad performance' },
        { id: 'google-analytics', name: 'Google Analytics', description: 'Website traffic' },
        { id: 'postgres', name: 'PostgreSQL', description: 'Custom database' }
      ]
    });
  }, [taskId]);

  const injectPlugin = (type: 'skill' | 'command' | 'connector', id: string) => {
    const injection = type === 'connector' ? `connector:${id}` : `/${id}`;
    setDescription(prev => prev + (prev ? ' ' : '') + injection);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // In real app, call gm_update_task
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('Task updated! (mock)');
    setSaving(false);
    router.push('/tasks');
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const isEditable = ['draft', 'pending', 'approved'].includes(status);

  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
        <p className="text-gray-500">Update task details and configuration</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Monthly SaaS metrics review"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={!isEditable}
          />
        </div>

        {/* Description with Plugin Browser */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Analyze our MRR growth, churn rate, and LTV:CAC ratio. Use /saas-metrics for calculations."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditable}
          />

          {/* Plugin Browser */}
          {isEditable && (
            <div className="mt-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Available Plugins</span>
                <button type="button" className="text-xs text-blue-600 hover:text-blue-800">
                  Refresh
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {(['skills', 'commands', 'connectors'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPluginTab(tab)}
                    className={`px-4 py-2 text-sm font-medium ${
                      pluginTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-4 max-h-48 overflow-y-auto">
                {pluginTab === 'skills' && (
                  <div className="space-y-2">
                    {plugins.skills.map(skill => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => injectPlugin('skill', skill.id)}
                        className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium text-gray-900">/{skill.id}</div>
                        <div className="text-xs text-gray-500">{skill.description}</div>
                      </button>
                    ))}
                  </div>
                )}

                {pluginTab === 'commands' && (
                  <div className="space-y-2">
                    {plugins.commands.map(cmd => (
                      <button
                        key={cmd.id}
                        type="button"
                        onClick={() => injectPlugin('command', cmd.id)}
                        className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">/{cmd.id}</span>
                          {cmd.requiredConnectors.map(c => (
                            <span
                              key={c}
                              className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">{cmd.description}</div>
                      </button>
                    ))}
                  </div>
                )}

                {pluginTab === 'connectors' && (
                  <div className="space-y-2">
                    {plugins.connectors.map(conn => (
                      <button
                        key={conn.id}
                        type="button"
                        onClick={() => injectPlugin('connector', conn.id)}
                        className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium text-gray-900">connector:{conn.id}</div>
                        <div className="text-xs text-gray-500">{conn.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                Click to inject into description
              </div>
            </div>
          )}
        </div>

        {/* Horizon & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horizon
            </label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value as typeof horizon)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!isEditable}
            >
              <option value="short-term">Short-term (within 24h)</option>
              <option value="medium-term">Medium-term (within 30 days)</option>
              <option value="long-term">Long-term (strategic)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category (optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="analytics, support, marketing..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!isEditable}
            />
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Schedule (optional)
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!isEditable}
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to run now, or set a future date/time
          </p>
        </div>

        {/* Status indicator for non-editable tasks */}
        {!isEditable && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              This task is currently <strong>{status}</strong> and cannot be edited.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={!isEditable || saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <a
            href="/tasks"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
