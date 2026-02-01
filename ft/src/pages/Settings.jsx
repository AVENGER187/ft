import React, { useState } from 'react';
import { User, Bell, Lock, Palette, Globe } from 'lucide-react';
import NotificationSettings from '../components/notifications/NotificationSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-xl shadow-md p-4 h-fit">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Settings</h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            )}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Privacy Settings</h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            )}
            {activeTab === 'appearance' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Appearance</h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            )}
            {activeTab === 'language' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Language Settings</h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
