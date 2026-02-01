/**
 * Analytics Service
 * IMPORTANT: Backend endpoints for analytics don't exist yet
 * This is a mock implementation with sample data
 * Replace with real API calls when backend is ready
 */

// Mock data generators
const generateMockDashboardStats = () => ({
  total_projects: 24,
  active_members: 156,
  completed_projects: 18,
  success_rate: 89,
  project_growth: [
    { month: 'Jan', value: 400 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 600 },
    { month: 'Apr', value: 800 },
    { month: 'May', value: 500 },
    { month: 'Jun', value: 700 },
  ],
  applications_by_status: [
    { status: 'Pending', count: 45 },
    { status: 'Accepted', count: 78 },
    { status: 'Rejected', count: 23 },
  ],
  projects_by_status: [
    { name: 'Active', value: 45 },
    { name: 'Completed', value: 30 },
    { name: 'Cancelled', value: 10 },
  ],
  popular_skills: [
    { name: 'Cinematography', count: 45 },
    { name: 'Editing', count: 38 },
    { name: 'Sound Design', count: 32 },
    { name: 'Directing', count: 28 },
    { name: 'Producing', count: 25 },
  ],
});

const generateMockProjectAnalytics = (projectId) => ({
  project_id: projectId,
  total_applications: 23,
  accepted_applications: 8,
  pending_applications: 10,
  team_size: 12,
  completion_percentage: 65,
  days_active: 45,
  activity_timeline: [
    { date: '2025-01-01', applications: 5, messages: 12 },
    { date: '2025-01-08', applications: 3, messages: 18 },
    { date: '2025-01-15', applications: 6, messages: 24 },
    { date: '2025-01-22', applications: 9, messages: 30 },
  ],
});

const generateMockUserAnalytics = () => ({
  total_applications: 15,
  accepted_applications: 8,
  projects_worked_on: 5,
  completion_rate: 87,
  average_rating: 4.6,
  skills_used: ['Cinematography', 'Editing', 'Color Grading'],
  activity_last_30_days: 42,
});

export const analyticsService = {
  /**
   * Get dashboard overview stats
   * TODO: Replace with real API when backend endpoint exists
   */
  getDashboardStats: async () => {
    try {
      console.log('📊 Using mock analytics data');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return generateMockDashboardStats();
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get project analytics
   * TODO: Replace with real API
   */
  getProjectAnalytics: async (projectId) => {
    try {
      console.log('📊 Using mock project analytics data');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return generateMockProjectAnalytics(projectId);
    } catch (error) {
      console.error('Failed to get project analytics:', error);
      throw error;
    }
  },

  /**
   * Get user analytics
   * TODO: Replace with real API
   */
  getUserAnalytics: async () => {
    try {
      console.log('📊 Using mock user analytics data');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return generateMockUserAnalytics();
    } catch (error) {
      console.error('Failed to get user analytics:', error);
      throw error;
    }
  },

  /**
   * Get application statistics
   * TODO: Replace with real API
   */
  getApplicationStats: async (timeRange = '30d') => {
    try {
      return {
        total: 150,
        pending: 45,
        accepted: 78,
        rejected: 27,
        acceptance_rate: 52,
      };
    } catch (error) {
      console.error('Failed to get application stats:', error);
      throw error;
    }
  },

  /**
   * Get platform statistics
   * TODO: Replace with real API
   */
  getPlatformStats: async () => {
    try {
      return {
        total_users: 1542,
        total_projects: 342,
        active_projects: 156,
        total_applications: 2341,
        success_rate: 87,
      };
    } catch (error) {
      console.error('Failed to get platform stats:', error);
      throw error;
    }
  },

  /**
   * Get trending projects
   * TODO: Replace with real API
   */
  getTrendingProjects: async (limit = 10) => {
    try {
      return {
        projects: [
          { id: '1', name: 'Indie Horror Short', trend_score: 95 },
          { id: '2', name: 'Documentary Series', trend_score: 88 },
          { id: '3', name: 'Music Video Project', trend_score: 82 },
        ].slice(0, limit)
      };
    } catch (error) {
      console.error('Failed to get trending projects:', error);
      throw error;
    }
  },

  /**
   * Get popular skills
   * TODO: Replace with real API
   */
  getPopularSkills: async (limit = 20) => {
    try {
      return generateMockDashboardStats().popular_skills.slice(0, limit);
    } catch (error) {
      console.error('Failed to get popular skills:', error);
      throw error;
    }
  },
};

/**
 * TODO FOR BACKEND DEVELOPER:
 * 
 * Create these endpoints:
 * 
 * GET /analytics/dashboard           - Dashboard overview
 * GET /analytics/projects/{id}       - Project analytics
 * GET /analytics/user                - User analytics
 * GET /analytics/applications        - Application stats
 * GET /analytics/platform            - Platform-wide stats
 * GET /analytics/trending/projects   - Trending projects
 * GET /analytics/popular-skills      - Popular skills
 */