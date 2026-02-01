import React from 'react';
import { Trash2, AlertCircle, CheckCircle, Info, MessageSquare, Users } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, onDelete }) => {
  const { markAsRead } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'team':
        return <Users className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Navigate to relevant page if needed
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group ${
        !notification.read ? 'bg-orange-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {notification.created_at && 
              formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })
            }
          </p>
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-all"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>

        {/* Unread Indicator */}
        {!notification.read && (
          <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2" />
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
