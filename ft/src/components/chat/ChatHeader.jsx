import React from 'react';
import { X, MoreVertical, Phone, Video } from 'lucide-react';

const ChatHeader = ({ room, onClose, wsStatus = 'disconnected' }) => {
  const getStatusColor = () => {
    switch (wsStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
      case 'authenticating':
        return 'text-yellow-600';
      case 'disconnected':
      case 'error':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (wsStatus) {
      case 'connected':
        return '● Live';
      case 'connecting':
        return '○ Connecting...';
      case 'authenticating':
        return '○ Authenticating...';
      case 'disconnected':
        return '○ Offline';
      case 'error':
        return '○ Error';
      default:
        return '○ Offline';
    }
  };

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
          <p className={`text-xs ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Call">
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Video">
          <Video className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="More">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;