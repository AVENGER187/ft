import { apiCall, projectService } from './api';

/**
 * Chat Service
 * Handles chat room management and message fetching
 * Integrates with your existing backend endpoints
 */
export const chatService = {
  /**
   * Get all chat rooms for the current user
   * Merges created projects + projects user is working on
   * 
   * Returns: { rooms: Array<{ id, name, project_type, last_message, last_message_time, unread_count }> }
   */
  getChatRooms: async () => {
    try {
      console.log('📂 Fetching chat rooms...');
      
      // Fetch both lists in parallel
      const [myProjects, workingProjects] = await Promise.all([
        projectService.getMyProjects(),
        projectService.getWorkingProjects(),
      ]);

      console.log('✅ My projects:', myProjects?.length || 0);
      console.log('✅ Working projects:', workingProjects?.projects?.length || 0);

      // Transform created projects to room format
      const myRooms = (myProjects || []).map(project => ({
        id: project.id,
        name: project.name,
        project_type: project.project_type,
        description: project.description,
        status: project.status,
        last_message: null,
        last_message_time: null,
        unread_count: 0,
        // Meta info for UI
        is_creator: true,
        created_at: project.created_at,
      }));

      // Transform working projects to room format
      const workingRooms = (workingProjects?.projects || []).map(project => ({
        id: project.id,
        name: project.project_name || project.name,
        project_type: project.project_type,
        description: project.description,
        status: project.status,
        last_message: null,
        last_message_time: null,
        unread_count: 0,
        // Meta info for UI
        is_creator: false,
        my_role: project.my_role,
        creator_name: project.creator_name,
        created_at: project.created_at,
      }));

      // Merge and deduplicate by id
      const allRooms = [...myRooms, ...workingRooms];
      const uniqueRooms = Array.from(
        new Map(allRooms.map(room => [room.id, room])).values()
      );

      // Sort by most recently created (or you could sort by last message time when available)
      uniqueRooms.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );

      console.log(`✅ Total unique chat rooms: ${uniqueRooms.length}`);
      return { rooms: uniqueRooms };
    } catch (error) {
      console.error('❌ Failed to fetch chat rooms:', error);
      return { rooms: [] };
    }
  },

  /**
   * Get message history for a specific project/room
   * 
   * Backend endpoint: GET /chat/messages/{project_id}?limit=50
   * Returns: Array<MessageResponse>
   */
  getRoomMessages: async (projectId, limit = 50) => {
    try {
      console.log(`📨 Fetching messages for room: ${projectId}`);
      
      const messages = await apiCall(`/chat/messages/${projectId}?limit=${limit}`);
      
      console.log(`✅ Loaded ${messages?.length || 0} messages`);
      return { messages: messages || [] };
    } catch (error) {
      console.error(`❌ Failed to fetch messages for room ${projectId}:`, error);
      
      // If 403, user is not a member of the project
      if (error.message.includes('403') || error.message.includes('Not a member')) {
        throw new Error('You are not a member of this project');
      }
      
      return { messages: [] };
    }
  },

  /**
   * Delete a message
   * 
   * Backend endpoint: DELETE /chat/message/{message_id}
   * Returns: { message: "Message deleted" }
   */
  deleteMessage: async (messageId) => {
    try {
      console.log(`🗑️ Deleting message: ${messageId}`);
      
      const result = await apiCall(`/chat/message/${messageId}`, {
        method: 'DELETE',
      });
      
      console.log('✅ Message deleted successfully');
      return result;
    } catch (error) {
      console.error(`❌ Failed to delete message ${messageId}:`, error);
      
      // If 403, user can only delete their own messages
      if (error.message.includes('403') || error.message.includes('Can only delete')) {
        throw new Error('You can only delete your own messages');
      }
      
      throw error;
    }
  },

  /**
   * Send message (placeholder - messages are sent via WebSocket)
   * 
   * This function is kept for compatibility with your hooks,
   * but actual message sending happens via WebSocket in websocketService.sendMessage()
   */
  sendMessage: async (projectId, content, attachments = []) => {
    console.warn('⚠️ chatService.sendMessage() is deprecated - use WebSocket instead');
    console.log('Use websocketService.sendMessage(content, attachments) instead');
    
    // Return a mock message object for optimistic UI updates
    return {
      id: `temp-${Date.now()}`,
      project_id: projectId,
      content,
      sender_id: 'you',
      sender_name: 'You',
      sent_at: new Date().toISOString(),
      edited_at: null,
      is_deleted: false,
      attachments,
    };
  },

  /**
   * Mark messages as read (placeholder for future implementation)
   */
  markAsRead: async (projectId) => {
    console.log(`ℹ️ Mark as read not implemented yet for room: ${projectId}`);
    // TODO: Implement when backend adds this endpoint
    return { success: true };
  },

  /**
   * Get unread message count (placeholder for future implementation)
   */
  getUnreadCount: async () => {
    console.log('ℹ️ Unread count not implemented yet');
    // TODO: Implement when backend adds this endpoint
    return { unread_count: 0 };
  },
};

export default chatService;