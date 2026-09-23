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
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  amber: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  red: {
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  emerald: {
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  slate: {
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
};

export default function StatCard({ icon: Icon, label, value, trend, trendUp, color = 'indigo' }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${colors.iconBg}`}>
          <Icon className={`w-5 h-5 ${colors.iconColor}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trendUp ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}
