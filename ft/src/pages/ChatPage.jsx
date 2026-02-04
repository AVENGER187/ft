import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Search, X, MoreVertical, Phone, Video, Trash2 } from 'lucide-react';
import { chatService } from '../services/chat.service';
import websocketService from '../services/websocket.service';
import { useAuth } from '../context/AuthContext';
import ChatInput from '../components/chat/ChatInput';

/* ════════════════════════════════════════════════════════
   ChatPage - Real-time chat with WebSocket integration
   Fixed version with proper message synchronization
   ════════════════════════════════════════════════════════ */
const ChatPage = () => {
  const { projectId: urlProjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── rooms (sidebar) ──────────────────────────────────
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomSearch, setRoomSearch] = useState('');

  // ── selected room ────────────────────────────────────
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ── messages ─────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ── WS status ────────────────────────────────────────
  const [wsStatus, setWsStatus] = useState('disconnected');

  /* ─── load rooms on mount ──────────────────────────── */
  useEffect(() => {
    (async () => {
      setRoomsLoading(true);
      try {
        const { rooms: list } = await chatService.getChatRooms();
        console.log('📂 Loaded rooms:', list);
        setRooms(list || []);
      } catch (error) {
        console.error('❌ Failed to load rooms:', error);
      } finally {
        setRoomsLoading(false);
      }
    })();
  }, []);

  /* ─── auto-select room from URL param ──────────────── */
  useEffect(() => {
    if (urlProjectId && rooms.length > 0) {
      const match = rooms.find(r => r.id === urlProjectId);
      if (match && (!selectedRoom || match.id !== selectedRoom.id)) {
        console.log('🎯 Auto-selecting room from URL:', match);
        selectRoom(match);
      }
    }
  }, [urlProjectId, rooms]);

  /* ─── scroll to bottom whenever messages change ───── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ─── cleanup WebSocket on unmount ──────────────────── */
  useEffect(() => {
    return () => {
      console.log('🧹 Cleanup: Disconnecting WebSocket');
      websocketService.disconnect();
      websocketService.removeAllCallbacks();
    };
  }, []);

  /* ─── select a room: fetch history + open WS ────── */
  const selectRoom = useCallback(async (room) => {
    console.log('📍 Selecting room:', room.name);
    
    // Tear down previous WS
    websocketService.disconnect();
    websocketService.removeAllCallbacks();

    setSelectedRoom(room);
    setMessages([]); // Clear messages immediately
    setMsgsLoading(true);
    navigate(`/chat/${room.id}`, { replace: true });

    try {
      // 1) Fetch message history from backend
      console.log('📨 Fetching message history for room:', room.id);
      const { messages: hist } = await chatService.getRoomMessages(room.id);
      console.log(`✅ Loaded ${hist.length} messages from database`);
      setMessages(hist);
    } catch (error) {
      console.error('❌ Failed to load messages:', error);
      setMessages([]);
    } finally {
      setMsgsLoading(false);
    }

    // 2) Open WebSocket for real-time updates
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('🔌 Setting up WebSocket for room:', room.id);
      
      // Register message callback BEFORE connecting
      websocketService.onMessage((msg) => {
        console.log('📨 WebSocket message received:', msg);
        
        // Add message to state (with deduplication)
        setMessages(prev => {
          // Check if message already exists by ID
          const exists = prev.some(m => m.id === msg.id);
          if (exists) {
            console.log('ℹ️ Message already in state, skipping:', msg.id);
            return prev;
          }
          console.log('✅ Adding new message to state:', msg.id);
          return [...prev, msg];
        });
      });

      // Register status callback
      websocketService.onStatusChange((status) => {
        console.log('🔌 WebSocket status:', status);
        setWsStatus(status);
      });

      // Connect to WebSocket
      websocketService.connect(room.id, token);
    } else {
      console.error('❌ No access token found');
    }
  }, [navigate]);

  /* ─── send handler (ChatInput calls this) ──────────── */
  const handleSend = async (content, attachments) => {
    if (!content?.trim() && !attachments?.length) return;
    if (!selectedRoom) return;

    console.log('📤 Sending message:', content);

    try {
      // Send via WebSocket
      if (websocketService.isConnected()) {
        websocketService.sendMessage(content);
        
        // Note: The server will broadcast the message back to ALL clients
        // including the sender, so we don't need optimistic UI updates
        // The onMessage callback will handle adding it to the state
      } else {
        console.warn('⚠️ WebSocket not connected');
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  };

  /* ─── delete a message ──────────────────────────────── */
  const handleDelete = async (messageId) => {
    try {
      await chatService.deleteMessage(messageId);
      setMessages(prev =>
        prev.map(m => 
          m.id === messageId 
            ? { ...m, is_deleted: true, content: '[Message deleted]' } 
            : m
        )
      );
    } catch (e) {
      console.error('❌ Delete failed:', e);
    }
  };

  /* ─── filtered room list ────────────────────────────── */
  const filteredRooms = rooms.filter(r =>
    r.name?.toLowerCase().includes(roomSearch.toLowerCase())
  );

  /* ════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex">
      {/* ── Sidebar: room list ──────────────────────── */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={roomSearch}
              onChange={e => setRoomSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* room list */}
        <div className="flex-1 overflow-y-auto">
          {roomsLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredRooms.length > 0 ? (
            filteredRooms.map(room => (
              <button
                key={room.id}
                onClick={() => selectRoom(room)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedRoom?.id === room.id
                    ? 'bg-orange-50 border-l-4 border-l-orange-500'
                    : ''
                }`}
              >
                <div className="w-11 h-11 flex-shrink-0 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {room.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-semibold text-gray-800 truncate text-sm">{room.name}</h3>
                  <p className="text-xs text-gray-500 truncate">
                    {room.last_message || 'No messages yet'}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-gray-400">
              <MessageSquare className="w-14 h-14 mb-3" />
              <p className="text-center text-sm">
                {roomSearch ? 'No matching conversations' : 'No conversations yet'}
              </p>
              <p className="text-xs text-center mt-1">
                Join or create a project to start chatting
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main: messages ────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* chat header */}
            <header className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {selectedRoom.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedRoom.name}</h3>
                  <p className={`text-xs ${wsStatus === 'connected' ? 'text-green-600' : 'text-gray-400'}`}>
                    {wsStatus === 'connected' ? '● Live' : '○ Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Call"><Phone className="w-5 h-5 text-gray-500" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="Video"><Video className="w-5 h-5 text-gray-500" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" title="More"><MoreVertical className="w-5 h-5 text-gray-500" /></button>
              </div>
            </header>

            {/* message list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {msgsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <MessageSquare className="w-16 h-16 mb-3" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.sender_id === user?.id}
                    onDelete={() => handleDelete(msg.id)}
                    canDelete={msg.sender_id === user?.id}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* input */}
            <ChatInput onSend={handleSend} roomId={selectedRoom.id} />
          </>
        ) : (
          /* no room selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────
   MessageBubble – renders a single message
   ────────────────────────────────────────────────────── */
const MessageBubble = ({ message, isOwn, onDelete, canDelete }) => {
  const [hover, setHover] = useState(false);

  const timeLabel = (() => {
    try {
      const d = new Date(message.sent_at);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  })();

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={`max-w-[70%] flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <span className="text-xs text-gray-500 px-1">{message.sender_name}</span>
        )}

        <div className="relative group">
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <p className="whitespace-pre-wrap break-words text-sm">
              {message.is_deleted ? (
                <em className="opacity-60">This message was deleted</em>
              ) : (
                message.content
              )}
            </p>
          </div>

          {/* delete button – only own messages, on hover */}
          {canDelete && hover && !message.is_deleted && (
            <button
              onClick={onDelete}
              className="absolute -top-2 -right-2 p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>

        <span className="text-xs text-gray-400 px-1">{timeLabel}</span>
      </div>
    </div>
  );
};

export default ChatPage;