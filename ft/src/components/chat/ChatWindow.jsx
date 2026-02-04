import React, { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../../hooks/phase2-hooks';
import { MessageSquare } from 'lucide-react';

const ChatWindow = ({ room, onClose }) => {
  const messagesEndRef = useRef(null);
  const { messages, isLoading, typingUsers, loadMessages, sendMessage, wsStatus } = useChat(room?.id);

  useEffect(() => {
    if (room?.id) {
      loadMessages();
    }
  }, [room?.id, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content, attachments) => {
    try {
      await sendMessage(content, attachments);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <ChatHeader room={room} onClose={onClose} wsStatus={wsStatus} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <MessageSquare className="w-16 h-16 mb-3" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} roomId={room.id} />
    </div>
  );
};

export default ChatWindow;