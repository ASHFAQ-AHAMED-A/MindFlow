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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {myNotifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-600 mb-1">No notifications yet</h3>
          <p className="text-sm text-slate-400">
            You'll receive updates about your cases, appointments, and approvals here.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
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
