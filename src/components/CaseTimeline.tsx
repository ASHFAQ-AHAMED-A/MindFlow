import { motion } from 'framer-motion';
import { TimelineEvent } from '../types';
import { CheckCircle2, Brain, Users, Workflow, Clock, AlertTriangle } from 'lucide-react';

interface CaseTimelineProps {
  events: TimelineEvent[];
}

const typeIcons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  system: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ai: { icon: <Brain className="w-4 h-4" />, color: 'text-violet-600', bg: 'bg-violet-100' },
  staff: { icon: <Users className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-100' },
  student: { icon: <Clock className="w-4 h-4" />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  workflow: { icon: <Workflow className="w-4 h-4" />, color: 'text-amber-600', bg: 'bg-amber-100' },
  escalation: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-600', bg: 'bg-red-100' },
};

export default function CaseTimeline({ events }: CaseTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-slate-200" />

      <div className="space-y-1">
        {events.map((event, index) => {
          const config = typeIcons[event.type] || typeIcons.system;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="relative flex gap-4 pb-6"
            >
              {/* Icon */}
              <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center ${config.color}`}>
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-semibold text-slate-900">{event.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${config.bg} ${config.color}`}>
                    {event.type}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{event.description}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(event.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
