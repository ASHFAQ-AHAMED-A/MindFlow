import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CaseTimeline from '../components/CaseTimeline';
import WorkflowProgress from '../components/WorkflowProgress';
import PriorityBadge from '../components/PriorityBadge';
import WhileYouWait from '../components/WhileYouWait';
import { ArrowLeft, Link2, FileText, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { WaitAction } from '../types';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: 'text-blue-700', bg: 'bg-blue-50' },
  triaged: { label: 'Triaged', color: 'text-violet-700', bg: 'bg-violet-50' },
  clustered: { label: 'Clustered', color: 'text-indigo-700', bg: 'bg-indigo-50' },
  assigned: { label: 'Assigned', color: 'text-blue-700', bg: 'bg-blue-50' },
  in_progress: { label: 'In Progress', color: 'text-indigo-700', bg: 'bg-indigo-50' },
  waiting: { label: 'Waiting', color: 'text-amber-700', bg: 'bg-amber-50' },
  escalated: { label: 'Escalated', color: 'text-red-700', bg: 'bg-red-50' },
  resolved: { label: 'Resolved', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  closed: { label: 'Closed', color: 'text-slate-700', bg: 'bg-slate-50' },
};

export default function StudentCase() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();

  // Find the case - either by param or the student's most recent case
  const studentCases = state.cases.filter(c => c.studentId === state.currentStudent.id);
  const caseItem = id
    ? state.cases.find(c => c.id === id)
    : studentCases[studentCases.length - 1];

  const [waitActions, setWaitActions] = useState<WaitAction[]>([
    { id: 'w1', title: 'Prepare required documents', description: 'Gather any supporting documentation for your request', completed: false },
    { id: 'w2', title: 'Review extension policy', description: 'Understand the academic extension guidelines', completed: false, url: '#' },
    { id: 'w3', title: 'Check financial aid options', description: 'Browse available scholarships and support programs', completed: false, url: '#' },
    { id: 'w4', title: 'Complete wellbeing self-assessment', description: 'Optional self-check questionnaire', completed: false },
    { id: 'w5', title: 'Track your case progress', description: 'Review your case timeline for updates', completed: true },
  ]);

  if (!caseItem) {
    return (
      <div className="text-center py-20">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">No Active Case</h2>
        <p className="text-slate-500 mb-6">Submit a support request to create your first case.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Get Support
        </button>
      </div>
    );
  }

  const status = statusConfig[caseItem.status] || statusConfig.new;
  const masterIssue = caseItem.masterIssueId
    ? state.masterIssues.find(mi => mi.id === caseItem.masterIssueId)
    : null;
  const caseWorkflows = state.workflows.filter(w => w.caseId === caseItem.id);
  const caseApprovals = state.approvals.filter(a => a.caseId === caseItem.id);

  const handleToggleAction = (actionId: string) => {
    setWaitActions(prev =>
      prev.map(a => (a.id === actionId ? { ...a, completed: !a.completed } : a))
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">{caseItem.id}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
              {status.label}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">My Support Journey</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="col-span-2 space-y-6">
          {/* Case Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold text-slate-900 mb-2">{caseItem.title}</h2>
            <p className="text-sm text-slate-500 mb-4">{caseItem.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <PriorityBadge priority={caseItem.priority} size="md" />
              {caseItem.categories.map(cat => (
                <span key={cat} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 capitalize">
                  {cat}
                </span>
              ))}
            </div>

            {/* Master Issue Link */}
            {masterIssue && (
              <div className="mt-4 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="flex items-center gap-2 text-sm">
                  <Link2 className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-indigo-700">Linked to: {masterIssue.title}</span>
                  <span className="text-xs text-indigo-500">({masterIssue.caseCount} related cases)</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Approval Status */}
          {caseApprovals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {caseApprovals.map(approval => (
                <div key={approval.id} className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Academic Extension
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Request</p>
                      <p className="text-sm font-medium text-slate-700">{approval.requestDetails}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Approver</p>
                      <p className="text-sm font-medium text-slate-700">{approval.approver}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        approval.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : approval.status === 'rejected'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {approval.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {approval.status === 'pending' ? '🟡 Pending Approval' : approval.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </div>
                    {approval.newDeadline && approval.status === 'approved' && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">New Deadline</p>
                        <p className="text-sm font-medium text-emerald-700">
                          {new Date(approval.newDeadline).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Case Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
          >
            <h3 className="text-base font-semibold text-slate-900 mb-5">Case Timeline</h3>
            <CaseTimeline events={caseItem.timeline} />
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Workflows */}
          {caseWorkflows.map((workflow) => (
            <WorkflowProgress key={workflow.id} workflow={workflow} />
          ))}

          {/* While You Wait */}
          {(caseItem.status === 'in_progress' || caseItem.status === 'waiting') && (
            <WhileYouWait
              waitingFor="Financial Aid Review"
              estimatedWait="Expected: 2 days"
              reason="Under review by Financial Aid Office"
              actions={waitActions}
              onToggleAction={handleToggleAction}
            />
          )}
        </div>
      </div>
    </div>
  );
}
