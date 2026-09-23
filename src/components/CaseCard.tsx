import { motion } from 'framer-motion';
import { Case } from '../types';
import PriorityBadge from './PriorityBadge';
import { ChevronRight, Link2 } from 'lucide-react';

interface CaseCardProps {
  caseItem: Case;
  onClick?: () => void;
  showMasterIssue?: boolean;
}

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

export default function CaseCard({ caseItem, onClick, showMasterIssue = false }: CaseCardProps) {
  const status = statusConfig[caseItem.status] || statusConfig.new;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-400">{caseItem.id}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.color} ${status.bg}`}>
              {status.label}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {caseItem.title}
          </h3>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0 mt-1" />
      </div>

      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{caseItem.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={caseItem.priority} />
          {caseItem.categories.map(cat => (
            <span key={cat} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200 capitalize">
              {cat}
            </span>
          ))}
        </div>
        {showMasterIssue && caseItem.masterIssueId && (
          <div className="flex items-center gap-1 text-xs text-indigo-500">
            <Link2 className="w-3 h-3" />
            <span>{caseItem.masterIssueId}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
