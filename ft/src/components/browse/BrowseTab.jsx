import React, { useState, useEffect, useCallback } from 'react';
import { Film, Users, Briefcase, Search, MapPin, Filter, X } from 'lucide-react';
import MyProjects from '../projects/MyProjects';
import MyApplications from '../Applications/MyApplications';
import ProjectDetailModal from '../projects/ProjectDetailModal';
import { searchService } from '../../services/search.service';
import { useNavigate } from 'react-router-dom';

/**
 * 🎬 BROWSE TAB - DASHBOARD STYLE
 * ✅ Toggle between "Search Projects" and "Search Users"
 * ✅ Filter buttons for project types and user roles
 * ✅ Clickable cards that open modals/navigate
 */
const BrowseTab = () => {
  const navigate = useNavigate();
  
  // Main view state
  const [activeView, setActiveView] = useState('all-projects');
  
  // Browse type toggle (projects or users)
  const [browseType, setBrowseType] = useState('projects');
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [skills, setSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Project type filter
  const [projectTypeFilter, setProjectTypeFilter] = useState('all');
  
  // User role filter
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  
  // Data states
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  
  // Selected project for modal
  const [selectedProject, setSelectedProject] = useState(null);

  // Load skills once
  useEffect(() => {
    searchService.getSkills().then(data => {
      setSkills(Array.isArray(data) ? data : []);
    });
  }, []);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const params = {};
      if (selectedSkillId) params.skill_id = selectedSkillId;
      if (projectTypeFilter !== 'all') params.project_type = projectTypeFilter;
      
      const { projects: list } = await searchService.searchProjects(params);
      setProjects(list);
    } catch (e) {
      console.error('Failed to search projects', e);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }, [selectedSkillId, projectTypeFilter]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params = {};
      if (selectedSkillId) params.skill_id = selectedSkillId;
      if (searchQuery.trim()) params.name = searchQuery.trim();
      if (userRoleFilter !== 'all') params.profession = userRoleFilter;
      
      const { users: list } = await searchService.searchUsers(params);
      setUsers(list);
    } catch (e) {
      console.error('Failed to search users', e);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, [selectedSkillId, searchQuery, userRoleFilter]);

  // Re-fetch when filters change
  useEffect(() => {
    if (activeView === 'all-projects' && browseType === 'projects') {
      fetchProjects();
    }
  }, [activeView, browseType, fetchProjects]);

  useEffect(() => {
    if (activeView === 'all-projects' && browseType === 'users') {
      fetchUsers();
    }
  }, [activeView, browseType, fetchUsers]);

  // Client-side text filter for projects
  const filteredProjects = searchQuery.trim()
    ? projects.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  // Handlers
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleUserClick = (user) => {
    navigate(`/profile/${user.user_id || user.id}`);
  };

  const handleBrowseTypeChange = (type) => {
    setBrowseType(type);
    setSearchQuery('');
    setProjectTypeFilter('all');
    setUserRoleFilter('all');
  };

  // Project types and user roles
  const projectTypes = ['short_film', 'feature_film', 'web_series', 'music_video', 'documentary', 'commercial', 'tv_series'];
  const userRoles = ['Director', 'Producer', 'Actor', 'Cinematographer', 'Editor', 'Writer', 'Sound Designer', 'Composer'];

  const showBrowseContent = activeView === 'all-projects';

  return (
    <div className="space-y-6">
      {/* View Toggle Buttons */}
      <div className="flex gap-3 flex-wrap">
        {[
          { id: 'all-projects', label: 'All Projects', icon: Film },
          { id: 'my-projects',  label: 'My Projects',  icon: Briefcase },
          { id: 'applied-roles',label: 'Applied Roles',icon: Briefcase },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveView(id);
              setSearchQuery('');
              setProjectTypeFilter('all');
              setUserRoleFilter('all');
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeView === id
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Browse Content */}
      {showBrowseContent && (
        <div className="space-y-6">
          {/* Search Projects / Search Users Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => handleBrowseTypeChange('projects')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  browseType === 'projects'
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-orange-100 border border-gray-200'
                }`}
              >
                Search Projects
              </button>
              <button
                onClick={() => handleBrowseTypeChange('users')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  browseType === 'users'
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-orange-100 border border-gray-200'
                }`}
              >
                Search Users
              </button>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border-2 border-orange-300 text-gray-700 hover:bg-orange-50 transition"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              {browseType === 'projects' && (
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setProjectTypeFilter('all')} 
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      projectTypeFilter === 'all' 
                        ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-orange-100 border border-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {projectTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setProjectTypeFilter(type)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        projectTypeFilter === type 
                         ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                         : 'bg-white text-gray-700 hover:bg-orange-100 border border-gray-200'
                      }`}
                    >
                      {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              )}
              {browseType === 'users' && (
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setUserRoleFilter('all')} 
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      userRoleFilter === 'all' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All
                  </button>
                  {userRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        userRoleFilter === role 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${browseType}...`}
              className="w-full px-6 py-4 rounded-lg border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-lg"
            />
          </div>

          {/* Results */}
          {browseType === 'projects' ? (
            <ProjectsSearchView
              projects={filteredProjects}
              loading={projectsLoading}
              onProjectClick={handleProjectClick}
            />
          ) : (
            <UsersSearchView
              users={users}
              loading={usersLoading}
              onUserClick={handleUserClick}
            />
          )}
        </div>
      )}

      {/* My Projects Tab */}
      {activeView === 'my-projects' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <MyProjects />
        </div>
      )}

      {/* Applied Roles Tab */}
      {activeView === 'applied-roles' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <MyApplications />
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={fetchProjects}
        />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Project Cards View
   ───────────────────────────────────────────────────────── */
const ProjectsSearchView = ({ projects, loading, onProjectClick }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-md">
        <Film className="w-16 h-16 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-600">No projects found</h3>
        <p className="text-sm text-gray-400">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} onClick={onProjectClick} />
      ))}
    </div>
  );
};

