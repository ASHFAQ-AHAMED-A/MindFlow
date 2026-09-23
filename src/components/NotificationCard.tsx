import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ArrowRight, CheckCircle2, Calendar, FileCheck, AlertCircle, X } from 'lucide-react';
import { Notification } from '../types';

interface NotificationCardProps {
  notification: Notification;
  onRead?: () => void;
  onAction?: () => void;
  onDismiss?: () => void;
}

const typeIcons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  appointment_available: { icon: <Calendar className="w-4 h-4" />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  extension_approved: { icon: <FileCheck className="w-4 h-4" />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  extension_rejected: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-600', bg: 'bg-red-100' },
  checkin_booked: { icon: <Calendar className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-100' },
  case_update: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-violet-600', bg: 'bg-violet-100' },
  standby_matched: { icon: <Bell className="w-4 h-4" />, color: 'text-amber-600', bg: 'bg-amber-100' },
  sla_warning: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-600', bg: 'bg-red-100' },
  general: { icon: <Bell className="w-4 h-4" />, color: 'text-slate-600', bg: 'bg-slate-100' },
};

export default function NotificationCard({ notification, onRead, onAction, onDismiss }: NotificationCardProps) {
  const config = typeIcons[notification.type] || typeIcons.general;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100 }}
        className={`rounded-2xl border p-4 transition-all duration-300 ${
          notification.read
            ? 'bg-white border-slate-200/60'
            : 'bg-indigo-50/50 border-indigo-200 shadow-sm'
        }`}
      >
        <div className="flex gap-3">
          <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center ${config.color}`}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className={`text-sm font-semibold ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                {notification.title}
              </h4>
              <div className="flex items-center gap-1">
                {!notification.read && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                )}
                {onDismiss && (
                  <button onClick={onDismiss} className="p-1 hover:bg-slate-100 rounded-lg">
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-400">
                {new Date(notification.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
              <div className="flex gap-2">
                {!notification.read && onRead && (
                  <button
                    onClick={onRead}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Mark read
                  </button>
                )}
                {notification.actionLabel && onAction && (
                  <button
                    onClick={onAction}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    {notification.actionLabel}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
