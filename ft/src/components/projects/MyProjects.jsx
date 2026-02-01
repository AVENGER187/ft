import React, { useState, useEffect } from 'react';
import { Plus, Film, Users, Clock, CheckCircle } from 'lucide-react';
import { projectService } from '../../services/api';
import CreateProjectModal from './CreateProjectModal';
import ManageProjectModal from './ManageProjectModal';

/**
 * 🎬 MY PROJECTS - ENHANCED
 * Shows projects created by user with application counts
 */
const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getMyProjects();
      setProjects(data.projects || data || []);
    } catch (error) {
      console.error('Failed to load my projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = () => {
    setShowCreateModal(false);
    loadProjects();
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
          <p className="text-gray-600">Projects you've created</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Project
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 mt-4">Loading your projects...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const pendingCount = project.pending_applications_count || 0;
            const acceptedCount = project.accepted_members_count || 0;
            
            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border-2 border-orange-100 hover:border-orange-300 relative"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {(project.status || 'active').replace('_', ' ')}
                  </span>
                </div>

                {/* Project Title */}
                <div className="mb-4 pr-20">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {project.name || project.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Project Type */}
                {project.project_type && (
                  <div className="mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {project.project_type.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  {/* Pending Applications */}
                  {pendingCount > 0 && (
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700">
                          Pending Applications
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-yellow-600 text-white rounded-full text-xs font-bold">
                        {pendingCount}
                      </span>
                    </div>
                  )}

                  {/* Accepted Members */}
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Team Members
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
                      {acceptedCount}
                    </span>
                  </div>

                  {/* Total Roles */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Total Roles
                    </span>
                    <span className="font-medium">
                      {project.roles?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="mt-4 text-center">
                  <span className="text-xs text-gray-500">Click to manage →</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Film className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-xl mb-2">No projects yet</p>
          <p className="text-gray-400 mb-6">Create your first project and start building your crew!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg"
          >
            Create Your First Project
          </button>
        </div>
      )}

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleProjectCreated}
        />
      )}

      {selectedProject && (
        <ManageProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={loadProjects}
        />
      )}
    </div>
  );
};

export default MyProjects;