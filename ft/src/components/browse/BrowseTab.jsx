import React, { useState } from 'react';
import { Film, Users, Briefcase } from 'lucide-react';
import ProjectsList from '../projects/ProjectsList';
import MyProjects from '../projects/MyProjects';
import MyApplications from '../Applications/MyApplications';

/**
 * 🎬 BROWSE TAB - Shows projects, my projects, and applied roles
 */
const BrowseTab = () => {
  const [activeView, setActiveView] = useState('all-projects');

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setActiveView('all-projects')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeView === 'all-projects'
              ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Film className="w-5 h-5" />
          All Projects
        </button>
        <button
          onClick={() => setActiveView('my-projects')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeView === 'my-projects'
              ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Users className="w-5 h-5" />
          My Projects
        </button>
        <button
          onClick={() => setActiveView('applied-roles')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeView === 'applied-roles'
              ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          Applied Roles
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {activeView === 'all-projects' && <ProjectsList />}
        {activeView === 'my-projects' && <MyProjects />}
        {activeView === 'applied-roles' && <MyApplications />}
      </div>
    </div>
  );
};

export default BrowseTab;