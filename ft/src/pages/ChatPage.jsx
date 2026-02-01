import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

/**
 * 💬 CHAT PAGE
 * Main chat interface with conversation list and chat window
 */
const ChatPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Check if we need to auto-select a room based on URL param
    if (projectId && !selectedRoom) {
      setSelectedRoom({ id: projectId, project_id: projectId });
    }
  }, [projectId]);

  useEffect(() => {
    // Handle mobile responsiveness
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    // Update URL without navigation
    if (room?.id) {
      window.history.pushState(null, '', `/chat/${room.id}`);
    }
  };

  const handleCloseChat = () => {
    setSelectedRoom(null);
    if (window.history.state) {
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                <p className="text-sm text-gray-600">Chat with your project teams</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
          <div className="flex h-full">
            {/* Chat List - Hide on mobile when chat is open */}
            {(!isMobileView || !selectedRoom) && (
              <ChatList
                onSelectRoom={handleSelectRoom}
                selectedRoomId={selectedRoom?.id}
              />
            )}

            {/* Chat Window - Show when room selected */}
            {(!isMobileView || selectedRoom) && (
              <ChatWindow
                room={selectedRoom}
                onClose={isMobileView ? handleCloseChat : null}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;