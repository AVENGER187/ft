/**
 * Application Constants
 * Centralized configuration for API, WebSocket, routes, and app settings
 */

// ============================================
// API Configuration
// ============================================
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔌 WebSocket Base URL:', WS_BASE_URL);

// ============================================
// Application Routes
// ============================================
export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PROJECTS: '/projects',
  MY_PROJECTS: '/my-projects',
  WORKING_PROJECTS: '/working-projects',
  PROJECT_DETAIL: '/projects/:id',
  CREATE_PROJECT: '/create-project',
  MESSAGES: '/messages',
  CHAT: '/chat',
  CHAT_ROOM: '/chat/:projectId',
  SEARCH: '/search',
  NOTIFICATIONS: '/notifications',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
};

// ============================================
// API Endpoints
// ============================================
export const API_ENDPOINTS = {
  // ──────────────────────────────────────────
  // Auth
  // ──────────────────────────────────────────
  SIGNUP_SEND_OTP: '/auth/signup/send-otp',
  SIGNUP_VERIFY_OTP: '/auth/signup/verify-otp',
  LOGIN: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh',
  RESET_PASSWORD_SEND_OTP: '/auth/reset-password/send-otp',
  RESET_PASSWORD: '/auth/reset-password',
  
  // ──────────────────────────────────────────
  // Profile
  // ──────────────────────────────────────────
  GET_PROFILE: '/profile/me',
  CREATE_PROFILE: '/profile/create',
  UPDATE_PROFILE: '/profile/update',
  
  // ──────────────────────────────────────────
  // Skills
  // ──────────────────────────────────────────
  LIST_SKILLS: '/skills/list',
  CREATE_SKILL: '/skills/create',
  GET_SKILL: '/skills/:id',
  
  // ──────────────────────────────────────────
  // Projects
  // ──────────────────────────────────────────
  CREATE_PROJECT: '/projects/create',
  GET_PROJECT: '/projects/:id',
  MY_PROJECTS: '/projects/my/projects',
  WORKING_PROJECTS: '/projects/my/working',
  
  // ──────────────────────────────────────────
  // Search
  // ──────────────────────────────────────────
  SEARCH_PROJECTS: '/search/projects',
  SEARCH_USERS: '/search/users',
  
  // ──────────────────────────────────────────
  // Applications
  // ──────────────────────────────────────────
  APPLY_TO_ROLE: '/applications/apply',
  MY_APPLICATIONS: '/applications/my',
  GET_PROJECT_APPLICATIONS: '/applications/project/:projectId',
  ACCEPT_APPLICATION: '/applications/accept/:applicationId',
  REJECT_APPLICATION: '/applications/reject/:applicationId',
  
  // ──────────────────────────────────────────
  // Project Management
  // ──────────────────────────────────────────
  UPDATE_PROJECT_STATUS: '/management/project/:projectId/status',
  GET_PROJECT_MEMBERS: '/management/project/:projectId/members',
  PROMOTE_MEMBER: '/management/project/:projectId/member/:userId/promote',
  REMOVE_MEMBER: '/management/project/:projectId/member/:userId',
  
  // ──────────────────────────────────────────
  // Chat (REST API)
  // ──────────────────────────────────────────
  CHAT_MESSAGES: '/chat/messages/:projectId',
  DELETE_MESSAGE: '/chat/message/:messageId',
  
  // ──────────────────────────────────────────
  // Upload
  // ──────────────────────────────────────────
  UPLOAD_PROFILE_PHOTO: '/upload/profile-photo',
  UPLOAD_PORTFOLIO: '/upload/portfolio',
  
  // ──────────────────────────────────────────
  // 🌟 Phase 3 - Notifications (Future)
  // ──────────────────────────────────────────
  GET_NOTIFICATIONS: '/notifications',
  UNREAD_COUNT: '/notifications/unread-count',
  MARK_AS_READ: '/notifications/:id/read',
  NOTIFICATION_SETTINGS: '/notifications/settings',
  
  // ──────────────────────────────────────────
  // 🌟 Phase 3 - Analytics (Future)
  // ──────────────────────────────────────────
  DASHBOARD_STATS: '/analytics/dashboard',
  PROJECT_ANALYTICS: '/analytics/projects/:id',
  USER_ANALYTICS: '/analytics/user',
  PLATFORM_STATS: '/analytics/platform',
  
  // ──────────────────────────────────────────
  // 🌟 Phase 3 - Ratings (Future)
  // ──────────────────────────────────────────
  GET_RATINGS: '/ratings/projects/:id',
  SUBMIT_RATING: '/ratings/submit',
  RATING_SUMMARY: '/ratings/projects/:id/summary',
};

