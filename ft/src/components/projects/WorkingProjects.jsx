import React, { useState, useEffect } from 'react';
import { Film, Briefcase, Users, Calendar } from 'lucide-react';
import { projectService } from '../../services/api';

/**
 * 🎬 WORKING PROJECTS COMPONENT
 * Shows projects where the user is an accepted team member
 */
const WorkingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkingProjects();
  }, []);

  const loadWorkingProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getWorkingProjects();
      setProjects(data.projects || data || []);
    } catch (error) {
      console.error('Failed to load working projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      active: 'bg-green-100 text-green-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-purple-100 text-purple-700',
      archived: 'bg-gray-100 text-gray-500',
    };
    return colors[status] || colors.active;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Projects I'm Working On</h2>
        <p className="text-gray-600">Projects where you're a team member</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 mt-4">Loading your projects...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-blue-100 hover:border-blue-300 relative"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {(project.status || 'active').replace('_', ' ')}
                </span>
              </div>

              {/* Project Info */}
              <div className="mb-4 pr-20">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {project.name || project.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Creator Info */}
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Created by {project.creator_name || 'Unknown'}</span>
              </div>

              {/* My Role */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">My Role:</span>
                  <span className="text-sm font-bold text-blue-900">
                    {project.my_role || 'Team Member'}
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                {project.project_type && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {project.project_type.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {project.estimated_completion && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due:
                    </span>
                    <span className="font-medium text-gray-800">
                      {new Date(project.estimated_completion).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {project.team_size && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Team:
                    </span>
                    <span className="font-medium text-gray-800">
                      {project.team_size} members
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <Film className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl mb-2">Not working on any projects yet</p>
          <p className="text-gray-400">Apply to projects to join teams!</p>
        </div>
      )}
    </div>
  );
};

export default WorkingProjects;