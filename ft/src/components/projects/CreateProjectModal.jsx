import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { projectService } from '../../services/api';

const CreateProjectModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    roles: [{ name: '', required: 1 }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addRole = () => {
    setFormData({
      ...formData,
      roles: [...formData.roles, { name: '', required: 1 }],
    });
  };

  const updateRole = (index, field, value) => {
    const newRoles = [...formData.roles];
    newRoles[index][field] = field === 'required' ? parseInt(value) || 1 : value;
    setFormData({ ...formData, roles: newRoles });
  };

  const removeRole = (index) => {
    if (formData.roles.length > 1) {
      const newRoles = formData.roles.filter((_, i) => i !== index);
      setFormData({ ...formData, roles: newRoles });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await projectService.createProject(formData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              placeholder="Short Film - Mystery Thriller"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
              placeholder="Looking for talented crew members for an indie mystery thriller..."
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Required Roles *
              </label>
              <button
                type="button"
                onClick={addRole}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Role
              </button>
            </div>

            <div className="space-y-3">
              {formData.roles.map((role, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={role.name}
                    onChange={(e) => updateRole(index, 'name', e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="e.g., Editor, Cinematographer"
                    required
                  />
                  <input
                    type="number"
                    value={role.required}
                    onChange={(e) => updateRole(index, 'required', e.target.value)}
                    className="w-24 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-center"
                    min="1"
                    required
                  />
                  {formData.roles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRole(index)}
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;