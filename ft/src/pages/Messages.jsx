import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useWebSocket } from '../hooks/phase2-hooks';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

const Messages = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { connected } = useWebSocket();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="flex h-full">
            {/* Chat List */}
            <ChatList
              onSelectRoom={setSelectedRoom}
              selectedRoomId={selectedRoom?.id}
            />

            {/* Chat Window */}
            {selectedRoom ? (
              <ChatWindow
                room={selectedRoom}
                onClose={() => setSelectedRoom(null)}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                <MessageSquare className="w-20 h-20 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a conversation from the left to start messaging
                </p>
                {!connected && (
                  <p className="mt-4 text-sm text-orange-600">
                    Connecting to chat server...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;