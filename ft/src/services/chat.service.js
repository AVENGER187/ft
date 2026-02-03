import { apiCall } from './api';

/**
 * Chat Service — matches the actual backend.
 *
 * Chat "rooms" are projects.  A user can be in a project as:
 *   • creator   → returned by  GET /projects/my/projects
 *   • member    → returned by  GET /projects/my/working
 * We merge both lists so every project the user participates in shows up.
 *
 * Messages live at  GET /chat/messages/{project_id}
 * Sending is via the native WebSocket at ws://.../chat/ws/{project_id}
 * Delete is        DELETE /chat/message/{message_id}
 */
export const chatService = {
  /* ────────────────────────────────────────────────────── */
  /*  Rooms (= projects the current user belongs to)       */
  /* ────────────────────────────────────────────────────── */
  getChatRooms: async () => {
    try {
      // 1) projects the user CREATED
      const createdRaw = await apiCall('/projects/my/projects').catch(() => []);
      const created = Array.isArray(createdRaw) ? createdRaw : [];

      // 2) projects the user is a MEMBER of (accepted applications)
      const workingRaw = await apiCall('/projects/my/working').catch(() => ({ projects: [] }));
      const working = Array.isArray(workingRaw)
        ? workingRaw
        : (workingRaw.projects || []);

      // 3) merge & de-duplicate by id
      const seen = new Set();
      const rooms = [];

      const toRoom = (p) => ({
        id:                p.id,
        name:              p.name || p.project_name || 'Unnamed Project',
        project_id:        p.id,
        last_message:      null,   // populated after first message fetch if needed
        last_message_time: null,
        unread_count:      0,
        type:              'project',
      });

      for (const p of [...created, ...working]) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          rooms.push(toRoom(p));
        }
      }

      return { rooms };
    } catch (error) {
      console.error('Failed to get chat rooms:', error);
      return { rooms: [] };
    }
  },

  /* ────────────────────────────────────────────────────── */
  /*  Messages                                              */
  /* ────────────────────────────────────────────────────── */
  /**
   * Fetch historical messages for a project.
   * Backend returns an array directly.
   */
  getRoomMessages: async (projectId, limit = 50) => {
    try {
      const response = await apiCall(`/chat/messages/${projectId}?limit=${limit}`);
      const messages = Array.isArray(response) ? response : (response.messages || []);
      return { messages };
    } catch (error) {
      console.error('Failed to get messages:', error);
      return { messages: [] };
    }
  },

  /**
   * Delete a message (soft-delete on the backend).
   */
  deleteMessage: async (messageId) => {
    try {
      return await apiCall(`/chat/message/${messageId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  },

  /* ────────────────────────────────────────────────────── */
  /*  Stubs for features not yet on the backend             */
  /* ────────────────────────────────────────────────────── */
  markAsRead: async () => ({ success: true }),
  getUnreadCount: async () => ({ count: 0 }),
};