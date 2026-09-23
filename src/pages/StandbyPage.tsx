import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import StandbyQueueList from '../components/StandbyQueue';
import AppointmentCard from '../components/AppointmentCard';
import StatCard from '../components/StatCard';
import { findEligibleStandbyStudent } from '../services/appointmentService';
import {
  Users,
  Calendar,
  XCircle,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Bell,
} from 'lucide-react';

export default function StandbyPage() {
  const { state, dispatch } = useApp();
  const [simulationStep, setSimulationStep] = useState<'idle' | 'cancelling' | 'matching' | 'notifying' | 'done'>('idle');
  const [matchedStudent, setMatchedStudent] = useState<string | null>(null);
  const [cancelledAppointmentId, setCancelledAppointmentId] = useState<string | null>(null);

  const waitingCount = state.standbyQueue.filter(s => s.status === 'waiting').length;
  const cancelledCount = state.appointments.filter(a => a.status === 'cancelled').length;

  // Find a scheduled appointment to simulate cancellation
  const cancellableAppointment = state.appointments.find(
    a => a.status === 'scheduled' && a.studentId
  ) || state.appointments.find(
    a => a.status === 'confirmed' && a.studentId
  );

  const handleSimulateCancellation = async () => {
    if (!cancellableAppointment) return;

    // Step 1: Cancel the appointment
    setSimulationStep('cancelling');
    setCancelledAppointmentId(cancellableAppointment.id);

    await new Promise(r => setTimeout(r, 1500));

    dispatch({ type: 'CANCEL_APPOINTMENT', payload: cancellableAppointment.id });

    // Step 2: Find eligible standby student
    setSimulationStep('matching');
    await new Promise(r => setTimeout(r, 1500));

    const cancelledSlot = { ...cancellableAppointment, status: 'cancelled' as const };
    const eligible = findEligibleStandbyStudent(state.standbyQueue, cancelledSlot);

    if (eligible) {
      setMatchedStudent(eligible.studentName);

      // Update standby status
      dispatch({
        type: 'UPDATE_STANDBY',
        payload: { id: eligible.id, updates: { status: 'notified' } },
      });

      // Step 3: Notify student
      setSimulationStep('notifying');
      await new Promise(r => setTimeout(r, 1500));

      // Add notification
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `NOT-${Date.now()}`,
          studentId: eligible.studentId,
          type: 'appointment_available',
          title: '🔔 Earlier Appointment Available!',
          message: `A ${cancellableAppointment.duration}-minute appointment slot has opened up with ${cancellableAppointment.staffName}. Claim it now!`,
          read: false,
          actionUrl: '/appointments',
          actionLabel: 'Claim Slot',
          createdAt: new Date().toISOString(),
        },
      });

      // Add timeline event to student's case
      dispatch({
        type: 'ADD_TIMELINE_EVENT',
        payload: {
          caseId: eligible.caseId,
          event: {
            id: `evt-standby-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'system',
            title: 'Standby Match Found',
            description: `An earlier appointment slot has been offered based on priority-aware matching.`,
          },
        },
      });

      setSimulationStep('done');
    } else {
      setSimulationStep('done');
      setMatchedStudent(null);
    }
  };

  const resetSimulation = () => {
    setSimulationStep('idle');
    setMatchedStudent(null);
    setCancelledAppointmentId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Smart Standby Queue</h1>
          <p className="text-sm text-slate-500 mt-1">Priority-aware appointment cancellation matching</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={Users} label="Students Waiting" value={waitingCount} color="indigo" />
        <StatCard icon={XCircle} label="Cancellations" value={cancelledCount} color="amber" />
        <StatCard icon={Calendar} label="Available to Match" value={cancellableAppointment ? 1 : 0} color="emerald" />
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Standby Queue */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4">Standby Queue</h2>
          <StandbyQueueList entries={state.standbyQueue} />
        </div>

        {/* Simulation Panel */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4">Cancellation Simulation</h2>

          {simulationStep === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border-2 border-dashed border-indigo-200 p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <Zap className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Simulate a Cancellation</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                Watch the smart standby system automatically find and notify the highest-priority eligible student when an appointment opens up.
              </p>
              {cancellableAppointment ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSimulateCancellation}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Simulate Cancellation
                </motion.button>
              ) : (
                <p className="text-sm text-amber-600 font-medium">No appointments available to cancel</p>
              )}
            </motion.div>
          )}

          {/* Simulation Steps */}
          <AnimatePresence mode="wait">
            {simulationStep !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm space-y-4"
              >
                {/* Step 1: Cancellation */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    simulationStep === 'cancelling' ? 'bg-amber-100 animate-pulse' : 'bg-emerald-100'
                  }`}>
                    {simulationStep === 'cancelling' ? (
                      <XCircle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Appointment Cancelled</p>
                    <p className="text-xs text-slate-500">Slot opened in counselor calendar</p>
                  </div>
                </div>

                {/* Step 2: Matching */}
                {(simulationStep === 'matching' || simulationStep === 'notifying' || simulationStep === 'done') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      simulationStep === 'matching' ? 'bg-indigo-100 animate-pulse' : 'bg-emerald-100'
                    }`}>
                      {simulationStep === 'matching' ? (
                        <Users className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Searching Standby Queue</p>
                      <p className="text-xs text-slate-500">Filtering by priority, service type, and availability</p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Match Found */}
                {(simulationStep === 'notifying' || simulationStep === 'done') && matchedStudent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      simulationStep === 'notifying' ? 'bg-violet-100 animate-pulse' : 'bg-emerald-100'
                    }`}>
                      {simulationStep === 'notifying' ? (
                        <Bell className="w-4 h-4 text-violet-600" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Match Found: {matchedStudent}</p>
                      <p className="text-xs text-slate-500">Priority-based selection from standby queue</p>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Notification Sent */}
                {simulationStep === 'done' && matchedStudent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-sm font-bold text-emerald-800">Notification Sent!</h4>
                    </div>
                    <p className="text-xs text-emerald-700">
                      {matchedStudent} has been notified of the available appointment. Waiting for 1-click claim response.
                    </p>
                    <p className="text-xs text-emerald-600 mt-2 italic">
                      Switch to Student View → Appointments to see the claim notification.
                    </p>
                  </motion.div>
                )}

                {simulationStep === 'done' && !matchedStudent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h4 className="text-sm font-bold text-amber-800">No Eligible Match</h4>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                      No students in the standby queue match this appointment type.
                    </p>
                  </motion.div>
                )}

                {simulationStep === 'done' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={resetSimulation}
                    className="w-full mt-4 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Reset Simulation
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* How it works */}
          <div className="mt-6 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">How Smart Standby Works</h3>
            <div className="space-y-3">
              {[
                { step: 'Cancellation detected', desc: 'Appointment slot opens in calendar' },
                { step: 'Queue searched', desc: 'Filter by service, type, duration' },
                { step: 'Priority matching', desc: 'Urgent → High → Normal, then by wait time' },
                { step: 'Student notified', desc: 'One-click claim notification sent' },
                { step: 'Auto-update', desc: 'If no response, next student is offered' },
              ].map((item, i) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-600">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.step}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
