import { motion } from 'framer-motion';
import { Workflow } from '../types';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { getWorkflowProgress } from '../services/workflowService';

interface WorkflowProgressProps {
  workflow: Workflow;
}

const typeLabels: Record<string, string> = {
  academic_extension: 'Academic Extension',
  wellbeing_checkin: 'Wellbeing Check-in',
  financial_support: 'Financial Support',
  housing_support: 'Housing Support',
  general_support: 'General Support',
};

const statusColors: Record<string, string> = {
  pending: 'text-slate-400',
  in_progress: 'text-indigo-600',
  waiting_approval: 'text-amber-600',
  approved: 'text-emerald-600',
  rejected: 'text-red-600',
  completed: 'text-emerald-600',
};

export default function WorkflowProgress({ workflow }: WorkflowProgressProps) {
  const progress = getWorkflowProgress(workflow);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {typeLabels[workflow.type] || workflow.type}
          </h3>
          <p className={`text-xs font-medium capitalize ${statusColors[workflow.status]}`}>
            {workflow.status.replace('_', ' ')}
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-slate-900">{progress}%</span>
          <p className="text-xs text-slate-400">complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-2 rounded-full bg-indigo-500"
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {workflow.steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3"
          >
            <div className="flex-shrink-0 mt-0.5">
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              ) : step.status === 'active' ? (
                <Loader2 className="w-4.5 h-4.5 text-indigo-500 animate-spin" />
              ) : (
                <Circle className="w-4.5 h-4.5 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${step.status === 'completed' ? 'text-slate-600' : step.status === 'active' ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.name}
              </p>
              <p className="text-xs text-slate-400">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
