import React from 'react';
import { Download, FileText } from 'lucide-react';

const MessageBubble = ({ message, isOwn }) => {
  const hasAttachments = message.attachments && message.attachments.length > 0;

  return (
    <div
      className={`px-4 py-2 rounded-2xl ${
        isOwn
          ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {message.is_deleted ? (
        <p className="text-sm italic opacity-70">[Message deleted]</p>
      ) : (
        <>
          {message.content && (
            <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
          )}

          {hasAttachments && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment, index) => (
                <FileAttachment key={index} attachment={attachment} isOwn={isOwn} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const FileAttachment = ({ attachment, isOwn }) => {
  const isImage = attachment.type?.startsWith('image/') || 
                  attachment.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  if (isImage) {
    return (
      <div className="rounded-lg overflow-hidden">
        <img
          src={attachment.url}
          alt={attachment.name || 'Image'}
          className="max-w-full h-auto max-h-64 object-contain"
        />
      </div>
    );
  }

  return (
    <a
      href={attachment.url}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 p-2 rounded-lg ${
        isOwn ? 'bg-white/20 hover:bg-white/30' : 'bg-white hover:bg-gray-50'
      } transition-colors`}
    >
      <FileText className="w-5 h-5" />
      <span className="text-sm truncate flex-1">{attachment.name || 'File'}</span>
      <Download className="w-4 h-4" />
    </a>
  );
};

export default MessageBubble;