import { type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: string;
  trendUp?: boolean;
  color?: 'indigo' | 'amber' | 'red' | 'emerald' | 'slate';
}

const colorMap = {
  indigo: {
    iconBg: 'bg-indigo-50 border-indigo-100 text-indigo-600',
    glow: 'group-hover:border-indigo-200',
  },
  amber: {
    iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
    glow: 'group-hover:border-amber-200',
  },
  red: {
    iconBg: 'bg-red-50 border-red-100 text-red-600',
    glow: 'group-hover:border-red-200',
  },
  emerald: {
    iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    glow: 'group-hover:border-emerald-200',
  },
  slate: {
    iconBg: 'bg-slate-100 border-slate-200 text-slate-700',
    glow: 'group-hover:border-slate-300',
  },
};

export default function StatCard({ icon: Icon, label, value, trend, trendUp, color = 'indigo' }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={`group bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 ${colors.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl border ${colors.iconBg} shadow-xs group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            trendUp
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-amber-700 bg-amber-50 border-amber-200'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className="mt-5">
        <p className="text-3xl font-extrabold text-slate-900 heading-font tracking-tight">{value}</p>
        <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
}

