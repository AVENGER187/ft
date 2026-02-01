import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocket.service';
import { chatService } from '../services/chat.service';
import { uploadService } from '../services/upload.service';
import { searchService } from '../services/search.service';

// ============================================
// useWebSocket Hook
// ============================================
export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      websocketService.connect(token);
      setConnected(true);
    }

    return () => {
      websocketService.disconnect();
      setConnected(false);
    };
  }, []);

  return {
    connected,
    socket: websocketService,
  };
};

// ============================================
// useChat Hook
// ============================================
export const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());

  // Load chat rooms
  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await chatService.getChatRooms();
      setRooms(data.rooms || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load messages for a room
  const loadMessages = useCallback(async () => {
    if (!roomId) return;

    setIsLoading(true);
    try {
      const data = await chatService.getRoomMessages(roomId);
      setMessages(data.messages || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  // Send message
  const sendMessage = useCallback(async (content, attachments = []) => {
    if (!roomId || !content.trim()) return;

    try {
      const message = await chatService.sendMessage(roomId, content, attachments);
      setMessages((prev) => [...prev, message]);
      websocketService.sendMessage(roomId, message);
      return message;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [roomId]);

  // Mark as read
  const markAsRead = useCallback(async () => {
    if (!roomId) return;
    try {
      await chatService.markAsRead(roomId);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, [roomId]);

  // WebSocket listeners
  useEffect(() => {
    if (!roomId || !websocketService.isConnected()) return;

    // Join room
    websocketService.joinRoom(roomId);

    // Listen for new messages
    const handleNewMessage = (message) => {
      if (message.room_id === roomId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // Listen for typing
    const handleTyping = ({ user_id, is_typing }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (is_typing) {
          newSet.add(user_id);
        } else {
          newSet.delete(user_id);
        }
        return newSet;
      });
    };

    websocketService.on('new_message', handleNewMessage);
    websocketService.on('user_typing', handleTyping);

    return () => {
      websocketService.off('new_message', handleNewMessage);
      websocketService.off('user_typing', handleTyping);
      websocketService.leaveRoom(roomId);
    };
  }, [roomId]);

  return {
    messages,
    rooms,
    isLoading,
    error,
    typingUsers: Array.from(typingUsers),
    loadRooms,
    loadMessages,
    sendMessage,
    markAsRead,
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
          result = await uploadService.uploadProfilePicture(file, setProgress);
          break;
        case 'chat':
          result = await uploadService.uploadChatAttachment(file, setProgress);
          break;
        case 'project':
          result = await uploadService.uploadProjectFile(null, file, setProgress);
          break;
        default:
          throw new Error('Invalid upload type');
      }

      setUploadedFile(result);
      return result;
    } catch (err) {
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
      query,
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
      
      setResults(data.results || data.projects || data.users || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [filters, initialType]);

  const getSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const data = await searchService.getSearchSuggestions(query, initialType);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Failed to get suggestions:', err);
    }
  }, [initialType]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
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
  };
};

// ============================================
// useDebounce Hook
// ============================================
export const useDebounce = (value, delay = 500) => {
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
export const useInfiniteScroll = (callback) => {
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      });

      if (node) observer.current.observe(node);
    },
    [callback]
  );

  return lastElementRef;
};