import React, { useState } from 'react';
import { Film, Briefcase } from 'lucide-react';
import MyProjects from './MyProjects_Enhanced';
import WorkingProjects from './WorkingProjects';

/**
 * 🎬 PROJECTS DASHBOARD
 * Unified view with tabs for:
 * - My Projects (Created)
 * - Projects I'm Working On (Member)
 */
const ProjectsDashboard = () => {
  const [activeTab, setActiveTab] = useState('owned'); // 'owned' or 'working'

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('owned')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'owned'
                  ? 'text-orange-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Film className="w-5 h-5" />
              My Projects
              {activeTab === 'owned' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('working')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'working'
                  ? 'text-orange-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Projects I'm Working On
              {activeTab === 'working' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'owned' ? (
          <MyProjects />
        ) : (
          <WorkingProjects />
        )}
      </div>
    </div>
  );
};

export default ProjectsDashboard;