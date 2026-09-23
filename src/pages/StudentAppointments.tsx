import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';
import { Calendar, Clock, Info } from 'lucide-react';

export default function StudentAppointments() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Your upcoming and past appointments</p>
        </div>
      </div>

      {/* Claimable Appointment Alert */}
      {claimableNotifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border-2 border-indigo-200 shadow-md"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-indigo-900 mb-1">🔔 Earlier Appointment Available!</h3>
              <p className="text-sm text-indigo-700">
                An appointment slot has opened up. Claim it now before it's taken!
              </p>
              {/* Find the available cancelled appointment slot */}
              {state.appointments
                .filter(a => a.status === 'cancelled')
                .slice(0, 1)
                .map(apt => (
                  <div key={apt.id} className="mt-3">
                    <AppointmentCard
                      appointment={{
                        ...apt,
                        status: 'scheduled',
                        studentId: state.currentStudent.id,
                      }}
                      isClaimable
                      onClaim={() => handleClaimSlot(apt.id)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Standby Status */}
      {myStandby.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800">You're on the Standby Queue</h3>
          </div>
          <p className="text-xs text-amber-700">
            You'll be automatically notified when an earlier appointment becomes available, prioritized by your case urgency.
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-amber-600">
            <Info className="w-3 h-3" />
            <span>Priority: {myStandby[0].priority.charAt(0).toUpperCase() + myStandby[0].priority.slice(1)}</span>
          </div>
        </motion.div>
      )}

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Upcoming</h2>
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl border border-slate-200/60">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No upcoming appointments</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {upcomingAppointments.map(apt => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4">Past</h2>
          <div className="grid grid-cols-2 gap-4">
            {pastAppointments.map(apt => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
