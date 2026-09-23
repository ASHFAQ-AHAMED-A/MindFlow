import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CaseTimeline from '../components/CaseTimeline';
import WorkflowProgress from '../components/WorkflowProgress';
import PriorityBadge from '../components/PriorityBadge';
import CaseCard from '../components/CaseCard';
import { ArrowLeft, Link2, User, Calendar, FileText } from 'lucide-react';
import { students } from '../data/mockData';

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();

  // If no id, show all cases
  if (!id) {
    return (
      <div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">All Cases</h1>
        <p className="text-sm text-slate-500 mb-6">Individual student support cases</p>
        <div className="space-y-3">
          {state.cases.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CaseCard
                caseItem={c}
                showMasterIssue
                onClick={() => navigate(`/staff/case/${c.id}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const caseItem = state.cases.find(c => c.id === id);
  if (!caseItem) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900">Case Not Found</h2>
        <button onClick={() => navigate('/staff')} className="mt-4 text-indigo-600">Back to Dashboard</button>
      </div>
    );
  }

  const student = students.find(s => s.id === caseItem.studentId);
  const masterIssue = caseItem.masterIssueId ? state.masterIssues.find(mi => mi.id === caseItem.masterIssueId) : null;
  const caseWorkflows = state.workflows.filter(w => w.caseId === caseItem.id);
  const caseApprovals = state.approvals.filter(a => a.caseId === caseItem.id);
  const caseAppointments = state.appointments.filter(a => a.caseId === caseItem.id);

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

  const status = statusConfig[caseItem.status] || statusConfig.new;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">{caseItem.id}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
              {status.label}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Case Detail</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main */}
        <div className="col-span-2 space-y-6">
          {/* Case Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-2">{caseItem.title}</h2>
            <p className="text-sm text-slate-500 mb-4">{caseItem.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <PriorityBadge priority={caseItem.priority} size="md" />
              {caseItem.categories.map(cat => (
                <span key={cat} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 capitalize">
                  {cat}
                </span>
              ))}
            </div>
            {masterIssue && (
              <div
                className="mt-4 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors"
                onClick={() => navigate(`/staff/master-issue/${masterIssue.id}`)}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Link2 className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-indigo-700">Master Issue: {masterIssue.title}</span>
                  <span className="text-xs text-indigo-500">({masterIssue.caseCount} students)</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
          >
            <h3 className="text-base font-semibold text-slate-900 mb-5">Case Timeline</h3>
            <CaseTimeline events={caseItem.timeline} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Student
            </h3>
            {student && (
              <div>
                <p className="text-sm font-medium text-slate-900">{student.name}</p>
                <p className="text-xs text-slate-500">{student.email}</p>
                <p className="text-xs text-slate-500 mt-1">{student.program} • Year {student.year}</p>
              </div>
            )}
          </motion.div>

          {/* Workflows */}
          {caseWorkflows.map(workflow => (
            <WorkflowProgress key={workflow.id} workflow={workflow} />
          ))}

          {/* Approvals */}
          {caseApprovals.map(approval => (
            <motion.div
              key={approval.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Approval
              </h3>
              <p className="text-xs text-slate-500 mb-1">Type: {approval.type.replace('_', ' ')}</p>
              <p className="text-xs text-slate-500 mb-1">Approver: {approval.approver}</p>
              <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                approval.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : approval.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {approval.status === 'pending' ? '🟡 Pending' : approval.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
              </span>
            </motion.div>
          ))}

          {/* Appointments */}
          {caseAppointments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Appointments
              </h3>
              {caseAppointments.map(apt => (
                <div key={apt.id} className="text-sm">
                  <p className="text-slate-700 font-medium">{apt.staffName}</p>
                  <p className="text-xs text-slate-500">{new Date(apt.startTime).toLocaleString()}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                    apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
