import { motion } from 'framer-motion';
import { Brain, Shield, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { TriageResult as TriageResultType } from '../types';
import PriorityBadge from './PriorityBadge';

interface TriageResultProps {
  result: TriageResultType;
  onContinue: () => void;
}

const categoryIcons: Record<string, { icon: string; color: string; bg: string }> = {
  academic: { icon: '📚', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  wellbeing: { icon: '💚', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  financial: { icon: '💰', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  housing: { icon: '🏠', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  career: { icon: '💼', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
  it: { icon: '💻', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
  general: { icon: '📋', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
};

const actionLabels: Record<string, string> = {
  academic_extension_workflow: 'Academic Extension Request',
  '15_min_checkin': '15-Minute Initial Check-in',
  financial_support_review: 'Financial Support Review',
  housing_support_case: 'Housing Support Case',
  career_guidance_session: 'Career Guidance Session',
  it_support_ticket: 'IT Support Ticket',
};

export default function TriageResultComponent({ result, onContinue }: TriageResultProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium mb-4">
          <Brain className="w-4 h-4" />
          AI Analysis Complete
        </div>
        <h2 className="text-2xl font-bold text-slate-900">We understand your situation</h2>
        <p className="text-slate-500 mt-2">{result.summary}</p>
      </motion.div>

      {/* Detected Categories */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-semibold text-slate-900">Detected Support Areas</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {result.categories.map((category, index) => {
            const config = categoryIcons[category] || categoryIcons.general;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${config.bg}`}
              >
                <span className="text-lg">{config.icon}</span>
                <span className={`text-sm font-medium capitalize ${config.color}`}>{category}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Priority & Confidence */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">Priority Assessment</h3>
          </div>
          <div className="mb-2">
            <PriorityBadge priority={result.priority} size="md" />
          </div>
          <p className="text-xs text-slate-500 mt-2">{result.priorityExplanation}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">AI Confidence</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900">{Math.round(result.confidence * 100)}</span>
            <span className="text-sm text-slate-500">%</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-2 rounded-full bg-indigo-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Recommended Actions */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-semibold text-slate-900">Recommended Next Steps</h3>
        </div>
        <div className="space-y-3">
          {result.suggestedActions.map((action, index) => (
            <motion.div
              key={action}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50/50 border border-indigo-100"
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {actionLabels[action] || action}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Continue Button */}
      <motion.div variants={itemVariants} className="text-center pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors"
        >
          Create Support Case
          <ArrowRight className="w-4 h-4" />
        </motion.button>
        <p className="text-xs text-slate-400 mt-3">
          ServiceNow will automatically coordinate workflows based on these findings
        </p>
      </motion.div>
    </motion.div>
  );
}
