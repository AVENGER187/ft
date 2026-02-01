import { API_BASE_URL } from '../utils/constants';

export const uploadService = {
  // Upload profile picture
  uploadProfilePicture: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload error'));
      });

      xhr.open('POST', `${API_BASE_URL}/upload/profile-picture`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  },

  // Upload project file
  uploadProjectFile: async (projectId, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);

    const token = localStorage.getItem('access_token');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload error'));
      });

      xhr.open('POST', `${API_BASE_URL}/upload/project-file`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  },

  // Upload chat attachment
  uploadChatAttachment: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload error'));
      });

      xhr.open('POST', `${API_BASE_URL}/upload/chat-attachment`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  },

  // Delete file
  deleteFile: async (fileId) => {
    const token = localStorage.getItem('access_token');

    const response = await fetch(`${API_BASE_URL}/upload/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }

    return response.json();
  },

  // Get file URL
  getFileUrl: (filename) => {
    return `${API_BASE_URL}/uploads/${filename}`;
  },
};