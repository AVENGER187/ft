import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Phone, Video, MoreVertical, Trash2, Send, Paperclip, X } from 'lucide-react';
import { chatService } from '../services/chat.service';
import websocketService from '../services/websocket.service';
import { useAuth } from '../context/AuthContext';

/* ════════════════════════════════════════════════════════
   Messages Page - Alternative chat interface
   Uses the same backend as ChatPage but different UI layout
   ════════════════════════════════════════════════════════ */
const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── rooms ────────────────────────────────────────────
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomSearch, setRoomSearch] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ── messages ─────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  // ── WebSocket status ─────────────────────────────────
  const [wsStatus, setWsStatus] = useState('disconnected');

  /* ─── Load rooms on mount ──────────────────────────── */
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

  /* ─── Scroll to bottom when messages change ─────────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ─── Cleanup WebSocket on unmount ──────────────────── */
  useEffect(() => {
    return () => {
      websocketService.disconnect();
      websocketService.removeAllCallbacks();
    };
  }, []);

  /* ─── Select room handler ───────────────────────────── */
  const handleSelectRoom = useCallback(async (room) => {
    console.log('📍 Selecting room:', room.name);
    
    // Cleanup previous connection
    websocketService.disconnect();
    websocketService.removeAllCallbacks();

    setSelectedRoom(room);
    setMessages([]);
    setMsgsLoading(true);

    try {
      // 1) Fetch message history
      const { messages: hist } = await chatService.getRoomMessages(room.id);
      console.log(`✅ Loaded ${hist.length} messages`);
      setMessages(hist);
    } catch (error) {
      console.error('❌ Failed to load messages:', error);
    } finally {
      setMsgsLoading(false);
    }

    // 2) Setup WebSocket
    const token = localStorage.getItem('access_token');
    if (token) {
      websocketService.onMessage((msg) => {
        console.log('📨 Message received:', msg);
        setMessages(prev => {
          const exists = prev.some(m => m.id === msg.id);
          if (exists) return prev;
          return [...prev, msg];
        });
      });

      websocketService.onStatusChange((status) => {
        console.log('🔌 Status:', status);
        setWsStatus(status);
      });

      websocketService.connect(room.id, token);
    }
  }, []);

  /* ─── Send message handler ──────────────────────────── */
  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedRoom) return;

    console.log('📤 Sending:', messageInput);

    try {
      if (websocketService.isConnected()) {
        websocketService.sendMessage(messageInput);
        setMessageInput(''); // Clear input
      } else {
        console.warn('⚠️ WebSocket not connected');
      }
    } catch (error) {
      console.error('❌ Failed to send:', error);
    }
  }, [messageInput, selectedRoom]);

  /* ─── Delete message handler ────────────────────────── */
  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      await chatService.deleteMessage(messageId);
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? { ...m, is_deleted: true, content: '[Message deleted]' }
            : m
        )
      );
    } catch (error) {
      console.error('❌ Delete failed:', error);
    }
  }, []);

  /* ─── Filtered rooms ─────────────────────────────────── */
  const filteredRooms = rooms.filter(r =>
    r.name?.toLowerCase().includes(roomSearch.toLowerCase())
  );

  /* ════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-4">
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden flex"
          style={{ height: 'calc(100vh - 8rem)' }}
        >
          {/* ══════════════════════════════════════
             LEFT: Chat List
             ══════════════════════════════════════ */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Header */}
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

            {/* Room List */}
            <div className="flex-1 overflow-y-auto">
              {roomsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredRooms.length > 0 ? (
                filteredRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => handleSelectRoom(room)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedRoom?.id === room.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {room.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-semibold text-gray-800 truncate text-sm">
                        {room.name}
                      </h3>
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
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════
             RIGHT: Chat Window
             ══════════════════════════════════════ */}
          {selectedRoom ? (
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
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
                  <button className="p-2 hover:bg-gray-100 rounded-lg"><Phone className="w-5 h-5 text-gray-500" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg"><Video className="w-5 h-5 text-gray-500" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="w-5 h-5 text-gray-500" /></button>
                </div>
              </div>

              {/* Messages */}
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
                      onDelete={() => handleDeleteMessage(msg.id)}
                      canDelete={msg.sender_id === user?.id}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 bg-white p-4">
                <div className="flex items-end gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message…"
                    rows={1}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* No room selected */
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
              <MessageSquare className="w-20 h-20 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the left to start messaging
              </p>
              {wsStatus === 'disconnected' && (
                <p className="mt-4 text-sm text-orange-600">
                  Will connect when you select a room...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────
   MessageBubble Component
   ────────────────────────────────────────────────────── */
const MessageBubble = ({ message, isOwn, onDelete, canDelete }) => {
  const [hover, setHover] = useState(false);

  const timeLabel = (() => {
    try {
      const d = new Date(message.sent_at);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
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

export default Messages;