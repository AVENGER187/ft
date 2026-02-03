import React, { useState } from 'react';
import { 
  Film, LogOut, User, Plus, 
  Bell, Settings as SettingsIcon,
  Search as SearchIcon, MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import Profile from '../components/profile/Profile';
import NotificationCenter from '../components/notifications/NotificationCenter';
import BrowseTab from '../components/browse/BrowseTab';
import CreateProject from '../components/projects/CreateProject';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'browse', label: 'Browse', icon: SearchIcon },
    { id: 'create-project', label: 'Create Project', icon: Plus },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">FilmCrew Platform</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name || user?.full_name || 'Filmmaker'}!</p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button
                onClick={() => navigate('/notifications')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="hidden sm:inline">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Chat */}
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                title="Chat"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden lg:inline">Chat</span>
              </button>

              {/* Settings */}
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                title="Settings"
              >
                <SettingsIcon className="w-5 h-5" />
                <span className="hidden lg:inline">Settings</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all relative ${
                    activeTab === tab.id
                      ? 'text-orange-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-t" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'browse' && <BrowseTab />}
        {activeTab === 'create-project' && <CreateProject />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  );
};

export default Dashboard;