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
  checkin_15min: '15-Minute Priority Check-in',
  follow_up: 'Comprehensive Follow-up Session',
  full_session: 'Full Clinical / Advisory Session',
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Scheduled', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  confirmed: { label: 'Confirmed Slot', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  completed: { label: 'Completed', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
  no_show: { label: 'No Show', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
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
      className={`rounded-3xl border p-6 shadow-sm transition-all duration-300 ${
        isClaimable
          ? 'bg-gradient-to-br from-indigo-50/90 to-violet-50/90 border-indigo-300 shadow-md shadow-indigo-100 ring-2 ring-indigo-200'
          : 'bg-white/95 backdrop-blur-sm border-slate-200/80 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
          {typeLabels[appointment.type] || appointment.type}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${status.color} ${status.bg}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-2.5 mb-5 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2.5 text-sm text-slate-800">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span className="font-bold">{formatDate(appointment.startTime)}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-slate-700">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold">{formatTimeSlot(appointment.startTime)} — {formatTimeSlot(appointment.endTime)}</span>
          <span className="text-xs text-slate-400 font-medium">({appointment.duration} mins)</span>
        </div>
        {showStaff && (
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <User className="w-4 h-4 text-indigo-600" />
            <span className="font-medium">{appointment.staffName}</span>
          </div>
        )}
      </div>

      {isClaimable && onClaim && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClaim}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-sm font-bold hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Claim This Immediate Slot</span>
        </motion.button>
      )}

      {onCancel && appointment.status !== 'cancelled' && (
        <button
          onClick={onCancel}
          className="w-full mt-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
        >
          Cancel Appointment
        </button>
      )}
    </motion.div>
  );
}

