import { motion } from 'framer-motion';
import { Clock, CheckCircle2, ExternalLink, Coffee } from 'lucide-react';
import { WaitAction } from '../types';

interface WhileYouWaitProps {
  waitingFor: string;
  estimatedWait: string;
  reason: string;
  actions: WaitAction[];
  onToggleAction: (id: string) => void;
}

export default function WhileYouWait({
  waitingFor,
  estimatedWait,
  reason,
  actions,
  onToggleAction,
}: WhileYouWaitProps) {
  const completedCount = actions.filter(a => a.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-6 shadow-sm"
    >
      {/* Waiting Status */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{waitingFor}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-amber-600 font-medium">⏳ {estimatedWait}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{reason}</span>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="mb-5 px-4 py-3 bg-white/60 rounded-xl border border-indigo-100">
        <div className="flex items-start gap-2">
          <Coffee className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-indigo-700 font-medium italic">
            "You may have to wait for a decision, but you shouldn't have to wait to make progress."
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          While You Wait
        </h4>
        <span className="text-xs font-medium text-indigo-600">
          {completedCount}/{actions.length} done
        </span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / actions.length) * 100}%` }}
          className="h-1.5 rounded-full bg-indigo-500"
        />
      </div>

      {/* Action Items */}
      <div className="space-y-2">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => onToggleAction(action.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
              action.completed
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {action.completed ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              ) : (
                <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${action.completed ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>
                {action.title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
            </div>
            {action.url && !action.completed && (
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-1" />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
