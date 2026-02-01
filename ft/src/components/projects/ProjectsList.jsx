import React, { useState, useEffect } from 'react';
import { Search, Film } from 'lucide-react';
import { projectService } from '../../services/api';
import ProjectDetailModal from './ProjectDetailModal';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.searchProjects(searchQuery);
      setProjects(data.projects || data || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProjects();
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, description..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </form>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 mt-4">Loading projects...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border border-gray-100 hover:border-orange-200"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">by {project.creator_name || 'Unknown'}</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {project.status || 'active'}
                </span>
              </div>
              {project.roles && project.roles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.roles.slice(0, 3).map((role, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {role.name}
                    </span>
                  ))}
                  {project.roles.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      +{project.roles.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No projects found</p>
          <p className="text-gray-400 mt-2">Try a different search or check back later</p>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={loadProjects}
        />
      )}
    </div>
  );
};

export default ProjectsList;