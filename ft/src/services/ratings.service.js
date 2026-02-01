/**
 * Ratings Service
 * IMPORTANT: Backend endpoints for ratings don't exist yet
 * This is a mock implementation using localStorage
 * Replace with real API calls when backend is ready
 */

const STORAGE_KEY = 'filmcrew_ratings';

// Mock data generator
const generateMockRatings = (targetId) => {
  const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'];
  
  return Array.from({ length: 4 }, (_, i) => ({
    id: `rating_${targetId}_${i}`,
    target_id: targetId,
    target_type: 'project',
    user_id: `user_${i}`,
    user_name: names[i],
    rating: 4 + Math.floor(Math.random() * 2), // 4 or 5 stars
    comment: `Great project to work on! The team was professional and the experience was valuable.`,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    helpful_count: Math.floor(Math.random() * 5),
  }));
};

const calculateSummary = (ratings) => {
  if (ratings.length === 0) {
    return {
      average_rating: 0,
      total_ratings: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  ratings.forEach(r => {
    distribution[r.rating]++;
    sum += r.rating;
  });

  return {
    average_rating: sum / ratings.length,
    total_ratings: ratings.length,
    distribution
  };
};

export const ratingsService = {
  /**
   * Get ratings for a project
   * TODO: Replace with real API
   */
  getProjectRatings: async (projectId, limit = 20, offset = 0) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allRatings = stored ? JSON.parse(stored) : {};
      
      let ratings = allRatings[projectId] || generateMockRatings(projectId);
      
      // Save if new
      if (!allRatings[projectId]) {
        allRatings[projectId] = ratings;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allRatings));
      }
      
      return { 
        ratings: ratings.slice(offset, offset + limit)
      };
    } catch (error) {
      console.error('Failed to get project ratings:', error);
      return { ratings: [] };
    }
  },

  /**
   * Get ratings for a user
   * TODO: Replace with real API
   */
  getUserRatings: async (userId, limit = 20, offset = 0) => {
    try {
      // Mock implementation
      return { ratings: [] };
    } catch (error) {
      console.error('Failed to get user ratings:', error);
      return { ratings: [] };
    }
  },

  /**
   * Submit a rating
   * TODO: Replace with real API
   */
  submitRating: async (data) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allRatings = stored ? JSON.parse(stored) : {};
      
      const targetId = data.target_id;
      const ratings = allRatings[targetId] || [];
      
      const newRating = {
        id: `rating_${Date.now()}`,
        target_id: targetId,
        target_type: data.target_type || 'project',
        user_id: 'current_user',
        user_name: 'You',
        rating: data.rating,
        comment: data.comment,
        created_at: new Date().toISOString(),
        helpful_count: 0,
      };
      
      ratings.unshift(newRating);
      allRatings[targetId] = ratings;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allRatings));
      
      return newRating;
    } catch (error) {
      console.error('Failed to submit rating:', error);
      throw error;
    }
  },

  /**
   * Update a rating
   * TODO: Replace with real API
   */
  updateRating: async (ratingId, data) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allRatings = stored ? JSON.parse(stored) : {};
      
      // Find and update rating
      Object.keys(allRatings).forEach(targetId => {
        const index = allRatings[targetId].findIndex(r => r.id === ratingId);
        if (index !== -1) {
          allRatings[targetId][index] = {
            ...allRatings[targetId][index],
            ...data,
            edited_at: new Date().toISOString()
          };
        }
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allRatings));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update rating:', error);
      throw error;
    }
  },

  /**
   * Delete a rating
   * TODO: Replace with real API
   */
  deleteRating: async (ratingId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allRatings = stored ? JSON.parse(stored) : {};
      
      // Find and delete rating
      Object.keys(allRatings).forEach(targetId => {
        allRatings[targetId] = allRatings[targetId].filter(r => r.id !== ratingId);
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allRatings));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete rating:', error);
      throw error;
    }
  },

  /**
   * Get rating summary for a project
   * TODO: Replace with real API
   */
  getProjectRatingSummary: async (projectId) => {
    try {
      const { ratings } = await ratingsService.getProjectRatings(projectId);
      return calculateSummary(ratings);
    } catch (error) {
      console.error('Failed to get rating summary:', error);
      return { average_rating: 0, total_ratings: 0, distribution: {} };
    }
  },

  /**
   * Get rating summary for a user
   * TODO: Replace with real API
   */
  getUserRatingSummary: async (userId) => {
    try {
      const { ratings } = await ratingsService.getUserRatings(userId);
      return calculateSummary(ratings);
    } catch (error) {
      console.error('Failed to get user rating summary:', error);
      return { average_rating: 0, total_ratings: 0, distribution: {} };
    }
  },

  /**
   * Get user's own ratings
   * TODO: Replace with real API
   */
  getMyRatings: async () => {
    try {
      return { ratings: [] };
    } catch (error) {
      console.error('Failed to get my ratings:', error);
      return { ratings: [] };
    }
  },

  /**
   * Check if user can rate
   * TODO: Replace with real API
   */
  canRate: async (projectId, userId) => {
    try {
      return { can_rate: true };
    } catch (error) {
      console.error('Failed to check if can rate:', error);
      return { can_rate: false };
    }
  },

  /**
   * Report a rating
   * TODO: Replace with real API
   */
  reportRating: async (ratingId, reason) => {
    try {
      console.log('Rating reported:', ratingId, reason);
      return { success: true };
    } catch (error) {
      console.error('Failed to report rating:', error);
      throw error;
    }
  },
};

/**
 * TODO FOR BACKEND DEVELOPER:
 * 
 * Create these endpoints:
 * 
 * GET    /ratings/projects/{id}        - Get project ratings
 * GET    /ratings/users/{id}           - Get user ratings  
 * POST   /ratings/submit               - Submit rating
 * PUT    /ratings/{id}                 - Update rating
 * DELETE /ratings/{id}                 - Delete rating
 * GET    /ratings/projects/{id}/summary - Rating summary
 * GET    /ratings/users/{id}/summary   - User rating summary
 * GET    /ratings/my-ratings           - User's own ratings
 * GET    /ratings/can-rate             - Check if can rate
 * POST   /ratings/{id}/report          - Report rating
 */