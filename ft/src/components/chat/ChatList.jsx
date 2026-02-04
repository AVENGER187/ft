import React, { useEffect } from 'react';
import { MessageSquare, Search } from 'lucide-react';
import { useChat } from '../../hooks/phase2-hooks';

const ChatList = ({ onSelectRoom, selectedRoomId }) => {
  const { rooms, isLoading, loadRooms } = useChat();
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const filteredRooms = rooms.filter((room) =>
    room.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedRoomId === room.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-lg">
                  {room.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {room.name || 'Unknown User'}
                  </h3>
                  {room.last_message_time && (
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatTime(room.last_message_time)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {room.last_message || 'No messages yet'}
                </p>
              </div>

              {/* Unread Badge */}
              {room.unread_count > 0 && (
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full flex-shrink-0">
                  {room.unread_count}
                </span>
              )}
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-gray-400">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p className="text-center">No conversations yet</p>
            <p className="text-sm text-center mt-2">
              {searchQuery ? 'Try a different search' : 'Start chatting with project members'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;