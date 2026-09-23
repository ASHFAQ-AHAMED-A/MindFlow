import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Home,
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  Sparkles,
  Layers,
  ClipboardList,
  UserCheck,
  ListChecks,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useState } from 'react';

const studentNav = [
  { to: '/', icon: Home, label: 'Support Home' },
  { to: '/case', icon: FileText, label: 'My Case & Tracking' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

const staffNav = [
  { to: '/staff', icon: LayoutDashboard, label: 'Overview & Stats' },
  { to: '/staff/master-issues', icon: Layers, label: 'Master Clusters' },
  { to: '/staff/cases', icon: ClipboardList, label: 'All Cases' },
  { to: '/staff/counselor', icon: UserCheck, label: 'Counselor Capacity' },
  { to: '/staff/standby', icon: ListChecks, label: 'Standby Queue' },
];

export default function Layout() {
  const { state, dispatch } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const nav = state.isStudentMode ? studentNav : staffNav;
  const unreadCount = state.notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-transparent flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 272 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 top-0 bottom-0 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 z-40 flex flex-col shadow-sm"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 h-20 border-b border-slate-100">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold tracking-tight text-slate-900 heading-font">CareFlow</h1>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">AI OS</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">Student Support Mesh</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mode Toggle Bar */}
        <div className="px-4 py-4">
          <div className="bg-slate-100/80 p-1 rounded-2xl flex items-center border border-slate-200/60 shadow-inner">
            <button
              onClick={() => {
                if (!state.isStudentMode) dispatch({ type: 'TOGGLE_MODE' });
              }}
              title="Student View"
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                state.isStudentMode
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Student</span>}
            </button>
            <button
              onClick={() => {
                if (state.isStudentMode) dispatch({ type: 'TOGGLE_MODE' });
              }}
              title="Staff View"
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                !state.isStudentMode
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Staff</span>}
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3.5 py-2 space-y-1.5 overflow-y-auto">
          {!collapsed && (
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              {state.isStudentMode ? 'Student Portal' : 'Staff Command'}
            </p>
          )}
          {nav.map((item) => {
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : item.to === '/staff'
              ? location.pathname === '/staff'
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-700 shadow-sm shadow-indigo-100/50 border border-indigo-100/80'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 border border-transparent'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`} />
                {!collapsed && (
                  <span className="flex-1 tracking-tight">{item.label}</span>
                )}
                {!collapsed && item.label === 'Notifications' && unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white min-w-[20px] text-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Collapse */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                {state.isStudentMode ? 'AC' : 'MP'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {state.isStudentMode ? state.currentStudent.name : 'Dr. Maya Patel'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {state.isStudentMode ? state.currentStudent.email : 'Support Coordinator'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors text-xs font-medium"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main
        animate={{ marginLeft: collapsed ? 80 : 272 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 min-h-screen flex flex-col"
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 flex-1">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}

