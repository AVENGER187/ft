import React from 'react';

const TypingIndicator = ({ users }) => {
  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-gray-500">
        {users.length === 1 ? 'Someone is typing...' : `${users.length} people are typing...`}
      </span>
    </div>
  );
};

export default TypingIndicator;