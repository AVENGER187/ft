import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analytics.service';
import { ratingsService } from '../services/ratings.service';
// ============================================
// useAnalytics Hook
// ============================================
export const useAnalytics = (type = 'dashboard') => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAnalytics = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      
      switch (type) {
        case 'dashboard':
          result = await analyticsService.getDashboardStats();
          break;
        case 'project':
          result = await analyticsService.getProjectAnalytics(params.projectId);
          break;
        case 'user':
          result = await analyticsService.getUserAnalytics();
          break;
        case 'platform':
          result = await analyticsService.getPlatformStats();
          break;
        default:
          result = await analyticsService.getDashboardStats();
      }

      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    data,
    isLoading,
    error,
    reload: loadAnalytics,
  };
};

// ============================================
// useRatings Hook
// ============================================
export const useRatings = (targetId, targetType = 'project') => {
  const [ratings, setRatings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRatings = useCallback(async () => {
    if (!targetId) return;

    setIsLoading(true);
    setError(null);

    try {
      let ratingsData, summaryData;

      if (targetType === 'project') {
        ratingsData = await ratingsService.getProjectRatings(targetId);
        summaryData = await ratingsService.getProjectRatingSummary(targetId);
      } else {
        ratingsData = await ratingsService.getUserRatings(targetId);
        summaryData = await ratingsService.getUserRatingSummary(targetId);
      }

      setRatings(ratingsData.ratings || []);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [targetId, targetType]);

  const submitRating = useCallback(async (ratingData) => {
    try {
      const result = await ratingsService.submitRating({
        ...ratingData,
        target_id: targetId,
        target_type: targetType,
      });
      
      await loadRatings();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [targetId, targetType, loadRatings]);

  const updateRating = useCallback(async (ratingId, ratingData) => {
    try {
      const result = await ratingsService.updateRating(ratingId, ratingData);
      await loadRatings();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadRatings]);

  const deleteRating = useCallback(async (ratingId) => {
    try {
      await ratingsService.deleteRating(ratingId);
      await loadRatings();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadRatings]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  return {
    ratings,
    summary,
    isLoading,
    error,
    submitRating,
    updateRating,
    deleteRating,
    reload: loadRatings,
  };
};

// ============================================
// usePermissions Hook
// ============================================
export const usePermissions = (projectId) => {
  const [permissions, setPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const checkPermission = useCallback((action) => {
    return permissions[action] || false;
  }, [permissions]);

  const loadPermissions = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      // This would come from your backend
      // For now, we'll simulate
      const userRole = 'owner'; // or 'member', 'viewer'
      
      const rolePermissions = {
        owner: {
          edit: true,
          delete: true,
          invite: true,
          remove_members: true,
          manage_roles: true,
        },
        member: {
          edit: false,
          delete: false,
          invite: true,
          remove_members: false,
          manage_roles: false,
        },
        viewer: {
          edit: false,
          delete: false,
          invite: false,
          remove_members: false,
          manage_roles: false,
        },
      };

      setPermissions(rolePermissions[userRole] || {});
    } catch (error) {
      console.error('Failed to load permissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  return {
    permissions,
    checkPermission,
    isLoading,
  };
};
