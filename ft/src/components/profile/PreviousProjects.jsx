import React, { useState } from 'react';
import { Plus, Trash2, Youtube, ExternalLink } from 'lucide-react';

/**
 * 🎬 PREVIOUS PROJECTS COMPONENT
 * Manage portfolio of completed work with YouTube links
 */

const PreviousProjects = ({ projects = [], isEditing, onChange }) => {
  const [localProjects, setLocalProjects] = useState(projects);

  const addProject = () => {
    const newProject = {
      id: Date.now(), // Temporary ID
      title: '',
      role: '',
      year: new Date().getFullYear(),
      youtube_url: '',
      description: ''
    };
    const updated = [...localProjects, newProject];
    setLocalProjects(updated);
    if (onChange) onChange(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...localProjects];
    updated[index][field] = value;
    setLocalProjects(updated);
    if (onChange) onChange(updated);
  };

  const removeProject = (index) => {
    const updated = localProjects.filter((_, i) => i !== index);
    setLocalProjects(updated);
    if (onChange) onChange(updated);
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            🎥 Previous Projects / Portfolio
          </h3>
          <button
            type="button"
            onClick={addProject}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        {localProjects.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Youtube className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No previous projects added yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Project" to showcase your work</p>
          </div>
        ) : (
          <div className="space-y-4">
            {localProjects.map((project, index) => (
              <div key={project.id || index} className="p-4 border-2 border-gray-200 rounded-lg space-y-3 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        placeholder="Short Film - Mystery"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Role *
                      </label>
                      <input
                        type="text"
                        value={project.role}
                        onChange={(e) => updateProject(index, 'role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        placeholder="Director, Editor, etc."
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Youtube className="w-4 h-4 text-red-600" />
                      YouTube URL *
                    </label>
                    <input
                      type="url"
                      value={project.youtube_url}
                      onChange={(e) => updateProject(index, 'youtube_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={project.year}
                      onChange={(e) => updateProject(index, 'year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                    placeholder="Brief description of the project..."
                  />
                </div>

                {/* Preview */}
                {project.youtube_url && extractYouTubeId(project.youtube_url) && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Preview:</p>
                    <div className="relative rounded-lg overflow-hidden">
                      <img 
                        src={getYouTubeThumbnail(project.youtube_url)} 
                        alt="Video thumbnail"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <Youtube className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // View Mode
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Youtube className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No previous projects to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🎥 Previous Projects / Portfolio
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => {
          const thumbnail = getYouTubeThumbnail(project.youtube_url);
          
          return (
            <a
              key={project.id || index}
              href={project.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 hover:shadow-lg transition-all"
            >
              {/* Thumbnail */}
              {thumbnail ? (
                <div className="relative h-48 overflow-hidden bg-gray-900">
                  <img 
                    src={thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Youtube className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <Youtube className="w-16 h-16 text-gray-500" />
                </div>
              )}

              {/* Info */}
              <div className="p-4">
                <h4 className="font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors flex items-center justify-between">
                  {project.title}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="font-medium text-orange-600">{project.role}</span>
                  {project.year && (
                    <>
                      <span>•</span>
                      <span>{project.year}</span>
                    </>
                  )}
                </div>

                {project.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default PreviousProjects;