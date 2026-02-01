import React from 'react';
import { Film, Briefcase, Clock, CheckCircle, Pause } from 'lucide-react';

/**
 * 🎬 CURRENT WORKING PROJECTS COMPONENT
 * Displays ongoing projects user is working on (auto-populated from accepted applications)
 */

const CurrentWorkingProjects = ({ projects = [] }) => {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'in_progress':
      case 'filming':
        return <Film className="w-4 h-4 text-blue-600" />;
      case 'post_production':
      case 'editing':
        return <Pause className="w-4 h-4 text-purple-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'in_progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'filming': 'bg-blue-100 text-blue-700 border-blue-200',
      'post_production': 'bg-purple-100 text-purple-700 border-purple-200',
      'editing': 'bg-purple-100 text-purple-700 border-purple-200',
      'completed': 'bg-green-100 text-green-700 border-green-200',
      'active': 'bg-orange-100 text-orange-700 border-orange-200',
      'draft': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[status?.toLowerCase()] || colors.active;
  };

  const formatStatus = (status) => {
    if (!status) return 'Active';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
        <Film className="w-16 h-16 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-1">Not currently working on any projects</p>
        <p className="text-sm text-gray-500">
          Projects you're accepted into will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🎬 Currently Working On
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <div
            key={project.id || index}
            className="bg-white border-2 border-blue-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800 mb-1">
                  {project.project_name || project.name}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {project.description}
                </p>
              </div>
              <div className="flex-shrink-0 ml-2">
                {getStatusIcon(project.status)}
              </div>
            </div>

            {/* Role Badge */}
            <div className="mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-lg">
                <Briefcase className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">
                  {project.my_role || project.role_title || 'Team Member'}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {formatStatus(project.status)}
              </span>
            </div>

            {/* Additional Info */}
            {project.project_type && (
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Type:</span>
                <span className="font-medium">{project.project_type.replace('_', ' ')}</span>
              </div>
            )}

            {project.creator_name && (
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>Director:</span>
                <span className="font-medium">{project.creator_name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentWorkingProjects;