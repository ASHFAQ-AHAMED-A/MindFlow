import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Users, ArrowRight } from 'lucide-react';
import { MasterIssue } from '../types';

interface MasterIssueCardProps {
  issue: MasterIssue;
  onClick?: () => void;
}

export default function MasterIssueCard({ issue, onClick }: MasterIssueCardProps) {
  const statusColors = {
    active: 'bg-red-500 shadow-sm shadow-red-500/50',
    monitoring: 'bg-amber-500 shadow-sm shadow-amber-500/50',
    resolved: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
  };

  const TrendIcon = issue.trend === 'increasing' ? TrendingUp : issue.trend === 'decreasing' ? TrendingDown : Minus;
  const trendColor = issue.trend === 'increasing' ? 'text-red-600 bg-red-50 border-red-200' : issue.trend === 'decreasing' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-50 border-slate-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className={`w-3 h-3 rounded-full ${statusColors[issue.status]}`} />
          <h3 className="text-base font-bold text-slate-900 heading-font group-hover:text-indigo-600 transition-colors">{issue.title}</h3>
        </div>
        <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 flex items-center justify-center transition-colors flex-shrink-0">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <Users className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-900">{issue.caseCount}</span>
          <span className="text-xs text-slate-400">affected students</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          <span>{issue.trendPercent}% {issue.trend}</span>
        </div>
      </div>

      {/* Priority breakdown */}
      <div className="flex flex-wrap gap-2 mb-3.5">
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Normal: {issue.priorityBreakdown.normal}
        </span>
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          High: {issue.priorityBreakdown.high}
        </span>
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
          Urgent: {issue.priorityBreakdown.urgent}
        </span>
      </div>

      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{issue.commonRequest}</p>
    </motion.div>
  );
}

