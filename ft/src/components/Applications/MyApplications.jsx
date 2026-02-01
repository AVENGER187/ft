import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, CheckCircle, XCircle, Film, ExternalLink, Calendar, User, MessageSquare } from 'lucide-react';

import { applicationService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

/**
 * 📋 MY APPLICATIONS COMPONENT - ENHANCED
 * Shows all roles the user has applied to with status tracking
 */
const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await applicationService.getMyApplications();
      console.log('📋 Applications loaded:', data);
      setApplications(data.applications || data || []);
    } catch (error) {
      console.error('❌ Failed to load applications:', error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const handleViewProject = (projectId) => {
    if (projectId) {
      // Navigate to project details - adjust based on your routing
      console.log('Viewing project:', projectId);
      // navigate(`/project/${projectId}`);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Applied Roles</h2>
        <p className="text-gray-600">Track all your project role applications and their status</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          All ({counts.all})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            filter === 'pending'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending ({counts.pending})
        </button>
        <button
          onClick={() => setFilter('accepted')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            filter === 'accepted'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Accepted ({counts.accepted})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
            filter === 'rejected'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <XCircle className="w-4 h-4" />
          Rejected ({counts.rejected})
        </button>
      </div>

      {/* Statistics Cards */}
      {!isLoading && applications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Applications</p>
                <p className="text-2xl font-bold text-blue-900">{counts.all}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{counts.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Accepted</p>
                <p className="text-2xl font-bold text-green-900">{counts.accepted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{counts.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 mt-4">Loading your applications...</p>
        </div>
      ) : filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-2 border-gray-100 hover:border-orange-200"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[250px]">
                  {/* Project Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg">
                      <Film className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {app.project_name || 'Untitled Project'}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-medium text-lg">{app.role_title || app.role_name}</span>
                      </div>
                      {app.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                      <Calendar className="w-3 h-3" />
                      Applied: {formatDate(app.applied_at || app.created_at)}
                    </span>
                    {app.project_type && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
                        {app.project_type.replace('_', ' ')}
                      </span>
                    )}
                    {app.creator_name && (
                      <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                        <User className="w-3 h-3" />
                        By: {app.creator_name}
                      </span>
                    )}
                  </div>

                  {/* Cover Letter */}
                  {app.cover_letter && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-1">Your Cover Letter:</p>
                      <p className="text-sm text-gray-700 italic">"{app.cover_letter}"</p>
                    </div>
                  )}
                </div>

                {/* Status Section */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(app.status)}
                    {getStatusBadge(app.status)}
                  </div>
                  
                  {app.project_id && (
  <button
    onClick={() => handleViewProject(app.project_id)}
    className="flex items-center gap-1 px-3 py-1 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all"
  >
    View Project
    <ExternalLink className="w-3 h-3" />
  </button>
)}

{/* ✅ ADD THIS BLOCK RIGHT HERE */}
{app.status === 'accepted' && app.project_id && (
  <button
    onClick={() => navigate(`/chat/${app.project_id}`)}
    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-all text-sm font-medium"
  >
    <MessageSquare className="w-4 h-4" />
    Chat with Team
  </button>
)}

                </div>
              </div>

              {/* Status Messages */}
              {app.status === 'accepted' && (
                <div className="mt-4 pt-4 border-t border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 font-semibold">
                      Congratulations! You've been accepted for this role. 🎉
                    </p>
                  </div>
                  <p className="text-green-600 text-sm mt-1 ml-7">
                    The project creator will contact you with next steps.
                  </p>
                </div>
              )}
              
              {app.status === 'rejected' && (
                <div className="mt-4 pt-4 border-t border-red-200 bg-gradient-to-r from-red-50 to-pink-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 font-medium">
                      Thank you for your interest.
                    </p>
                  </div>
                  <p className="text-red-600 text-sm mt-1 ml-7">
                    Unfortunately, this position has been filled. Keep applying to other exciting projects!
                  </p>
                </div>
              )}

              {app.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <p className="text-yellow-700 font-medium">
                      Your application is being reviewed
                    </p>
                  </div>
                  <p className="text-yellow-600 text-sm mt-1 ml-7">
                    The project creator will review your application soon. Hang tight!
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300">
          <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl font-semibold mb-2">
            {filter === 'all' 
              ? 'No applications yet' 
              : `No ${filter} applications`}
          </p>
          <p className="text-gray-400 mb-6">
            {filter === 'all'
              ? 'Start applying to projects to build your filmmaking network!'
              : `You don't have any ${filter} applications at the moment.`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => {/* Navigate to browse projects */}}
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg"
            >
              Browse Available Projects
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyApplications;