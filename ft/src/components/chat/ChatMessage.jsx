import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import MessageBubble from './MessageBubble';

const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  const isOwnMessage = message.sender_id === user?.id;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {!isOwnMessage && (
          <span className="text-xs text-gray-500 px-2">{message.sender_name}</span>
        )}
        
        <MessageBubble message={message} isOwn={isOwnMessage} />
        
        <span className="text-xs text-gray-400 px-2">
          {message.created_at && formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;