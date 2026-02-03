import React from 'react';
import { MapPin, Briefcase, Award, Eye } from 'lucide-react';

const UserSearchResults = ({ users, loading, onUserClick }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No users found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Found {users.length} {users.length === 1 ? 'user' : 'users'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserClick && onUserClick(user)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border-2 border-transparent hover:border-orange-400"
          >
            {/* User Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                {user.profile_photo_url ? (
                  <img
                    src={user.profile_photo_url}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {user.name}
                </h3>
                {user.profession && (
                  <div className="flex items-center gap-1 text-sm text-orange-600 mt-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">{user.profession}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {(user.city || user.state || user.country) && (
              <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                <span className="line-clamp-1">
                  {[user.city, user.state, user.country].filter(Boolean).join(', ')}
                </span>
                {user.distance_km !== undefined && user.distance_km !== null && (
                  <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                    {user.distance_km.toFixed(1)} km
                  </span>
                )}
              </div>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {user.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium"
                    >
                      {typeof skill === 'object' ? skill.name : skill}
                    </span>
                  ))}
                  {user.skills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      +{user.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* View Profile Button */}
            <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearchResults;