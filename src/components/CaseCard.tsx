import { motion } from 'framer-motion';
import { Case } from '../types';
import PriorityBadge from './PriorityBadge';
import { ArrowRight, Link2 } from 'lucide-react';

interface CaseCardProps {
  caseItem: Case;
  onClick?: () => void;
  showMasterIssue?: boolean;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  triaged: { label: 'Triaged', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  clustered: { label: 'Clustered', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  assigned: { label: 'Assigned', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  in_progress: { label: 'In Progress', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  waiting: { label: 'Waiting', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  escalated: { label: 'Escalated', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  resolved: { label: 'Resolved', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  closed: { label: 'Closed', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
};

export default function CaseCard({ caseItem, onClick, showMasterIssue = false }: CaseCardProps) {
  const status = statusConfig[caseItem.status] || statusConfig.new;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{caseItem.id}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${status.color} ${status.bg}`}>
              {status.label}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
            {caseItem.title}
          </h3>
        </div>
        <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 flex items-center justify-center transition-colors flex-shrink-0">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{caseItem.description}</p>

      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={caseItem.priority} size="sm" />
          {caseItem.categories.map(cat => (
            <span key={cat} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 capitalize">
              {cat}
            </span>
          ))}
        </div>
        {showMasterIssue && caseItem.masterIssueId && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50/80 px-2.5 py-0.5 rounded-lg border border-indigo-100">
            <Link2 className="w-3.5 h-3.5" />
            <span>{caseItem.masterIssueId}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

