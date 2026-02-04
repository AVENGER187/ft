import { WS_BASE_URL, WS_CONFIG } from '../utils/constants';

/**
 * WebSocket Service for Real-Time Chat
 * Manages WebSocket connections to the FastAPI backend
 * 
 * Backend Protocol:
 * 1. Connect to: ws://localhost:8000/chat/ws/{project_id}
 * 2. First message MUST be: {"token": "your_jwt_token"}
 * 3. Send messages: {"content": "message text"}
 * 4. Receive: {id, project_id, sender_id, sender_name, content, sent_at, ...}
 */
class WebSocketService {
  constructor() {
    this.ws = null;
    this.projectId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = WS_CONFIG.MAX_RECONNECT_ATTEMPTS || 5;
    this.reconnectDelay = WS_CONFIG.RECONNECT_DELAY_MS || 2000;
    this.messageCallbacks = [];
    this.statusCallbacks = [];
    this.connected = false;
    this.authenticated = false;
  }

  /**
   * Connect to a project's chat room
   * 
   * @param {string} projectId - UUID of the project
   * @param {string} token - JWT access token
   */
  connect(projectId, token) {
    // Close existing connection if any
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('⚠️ WebSocket already connected, disconnecting first...');
      this.disconnect();
    }

    this.projectId = projectId;
    const wsUrl = `${WS_BASE_URL}/chat/ws/${projectId}`;

    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);

    try {
      this.ws = new WebSocket(wsUrl);

      // ─────────────────────────────────────────
      // Connection opened
      // ─────────────────────────────────────────
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.connected = true;
        this.reconnectAttempts = 0;
        
        // CRITICAL: Send authentication token as FIRST message
        console.log('🔐 Sending authentication token...');
        this.ws.send(JSON.stringify({ token }));
        
        this._notifyStatusChange('connected');
      };

      // ─────────────────────────────────────────
      // Message received
      // ─────────────────────────────────────────
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle errors from server
          if (data.error) {
            console.error('❌ WebSocket error from server:', data.error);
            
            if (data.error.includes('Token required') || 
                data.error.includes('Invalid token')) {
              console.error('🔐 Authentication failed');
              this._notifyStatusChange('error');
              this.disconnect();
              return;
            }
            
            if (data.error.includes('Not a member')) {
              console.error('🚫 User is not a member of this project');
              this._notifyStatusChange('error');
              this.disconnect();
              return;
            }
            
            this._notifyStatusChange('error');
            return;
          }

          // Valid message received
          // Backend sends: {id, project_id, sender_id, sender_name, content, sent_at, edited_at, is_deleted}
          console.log('📨 Message received:', data);
          
          // Mark as authenticated if we successfully receive a message
          if (!this.authenticated) {
            this.authenticated = true;
            console.log('✅ WebSocket authenticated successfully');
          }
          
          this._notifyMessage(data);
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error);
          console.error('Raw data:', event.data);
        }
      };

      // ─────────────────────────────────────────
      // Error occurred
      // ─────────────────────────────────────────
      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.connected = false;
        this.authenticated = false;
        this._notifyStatusChange('error');
      };

      // ─────────────────────────────────────────
      // Connection closed
      // ─────────────────────────────────────────
      this.ws.onclose = (event) => {
        console.log(`🔌 WebSocket closed: Code ${event.code}, Reason: ${event.reason || 'No reason'}`);
        this.connected = false;
        this.authenticated = false;
        this._notifyStatusChange('disconnected');

        // Attempt reconnection if not a normal closure
        // Code 1000 = normal closure
        // Code 1001 = going away (user navigated away)
        if (event.code !== 1000 && 
            event.code !== 1001 && 
            this.reconnectAttempts < this.maxReconnectAttempts) {
          
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * this.reconnectAttempts;
          
          console.log(`🔄 Reconnecting... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          console.log(`⏳ Waiting ${delay}ms before reconnect...`);
          
          setTimeout(() => {
            if (this.projectId && token) {
              this.connect(this.projectId, token);
            }
          }, delay);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('❌ Max reconnection attempts reached');
          this._notifyStatusChange('error');
        }
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error);
      this._notifyStatusChange('error');
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.ws) {
      console.log('🔌 Disconnecting WebSocket...');
      this.connected = false;
      this.authenticated = false;
      
      // Close with code 1000 (normal closure) to prevent reconnection
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
      this.projectId = null;
    }
  }

  /**
   * Send a message through WebSocket
   * 
   * Backend expects: {"content": "message text"}
   * Backend responds by broadcasting to all clients: {id, project_id, sender_id, sender_name, content, sent_at, ...}
   * 
   * @param {string} content - Message text content
   * @param {Array} attachments - File attachments (not yet supported by backend)
   */
  sendMessage(content, attachments = []) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket not connected');
      throw new Error('WebSocket not connected');
    }

    if (!this.authenticated) {
      console.error('❌ WebSocket not authenticated yet');
      throw new Error('WebSocket not authenticated');
    }

    if (!content || !content.trim()) {
      console.warn('⚠️ Attempted to send empty message');
      return;
    }

    const message = {
      content: content.trim(),
      // Note: Backend doesn't support attachments via WebSocket yet
      // Attachments would need to be uploaded separately via REST API
      // and URLs included in the message content
    };

    console.log('📤 Sending message:', message);
    this.ws.send(JSON.stringify(message));
  }

  /**
   * Send typing indicator (placeholder for future implementation)
   * 
   * Backend doesn't support this yet
   */
  sendTyping(isTyping) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.authenticated) {
      return;
    }

    // TODO: Implement when backend supports typing indicators
    // this.ws.send(JSON.stringify({ type: 'typing', is_typing: isTyping }));
  }

  /**
   * Register callback for incoming messages
   * 
   * Callback receives: {id, project_id, sender_id, sender_name, content, sent_at, edited_at, is_deleted}
   */
  onMessage(callback) {
    if (typeof callback !== 'function') {
      console.error('❌ onMessage callback must be a function');
      return;
    }
    this.messageCallbacks.push(callback);
  }

  /**
   * Register callback for status changes
   * 
   * Callback receives: 'connected' | 'disconnected' | 'error' | 'reconnecting'
   */
  onStatusChange(callback) {
    if (typeof callback !== 'function') {
      console.error('❌ onStatusChange callback must be a function');
      return;
    }
    this.statusCallbacks.push(callback);
  }

  /**
   * Remove all callbacks (cleanup)
   */
  removeAllCallbacks() {
    this.messageCallbacks = [];
    this.statusCallbacks = [];
  }

  /**
   * Remove a specific message callback
   */
  removeMessageCallback(callback) {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Remove a specific status callback
   */
  removeStatusCallback(callback) {
    this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Check if WebSocket is connected and authenticated
   */
  isConnected() {
    return this.connected && 
           this.authenticated && 
           this.ws && 
           this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get current connection status
   */
  getStatus() {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return this.authenticated ? 'connected' : 'authenticating';
      case WebSocket.CLOSING:
        return 'disconnecting';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }

  /**
   * Notify all message callbacks
   * @private
   */
  _notifyMessage(message) {
    this.messageCallbacks.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error('❌ Error in message callback:', error);
      }
    });
  }

  /**
   * Notify all status callbacks
   * @private
   */
  _notifyStatusChange(status) {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('❌ Error in status callback:', error);
      }
    });
  }
}

// ============================================
// Export singleton instance
// ============================================
const websocketService = new WebSocketService();

// Expose for debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.websocketService = websocketService;
}

export default websocketService;