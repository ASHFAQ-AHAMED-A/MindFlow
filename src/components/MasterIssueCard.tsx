import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Users, ChevronRight } from 'lucide-react';
import { MasterIssue } from '../types';

interface MasterIssueCardProps {
  issue: MasterIssue;
  onClick?: () => void;
}

export default function MasterIssueCard({ issue, onClick }: MasterIssueCardProps) {
  const statusColors = {
    active: 'bg-red-500',
    monitoring: 'bg-amber-500',
    resolved: 'bg-emerald-500',
  };

  const TrendIcon = issue.trend === 'increasing' ? TrendingUp : issue.trend === 'decreasing' ? TrendingDown : Minus;
  const trendColor = issue.trend === 'increasing' ? 'text-red-600' : issue.trend === 'decreasing' ? 'text-emerald-600' : 'text-slate-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${statusColors[issue.status]}`} />
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{issue.title}</h3>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Users className="w-4 h-4" />
          <span className="font-semibold">{issue.caseCount}</span>
          <span className="text-slate-400">students</span>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          {issue.trendPercent}%
        </div>
      </div>

      {/* Priority breakdown */}
      <div className="flex gap-2 mb-3">
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Normal: {issue.priorityBreakdown.normal}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          High: {issue.priorityBreakdown.high}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          Urgent: {issue.priorityBreakdown.urgent}
        </span>
      </div>

      <p className="text-xs text-slate-500 line-clamp-2">{issue.commonRequest}</p>
    </motion.div>
  );
}
