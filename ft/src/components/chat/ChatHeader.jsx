import React from 'react';
import { X, MoreVertical, Phone, Video } from 'lucide-react';

const ChatHeader = ({ room, onClose }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {room.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-gray-800">{room.name || 'Unknown User'}</h3>
          <p className="text-sm text-green-600">● Online</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Video className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
