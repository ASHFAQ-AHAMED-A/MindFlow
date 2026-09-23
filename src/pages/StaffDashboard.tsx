import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import MasterIssueCard from '../components/MasterIssueCard';
import CaseCard from '../components/CaseCard';
import {
  FileText,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Calendar,
  Users,
  XCircle,
  ShieldAlert,
  Radio,
  ArrowRight,
} from 'lucide-react';

export default function StaffDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();

  const activeCases = state.cases.filter(c => c.status !== 'closed' && c.status !== 'resolved').length;
  const highPriority = state.cases.filter(c => c.priority === 'high').length;
  const urgent = state.cases.filter(c => c.priority === 'urgent').length;
  const waiting = state.cases.filter(c => c.status === 'waiting').length;
  const availableSlots = state.appointments.filter(a => a.status === 'scheduled' && !a.studentId).length;
  const standbyStudents = state.standbyQueue.filter(s => s.status === 'waiting').length;
  const cancellationsToday = state.appointments.filter(a => a.status === 'cancelled').length;
  const slaAtRisk = Math.floor(activeCases * 0.08); // Mock: 8% of active cases

  const recentCases = [...state.cases].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font tracking-tight">Support Operations Hub</h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Engine</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">Real-time triage telemetry, active crisis clusters, and advisor workload allocation</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/staff/standby')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-indigo-600" />
            <span>Standby Radar</span>
          </button>
          <button
            onClick={() => navigate('/staff/cases')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
          >
            <span>Triage Stream</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Urgency & Case Load</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={FileText} label="Active Open Cases" value={activeCases} color="indigo" />
          <StatCard icon={AlertTriangle} label="High Priority" value={highPriority} color="amber" trend="12%" trendUp />
          <StatCard icon={AlertOctagon} label="Immediate Crisis (Urgent)" value={urgent} color="red" />
          <StatCard icon={Clock} label="Pending Review (Waiting)" value={waiting} color="slate" />
        </div>
      </div>

      {/* Capacity & SLA Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Capacity & Allocation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={Calendar} label="Available Counselor Slots" value={availableSlots} color="emerald" />
          <StatCard icon={Users} label="Standby Queue Length" value={standbyStudents} color="indigo" />
          <StatCard icon={XCircle} label="Cancellations Today" value={cancellationsToday} color="amber" />
          <StatCard icon={ShieldAlert} label="SLA At Risk Threshold" value={slaAtRisk} color="red" />
        </div>
      </div>

      {/* Two Column Layout: Master Issues & Recent Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        {/* Master Issues */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 heading-font">Active Master Issue Clusters</h2>
              <p className="text-xs text-slate-400">AI correlated systemic student challenges</p>
            </div>
            <button
              onClick={() => navigate('/staff/master-issues')}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            {state.masterIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <MasterIssueCard
                  issue={issue}
                  onClick={() => navigate(`/staff/master-issue/${issue.id}`)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 heading-font">Recent Student Submissions</h2>
              <p className="text-xs text-slate-400">Chronological inbound support queue</p>
            </div>
            <button
              onClick={() => navigate('/staff/cases')}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            {recentCases.map((c, index) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
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
      </div>
    </div>
  );
}

