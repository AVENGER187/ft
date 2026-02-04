import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { chatService } from '../../services/chat.service';

const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  const isOwnMessage = message.sender_id === user?.id;
  const [hover, setHover] = useState(false);
  const [isDeleted, setIsDeleted] = useState(message.is_deleted || false);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this message?')) return;
    
    try {
      await chatService.deleteMessage(message.id);
      setIsDeleted(true);
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    }
  };

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {!isOwnMessage && (
          <span className="text-xs text-gray-500 px-2">{message.sender_name || 'Unknown'}</span>
        )}
        
        <div className="relative group">
          <MessageBubble 
            message={{ ...message, is_deleted: isDeleted }} 
            isOwn={isOwnMessage} 
          />

          {/* Delete button - only show for own messages */}
          {isOwnMessage && hover && !isDeleted && (
            <button
              onClick={handleDelete}
              className="absolute -top-2 -right-2 p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Delete message"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>
        
        <span className="text-xs text-gray-400 px-2">
          {formatTime(message.sent_at)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;