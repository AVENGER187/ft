/**
 * ✅ NATIVE WEBSOCKET SERVICE
 * Uses the browser's built-in WebSocket — no Socket.io dependency.
 *
 * Backend handshake (chat.py):
 *   1.  Client opens   ws://{host}/chat/ws/{project_id}
 *   2.  Server accepts immediately.
 *   3.  Client sends   { "token": "<jwt>" }          ← auth
 *   4.  Server validates; sends { "error": "…" } on failure.
 *   5.  Client sends   { "content": "hello" }        ← each message
 *   6.  Server broadcasts to all connections in the room.
 */

const WS_BASE = (() => {
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  // Dev: backend on :8000 even though React dev-server is on :5173
  return `${proto}://localhost:8000`;
})();

class WebSocketService {
  constructor() {
    this.socket            = null;
    this.connected         = false;
    this.projectId         = null;
    this.token             = null;
    this.reconnectAttempts = 0;
    this.maxReconnects     = 5;
    this.baseDelay         = 1000;
    this.reconnectTimer    = null;
    this._messageCallbacks = [];
    this._statusCallbacks  = [];
  }

  // ── lifecycle ──────────────────────────────────────

  connect(projectId, token) {
    if (this.socket?.readyState === WebSocket.OPEN && this.projectId === projectId) {
      console.log('✅ WebSocket already connected to', projectId);
      return;
    }
    if (this.socket) this.disconnect();
    if (!projectId || !token) {
      console.error('❌ connect() requires projectId and token');
      return;
    }

    this.projectId = projectId;
    this.token     = token;
    const url      = `${WS_BASE}/chat/ws/${projectId}`;
    console.log('🔌 Opening WebSocket →', url);
    this.socket    = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('✅ WebSocket open');
      this.connected         = true;
      this.reconnectAttempts = 0;
      this.socket.send(JSON.stringify({ token: this.token }));
      console.log('🔑 Auth token sent');
      this._emit('connected');
    };

    this.socket.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.error) {
          console.error('❌ Server error:', data.error);
          this.disconnect();
          this._emit('error');
          return;
        }
        this._messageCallbacks.forEach(cb => cb(data));
      } catch (e) {
        console.error('❌ Parse error', e);
      }
    };

    this.socket.onerror = () => {
      console.error('❌ WebSocket error');
      this.connected = false;
      this._emit('error');
    };

    this.socket.onclose = (evt) => {
      console.log('🔌 WebSocket closed', evt.code, evt.reason);
      this.connected = false;
      this._emit('disconnected');
      if (evt.code !== 1000) this._scheduleReconnect();
    };
  }

  disconnect() {
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    if (this.socket)         { this.socket.close(1000, 'client disconnect'); this.socket = null; }
    this.connected         = false;
    this.reconnectAttempts = 0;
  }

  // ── sending ────────────────────────────────────────

  sendMessage(content) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }
    if (!content?.trim()) return;
    this.socket.send(JSON.stringify({ content: content.trim() }));
    console.log('📤 Sent:', content.trim());
  }

  // ── listeners ──────────────────────────────────────

  onMessage(fn)       { if (typeof fn === 'function') this._messageCallbacks.push(fn); }
  onStatusChange(fn)  { if (typeof fn === 'function') this._statusCallbacks.push(fn); }
  removeAllCallbacks(){ this._messageCallbacks = []; this._statusCallbacks = []; }

  // ── helpers ────────────────────────────────────────

  isConnected()        { return this.connected && this.socket?.readyState === WebSocket.OPEN; }
  getCurrentProjectId(){ return this.projectId; }

  _emit(status) { this._statusCallbacks.forEach(cb => cb(status)); }

  _scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnects) {
      console.warn('⚠️ Max reconnect attempts reached');
      return;
    }
    this.reconnectAttempts++;
    const delay = this.baseDelay * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`🔄 Reconnecting in ${delay}ms… (${this.reconnectAttempts}/${this.maxReconnects})`);
    this.reconnectTimer = setTimeout(() => {
      if (this.projectId && this.token) this.connect(this.projectId, this.token);
    }, delay);
  }
}

const websocketService = new WebSocketService();
export default websocketService;