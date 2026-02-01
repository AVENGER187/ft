import { io } from 'socket.io-client';
import { WS_BASE_URL } from '../utils/constants';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    // Disable WebSocket for now if backend doesn't support it
    console.log('⚠️ WebSocket disabled - using REST API only');
    return;

    /* UNCOMMENT WHEN BACKEND HAS WEBSOCKET SUPPORT
    if (this.socket?.connected) {
      console.log('✅ WebSocket already connected');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('⚠️ No token found, skipping WebSocket connection');
      return;
    }

    try {
      console.log('🔌 Connecting to WebSocket...');
      
      this.socket = io(WS_BASE_URL, {
        auth: {
          token: `Bearer ${token}`
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket connected');
        this.connected = true;
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ WebSocket disconnected:', reason);
        this.connected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error.message);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log('⚠️ Max reconnection attempts reached');
          this.disconnect();
        }
      });

      this.socket.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
      });

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
    }
    */
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Join a project room
   */
  joinProjectRoom(projectId) {
    if (!this.socket?.connected) {
      console.log('⚠️ WebSocket not connected');
      return;
    }

    console.log('📡 Joining project room:', projectId);
    this.socket.emit('join_room', { project_id: projectId });
  }

  /**
   * Leave a project room
   */
  leaveProjectRoom(projectId) {
    if (!this.socket?.connected) return;

    console.log('📡 Leaving project room:', projectId);
    this.socket.emit('leave_room', { project_id: projectId });
  }

  /**
   * Send a message
   */
  sendMessage(projectId, content) {
    if (!this.socket?.connected) {
      console.log('⚠️ WebSocket not connected, cannot send message');
      return;
    }

    this.socket.emit('send_message', {
      project_id: projectId,
      content,
    });
  }

  /**
   * Listen for new messages
   */
  onNewMessage(callback) {
    if (!this.socket) return;
    this.socket.on('new_message', callback);
  }

  /**
   * Listen for typing indicators
   */
  onUserTyping(callback) {
    if (!this.socket) return;
    this.socket.on('user_typing', callback);
  }

  /**
   * Send typing indicator
   */
  sendTyping(projectId) {
    if (!this.socket?.connected) return;
    this.socket.emit('typing', { project_id: projectId });
  }

  /**
   * Listen for notifications
   */
  onNewNotification(callback) {
    if (!this.socket) return;
    this.socket.on('new_notification', callback);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connected && this.socket?.connected;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;