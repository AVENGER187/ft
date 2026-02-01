import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Save, X, User, MapPin, FileText, Briefcase, Camera, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileService, skillsService, projectService, uploadService } from '../../services/api';
import RoleCategorization from './RoleCategorization';
import PreviousProjects from './PreviousProjects';
import CurrentWorkingProjects from './CurrentWorkingProjects';

/**
 * 🎭 ENHANCED PROFILE COMPONENT
 * Features:
 * - Profile Photo Upload
 * - Categorized Skills (Audio, Edit, Video)
 * - Previous Projects (Portfolio with YouTube links)
 * - Currently Working Projects
 */

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [workingProjects, setWorkingProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profession: '',
    city: '',
    state: '',
    country: '',
    years_of_experience: 0,
    previous_projects: '',
    portfolio_url: '',
    skill_ids: [],
    age: null,
    gender: null,
    is_actor: false,
    profile_photo_url: null,
    latitude: null,
    longitude: null,
    previous_work: [],
  });

  useEffect(() => {
    console.log('🔄 Profile component mounted');
    loadProfileData();
    loadSkills();
    loadWorkingProjects();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('❌ No access token found');
        setMessage({ 
          type: 'error', 
          text: 'Please login to view your profile' 
        });
        setIsLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      console.log('📊 Loading profile data...');
      const profileData = await profileService.getProfile();
      
      if (profileData) {
        console.log('✅ Profile found:', profileData);
        setProfile(profileData);
        
        let previousWork = [];
        if (profileData.previous_work) {
          try {
            previousWork = typeof profileData.previous_work === 'string' 
              ? JSON.parse(profileData.previous_work)
              : profileData.previous_work;
          } catch (e) {
            console.log('Could not parse previous_work:', e);
          }
        }
        
        setFormData({
          name: profileData.name || '',
          bio: profileData.bio || '',
          profession: profileData.profession || '',
          city: profileData.city || '',
          state: profileData.state || '',
          country: profileData.country || '',
          years_of_experience: profileData.years_of_experience || 0,
          previous_projects: profileData.previous_projects || '',
          portfolio_url: profileData.portfolio_url || '',
          skill_ids: (profileData.skills || []).map(s => s.id),
          age: profileData.age || null,
          gender: profileData.gender || null,
          is_actor: profileData.is_actor || false,
          profile_photo_url: profileData.profile_photo_url || null,
          latitude: profileData.latitude || null,
          longitude: profileData.longitude || null,
          previous_work: previousWork,
        });
        
        updateUser({ 
          ...profileData,
          hasProfile: true 
        });
      } else {
        console.log('ℹ️ No profile found - user needs to create one');
        setProfile(null);
        setIsEditing(true);
        setMessage({ 
          type: 'info', 
          text: 'Please create your profile to get started!' 
        });
      }
    } catch (error) {
      console.error('❌ Failed to load profile:', error);
      
      if (error.message.includes('user_id') || error.message.includes('Invalid token') || error.message.includes('401')) {
        setMessage({ 
          type: 'error', 
          text: 'Your session has expired. Please login again.' 
        });
        localStorage.clear();
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage({ 
          type: 'error', 
          text: `Failed to load profile: ${error.message}` 
        });
        setIsEditing(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadSkills = async () => {
    try {
      console.log('🎯 Loading skills...');
      const skillsData = await skillsService.listSkills();
      console.log('✅ Skills loaded:', skillsData);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
    } catch (error) {
      console.error('❌ Failed to load skills:', error);
      setSkills([]);
    }
  };

  const loadWorkingProjects = async () => {
    try {
      console.log('🎬 Loading working projects...');
      const data = await projectService.getWorkingProjects();
      console.log('✅ Working projects loaded:', data);
      setWorkingProjects(data.projects || data || []);
    } catch (error) {
      console.error('❌ Failed to load working projects:', error);
      setWorkingProjects([]);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setMessage({ type: '', text: '' });

    try {
      console.log('📤 Uploading profile photo...');
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await uploadService.uploadProfilePhoto(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('✅ Photo uploaded:', result);
      
      // Update form data with new photo URL
      const photoUrl = typeof result === 'string' ? result : result.url;
      setFormData(prev => ({
        ...prev,
        profile_photo_url: photoUrl
      }));

      // If profile exists, update it immediately
      if (profile) {
        const updatedProfile = await profileService.updateProfile({
          ...formData,
          profile_photo_url: photoUrl,
          previous_work: JSON.stringify(formData.previous_work)
        });
        setProfile(updatedProfile);
        updateUser({ ...updatedProfile, hasProfile: true });
      }

      setMessage({ type: 'success', text: 'Profile photo uploaded successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('❌ Photo upload failed:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload photo' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? (parseInt(value) || 0) : value),
    });
  };

  const handleSkillToggle = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skill_ids: prev.skill_ids.includes(skillId)
        ? prev.skill_ids.filter(id => id !== skillId)
        : [...prev.skill_ids, skillId]
    }));
  };

  const handlePreviousProjectsChange = (projects) => {
    setFormData(prev => ({
      ...prev,
      previous_work: projects
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.name || formData.name.trim().length === 0) {
      setMessage({ type: 'error', text: 'Name is required!' });
      setIsLoading(false);
      return;
    }

    try {
      console.log('💾 Saving profile...', formData);
      
      const dataToSend = {
        ...formData,
        previous_work: JSON.stringify(formData.previous_work)
      };
      
      let updatedProfile;
      if (profile) {
        updatedProfile = await profileService.updateProfile(dataToSend);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        console.log('✅ Profile updated:', updatedProfile);
      } else {
        updatedProfile = await profileService.createProfile(dataToSend);
        setMessage({ type: 'success', text: 'Profile created successfully!' });
        console.log('✅ Profile created:', updatedProfile);
      }
      
      setProfile(updatedProfile);
      updateUser({ 
        ...updatedProfile,
        hasProfile: true 
      });
      setIsEditing(false);
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('❌ Save error:', err);
      setMessage({ 
        type: 'error', 
        text: err.message || 'Failed to save profile' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      let previousWork = [];
      if (profile.previous_work) {
        try {
          previousWork = typeof profile.previous_work === 'string' 
            ? JSON.parse(profile.previous_work)
            : profile.previous_work;
        } catch (e) {
          console.log('Could not parse previous_work');
        }
      }

      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        profession: profile.profession || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        years_of_experience: profile.years_of_experience || 0,
        previous_projects: profile.previous_projects || '',
        portfolio_url: profile.portfolio_url || '',
        skill_ids: (profile.skills || []).map(s => s.id),
        age: profile.age || null,
        gender: profile.gender || null,
        is_actor: profile.is_actor || false,
        profile_photo_url: profile.profile_photo_url || null,
        latitude: profile.latitude || null,
        longitude: profile.longitude || null,
        previous_work: previousWork,
      });
      setIsEditing(false);
    }
    setMessage({ type: '', text: '' });
  };

  if (isLoading && !profile && !isEditing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-8 py-12 text-center relative">
          {/* Profile Photo */}
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg">
              {formData.profile_photo_url || profile?.profile_photo_url ? (
                <img
                  src={formData.profile_photo_url || profile?.profile_photo_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Upload photo"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-orange-500" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4 max-w-xs mx-auto">
              <div className="bg-white/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-white text-sm mt-1">{uploadProgress}% uploaded</p>
            </div>
          )}

          <h2 className="text-3xl font-bold text-white mb-2">
            {profile?.name || user?.name || 'Your Profile'}
          </h2>
          <p className="text-white/90">{user?.email || 'No email available'}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : message.type === 'info'
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Basic Information</h3>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4" />
                    Profession
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="e.g., Director, Cinematographer"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4" />
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Skills - Categorized */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Skills & Roles</h3>
                <RoleCategorization
                  skills={skills}
                  isEditing={true}
                  selectedSkills={formData.skill_ids}
                  onToggle={handleSkillToggle}
                />
              </div>

              {/* Previous Projects */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <PreviousProjects
                  projects={formData.previous_work}
                  isEditing={true}
                  onChange={handlePreviousProjectsChange}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? 'Saving...' : (profile ? 'Save Changes' : 'Create Profile')}
                </button>
                {profile && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {profile ? (
                <>
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <InfoField label="Name" value={profile.name} icon={User} />
                    <InfoField label="Profession" value={profile.profession} icon={Briefcase} />
                    <InfoField label="Bio" value={profile.bio} multiline icon={FileText} />
                    <InfoField 
                      label="Location" 
                      value={[profile.city, profile.state, profile.country].filter(Boolean).join(', ')} 
                      icon={MapPin}
                    />
                  </div>

                  {/* Skills - Categorized */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Skills & Roles</h3>
                      <RoleCategorization
                        skills={skills}
                        isEditing={false}
                        selectedSkills={profile.skills.map(s => s.id)}
                      />
                    </div>
                  )}

                  {/* Currently Working Projects */}
                  {workingProjects && workingProjects.length > 0 && (
                    <div className="pt-6 border-t border-gray-200">
                      <CurrentWorkingProjects projects={workingProjects} />
                    </div>
                  )}

                  {/* Previous Projects */}
                  {formData.previous_work && formData.previous_work.length > 0 && (
                    <div className="pt-6 border-t border-gray-200">
                      <PreviousProjects
                        projects={formData.previous_work}
                        isEditing={false}
                      />
                    </div>
                  )}

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit Profile
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No profile data found</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg"
                  >
                    Create Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Info Field Component
const InfoField = ({ icon: Icon, label, value, multiline }) => {
  if (!value || value === ', ') return null;
  
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      {multiline ? (
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="text-lg text-gray-800">{value}</p>
      )}
    </div>
  );
};

export default Profile;