// ============================================
// WebSocket Configuration
// ============================================
export const WS_CONFIG = {
  // Base URL
  BASE_URL: WS_BASE_URL,
  
  // Reconnection settings
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY_MS: 2000,
  
  // Keep-alive settings
  HEARTBEAT_INTERVAL_MS: 30000,
  CONNECTION_TIMEOUT_MS: 60000,
};

// ============================================
// WebSocket Events
// ============================================
export const WS_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  RECONNECT: 'reconnect',
  
  // Room management
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  
  // Messaging
  NEW_MESSAGE: 'new_message',
  SEND_MESSAGE: 'send_message',
  MESSAGE_DELETED: 'message_deleted',
  MESSAGE_EDITED: 'message_edited',
  
  // Typing indicators
  TYPING: 'typing',
  USER_TYPING: 'user_typing',
  STOP_TYPING: 'stop_typing',
  
  // Read receipts
  MESSAGE_READ: 'message_read',
  MESSAGES_READ: 'messages_read',
  
  // 🌟 Phase 3 - Future events
  NEW_NOTIFICATION: 'new_notification',
  USER_STATUS_CHANGE: 'user_status_change',
  PROJECT_UPDATE: 'project_update',
};

// ============================================
// File Upload Configuration
// ============================================
export const UPLOAD_CONFIG = {
  // Size limits (in bytes)
  MAX_FILE_SIZE: 50 * 1024 * 1024,        // 50MB (for videos/large files)
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,        // 5MB (for images)
  MAX_PROFILE_PHOTO_SIZE: 2 * 1024 * 1024, // 2MB (for profile photos)
  
  // Allowed types
  ALLOWED_IMAGE_TYPES: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
  ],
  
  ALLOWED_VIDEO_TYPES: [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
  ],
  
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  
  ALLOWED_PORTFOLIO_TYPES: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'application/pdf',
  ],
};

// ============================================
// Project Status Enums (MUST match backend)
// ============================================
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  SHELVED: 'shelved',
  DISPOSED: 'disposed',
  DEAD: 'dead',
};

export const PROJECT_STATUS_LABELS = {
  active: '✅ Active (Recruiting)',
  completed: '🎉 Completed',
  shelved: '📦 Shelved (On Hold)',
  disposed: '🗑️ Disposed',
  dead: '💀 Dead (Cancelled)',
};

// ============================================
// Application Status Enums
// ============================================
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const APPLICATION_STATUS_LABELS = {
  pending: '⏳ Pending',
  accepted: '✅ Accepted',
  rejected: '❌ Rejected',
};

// ============================================
// Project Type Enums
// ============================================
export const PROJECT_TYPE = {
  SHORT_FILM: 'short_film',
  FEATURE_FILM: 'feature_film',
  SERIES: 'series',
  DOCUMENTARY: 'documentary',
  MUSIC_VIDEO: 'music_video',
  COMMERCIAL: 'commercial',
  OTHER: 'other',
};

export const PROJECT_TYPE_LABELS = {
  short_film: '🎬 Short Film',
  feature_film: '🎥 Feature Film',
  series: '📺 Series',
  documentary: '📹 Documentary',
  music_video: '🎵 Music Video',
  commercial: '📢 Commercial',
  other: '🎞️ Other',
};

// ============================================
// Payment Type Enums
// ============================================
export const PAYMENT_TYPE = {
  PAID: 'paid',
  UNPAID: 'unpaid',
  NEGOTIABLE: 'negotiable',
};

