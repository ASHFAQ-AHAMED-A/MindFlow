import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import AppointmentCard from '../components/AppointmentCard';
import PriorityBadge from '../components/PriorityBadge';
import { staff } from '../data/mockData';
import { Calendar, Clock, Users, UserCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CounselorCapacity() {
  const { state } = useApp();
  const navigate = useNavigate();

  const counselors = staff.filter(s => s.role === 'Counselor');

  const todayCheckins = state.appointments.filter(
    a => a.type === 'checkin_15min' && (a.status === 'confirmed' || a.status === 'scheduled')
  ).length;

  const todayFollowups = state.appointments.filter(
    a => a.type === 'follow_up' && (a.status === 'confirmed' || a.status === 'scheduled')
  ).length;

  const availableSlots = state.appointments.filter(
    a => (a.status === 'scheduled') && !a.studentId
  ).length;

  const standbyCount = state.standbyQueue.filter(s => s.status === 'waiting').length;

  // Next high-priority student in standby
  const nextPriorityStudent = state.standbyQueue
    .filter(s => s.status === 'waiting')
    .sort((a, b) => {
      const order: Record<string, number> = { urgent: 0, high: 1, normal: 2 };
      return order[a.priority] - order[b.priority];
    })[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Counselor Capacity</h1>
          <p className="text-sm text-slate-500 mt-1">Manage counselor schedules and availability</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="15-min Check-ins Today" value={todayCheckins} color="indigo" />
        <StatCard icon={Clock} label="Follow-ups Today" value={todayFollowups} color="emerald" />
        <StatCard icon={UserCheck} label="Available Slots" value={availableSlots} color="amber" />
        <StatCard icon={Users} label="Standby Queue" value={standbyCount} color="red" />
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Counselor Schedules */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4">Counselor Schedules</h2>
          {counselors.map((counselor) => {
            const counselorAppointments = state.appointments.filter(
              a => a.staffId === counselor.id && a.status !== 'cancelled'
            );

            return (
              <motion.div
                key={counselor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm mb-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                    {counselor.name.split(' ').slice(-1)[0][0]}{counselor.name.split(' ')[0][0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{counselor.name}</h3>
                    <p className="text-xs text-slate-500">{counselor.department}</p>
                  </div>
                  <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {counselorAppointments.length} appointments
                  </span>
                </div>

                <div className="space-y-2">
                  {counselorAppointments.map(apt => (
                    <div key={apt.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-700">
                          {new Date(apt.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                        <span className="text-xs text-slate-400">({apt.duration} min)</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-blue-50 text-blue-600'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Next Priority Student */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4">Next Priority Student</h2>

          {nextPriorityStudent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-6 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-base font-bold text-indigo-600">
                  {nextPriorityStudent.studentName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{nextPriorityStudent.studentName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-slate-400">{nextPriorityStudent.caseId}</span>
                    <PriorityBadge priority={nextPriorityStudent.priority} />
                  </div>
                </div>
              </div>

              {/* AI Summary (mock) */}
              <div className="bg-white/70 rounded-xl p-4 border border-indigo-100 mb-4">
                <h4 className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  AI Summary
                </h4>
                <p className="text-sm text-slate-600">
                  Academic pressure + financial concern. Student reports difficulty completing ML assignment and financial stress.
                </p>
              </div>

              <button
                onClick={() => navigate(`/staff/case/${nextPriorityStudent.caseId}`)}
                className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Open Case
              </button>
            </motion.div>
          ) : (
            <div className="text-center py-8 bg-white rounded-2xl border border-slate-200/60">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No students in standby</p>
            </div>
          )}

          {/* Cancelled Appointments */}
          <h2 className="text-base font-semibold text-slate-900 mt-8 mb-4">Cancelled Appointments</h2>
          {state.appointments.filter(a => a.status === 'cancelled').length === 0 ? (
            <div className="text-center py-6 bg-white rounded-2xl border border-slate-200/60">
              <p className="text-sm text-slate-400">No cancellations today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.appointments.filter(a => a.status === 'cancelled').map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
