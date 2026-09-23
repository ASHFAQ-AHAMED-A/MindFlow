import { motion } from 'framer-motion';
import { StandbyEntry } from '../types';
import PriorityBadge from './PriorityBadge';
import { Clock, User, Zap } from 'lucide-react';

interface StandbyQueueListProps {
  entries: StandbyEntry[];
  onMatch?: (entry: StandbyEntry) => void;
  showMatchButton?: boolean;
}

export default function StandbyQueueList({ entries, onMatch, showMatchButton = false }: StandbyQueueListProps) {
  const waitingEntries = entries.filter(e => e.status === 'waiting');
  const otherEntries = entries.filter(e => e.status !== 'waiting');

  return (
    <div className="space-y-3">
      {waitingEntries.length === 0 && otherEntries.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">No students in standby queue</p>
        </div>
      )}

      {waitingEntries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600">
                {entry.studentName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900">{entry.studentName}</h4>
                  <PriorityBadge priority={entry.priority} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {entry.caseId}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {entry.requestedDuration} min
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 capitalize">
                  Service: {entry.eligibleService.replace('_', ' ')}
                </p>
              </div>
            </div>

            {showMatchButton && onMatch && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMatch(entry)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Zap className="w-3 h-3" />
                Match
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}

      {otherEntries.map((entry) => (
        <div
          key={entry.id}
          className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-500">
              {entry.studentName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-600">{entry.studentName}</h4>
              <span className="text-xs text-slate-400 capitalize">{entry.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
