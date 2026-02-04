'use client';

import { useState, useEffect } from 'react';

interface Suggestion {
  id: string;
  type: 'scheduled' | 'reactive' | 'analytical' | 'proactive';
  title: string;
  description: string;
  reasoning: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
  createdAt: string;
  relatedData?: Record<string, unknown>;
}

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ type?: string; priority?: string }>({});

  useEffect(() => {
    // Mock data - in real app, call gm_list_suggestions
    setSuggestions([
      {
        id: 'sug-1',
        type: 'reactive',
        title: 'Customer inquiry requires attention',
        description: 'New support ticket from enterprise customer about integration issues',
        reasoning: 'High-value customer with SLA requirements',
        priority: 'high',
        source: 'email-monitor',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sug-2',
        type: 'analytical',
        title: 'Revenue anomaly detected',
        description: 'MRR dropped 12% compared to last week',
        reasoning: 'Automated analysis detected significant deviation from trend',
        priority: 'high',
        source: 'metrics-analyzer',
        createdAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'sug-3',
        type: 'scheduled',
        title: 'Monthly report due soon',
        description: 'Investor report scheduled for next week',
        reasoning: 'Based on recurring schedule pattern',
        priority: 'medium',
        source: 'scheduler',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'sug-4',
        type: 'proactive',
        title: 'Consider A/B testing pricing page',
        description: 'Conversion rate on pricing page is below industry average',
        reasoning: 'Based on benchmark data and traffic analysis',
        priority: 'low',
        source: 'growth-advisor',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ]);
    setLoading(false);
  }, []);

  const handleCreateTask = async (suggestion: Suggestion) => {
    // In real app, would navigate to /tasks/new with prefilled data
    alert(`Creating task from suggestion: ${suggestion.title} (mock)`);
  };

  const handleDismiss = async (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const filteredSuggestions = suggestions
    .filter(s => !filter.type || s.type === filter.type)
    .filter(s => !filter.priority || s.priority === filter.priority);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Suggestions</h1>
        <p className="text-gray-500">AI-generated recommendations for your attention</p>
      </header>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filter.type || ''}
          onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Types</option>
          <option value="reactive">Reactive</option>
          <option value="scheduled">Scheduled</option>
          <option value="analytical">Analytical</option>
          <option value="proactive">Proactive</option>
        </select>

        <select
          value={filter.priority || ''}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value || undefined })}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {filteredSuggestions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">💡</div>
          <h3 className="text-lg font-medium text-gray-900">No suggestions</h3>
          <p className="text-gray-500">The GM will surface suggestions as they arise.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map(suggestion => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onCreateTask={() => handleCreateTask(suggestion)}
              onDismiss={() => handleDismiss(suggestion.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SuggestionCard({
  suggestion,
  onCreateTask,
  onDismiss
}: {
  suggestion: Suggestion;
  onCreateTask: () => void;
  onDismiss: () => void;
}) {
  const typeIcons = {
    reactive: '⚡',
    scheduled: '📅',
    analytical: '📊',
    proactive: '🎯'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="text-2xl">{typeIcons[suggestion.type]}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
            <span className={`px-2 py-0.5 text-xs rounded-full ${priorityColors[suggestion.priority]}`}>
              {suggestion.priority}
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
              {suggestion.type}
            </span>
          </div>

          <p className="text-gray-600 mb-3">{suggestion.description}</p>

          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Why: </span>
              {suggestion.reasoning}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Source: {suggestion.source}</span>
            <span>{new Date(suggestion.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onCreateTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Task
        </button>
        <button
          onClick={onDismiss}
          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
