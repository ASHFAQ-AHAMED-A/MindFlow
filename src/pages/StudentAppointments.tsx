import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import AppointmentCard from '../components/AppointmentCard';
import { Calendar, Clock, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export default function StudentAppointments() {
  const { state, dispatch } = useApp();

  // Student's appointments
  const myAppointments = state.appointments.filter(
    a => a.studentId === state.currentStudent.id
  );

  // Check if student is in standby
  const myStandby = state.standbyQueue.filter(
    s => s.studentId === state.currentStudent.id && s.status === 'waiting'
  );

  // Check for claimable slots (slots that were matched to this student)
  const claimableNotifications = state.notifications.filter(
    n => n.studentId === state.currentStudent.id && n.type === 'appointment_available' && !n.read
  );

  const handleClaimSlot = (appointmentId: string) => {
    // Claim the appointment
    dispatch({
      type: 'UPDATE_APPOINTMENT',
      payload: {
        id: appointmentId,
        updates: {
          studentId: state.currentStudent.id,
          status: 'confirmed',
        },
      },
    });

    // Remove from standby
    const standbyEntry = state.standbyQueue.find(s => s.studentId === state.currentStudent.id);
    if (standbyEntry) {
      dispatch({ type: 'REMOVE_STANDBY', payload: standbyEntry.id });
    }

    // Mark notification as read
    claimableNotifications.forEach(n => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id });
    });

    // Add timeline event
    const studentCase = state.cases.find(c => c.studentId === state.currentStudent.id);
    if (studentCase) {
      dispatch({
        type: 'ADD_TIMELINE_EVENT',
        payload: {
          caseId: studentCase.id,
          event: {
            id: `evt-claim-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'student',
            title: 'Appointment Claimed',
            description: 'Student claimed an earlier appointment slot from the standby queue.',
          },
        },
      });
    }

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `NOT-${Date.now()}`,
        studentId: state.currentStudent.id,
        type: 'checkin_booked',
        title: 'Appointment Confirmed!',
        message: 'Your check-in appointment has been confirmed. We look forward to supporting you.',
        read: false,
        actionUrl: '/appointments',
        actionLabel: 'View Details',
        createdAt: new Date().toISOString(),
      },
    });
  };

  const upcomingAppointments = myAppointments.filter(a => a.status === 'confirmed' || a.status === 'scheduled');
  const pastAppointments = myAppointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font tracking-tight">Your Care Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage scheduled sessions, priority check-ins, and automated standby matching</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {upcomingAppointments.length} Active Booking{upcomingAppointments.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Claimable Earlier Slot Banner */}
      {claimableNotifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold heading-font text-white">⚡ Earlier Appointment Slot Available!</h3>
                <p className="text-indigo-100 text-sm mt-1 max-w-xl leading-relaxed">
                  A cancellation just occurred. Because your case is prioritized on the Standby Queue, you are eligible to claim this slot immediately.
                </p>
              </div>
            </div>

            {/* Claim button */}
            {state.appointments
              .filter(a => a.status === 'cancelled')
              .slice(0, 1)
              .map(apt => (
                <motion.button
                  key={apt.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleClaimSlot(apt.id)}
                  className="px-6 py-3.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-2xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Claim Early Slot</span>
                </motion.button>
              ))}
          </div>
        </motion.div>
      )}

      {/* Standby Status Card */}
      {myStandby.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-amber-50/80 backdrop-blur-sm border border-amber-200/80 shadow-xs"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-amber-900 heading-font">Active Standby Queue Position</h3>
              <p className="text-xs sm:text-sm text-amber-800/90 mt-1 leading-relaxed">
                You are queued for automatic cancellation backfill. The moment an earlier specialist slot becomes open, we will send an instant notification to your dashboard.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>Urgency Level: {myStandby[0].priority.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-base font-bold text-slate-900 heading-font mb-4">Upcoming Scheduled Sessions</h2>
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 mb-1">No Upcoming Appointments</h3>
            <p className="text-xs text-slate-400">Your scheduled counselor check-ins will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingAppointments.map(apt => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="pt-4">
          <h2 className="text-base font-bold text-slate-900 heading-font mb-4">Past Sessions History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastAppointments.map(apt => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

