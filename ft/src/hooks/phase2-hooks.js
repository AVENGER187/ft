import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocket.service';
import { chatService } from '../services/chat.service';
import { uploadService } from '../services/api';
import { searchService } from '../services/api';
import { UI_CONFIG } from '../utils/constants';

// ============================================
// useWebSocket Hook
// ============================================
export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // WebSocket connection is managed per-room in useChat
    // This hook just provides status monitoring
    const checkConnection = () => {
      setConnected(websocketService.isConnected());
    };

    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    connected,
    error,
    socket: websocketService,
  };
};

// ============================================
// useChat Hook (Fixed for Backend Integration)
// ============================================
export const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [wsStatus, setWsStatus] = useState('disconnected');
  
  // Refs to prevent stale closures
  const messagesRef = useRef(messages);
  const roomIdRef = useRef(roomId);

  useEffect(() => {
    messagesRef.current = messages;
    roomIdRef.current = roomId;
  }, [messages, roomId]);

  // ─────────────────────────────────────────
  // Load chat rooms
  // ─────────────────────────────────────────
  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await chatService.getChatRooms();
      const roomsList = data.rooms || data || [];
      setRooms(roomsList);
      return roomsList;
    } catch (err) {
      console.error('❌ Failed to load rooms:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─────────────────────────────────────────
  // Load messages for a room
  // ─────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    if (!roomId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await chatService.getRoomMessages(roomId);
      const messagesList = data.messages || data || [];
      setMessages(messagesList);
      return messagesList;
    } catch (err) {
      console.error(`❌ Failed to load messages for room ${roomId}:`, err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  // ─────────────────────────────────────────
  // Send message via WebSocket
  // ─────────────────────────────────────────
  const sendMessage = useCallback(async (content, attachments = []) => {
    if (!roomId || !content?.trim()) {
      console.warn('⚠️ Cannot send empty message or no room selected');
      return;
    }

    try {
      // Send via WebSocket for real-time delivery
      if (websocketService.isConnected()) {
        websocketService.sendMessage(content, attachments);
        
        // Note: The server will broadcast the message back to all clients
        // including the sender, so we don't need to add it locally here
        // The onMessage callback will handle adding it to the state
      } else {
        throw new Error('WebSocket not connected');
      }
    } catch (err) {
      console.error('❌ Failed to send message:', err);
      setError(err.message);
      throw err;
    }
  }, [roomId]);

  // ─────────────────────────────────────────
  // Delete message
  // ─────────────────────────────────────────
  const deleteMessage = useCallback(async (messageId) => {
    try {
      await chatService.deleteMessage(messageId);
      
      // Update local state to mark as deleted
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, is_deleted: true, content: '[Message deleted]' }
            : msg
        )
      );
    } catch (err) {
      console.error(`❌ Failed to delete message ${messageId}:`, err);
      setError(err.message);
      throw err;
    }
  }, []);

  // ─────────────────────────────────────────
  // WebSocket event listeners
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('⚠️ No access token found');
      return;
    }

    // Clean up previous connection
    websocketService.disconnect();
    websocketService.removeAllCallbacks();

    // Register message callback
    websocketService.onMessage((msg) => {
      console.log('📨 Message received in hook:', msg);
      
      // Deduplicate: only add if not already in messages
      setMessages(prev => {
        const exists = prev.some(m => m.id === msg.id);
        if (exists) {
          console.log('ℹ️ Message already exists, skipping:', msg.id);
          return prev;
        }
        console.log('✅ Adding new message to state:', msg.id);
        return [...prev, msg];
      });
    });

    // Register status change callback
    websocketService.onStatusChange((status) => {
      console.log('🔌 WebSocket status changed:', status);
      setWsStatus(status);
    });

    // Connect to the room
    console.log(`🔌 Connecting to room: ${roomId}`);
    websocketService.connect(roomId, token);

    // Cleanup on unmount or room change
    return () => {
      console.log(`🔌 Disconnecting from room: ${roomId}`);
      websocketService.disconnect();
      websocketService.removeAllCallbacks();
    };
  }, [roomId]);

  // ─────────────────────────────────────────
  // Typing indicators (placeholder for future)
  // ─────────────────────────────────────────
  const startTyping = useCallback(() => {
    if (!roomId || !websocketService.isConnected()) return;
    // TODO: Implement typing indicator
    // websocketService.send({ type: 'typing', room_id: roomId, is_typing: true });
  }, [roomId]);

  const stopTyping = useCallback(() => {
    if (!roomId || !websocketService.isConnected()) return;
    // TODO: Implement typing indicator
    // websocketService.send({ type: 'typing', room_id: roomId, is_typing: false });
  }, [roomId]);

  // ─────────────────────────────────────────
  // Mark as read (placeholder for future)
  // ─────────────────────────────────────────
  const markAsRead = useCallback(async () => {
    if (!roomId) return;
    try {
      // TODO: Implement mark as read endpoint
      // await chatService.markAsRead(roomId);
      console.log('ℹ️ Mark as read not implemented yet');
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, [roomId]);

  return {
    messages,
    rooms,
    isLoading,
    error,
    wsStatus,
    typingUsers,
    loadRooms,
    loadMessages,
    sendMessage,
    deleteMessage,
    markAsRead,
    startTyping,
    stopTyping,
  };
};

// ============================================
// useFileUpload Hook
// ============================================
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const uploadFile = useCallback(async (file, type = 'profile') => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setUploadedFile(null);

    try {
      let result;

      switch (type) {
        case 'profile':
          result = await uploadService.uploadProfilePhoto(file);
          break;
        case 'portfolio':
        case 'chat':
        case 'project':
          result = await uploadService.uploadPortfolio(file);
          break;
        default:
          throw new Error('Invalid upload type');
      }

      setUploadedFile(result);
      setProgress(100);
      return result;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const resetUpload = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setUploadedFile(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadedFile,
    uploadFile,
    resetUpload,
  };
};

// ============================================
// useSearch Hook
// ============================================
export const useSearch = (initialType = 'projects') => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  const search = useCallback(async (query, customFilters = {}) => {
    setIsLoading(true);
    setError(null);

    const searchParams = {
      ...filters,
      ...customFilters,
    };

    try {
      let data;
      if (initialType === 'projects') {
        data = await searchService.searchProjects(searchParams);
      } else {
        data = await searchService.searchUsers(searchParams);
      }
      
      const resultsList = data.results || data.projects || data.users || data || [];
      setResults(resultsList);
      return resultsList;
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [filters, initialType]);

  const getSuggestions = useCallback(async (query) => {
    if (!query || query.length < UI_CONFIG.MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      return;
    }

    try {
      // Client-side filtering from results as a simple implementation
      // Backend doesn't have /search/suggestions endpoint yet
      const filtered = results.filter(item =>
        item.name?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(filtered);
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      setSuggestions([]);
    }
  }, [results]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isLoading,
    error,
    filters,
    suggestions,
    search,
    getSuggestions,
    updateFilters,
    clearFilters,
    clearResults,
  };
};

// ============================================
// useDebounce Hook
// ============================================
export const useDebounce = (value, delay = UI_CONFIG.SEARCH_DEBOUNCE_MS) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ============================================
// useInfiniteScroll Hook
// ============================================
export const useInfiniteScroll = (callback, options = {}) => {
  const observer = useRef();
  
  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      }, {
        threshold: 0.1,
        ...options,
      });

      if (node) observer.current.observe(node);
    },
    [callback, options]
  );

  return lastElementRef;
};

// ============================================
// useLocalStorage Hook
// ============================================
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// ============================================
// useClickOutside Hook
// ============================================
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, callback]);
};

// ============================================
// useKeyPress Hook
// ============================================
export const useKeyPress = (targetKey, callback) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === targetKey) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [targetKey, callback]);
};

// ============================================
// Export all hooks
// ============================================
export default {
  useWebSocket,
  useChat,
  useFileUpload,
  useSearch,
  useDebounce,
  useInfiniteScroll,
  useLocalStorage,
  useClickOutside,
  useKeyPress,
};