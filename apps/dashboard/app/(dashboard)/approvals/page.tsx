'use client';

import { useState, useEffect } from 'react';

interface ApprovalRequest {
  id: string;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  horizon: 'short-term' | 'medium-term' | 'long-term';
  requestedAt: string;
  requestedBy: string;
  actionType: 'execute' | 'high_impact';
  riskLevel: 'low' | 'medium' | 'high';
  estimatedImpact?: string;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, call gm_list_approvals
    setApprovals([
      {
        id: 'apr-1',
        taskId: 'task-1',
        taskTitle: 'Send marketing campaign',
        taskDescription: 'Send email campaign to 5,000 subscribers about new product launch',
        horizon: 'short-term',
        requestedAt: new Date().toISOString(),
        requestedBy: 'orchestrator',
        actionType: 'high_impact',
        riskLevel: 'medium',
        estimatedImpact: '5,000 customers will receive email'
      },
      {
        id: 'apr-2',
        taskId: 'task-2',
        taskTitle: 'Update pricing structure',
        taskDescription: 'Adjust pricing tiers based on competitive analysis',
        horizon: 'medium-term',
        requestedAt: new Date(Date.now() - 3600000).toISOString(),
        requestedBy: 'orchestrator',
        actionType: 'high_impact',
        riskLevel: 'high',
        estimatedImpact: 'Revenue impact across all tiers'
      },
      {
        id: 'apr-3',
        taskId: 'task-3',
        taskTitle: 'Generate weekly report',
        taskDescription: 'Compile and send weekly analytics summary',
        horizon: 'short-term',
        requestedAt: new Date(Date.now() - 7200000).toISOString(),
        requestedBy: 'scheduled',
        actionType: 'execute',
        riskLevel: 'low'
      }
    ]);
    setLoading(false);
  }, []);

  const handleApprove = async (id: string) => {
    // In real app, call gm_approve_task
    setApprovals(prev => prev.filter(a => a.id !== id));
    alert('Approved! (mock)');
  };

  const handleReject = async (id: string) => {
    // In real app, call gm_reject_task
    setApprovals(prev => prev.filter(a => a.id !== id));
    alert('Rejected! (mock)');
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-500">Review and approve tasks before execution</p>
      </header>

      {approvals.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
          <p className="text-gray-500">No pending approvals at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map(approval => (
            <ApprovalCard
              key={approval.id}
              approval={approval}
              onApprove={() => handleApprove(approval.id)}
              onReject={() => handleReject(approval.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApprovalCard({
  approval,
  onApprove,
  onReject
}: {
  approval: ApprovalRequest;
  onApprove: () => void;
  onReject: () => void;
}) {
  const riskColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{approval.taskTitle}</h3>
            <span className={`px-2 py-0.5 text-xs rounded-full horizon-${approval.horizon}`}>
              {approval.horizon}
            </span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${riskColors[approval.riskLevel]}`}>
              {approval.riskLevel} risk
            </span>
          </div>

          <p className="text-gray-600 mb-4">{approval.taskDescription}</p>

          {approval.estimatedImpact && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm">
                <span className="font-medium text-gray-700">Estimated Impact: </span>
                <span className="text-gray-600">{approval.estimatedImpact}</span>
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Requested by: {approval.requestedBy}</span>
            <span>Action: {approval.actionType}</span>
            <span>{new Date(approval.requestedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onApprove}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Approve
        </button>
        <button
          onClick={onReject}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Reject
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
          View Details
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
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
