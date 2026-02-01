import { apiCall } from './api';

/**
 * Search Service - Adapted to match actual backend endpoints
 * Backend has: /search/projects and /search/users
 */
export const searchService = {
  /**
   * Search projects with filters
   * Matches backend: GET /search/projects
   */
  searchProjects: async (params) => {
    try {
      const queryParams = new URLSearchParams();

      // Backend accepts: skill_id, project_type, latitude, longitude, max_distance_km
      if (params.skill_id) queryParams.append('skill_id', params.skill_id);
      if (params.project_type) queryParams.append('project_type', params.project_type);
      if (params.latitude) queryParams.append('latitude', params.latitude);
      if (params.longitude) queryParams.append('longitude', params.longitude);
      if (params.max_distance_km) queryParams.append('max_distance_km', params.max_distance_km);

      const queryString = queryParams.toString();
      const endpoint = `/search/projects${queryString ? `?${queryString}` : ''}`;
      
      console.log('🔍 Searching projects:', endpoint);
      const response = await apiCall(endpoint);
      
      // Backend returns array directly
      return {
        projects: Array.isArray(response) ? response : (response.projects || []),
        total: response.length || 0
      };
    } catch (error) {
      console.error('Failed to search projects:', error);
      return { projects: [], total: 0 };
    }
  },

  /**
   * Search users with filters
   * Matches backend: GET /search/users
   */
  searchUsers: async (params) => {
    try {
      const queryParams = new URLSearchParams();

      // Backend accepts: name, profession, skill_id, latitude, longitude, max_distance_km
      if (params.name) queryParams.append('name', params.name);
      if (params.profession) queryParams.append('profession', params.profession);
      if (params.skill_id) queryParams.append('skill_id', params.skill_id);
      if (params.latitude) queryParams.append('latitude', params.latitude);
      if (params.longitude) queryParams.append('longitude', params.longitude);
      if (params.max_distance_km) queryParams.append('max_distance_km', params.max_distance_km);

      const queryString = queryParams.toString();
      const endpoint = `/search/users${queryString ? `?${queryString}` : ''}`;
      
      console.log('🔍 Searching users:', endpoint);
      const response = await apiCall(endpoint);
      
      // Backend returns array directly
      return {
        users: Array.isArray(response) ? response : (response.users || []),
        total: response.length || 0
      };
    } catch (error) {
      console.error('Failed to search users:', error);
      return { users: [], total: 0 };
    }
  },

  /**
   * Get all available skills
   * Uses existing skills endpoint
   */
  getSkills: async () => {
    try {
      return await apiCall('/skills/list');
    } catch (error) {
      console.error('Failed to get skills:', error);
      return [];
    }
  },

  /**
   * Get popular skills
   * Mock implementation - backend doesn't have this endpoint
   */
  getPopularSkills: async (limit = 20) => {
    try {
      // Get all skills and return first N as "popular"
      const skills = await apiCall('/skills/list');
      const skillsArray = Array.isArray(skills) ? skills : (skills.skills || []);
      
      return {
        skills: skillsArray.slice(0, limit).map(s => s.name)
      };
    } catch (error) {
      console.error('Failed to get popular skills:', error);
      return { skills: [] };
    }
  },

  /**
   * Get search suggestions (autocomplete)
   * Mock implementation - backend doesn't have this endpoint
   */
  getSearchSuggestions: async (query, type = 'projects') => {
    try {
      // For now, return empty - could implement client-side filtering
      console.log('Search suggestions not implemented on backend');
      return { suggestions: [] };
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return { suggestions: [] };
    }
  },

  /**
   * Get location suggestions
   * Mock implementation - backend doesn't have this endpoint
   */
  getLocationSuggestions: async (query) => {
    try {
      console.log('Location suggestions not implemented on backend');
      return { locations: [] };
    } catch (error) {
      console.error('Failed to get location suggestions:', error);
      return { locations: [] };
    }
  },

  /**
   * Get recent searches
   * Client-side implementation using localStorage
   */
  getRecentSearches: async () => {
    try {
      const stored = localStorage.getItem('recent_searches');
      const searches = stored ? JSON.parse(stored) : [];
      return { searches };
    } catch (error) {
      console.error('Failed to get recent searches:', error);
      return { searches: [] };
    }
  },

  /**
   * Save search query
   * Client-side implementation using localStorage
   */
  saveSearch: async (query, filters) => {
    try {
      const stored = localStorage.getItem('recent_searches');
      const searches = stored ? JSON.parse(stored) : [];
      
      // Add new search at the beginning
      searches.unshift({
        id: Date.now().toString(),
        query,
        filters,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 10 searches
      const updated = searches.slice(0, 10);
      
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error('Failed to save search:', error);
      throw error;
    }
  },

  /**
   * Delete recent search
   * Client-side implementation
   */
  deleteRecentSearch: async (searchId) => {
    try {
      const stored = localStorage.getItem('recent_searches');
      const searches = stored ? JSON.parse(stored) : [];
      
      const updated = searches.filter(s => s.id !== searchId);
      
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete recent search:', error);
      throw error;
    }
  },
};

/**
 * BACKEND ENDPOINTS AVAILABLE:
 * ✅ GET /search/projects - Search projects
 * ✅ GET /search/users    - Search users
 * 
 * BACKEND ENDPOINTS NEEDED:
 * ❌ GET /search/suggestions      - Autocomplete suggestions
 * ❌ GET /search/locations        - Location suggestions
 * ❌ GET /search/popular-skills   - Popular skills with counts
 */