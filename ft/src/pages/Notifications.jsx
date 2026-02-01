import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from '../components/notifications/NotificationItem';
import NotificationSettings from '../components/notifications/NotificationSettings';

const Notifications = () => {
  const [activeTab, setActiveTab] = React.useState('all');
  const { notifications, isLoading, deleteNotification } = useNotifications();

  const filteredNotifications = React.useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  }, [notifications, activeTab]);

  if (activeTab === 'settings') {
    return <NotificationSettings />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your activity</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'unread'
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div>
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDelete={() => deleteNotification(notification.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Bell className="w-20 h-20 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-gray-500 text-center">
                {activeTab === 'unread' 
                  ? "You're all caught up!" 
                  : "We'll notify you when something happens"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
