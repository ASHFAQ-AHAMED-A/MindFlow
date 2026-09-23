import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CaseCard from '../components/CaseCard';
import PriorityBadge from '../components/PriorityBadge';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Lightbulb,
  BarChart3,
  Layers,
} from 'lucide-react';

export default function MasterIssuePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();

  // If no id, show list of all master issues
  if (!id) {
    return (
      <div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Master Issues</h1>
        <p className="text-sm text-slate-500 mb-6">Clustered student concerns identified by AI semantic analysis</p>
        <div className="space-y-4">
          {state.masterIssues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/staff/master-issue/${issue.id}`)}
              className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${issue.status === 'active' ? 'bg-red-500' : issue.status === 'monitoring' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <h3 className="text-lg font-semibold text-slate-900">{issue.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-bold text-slate-900">{issue.caseCount}</span>
                  <span className="text-slate-400">students</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-3">{issue.description}</p>
              <div className="flex gap-2">
                <PriorityBadge priority="normal" />
                <span className="text-xs text-slate-500 self-center">: {issue.priorityBreakdown.normal}</span>
                <PriorityBadge priority="high" />
                <span className="text-xs text-slate-500 self-center">: {issue.priorityBreakdown.high}</span>
                <PriorityBadge priority="urgent" />
                <span className="text-xs text-slate-500 self-center">: {issue.priorityBreakdown.urgent}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const issue = state.masterIssues.find(mi => mi.id === id);
  if (!issue) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900">Master Issue Not Found</h2>
        <button onClick={() => navigate('/staff')} className="mt-4 text-indigo-600">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const relatedCases = state.cases.filter(c => c.masterIssueId === issue.id);
  const TrendIcon = issue.trend === 'increasing' ? TrendingUp : issue.trend === 'decreasing' ? TrendingDown : Minus;
  const trendColor = issue.trend === 'increasing' ? 'text-red-600' : issue.trend === 'decreasing' ? 'text-emerald-600' : 'text-slate-500';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">{issue.id}</span>
            <span className={`w-2 h-2 rounded-full ${issue.status === 'active' ? 'bg-red-500' : 'bg-amber-500'}`} />
            <span className="text-xs font-medium capitalize text-slate-500">{issue.status}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Master Issue Detail</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main */}
        <div className="col-span-2 space-y-6">
          {/* Issue Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">{issue.title}</h2>
              <div className={`flex items-center gap-1.5 text-sm font-semibold ${trendColor}`}>
                <TrendIcon className="w-4 h-4" />
                {issue.trendPercent}% {issue.trend}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-5">{issue.description}</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-slate-50">
                <p className="text-3xl font-bold text-slate-900">{issue.caseCount}</p>
                <p className="text-xs text-slate-500 mt-1">Total Students</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50">
                <p className="text-3xl font-bold text-slate-900 capitalize">{issue.category}</p>
                <p className="text-xs text-slate-500 mt-1">Category</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50">
                <p className="text-3xl font-bold text-slate-900">{relatedCases.length}</p>
                <p className="text-xs text-slate-500 mt-1">Tracked Cases</p>
              </div>
            </div>
          </motion.div>

          {/* Priority Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-900">Priority Distribution</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Normal', value: issue.priorityBreakdown.normal, color: 'bg-emerald-500', bg: 'bg-emerald-100' },
                { label: 'High', value: issue.priorityBreakdown.high, color: 'bg-amber-500', bg: 'bg-amber-100' },
                { label: 'Urgent', value: issue.priorityBreakdown.urgent, color: 'bg-red-500', bg: 'bg-red-100' },
              ].map(item => {
                const percent = (item.value / issue.caseCount) * 100;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      <span className="text-sm font-bold text-slate-900">{item.value}</span>
                    </div>
                    <div className={`w-full h-3 rounded-full ${item.bg}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`h-3 rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Related Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-900">Individual Cases</h3>
            </div>
            <div className="space-y-3">
              {relatedCases.map((c) => (
                <CaseCard
                  key={c.id}
                  caseItem={c}
                  onClick={() => navigate(`/staff/case/${c.id}`)}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Common Request */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Common Request
            </h3>
            <p className="text-sm text-slate-600 italic">"{issue.commonRequest}"</p>
          </motion.div>

          {/* Suggested Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-5"
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              AI Suggested Action
            </h3>
            <p className="text-sm text-slate-600">{issue.suggestedAction}</p>
            <button className="mt-4 w-full px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Create Academic Workflow
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
