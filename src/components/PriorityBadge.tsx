import { PriorityLevel } from '../types';

interface PriorityConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
}

const priorityMap: Record<PriorityLevel, PriorityConfig> = {
  normal: {
    label: 'Normal',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  high: {
    label: 'High',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  urgent: {
    label: 'Urgent',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    dotColor: 'bg-red-500',
  },
};

export default function PriorityBadge({ priority, size = 'sm' }: { priority: PriorityLevel; size?: 'sm' | 'md' | 'lg' }) {
  const config = priorityMap[priority];
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bgColor} ${config.color} ${config.borderColor} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
