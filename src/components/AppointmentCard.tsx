import { motion } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { Appointment } from '../types';
import { formatTimeSlot, formatDate } from '../services/appointmentService';

interface AppointmentCardProps {
  appointment: Appointment;
  onClaim?: () => void;
  onCancel?: () => void;
  isClaimable?: boolean;
  showStaff?: boolean;
}

const typeLabels: Record<string, string> = {
  checkin_15min: '15-min Check-in',
  follow_up: 'Follow-up Session',
  full_session: 'Full Session',
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Scheduled', color: 'text-blue-700', bg: 'bg-blue-50' },
  confirmed: { label: 'Confirmed', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50' },
  completed: { label: 'Completed', color: 'text-slate-700', bg: 'bg-slate-50' },
  no_show: { label: 'No Show', color: 'text-amber-700', bg: 'bg-amber-50' },
};

export default function AppointmentCard({
  appointment,
  onClaim,
  onCancel,
  isClaimable = false,
  showStaff = true,
}: AppointmentCardProps) {
  const status = statusConfig[appointment.status] || statusConfig.scheduled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 ${
        isClaimable
          ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100'
          : 'bg-white border-slate-200/60'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          {typeLabels[appointment.type] || appointment.type}
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-medium">{formatDate(appointment.startTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>{formatTimeSlot(appointment.startTime)} — {formatTimeSlot(appointment.endTime)}</span>
          <span className="text-xs text-slate-400">({appointment.duration} min)</span>
        </div>
        {showStaff && (
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            <span>{appointment.staffName}</span>
          </div>
        )}
      </div>

      {isClaimable && onClaim && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClaim}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          Claim Slot
        </motion.button>
      )}

      {onCancel && appointment.status !== 'cancelled' && (
        <button
          onClick={onCancel}
          className="w-full mt-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
        >
          Cancel Appointment
        </button>
      )}
    </motion.div>
  );
}
