import React from 'react';
import { MapPin, Film, Users, Eye, Calendar } from 'lucide-react';

const ProjectSearchResults = ({ projects, loading, onProjectClick }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Film className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No projects found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  const formatProjectType = (type) => {
    if (!type) return 'Unknown';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Found {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onProjectClick && onProjectClick(project)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-orange-400"
          >
            {/* Project Header with Gradient */}
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Film className="w-6 h-6 text-white" />
                </div>
                {project.project_type && (
                  <span className="px-3 py-1 bg-white text-orange-600 rounded-full text-xs font-bold uppercase tracking-wide">
                    {formatProjectType(project.project_type)}
                  </span>
                )}
              </div>
            </div>

            {/* Project Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                {project.name}
              </h3>

              {project.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
              )}

              {/* Location */}
              {(project.city || project.state || project.country) && (
                <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                  <span className="flex-1 line-clamp-1">
                    {[project.city, project.state, project.country].filter(Boolean).join(', ')}
                  </span>
                  {project.distance_km !== undefined && project.distance_km !== null && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                      {project.distance_km.toFixed(1)} km
                    </span>
                  )}
                </div>
              )}

              {/* Open Roles */}
              {project.roles && project.roles.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>Open Roles ({project.roles.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.roles.slice(0, 3).map((role, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium"
                      >
                        {role.role_name || role.name || 'Role'}
                      </span>
                    ))}
                    {project.roles.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        +{project.roles.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* View Project Button */}
              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                View Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSearchResults;