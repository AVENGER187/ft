import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useFileUpload } from '../../hooks/phase2-hooks';

const ImageUpload = ({ onUploadComplete, maxSize = 5 * 1024 * 1024 }) => {
  const [preview, setPreview] = useState(null);
  const { uploadFile, uploading, progress, error } = useFileUpload();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload file
    try {
      const result = await uploadFile(file, 'profile');
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }, [uploadFile, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize,
    multiple: false,
  });

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />
          {!uploading && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p>{Math.round(progress)}% Uploaded</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-orange-400 bg-orange-50'
              : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {isDragActive ? 'Drop image here' : 'Drag & drop an image, or click to select'}
          </p>
          <p className="text-sm text-gray-400">
            PNG, JPG, GIF up to {(maxSize / 1024 / 1024).toFixed(0)}MB
          </p>
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

export default ImageUpload;