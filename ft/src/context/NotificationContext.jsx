import React, { createContext, useState, useEffect, useContext } from 'react';
import { notificationsService } from '../services/notifications.service';
import websocketService from '../services/websocket.service';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications
  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data.notifications || []);
      
      const countData = await notificationsService.getUnreadCount();
      setUnreadCount(countData.count || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // WebSocket listener for new notifications
  useEffect(() => {
    if (websocketService.isConnected()) {
      const handleNewNotification = (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Show toast notification
        toast(notification.message, {
          icon: '🔔',
          duration: 4000,
        });
      };

      websocketService.on('new_notification', handleNewNotification);

      return () => {
        websocketService.off('new_notification', handleNewNotification);
      };
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};


