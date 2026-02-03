import React, { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { uploadService } from '../../services/api';

/**
 * Chat message input bar.
 *
 * Props:
 *   onSend(content, attachments)  – called when the user presses Send / Enter
 *   roomId                        – project id (used as context label only here)
 */
const ChatInput = ({ onSend, roomId }) => {
  const [message, setMessage]       = useState('');
  const [attachments, setAttachments] = useState([]);   // [{name, url}]
  const [uploading, setUploading]   = useState(false);
  const fileInputRef                = useRef(null);

  // ── file upload ────────────────────────────────────
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    for (const file of files) {
      try {
        // reuse the existing portfolio upload endpoint (accepts images + video + pdf)
        const result = await uploadService.uploadPortfolio(file);
        setAttachments(prev => [...prev, { name: file.name, url: result.url }]);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
    setUploading(false);
    // reset the hidden <input> so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (idx) =>
    setAttachments(prev => prev.filter((_, i) => i !== idx));

  // ── send ───────────────────────────────────────────
  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;
    try {
      await onSend(message, attachments);
      setMessage('');
      setAttachments([]);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* attachment previews */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 flex gap-2 flex-wrap border-b border-gray-200">
          {attachments.map((att, i) => (
            <div key={i} className="relative group bg-gray-100 rounded-lg px-3 py-1 pr-8">
              <span className="text-sm text-gray-700">{att.name}</span>
              <button
                onClick={() => removeAttachment(i)}
                className="absolute top-0.5 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* input row */}
      <div className="p-4 flex items-end gap-3">
        {/* hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />

        {/* attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>

        {/* textarea */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none max-h-32"
            style={{ minHeight: '40px' }}
          />
        </div>

        {/* send button */}
        <button
          onClick={handleSend}
          disabled={(!message.trim() && attachments.length === 0) || uploading}
          className="p-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;