export const PAYMENT_TYPE_LABELS = {
  paid: '💰 Paid',
  unpaid: '🆓 Unpaid',
  negotiable: '💬 Negotiable',
};

// ============================================
// Member Role Enums
// ============================================
export const MEMBER_ROLE = {
  ADMIN: 'admin',
  PARENT: 'parent',
  CHILD: 'child',
};

export const MEMBER_ROLE_LABELS = {
  admin: '👑 Admin',
  parent: '👨‍💼 Parent',
  child: '👤 Member',
};

// ============================================
// Gender Enums
// ============================================
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
};

export const GENDER_LABELS = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  prefer_not_to_say: 'Prefer not to say',
};

// ============================================
// UI Configuration
// ============================================
export const UI_CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Chat
  CHAT_MESSAGES_PER_PAGE: 50,
  TYPING_TIMEOUT_MS: 3000,
  
  // Search
  SEARCH_DEBOUNCE_MS: 500,
  MIN_SEARCH_LENGTH: 2,
  
  // Notifications
  NOTIFICATION_DISPLAY_TIME_MS: 5000,
  
  // Auto-refresh intervals
  NOTIFICATIONS_REFRESH_MS: 60000, // 1 minute
  MESSAGES_REFRESH_MS: 30000,      // 30 seconds
};

// ============================================
// Validation Rules
// ============================================
export const VALIDATION = {
  // Auth
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  OTP_LENGTH: 6,
  
  // Profile
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 255,
  BIO_MAX_LENGTH: 1000,
  
  // Projects
  PROJECT_NAME_MIN_LENGTH: 1,
  PROJECT_NAME_MAX_LENGTH: 500,
  PROJECT_DESCRIPTION_MAX_LENGTH: 5000,
  
  // Skills
  SKILL_NAME_MAX_LENGTH: 255,
  
  // Messages
  MESSAGE_MIN_LENGTH: 1,
  MESSAGE_MAX_LENGTH: 5000,
};

// ============================================
// Error Messages
// ============================================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized. Please login again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  WEBSOCKET_ERROR: 'Real-time connection error. Messages may be delayed.',
};

// ============================================
// Success Messages
// ============================================
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PROJECT_CREATED: 'Project created successfully!',
  APPLICATION_SENT: 'Application sent successfully!',
  MESSAGE_SENT: 'Message sent!',
  FILE_UPLOADED: 'File uploaded successfully!',
};

// ============================================
// Default Values
// ============================================
export const DEFAULTS = {
  PROFILE_PHOTO: '/assets/default-avatar.png',
  PROJECT_THUMBNAIL: '/assets/default-project.png',
  LOCATION: {
    CITY: null,
    STATE: null,
    COUNTRY: null,
    LATITUDE: null,
    LONGITUDE: null,
  },
};

// ============================================
// Local Storage Keys
// ============================================
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent_searches',
  DRAFT_MESSAGES: 'draft_messages',
};

// ============================================
// Feature Flags
// ============================================
export const FEATURES = {
  CHAT_ENABLED: true,
  NOTIFICATIONS_ENABLED: false,    // 🌟 Phase 3
  ANALYTICS_ENABLED: false,        // 🌟 Phase 3
  RATINGS_ENABLED: false,          // 🌟 Phase 3
  VIDEO_CALLS_ENABLED: false,      // 🌟 Future
  SCREEN_SHARING_ENABLED: false,   // 🌟 Future
};

// ============================================
// Export all as default object
// ============================================
export default {
  API_BASE_URL,
  WS_BASE_URL,
  ROUTES,
  API_ENDPOINTS,
  WS_CONFIG,
  WS_EVENTS,
  UPLOAD_CONFIG,
  PROJECT_STATUS,
  PROJECT_STATUS_LABELS,
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
  PROJECT_TYPE,
  PROJECT_TYPE_LABELS,
  PAYMENT_TYPE,
  PAYMENT_TYPE_LABELS,
  MEMBER_ROLE,
  MEMBER_ROLE_LABELS,
  GENDER,
  GENDER_LABELS,
  UI_CONFIG,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULTS,
  STORAGE_KEYS,
  FEATURES,
};