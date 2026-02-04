'use client';

import { useState, useEffect } from 'react';

interface Settings {
  organization: {
    name: string;
    timezone: string;
  };
  approvals: {
    requireApprovalForHighImpact: boolean;
    autoApproveScheduled: boolean;
    approvalTimeoutMinutes: number;
  };
  notifications: {
    emailOnApprovalRequired: boolean;
    emailOnTaskComplete: boolean;
    emailOnTaskFailed: boolean;
  };
  orchestrator: {
    endpoint: string;
    status: 'connected' | 'disconnected' | 'error';
    lastSync: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Mock data - in real app, call gm_get_settings
    setSettings({
      organization: {
        name: 'Demo Organization',
        timezone: 'America/New_York'
      },
      approvals: {
        requireApprovalForHighImpact: true,
        autoApproveScheduled: false,
        approvalTimeoutMinutes: 60
      },
      notifications: {
        emailOnApprovalRequired: true,
        emailOnTaskComplete: false,
        emailOnTaskFailed: true
      },
      orchestrator: {
        endpoint: 'https://gm-mock-orchestrator.tools-7b7.workers.dev',
        status: 'connected',
        lastSync: new Date().toISOString()
      }
    });
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // In real app, call gm_update_settings
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    alert('Settings saved! (mock)');
  };

  if (loading || !settings) {
    return <LoadingState />;
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure your General Manager instance</p>
      </header>

      {/* Organization Settings */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={settings.organization.name}
              onChange={(e) => setSettings({
                ...settings,
                organization: { ...settings.organization, name: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              value={settings.organization.timezone}
              onChange={(e) => setSettings({
                ...settings,
                organization: { ...settings.organization, timezone: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </section>

      {/* Approval Settings */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Approvals</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.approvals.requireApprovalForHighImpact}
              onChange={(e) => setSettings({
                ...settings,
                approvals: { ...settings.approvals, requireApprovalForHighImpact: e.target.checked }
              })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Require approval for high-impact actions</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.approvals.autoApproveScheduled}
              onChange={(e) => setSettings({
                ...settings,
                approvals: { ...settings.approvals, autoApproveScheduled: e.target.checked }
              })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Auto-approve scheduled tasks</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approval Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.approvals.approvalTimeoutMinutes}
              onChange={(e) => setSettings({
                ...settings,
                approvals: { ...settings.approvals, approvalTimeoutMinutes: parseInt(e.target.value) }
              })}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.notifications.emailOnApprovalRequired}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, emailOnApprovalRequired: e.target.checked }
              })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Email when approval is required</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.notifications.emailOnTaskComplete}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, emailOnTaskComplete: e.target.checked }
              })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Email when task completes</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.notifications.emailOnTaskFailed}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, emailOnTaskFailed: e.target.checked }
              })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Email when task fails</span>
          </label>
        </div>
      </section>

      {/* Orchestrator Status */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Orchestrator Connection</h2>
        <p className="text-sm text-gray-500 mb-4">
          The orchestrator manages plugins and connectors. Connector configuration is handled through the orchestrator.
        </p>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${
              settings.orchestrator.status === 'connected' ? 'bg-green-500' :
              settings.orchestrator.status === 'disconnected' ? 'bg-gray-400' : 'bg-red-500'
            }`} />
            <div>
              <p className="font-medium text-gray-900">{settings.orchestrator.endpoint}</p>
              <p className="text-sm text-gray-500">
                Last sync: {new Date(settings.orchestrator.lastSync).toLocaleString()}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            Test Connection
          </button>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-8 space-y-8 animate-pulse max-w-4xl">
      <div className="h-8 w-32 bg-gray-200 rounded" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-48 bg-gray-200 rounded-lg" />
      ))}
    </div>
  );
}
