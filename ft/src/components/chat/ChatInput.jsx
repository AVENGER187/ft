import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, X } from 'lucide-react';
import { useFileUpload } from '../../hooks/phase2-hooks';
import websocketService from '../../services/websocket.service';

const ChatInput = ({ onSend, roomId }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { uploadFile, uploading, progress } = useFileUpload();

  const handleTyping = (value) => {
    setMessage(value);

    // Notify others that user is typing
    if (!isTyping) {
      setIsTyping(true);
      websocketService.sendTyping(roomId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      websocketService.sendTyping(roomId, false);
    }, 1000);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      try {
        const result = await uploadFile(file, 'chat');
        setAttachments((prev) => [...prev, result]);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;

    try {
      await onSend(message, attachments);
      setMessage('');
      setAttachments([]);
      setIsTyping(false);
      websocketService.sendTyping(roomId, false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 flex gap-2 flex-wrap border-b border-gray-200">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="relative group bg-gray-100 rounded-lg p-2 pr-8"
            >
              <span className="text-sm text-gray-700">{attachment.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 flex items-end gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none max-h-32"
            style={{ minHeight: '40px' }}
          />
        </div>

        <button
          onClick={() => {/* Emoji picker */}}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Smile className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={handleSend}
          disabled={!message.trim() && attachments.length === 0}
          className="p-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;