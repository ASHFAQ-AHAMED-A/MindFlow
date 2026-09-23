import { motion } from 'framer-motion';
import { Brain, Shield, Target, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TriageResult as TriageResultType } from '../types';
import PriorityBadge from './PriorityBadge';

interface TriageResultProps {
  result: TriageResultType;
  onContinue: () => void;
}

const categoryIcons: Record<string, { icon: string; color: string; bg: string }> = {
  academic: { icon: '📚', color: 'text-blue-700', bg: 'bg-blue-50/80 border-blue-200/80' },
  wellbeing: { icon: '💚', color: 'text-emerald-700', bg: 'bg-emerald-50/80 border-emerald-200/80' },
  financial: { icon: '💰', color: 'text-amber-700', bg: 'bg-amber-50/80 border-amber-200/80' },
  housing: { icon: '🏠', color: 'text-violet-700', bg: 'bg-violet-50/80 border-violet-200/80' },
  career: { icon: '💼', color: 'text-cyan-700', bg: 'bg-cyan-50/80 border-cyan-200/80' },
  it: { icon: '💻', color: 'text-slate-700', bg: 'bg-slate-50/80 border-slate-200/80' },
  general: { icon: '📋', color: 'text-slate-700', bg: 'bg-slate-50/80 border-slate-200/80' },
};

const actionLabels: Record<string, string> = {
  academic_extension_workflow: 'Automated Academic Extension Request to Instructor',
  '15_min_checkin': '15-Minute Priority Wellbeing Check-in Slot',
  financial_support_review: 'Financial Emergency Bursary Application',
  housing_support_case: 'Campus Emergency Accommodation Routing',
  career_guidance_session: 'Academic & Career Direction Advisor Session',
  it_support_ticket: 'Campus IT Priority Device/Network Ticket',
};

export default function TriageResultComponent({ result, onContinue }: TriageResultProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-6 w-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Brain className="w-3.5 h-3.5" />
          <span>AI Multi-Vector Triage Complete</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 heading-font tracking-tight">We Understand Your Situation</h2>
        <p className="text-slate-500 mt-2 text-base max-w-xl mx-auto leading-relaxed">{result.summary}</p>
      </motion.div>

      {/* Detected Categories */}
      <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-7 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 heading-font">Identified Support Vectors</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {result.categories.map((category, index) => {
            const config = categoryIcons[category] || categoryIcons.general;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border shadow-xs ${config.bg}`}
              >
                <span className="text-xl">{config.icon}</span>
                <span className={`text-sm font-bold capitalize ${config.color}`}>{category}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Priority & Confidence */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 heading-font">Priority & Urgency Assessment</h3>
          </div>
          <div className="mb-2.5">
            <PriorityBadge priority={result.priority} size="md" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{result.priorityExplanation}</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 heading-font">Classification Confidence</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 heading-font">{Math.round(result.confidence * 100)}</span>
            <span className="text-sm font-bold text-slate-400">%</span>
            <span className="ml-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">High Certainty</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
            />
          </div>
        </div>
      </motion.div>

      {/* Recommended Actions */}
      <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-7 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 heading-font">Automated Action Plan</h3>
            <p className="text-xs text-slate-400">These automated workflows will trigger upon creating the case</p>
          </div>
        </div>
        <div className="space-y-3">
          {result.suggestedActions.map((action, index) => (
            <motion.div
              key={action}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 text-slate-800 hover:bg-indigo-50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {index + 1}
              </div>
              <span className="text-sm font-semibold flex-1">
                {actionLabels[action] || action}
              </span>
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Continue Button */}
      <motion.div variants={itemVariants} className="text-center pt-4 pb-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white rounded-2xl text-base font-bold hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 transition-all"
        >
          <span>Provision & Initialize Case</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
        <p className="text-xs text-slate-400 mt-3 font-medium">
          ServiceNow engine coordinates notifications, advisor workflows, and calendar slots
        </p>
      </motion.div>
    </motion.div>
  );
}

