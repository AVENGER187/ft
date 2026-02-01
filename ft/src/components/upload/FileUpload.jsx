import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { useFileUpload } from '../../hooks/phase2-hooks';

const FileUpload = ({ onUploadComplete, acceptedFileTypes, maxSize = 10 * 1024 * 1024 }) => {
  const [files, setFiles] = React.useState([]);
  const { uploadFile, uploading, progress, error } = useFileUpload();

  const onDrop = useCallback(async (acceptedFiles) => {
    setFiles(acceptedFiles);

    for (const file of acceptedFiles) {
      try {
        const result = await uploadFile(file, 'project');
        if (onUploadComplete) {
          onUploadComplete(result);
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  }, [uploadFile, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    multiple: true,
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-orange-400 bg-orange-50'
            : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files, or click to select'}
        </p>
        <p className="text-sm text-gray-400">
          Up to {(maxSize / 1024 / 1024).toFixed(0)}MB per file
        </p>
      </div>

      {uploading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Uploading...</span>
            <span className="text-sm text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;