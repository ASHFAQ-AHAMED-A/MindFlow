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
  appointment_available: { icon: <Calendar className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
  extension_approved: { icon: <FileCheck className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  extension_rejected: { icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
  checkin_booked: { icon: <Calendar className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  case_update: { icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
  standby_matched: { icon: <Bell className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  sla_warning: { icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
  general: { icon: <Bell className="w-5 h-5" />, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-100' },
};

export default function NotificationCard({ notification, onRead, onAction, onDismiss }: NotificationCardProps) {
  const config = typeIcons[notification.type] || typeIcons.general;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100 }}
        className={`rounded-3xl border p-6 transition-all duration-300 ${
          notification.read
            ? 'bg-white/95 backdrop-blur-sm border-slate-200/80'
            : 'bg-indigo-50/60 backdrop-blur-sm border-indigo-200 shadow-sm ring-1 ring-indigo-100'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-11 h-11 rounded-2xl border ${config.bg} flex items-center justify-center ${config.color} shadow-xs`}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h4 className={`text-base font-bold heading-font ${notification.read ? 'text-slate-800' : 'text-slate-900'}`}>
                {notification.title}
              </h4>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-500/50" />
                )}
                {onDismiss && (
                  <button onClick={onDismiss} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{notification.message}</p>
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400">
                {new Date(notification.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
              <div className="flex items-center gap-3">
                {!notification.read && onRead && (
                  <button
                    onClick={onRead}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Mark as read
                  </button>
                )}
                {notification.actionLabel && onAction && (
                  <button
                    onClick={onAction}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold shadow-xs shadow-indigo-200 transition-all"
                  >
                    <span>{notification.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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

