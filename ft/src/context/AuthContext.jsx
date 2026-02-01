import React, { createContext, useState, useEffect, useContext } from 'react';
import { profileService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  /**
   * ✅ Check if JWT token is valid (not expired)
   */
  const isTokenValid = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // seconds → ms
      return Date.now() < expiryTime;
    } catch (error) {
      return false;
    }
  };

  /**
   * Initialize auth - runs ONCE on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 AuthProvider initializing...');

      const token = localStorage.getItem('access_token');

      // ❌ No token or expired token
      if (!token || !isTokenValid()) {
        console.log('❌ Token missing or expired');
        localStorage.clear();
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log('✅ Valid token found');

      try {
        // Load stored user
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser({ authenticated: true });
        }

        // Try loading profile (non-blocking)
        try {
          await loadProfile();
        } catch {
          console.log('ℹ️ Profile not loaded during init');
        }
      } catch (error) {
        console.error('❌ Auth init error:', error);
        setUser({ authenticated: true });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Load user profile from backend
   */
  const loadProfile = async () => {
    setProfileLoading(true);
    try {
      console.log('👤 Loading profile...');
      const profileData = await profileService.getProfile();

      if (profileData) {
        console.log('✅ Profile loaded:', profileData);
        setProfile(profileData);

        setUser(prev => ({
          ...prev,
          name: profileData.name,
          email: profileData.email || prev?.email,
          profile_photo_url: profileData.profile_photo_url,
          profession: profileData.profession,
          hasProfile: true,
        }));

        const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}');
        localStorage.setItem(
          'user_data',
          JSON.stringify({
            ...currentUser,
            name: profileData.name,
            profile_photo_url: profileData.profile_photo_url,
            profession: profileData.profession,
            hasProfile: true,
          })
        );
      } else {
        setProfile(null);
        setUser(prev => ({ ...prev, hasProfile: false }));
      }
    } catch (error) {
      console.log('ℹ️ Profile error:', error.message);
      setProfile(null);
      setUser(prev => ({ ...prev, hasProfile: false }));
    } finally {
      setProfileLoading(false);
    }
  };

  /**
   * Login
   */
  const login = async (access_token, refresh_token, userData = {}) => {
    console.log('🔐 LOGIN');

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    const newUser = {
      authenticated: true,
      timestamp: new Date().toISOString(),
      ...userData,
    };

    localStorage.setItem('user_data', JSON.stringify(newUser));
    setUser(newUser);

    try {
      await loadProfile();
    } catch {
      console.log('ℹ️ Profile not loaded during login');
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    console.log('🚪 LOGOUT');
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setProfile(null);
  };

  /**
   * Update user
   */
  const updateUser = userData => {
    setUser(prev => {
      const updatedUser = { ...prev, ...userData };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  /**
   * Update profile
   */
  const updateProfile = profileData => {
    setProfile(profileData);

    setUser(prev => ({
      ...prev,
      name: profileData.name,
      profile_photo_url: profileData.profile_photo_url,
      profession: profileData.profession,
      hasProfile: true,
    }));

    const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}');
    localStorage.setItem(
      'user_data',
      JSON.stringify({
        ...currentUser,
        name: profileData.name,
        profile_photo_url: profileData.profile_photo_url,
        profession: profileData.profession,
        hasProfile: true,
      })
    );
  };

  /**
   * Refresh profile
   */
  const refreshProfile = async () => {
    await loadProfile();
  };

  const value = {
    user,
    profile,
    loading,
    profileLoading,
    login,
    logout,
    updateUser,
    updateProfile,
    refreshProfile,
    isAuthenticated: !!user && user.authenticated === true,
    hasProfile: profile !== null || user?.hasProfile === true,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;