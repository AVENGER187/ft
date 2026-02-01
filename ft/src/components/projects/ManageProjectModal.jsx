import React, { useState, useEffect } from 'react';
import { X, Check, XCircle, Users, User, MapPin, Briefcase, ExternalLink, Settings } from 'lucide-react';
import { applicationService, managementService } from '../../services/api';

/**
 * 🎬 ENHANCED MANAGE PROJECT MODAL
 * - Shows detailed applicant information
 * - Clickable profiles
 * - Project status management
 * - Role-wise filled info
 */
const ManageProjectModal = ({ project, onClose, onUpdate }) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(project.status || 'active');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await applicationService.getProjectApplications(project.id);
      setApplications(data.applications || data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (applicationId) => {
    try {
      setError('');
      await applicationService.acceptApplication(applicationId);
      setSuccess('Application accepted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      loadApplications();
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || 'Failed to accept application');
    }
  };

  const handleReject = async (applicationId) => {
    try {
      setError('');
      await applicationService.rejectApplication(applicationId);
      setSuccess('Application rejected');
      setTimeout(() => setSuccess(''), 3000);
      loadApplications();
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || 'Failed to reject application');
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === project.status) return;
    
    setIsUpdatingStatus(true);
    try {
      await managementService.updateProjectStatus(project.id, selectedStatus);
      setSuccess('Project status updated!');
      setTimeout(() => setSuccess(''), 3000);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const openProfile = (userId) => {
    // Open user profile in new tab or navigate
    window.open(`/profile/${userId}`, '_blank');
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');

  // Calculate role-wise filled info
  const roleStats = {};
  if (project.roles) {
    project.roles.forEach(role => {
      const accepted = acceptedApplications.filter(app => app.role_id === role.id).length;
      roleStats[role.id] = {
        filled: accepted,
        total: role.slots_available || role.required,
        title: role.role_title || role.name
      };
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto my-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {project.name || project.title}
              </h2>
              <p className="text-gray-600">Manage Applications & Team</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Project Status Management */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Project Status</h3>
            </div>
            <div className="flex gap-3 items-center">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="draft">📝 Draft</option>
                <option value="active">✅ Active (Recruiting)</option>
                <option value="in_progress">🎬 In Progress (Filming)</option>
                <option value="completed">🎉 Completed</option>
                <option value="archived">📦 Archived</option>
              </select>
              {selectedStatus !== project.status && (
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdatingStatus}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              )}
            </div>
          </div>

          {/* Role Stats */}
          {Object.keys(roleStats).length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Role Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.values(roleStats).map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                    <span className="font-medium text-gray-700">{stat.title}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${stat.filled >= stat.total ? 'text-green-600' : 'text-orange-600'}`}>
                        {stat.filled} / {stat.total}
                      </span>
                      {stat.filled >= stat.total && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Filled</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Applications */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-yellow-600" />
              🟡 Pending Applications ({pendingApplications.length})
            </h3>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : pendingApplications.length > 0 ? (
              <div className="space-y-3">
                {pendingApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-yellow-50 border-2 border-yellow-200 rounded-xl hover:border-yellow-300 transition-all"
                  >
                    <div className="flex-1">
                      {/* Applicant Info */}
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 bg-yellow-200 rounded-lg">
                          <User className="w-5 h-5 text-yellow-700" />
                        </div>
                        <div className="flex-1">
                          <button
                            onClick={() => openProfile(app.user_id)}
                            className="text-lg font-bold text-gray-800 hover:text-orange-600 transition-colors flex items-center gap-1 group"
                          >
                            {app.user_name || app.applicant_name}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {app.role_title || app.role_name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="ml-11 space-y-1">
                        {app.applicant_location && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {app.applicant_location}
                          </div>
                        )}
                        
                        {app.applicant_skills && app.applicant_skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {app.applicant_skills.slice(0, 4).map((skill, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {app.applicant_portfolio_url && (
                          <a
                            href={app.applicant_portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                          >
                            🎬 View Portfolio
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          Applied: {new Date(app.applied_at || app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 md:flex-col lg:flex-row">
                      <button
                        onClick={() => handleAccept(app.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                      >
                        <Check className="w-5 h-5" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No pending applications</p>
              </div>
            )}
          </div>

          {/* Accepted Members */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Check className="w-6 h-6 text-green-600" />
              🟢 Team Members ({acceptedApplications.length})
            </h3>
            {acceptedApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {acceptedApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 bg-green-50 border-2 border-green-200 rounded-xl hover:border-green-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <button
                        onClick={() => openProfile(app.user_id)}
                        className="font-bold text-gray-800 hover:text-green-600 transition-colors flex items-center gap-1 group"
                      >
                        {app.user_name || app.applicant_name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                        Member
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {app.role_title || app.role_name}
                    </p>
                    {app.applicant_portfolio_url && (
                      <a
                        href={app.applicant_portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                      >
                        🎬 Portfolio
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No team members yet</p>
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Description</h3>
            <p className="text-gray-600 leading-relaxed mb-4">{project.description}</p>
            
            {project.project_type && (
              <div className="mb-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {project.project_type.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProjectModal;