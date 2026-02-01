import { apiCall } from './api';

/**
 * Chat Service - Adapted to match actual backend
 * Backend uses project-based chat, not room-based
 */
export const chatService = {
  /**
   * Get all projects user is a member of (as chat "rooms")
   * This adapts the backend's project system to work like chat rooms
   */
  getChatRooms: async () => {
    try {
      // Get projects where user is a member
      const response = await apiCall('/projects/my/projects');
      
      // Transform projects into chat rooms format
      const rooms = (response || []).map(project => ({
        id: project.id,
        name: project.name,
        project_id: project.id,
        last_message: null,
        last_message_time: null,
        unread_count: 0,
        type: 'project'
      }));
      
      return { rooms };
    } catch (error) {
      console.error('Failed to get chat rooms:', error);
      return { rooms: [] };
    }
  },

  /**
   * Get messages for a project (room)
   * @param {string} projectId - Project ID
   * @param {number} limit - Max messages to fetch
   */
  getRoomMessages: async (projectId, limit = 50) => {
    try {
      const response = await apiCall(`/chat/messages/${projectId}?limit=${limit}`);
      
      // Backend returns array directly or wrapped in object
      const messages = Array.isArray(response) ? response : (response.messages || []);
      
      return { messages };
    } catch (error) {
      console.error('Failed to get messages:', error);
      return { messages: [] };
    }
  },

  /**
   * Send a message to a project
   * Note: Backend doesn't have POST endpoint for messages
   * Messages are sent via WebSocket when it's implemented
   * For now, this is a placeholder
   */
  sendMessage: async (projectId, content, attachments = []) => {
    try {
      // Backend doesn't have POST /chat/messages endpoint yet
      // This would need to be implemented on backend
      console.warn('Send message endpoint not implemented on backend');
      
      // Return mock message for now
      return {
        id: Date.now().toString(),
        project_id: projectId,
        sender_id: 'current_user',
        sender_name: 'You',
        content: content,
        sent_at: new Date().toISOString(),
        attachments: attachments
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  /**
   * Delete a message
   * @param {string} messageId - Message ID
   */
  deleteMessage: async (messageId) => {
    try {
      return await apiCall(`/chat/message/${messageId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  },

  /**
   * Mark messages as read (not implemented in backend)
   */
  markAsRead: async (projectId) => {
    console.warn('Mark as read not implemented on backend');
    return { success: true };
  },

  /**
   * Get unread message count (not implemented in backend)
   */
  getUnreadCount: async () => {
    console.warn('Unread count not implemented on backend');
    return { count: 0 };
  },
};