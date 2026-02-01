import { API_BASE_URL } from '../utils/constants';

/* ======================================================
   🔄 TOKEN REFRESH MANAGEMENT
====================================================== */

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const attemptTokenRefresh = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => resolve(token));
    });
  }

  isRefreshing = true;

  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    const newToken = data.access_token;

    localStorage.setItem('access_token', newToken);
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    isRefreshing = false;
    onRefreshed(newToken);

    return newToken;
  } catch (error) {
    isRefreshing = false;
    localStorage.clear();
    window.location.href = '/login';
    throw error;
  }
};

/* ======================================================
   🌐 MAIN API CALL
====================================================== */

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    console.log(`🌐 API Call: ${options.method || 'GET'} ${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      console.error(`❌ API Error [${response.status}]`, data);

      // 🔄 AUTO REFRESH TOKEN ONCE
      if (response.status === 401 && !endpoint.includes('/auth/')) {
        try {
          console.log('🔄 Attempting token refresh...');
          const newToken = await attemptTokenRefresh();

          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });

          if (retryResponse.ok) {
            return await retryResponse.json();
          }
        } catch {
          throw new Error('Session expired. Please login again.');
        }
      }

      if (response.status === 404) {
        throw new Error('Resource not found');
      }

      if (response.status === 422) {
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            const messages = data.detail.map(err =>
              typeof err === 'string' ? err : err.msg || JSON.stringify(err)
            ).join(', ');
            throw new Error(`Validation error: ${messages}`);
          }
          throw new Error(data.detail);
        }
      }

      if (response.status === 500) {
        if (data.detail?.includes('user_id')) {
          throw new Error('User ID missing or invalid. Please login again.');
        }
        throw new Error(data.detail || 'Internal server error');
      }

      throw new Error(data.detail || `Request failed (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error('❌ API Error:', error.message);
    throw error;
  }
};

/* ======================================================
   🔐 AUTH SERVICES
====================================================== */

export const authService = {
  sendOTP: (email, password) =>
    apiCall('/auth/signup/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  verifyOTP: (email, otp) =>
    apiCall(`/auth/signup/verify-otp/${encodeURIComponent(email)}`, {
      method: 'POST',
      body: JSON.stringify({ otp }),
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

/* ======================================================
   👤 PROFILE SERVICES
====================================================== */

export const profileService = {
  getProfile: async () => {
    try {
      return await apiCall('/profile/me');
    } catch (error) {
      if (error.message.includes('not found')) return null;
      throw error;
    }
  },

  createProfile: (data) =>
    apiCall('/profile/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProfile: (data) =>
    apiCall('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

/* ======================================================
   📽️ PROJECT SERVICES (ENHANCED)
====================================================== */

export const projectService = {
  createProject: (data) =>
    apiCall('/projects/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProject: (id) => apiCall(`/projects/${id}`),

  getMyProjects: () => apiCall('/projects/my/projects'),

  // FIXED: Changed from /projects/working to /projects/my/working
  getWorkingProjects: () => apiCall('/projects/my/working'),

  searchProjects: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/search/projects${params ? `?${params}` : ''}`);
  },
};

/* ======================================================
   🔍 SEARCH SERVICES
====================================================== */

export const searchService = {
  searchUsers: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/search/users${params ? `?${params}` : ''}`);
  },
};

/* ======================================================
   📥 APPLICATION SERVICES (ENHANCED)
====================================================== */

export const applicationService = {
  // Apply to a role
  applyToRole: (role_id, cover_letter = '') =>
    apiCall('/applications/apply', {
      method: 'POST',
      body: JSON.stringify({ role_id, cover_letter }),
    }),

  // Get my applications (user side)
  getMyApplications: () => apiCall('/applications/my'),

  // Get applications for a specific project (creator side)
  getProjectApplications: (project_id) =>
    apiCall(`/applications/project/${project_id}`),

  // FIXED: Accept an application
  acceptApplication: (application_id) =>
    apiCall(`/applications/accept/${application_id}`, {
      method: 'POST',
    }),

  // FIXED: Reject an application
  rejectApplication: (application_id) =>
    apiCall(`/applications/reject/${application_id}`, {
      method: 'POST',
    }),
};

/* ======================================================
   🛠️ PROJECT MANAGEMENT SERVICES (NEW)
====================================================== */

export const managementService = {
  // Update project status
  updateProjectStatus: (project_id, status) =>
    apiCall(`/management/project/${project_id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Get project members
  getProjectMembers: (project_id) =>
    apiCall(`/management/project/${project_id}/members`),

  // Promote/demote member
  promoteMember: (project_id, user_id, member_role) =>
    apiCall(`/management/project/${project_id}/member/${user_id}/promote`, {
      method: 'PUT',
      body: JSON.stringify({ member_role }),
    }),

  // Remove member
  removeMember: (project_id, user_id) =>
    apiCall(`/management/project/${project_id}/member/${user_id}`, {
      method: 'DELETE',
    }),
};

/* ======================================================
   🛠️ SKILLS SERVICES
====================================================== */

export const skillsService = {
  listSkills: (category = null) =>
    apiCall(category ? `/skills/list?category=${category}` : '/skills/list'),
};

/* ======================================================
   💬 CHAT SERVICES (NEW)
====================================================== */

export const chatService = {
  // Get chat messages for a project
  getMessages: (project_id, limit = 50) =>
    apiCall(`/chat/messages/${project_id}?limit=${limit}`),

  // Delete a message
  deleteMessage: (message_id) =>
    apiCall(`/chat/message/${message_id}`, {
      method: 'DELETE',
    }),

  // Note: Sending messages will be handled via WebSocket when implemented
  // For now, this is a placeholder
  sendMessage: async (project_id, content) => {
    console.warn('⚠️ Send message via WebSocket not yet implemented');
    // This would use WebSocket when backend supports it
    return {
      id: Date.now().toString(),
      project_id,
      content,
      sent_at: new Date().toISOString(),
    };
  },
};

/* ======================================================
   📤 UPLOAD SERVICES (ENHANCED)
====================================================== */

export const uploadService = {
  // Upload profile photo
  uploadProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/upload/profile-photo`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  },

  // Upload portfolio file
  uploadPortfolio: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/upload/portfolio`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  },
};

/* ======================================================
   📦 EXPORT ALL
====================================================== */

export default {
  authService,
  profileService,
  projectService,
  searchService,
  applicationService,
  managementService,
  skillsService,
  chatService,
  uploadService,
};