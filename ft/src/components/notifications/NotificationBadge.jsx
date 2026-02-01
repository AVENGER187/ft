import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationBadge = () => {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
};

export default NotificationBadge;