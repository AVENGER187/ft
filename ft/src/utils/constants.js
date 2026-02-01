// API Configuration
export const API_BASE_URL = 'http://localhost:8000';
export const WS_BASE_URL = 'ws://localhost:8000';

// Application Routes
export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PROJECTS: '/projects',
  MY_PROJECTS: '/my-projects',
  PROJECT_DETAIL: '/projects/:id',
  MESSAGES: '/messages',
  SEARCH: '/search',
  NOTIFICATIONS: '/notifications',    // 🌟 Phase 3
  ANALYTICS: '/analytics',            // 🌟 Phase 3
  SETTINGS: '/settings',              // 🌟 Phase 3
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGNUP_SEND_OTP: '/auth/signup/send-otp',
  SIGNUP_VERIFY_OTP: '/auth/signup/verify-otp',
  LOGIN: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Profile
  GET_PROFILE: '/profile/me',
  UPDATE_PROFILE: '/profile/update',
  
  // Projects
  CREATE_PROJECT: '/projects/create',
  GET_PROJECT: '/projects',
  MY_PROJECTS: '/projects/my/projects',
  
  // Search
  SEARCH_PROJECTS: '/search/projects',
  SEARCH_USERS: '/search/users',
  
  // Applications
  APPLY_TO_ROLE: '/applications/apply',
  GET_PROJECT_APPLICATIONS: '/applications/project',
  ACCEPT_APPLICATION: '/applications/accept',
  REJECT_APPLICATION: '/applications/reject',
  
  // Chat
  CHAT_ROOMS: '/chat/rooms',
  CHAT_MESSAGES: '/chat/rooms/:roomId/messages',
  SEND_MESSAGE: '/chat/rooms/:roomId/messages',
  
  // Upload
  UPLOAD_PROFILE_PIC: '/upload/profile-picture',
  UPLOAD_PROJECT_FILE: '/upload/project-file',
  UPLOAD_CHAT_ATTACHMENT: '/upload/chat-attachment',
  
  // Advanced Search
  GET_SKILLS: '/search/skills',
  GET_POPULAR_SKILLS: '/search/skills/popular',
  SEARCH_SUGGESTIONS: '/search/suggestions',
  
  // 🌟 Phase 3 - Notifications
  GET_NOTIFICATIONS: '/notifications',
  UNREAD_COUNT: '/notifications/unread-count',
  MARK_AS_READ: '/notifications/:id/read',
  NOTIFICATION_SETTINGS: '/notifications/settings',
  
  // 🌟 Phase 3 - Analytics
  DASHBOARD_STATS: '/analytics/dashboard',
  PROJECT_ANALYTICS: '/analytics/projects/:id',
  USER_ANALYTICS: '/analytics/user',
  PLATFORM_STATS: '/analytics/platform',
  
  // 🌟 Phase 3 - Ratings
  GET_RATINGS: '/ratings/projects/:id',
  SUBMIT_RATING: '/ratings/submit',
  RATING_SUMMARY: '/ratings/projects/:id/summary',
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
};

// Application Status
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

// WebSocket Events
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  NEW_MESSAGE: 'new_message',
  SEND_MESSAGE: 'send_message',
  TYPING: 'typing',
  USER_TYPING: 'user_typing',
  MESSAGE_READ: 'message_read',
  NEW_NOTIFICATION: 'new_notification',  // 🌟 Phase 3
};