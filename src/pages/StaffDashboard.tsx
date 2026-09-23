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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Support Operations</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time overview of student support activity</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">
          ● Live
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Active Cases" value={activeCases} color="indigo" />
        <StatCard icon={AlertTriangle} label="High Priority" value={highPriority} color="amber" trend="12%" trendUp />
        <StatCard icon={AlertOctagon} label="Urgent" value={urgent} color="red" />
        <StatCard icon={Clock} label="Waiting" value={waiting} color="slate" />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Available Slots" value={availableSlots} color="emerald" />
        <StatCard icon={Users} label="Standby Students" value={standbyStudents} color="indigo" />
        <StatCard icon={XCircle} label="Cancellations Today" value={cancellationsToday} color="amber" />
        <StatCard icon={ShieldAlert} label="SLA at Risk" value={slaAtRisk} color="red" />
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Master Issues */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Master Issues</h2>
            <button
              onClick={() => navigate('/staff/master-issues')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {state.masterIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Recent Cases</h2>
            <button
              onClick={() => navigate('/staff/cases')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentCases.map((c, index) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
