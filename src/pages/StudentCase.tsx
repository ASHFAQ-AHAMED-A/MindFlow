import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CaseTimeline from '../components/CaseTimeline';
import WorkflowProgress from '../components/WorkflowProgress';
import PriorityBadge from '../components/PriorityBadge';
import WhileYouWait from '../components/WhileYouWait';
import { ArrowLeft, Link2, FileText, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { useState } from 'react';
import { WaitAction } from '../types';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  triaged: { label: 'Triaged', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  clustered: { label: 'Clustered', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  assigned: { label: 'Assigned', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  in_progress: { label: 'In Progress', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  waiting: { label: 'Waiting on Info', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  escalated: { label: 'Escalated', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  resolved: { label: 'Resolved', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  closed: { label: 'Closed', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
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
      <div className="text-center py-24 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-12 max-w-lg mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 heading-font mb-2">No Active Case Found</h2>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">Tell us what you are going through to initiate your first autonomous support case.</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-sm font-bold hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all"
        >
          Submit Support Request
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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-3 hover:bg-white bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors shadow-xs"
            title="Back to Support Home"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                {caseItem.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.color} ${status.bg}`}>
                {status.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font tracking-tight">Support Journey & Live Tracking</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Clock className="w-4 h-4" />
          <span>Created on {new Date(caseItem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-7 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Case Subject</span>
                <h2 className="text-xl font-bold text-slate-900 heading-font mt-1">{caseItem.title}</h2>
              </div>
              <PriorityBadge priority={caseItem.priority} size="md" />
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 mb-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Submitted Concern</p>
              <p className="text-sm text-slate-700 leading-relaxed italic">"{caseItem.description}"</p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold text-slate-400 mr-1">Categories:</span>
              {caseItem.categories.map(cat => (
                <span key={cat} className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50/80 text-indigo-700 border border-indigo-100 capitalize">
                  {cat}
                </span>
              ))}
            </div>

            {/* Master Issue Link */}
            {masterIssue && (
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 to-violet-50/90 border border-indigo-100/90">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-indigo-900 block">Correlated Campus Initiative: {masterIssue.title}</span>
                    <span className="text-xs text-indigo-600 font-medium">({masterIssue.caseCount} related peer inquiries being resolved in unison)</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Academic Approvals */}
          {caseApprovals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {caseApprovals.map(approval => (
                <div key={approval.id} className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-7 shadow-sm">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 heading-font">
                        Academic Deadline Extension
                      </h3>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      approval.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : approval.status === 'rejected'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {approval.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {approval.status === 'pending' ? '🟡 Pending Instructor Approval' : approval.status === 'approved' ? 'Extension Granted' : 'Rejected'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Request Details</p>
                      <p className="text-sm font-semibold text-slate-800">{approval.requestDetails}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Approver</p>
                      <p className="text-sm font-semibold text-slate-800">{approval.approver}</p>
                    </div>
                    {approval.newDeadline && approval.status === 'approved' && (
                      <div className="sm:col-span-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-sm text-emerald-800 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Extended Submission Deadline: {new Date(approval.newDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Case Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-7 shadow-sm"
          >
            <h3 className="text-lg font-bold text-slate-900 heading-font mb-6 pb-3 border-b border-slate-100">Live Case Timeline & Actions</h3>
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

