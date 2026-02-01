import React from 'react';
import { FileText, Download, X } from 'lucide-react';

const FileAttachment = ({ file, onRemove, showRemove = false }) => {
  const isImage = file.type?.startsWith('image/');

  return (
    <div className="relative group bg-gray-50 rounded-lg p-3 border border-gray-200">
      {isImage && file.preview ? (
        <img
          src={file.preview}
          alt={file.name}
          className="w-full h-32 object-cover rounded"
        />
      ) : (
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}

      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default FileAttachment;