const ProjectCard = ({ project, onClick }) => (
  <div
    onClick={() => onClick(project)}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-orange-300"
  >
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
      <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold whitespace-nowrap ml-2">
        {project.project_type?.replace(/_/g, ' ')}
      </span>
    </div>
    <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
      {(project.city || project.country) && (
        <span className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {[project.city, project.state, project.country].filter(Boolean).join(', ')}
        </span>
      )}
      {project.creator_name && (
        <span className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {project.creator_name}
        </span>
      )}
    </div>
    {project.roles && project.roles.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-4">
        {project.roles.slice(0, 3).map((role, idx) => (
          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            {role.role_title || role.name}
          </span>
        ))}
        {project.roles.length > 3 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            +{project.roles.length - 3} more
          </span>
        )}
      </div>
    )}
    <button className="
  w-full py-2
  bg-gradient-to-r from-orange-400 to-yellow-400
  text-white
  rounded-lg
  font-semibold
  shadow-md
  hover:from-orange-500 hover:to-yellow-500
  transition-all
">
  View Details
</button>
  </div>
);

/* ─────────────────────────────────────────────────────────
   User Cards View
   ───────────────────────────────────────────────────────── */
const UsersSearchView = ({ users, loading, onUserClick }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-md">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-600">No users found</h3>
        <p className="text-sm text-gray-400">Try a different name or role</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {users.map(user => (
        <UserCard key={user.id} user={user} onClick={onUserClick} />
      ))}
    </div>
  );
};

const UserCard = ({ user, onClick }) => (
  <div
    onClick={() => onClick(user)}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition text-center cursor-pointer border-2 border-transparent hover:border-orange-300"
  >
    <div className="mb-3">
      {user.profile_photo_url ? (
        <img 
          src={user.profile_photo_url} 
          alt={user.name}
          className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-orange-100"
        />
      ) : (
        <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white text-4xl font-bold">
          {user.name?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-1">{user.name}</h3>
    {user.profession && (
      <p className="text-orange-600 font-semibold mb-2">{user.profession}</p>
    )}
    {(user.city || user.country) && (
      <p className="text-sm text-gray-500 mb-3">
        {[user.city, user.state, user.country].filter(Boolean).join(', ')}
      </p>
    )}
    {user.skills && user.skills.length > 0 && (
      <div className="flex justify-center flex-wrap gap-2 mb-4">
        {user.skills.slice(0, 3).map((skill, idx) => (
          <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
            {typeof skill === 'string' ? skill : skill.name}
          </span>
        ))}
        {user.skills.length > 3 && (
          <span className="text-xs text-gray-400">+{user.skills.length - 3} more</span>
        )}
      </div>
    )}
    <button className="
  w-full py-2
  bg-gradient-to-r from-orange-400 to-yellow-400
  text-white
  rounded-lg
  font-semibold
  shadow-md
  hover:from-orange-500 hover:to-yellow-500
  transition-all
">
  View Profile
</button>

  </div>
);

export default BrowseTab;