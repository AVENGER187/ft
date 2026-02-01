/**
 * Notifications Service
 * IMPORTANT: Backend endpoints for notifications don't exist yet
 * This is a mock implementation that uses localStorage
 * Replace with real API calls when backend is ready
 */

const STORAGE_KEY = 'filmcrew_notifications';
const SETTINGS_KEY = 'filmcrew_notification_settings';

// Mock data generator
const generateMockNotifications = () => {
  const types = ['message', 'application', 'project', 'team'];
  const messages = {
    message: 'New message in project',
    application: 'Your application was reviewed',
    project: 'Project status updated',
    team: 'New team member joined'
  };

  return Array.from({ length: 5 }, (_, i) => ({
    id: `notif_${Date.now()}_${i}`,
    type: types[i % types.length],
    message: messages[types[i % types.length]],
    created_at: new Date(Date.now() - i * 3600000).toISOString(),
    read: i > 2,
  }));
};

export const notificationsService = {
  /**
   * Get all notifications
   * TODO: Replace with real API when backend endpoint exists
   */
  getNotifications: async (limit = 50, offset = 0) => {
    try {
      // Try to get from localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      const notifications = stored ? JSON.parse(stored) : generateMockNotifications();
      
      // Save to localStorage if new
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      }
      
      return { 
        notifications: notifications.slice(offset, offset + limit)
      };
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return { notifications: [] };
    }
  },

  /**
   * Get unread count
   * TODO: Replace with real API
   */
  getUnreadCount: async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const notifications = stored ? JSON.parse(stored) : [];
      const count = notifications.filter(n => !n.read).length;
      
      return { count };
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return { count: 0 };
    }
  },

  /**
   * Mark notification as read
   * TODO: Replace with real API
   */
  markAsRead: async (notificationId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const notifications = stored ? JSON.parse(stored) : [];
      
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error('Failed to mark as read:', error);
      throw error;
    }
  },

  /**
   * Mark all as read
   * TODO: Replace with real API
   */
  markAllAsRead: async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const notifications = stored ? JSON.parse(stored) : [];
      
      const updated = notifications.map(n => ({ ...n, read: true }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      throw error;
    }
  },

  /**
   * Delete notification
   * TODO: Replace with real API
   */
  deleteNotification: async (notificationId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const notifications = stored ? JSON.parse(stored) : [];
      
      const updated = notifications.filter(n => n.id !== notificationId);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  },

  /**
   * Get notification settings
   * TODO: Replace with real API
   */
  getSettings: async () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      const defaultSettings = {
        email_notifications: true,
        push_notifications: true,
        new_messages: true,
        project_updates: true,
        application_status: true,
        team_invites: true,
      };
      
      const settings = stored ? JSON.parse(stored) : defaultSettings;
      
      return { settings };
    } catch (error) {
      console.error('Failed to get settings:', error);
      return { settings: {} };
    }
  },

  /**
   * Update notification settings
   * TODO: Replace with real API
   */
  updateSettings: async (settings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return { success: true, settings };
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  },
};

/**
 * TODO FOR BACKEND DEVELOPER:
 * 
 * Create these endpoints:
 * 
 * GET    /notifications              - Get user notifications
 * GET    /notifications/unread-count - Get unread count
 * POST   /notifications/{id}/read    - Mark as read
 * POST   /notifications/mark-all-read - Mark all as read
 * DELETE /notifications/{id}         - Delete notification
 * GET    /notifications/settings     - Get settings
 * PUT    /notifications/settings     - Update settings
 */