import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import NotificationCard from '../components/NotificationCard';
import { Bell, CheckCheck } from 'lucide-react';

export default function StudentNotifications() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const myNotifications = state.notifications.filter(
    n => n.studentId === state.currentStudent.id
  );

  const unreadCount = myNotifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const handleMarkAllRead = () => {
    myNotifications.forEach(n => {
      if (!n.read) {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id });
      }
    });
  };

  const handleAction = (url?: string) => {
    if (url) {
      navigate(url);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font tracking-tight">Activity Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread system notifications` : 'All caught up! No unread notifications'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-100 transition-colors shadow-xs"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {myNotifications.length === 0 ? (
        <div className="text-center py-20 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 heading-font mb-1">No notifications yet</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            You'll receive live automated updates about your cases, slot openings, and approval actions here.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 max-w-3xl"
        >
          {myNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NotificationCard
                notification={notification}
                onRead={() => handleMarkRead(notification.id)}
                onAction={() => handleAction(notification.actionUrl)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

