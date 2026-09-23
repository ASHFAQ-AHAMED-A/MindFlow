import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Home,
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  Users,
  Layers,
  ClipboardList,
  UserCheck,
  ListChecks,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const studentNav = [
  { to: '/', icon: Home, label: 'Support Home' },
  { to: '/case', icon: FileText, label: 'My Case' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

const staffNav = [
  { to: '/staff', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/staff/master-issues', icon: Layers, label: 'Master Issues' },
  { to: '/staff/cases', icon: ClipboardList, label: 'All Cases' },
  { to: '/staff/counselor', icon: UserCheck, label: 'Counselor' },
  { to: '/staff/standby', icon: ListChecks, label: 'Standby Queue' },
];

export default function Layout() {
  const { state, dispatch } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const nav = state.isStudentMode ? studentNav : staffNav;
  const unreadCount = state.notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 bottom-0 bg-white border-r border-slate-200/60 z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-lg font-bold text-slate-900">CareFlow</h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mode Toggle */}
        <div className="px-3 py-3 border-b border-slate-100">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_MODE' })}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              collapsed ? 'justify-center' : ''
            } ${
              state.isStudentMode
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            {!collapsed && (state.isStudentMode ? 'Student View' : 'Staff View')}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/' || item.to === '/staff'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {!collapsed && item.label === 'Notifications' && unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 min-h-screen"
      >
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
