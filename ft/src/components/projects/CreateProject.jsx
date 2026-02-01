import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, Calendar, Film } from 'lucide-react';
import { projectService, skillsService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * 🎬 CREATE PROJECT COMPONENT
 * Full-featured project creation with all backend fields
 */
const CreateProject = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_type: 'short_film',
    release_platform: '',
    estimated_completion: '',
    city: '',
    state: '',
    country: '',
    roles: [
      {
        skill_id: 1,
        role_title: '',
        description: '',
        slots_available: 1,
        payment_type: 'unpaid',
        payment_amount: 0,
        payment_details: ''
      }
    ]
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const skillsData = await skillsService.listSkills();
      setSkills(skillsData);
    } catch (error) {
      console.error('Failed to load skills:', error);
      toast.error('Failed to load skills');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addRole = () => {
    setFormData(prev => ({
      ...prev,
      roles: [
        ...prev.roles,
        {
          skill_id: skills[0]?.id || 1,
          role_title: '',
          description: '',
          slots_available: 1,
          payment_type: 'unpaid',
          payment_amount: 0,
          payment_details: ''
        }
      ]
    }));
  };

  const updateRole = (index, field, value) => {
    setFormData(prev => {
      const newRoles = [...prev.roles];
      newRoles[index][field] = field === 'slots_available' || field === 'payment_amount' || field === 'skill_id'
        ? parseInt(value) || (field === 'payment_amount' ? 0 : 1)
        : value;
      return { ...prev, roles: newRoles };
    });
  };

  const removeRole = (index) => {
    if (formData.roles.length > 1) {
      setFormData(prev => ({
        ...prev,
        roles: prev.roles.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate
      if (!formData.name.trim()) {
        toast.error('Project name is required');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Project description is required');
        return;
      }
      if (formData.roles.some(r => !r.role_title.trim())) {
        toast.error('All roles must have a title');
        return;
      }

      // Create project
      const createdProject = await projectService.createProject(formData);
      console.log('✅ Project created:', createdProject);
      
      toast.success('Project created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        project_type: 'short_film',
        release_platform: '',
        estimated_completion: '',
        city: '',
        state: '',
        country: '',
        roles: [
          {
            skill_id: skills[0]?.id || 1,
            role_title: '',
            description: '',
            slots_available: 1,
            payment_type: 'unpaid',
            payment_amount: 0,
            payment_details: ''
          }
        ]
      });

      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error(error.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
            <p className="text-gray-600">Fill in the details to start your project</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Film className="w-5 h-5" />
              Project Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Short Film - Mystery Thriller"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type *
                </label>
                <select
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  required
                >
                  <option value="short_film">Short Film</option>
                  <option value="feature_film">Feature Film</option>
                  <option value="documentary">Documentary</option>
                  <option value="web_series">Web Series</option>
                  <option value="commercial">Commercial</option>
                  <option value="music_video">Music Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Platform
                </label>
                <input
                  type="text"
                  name="release_platform"
                  value={formData.release_platform}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="YouTube, Netflix, etc."
                />
              </div>
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
                placeholder="Describe your project, story, vision..."
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Estimated Completion
              </label>
              <input
                type="date"
                name="estimated_completion"
                value={formData.estimated_completion}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Required Roles *</h3>
              <button
                type="button"
                onClick={addRole}
                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Role
              </button>
            </div>

            <div className="space-y-4">
              {formData.roles.map((role, index) => (
                <div key={index} className="p-4 border-2 border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Skill/Role *
                        </label>
                        <select
                          value={role.skill_id}
                          onChange={(e) => updateRole(index, 'skill_id', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                          required
                        >
                          {skills.map(skill => (
                            <option key={skill.id} value={skill.id}>
                              {skill.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role Title *
                        </label>
                        <input
                          type="text"
                          value={role.role_title}
                          onChange={(e) => updateRole(index, 'role_title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                          placeholder="e.g., Lead Editor"
                          required
                        />
                      </div>
                    </div>
                    {formData.roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRole(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Description
                    </label>
                    <textarea
                      value={role.description}
                      onChange={(e) => updateRole(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                      placeholder="Describe the role responsibilities..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slots Available *
                      </label>
                      <input
                        type="number"
                        value={role.slots_available}
                        onChange={(e) => updateRole(index, 'slots_available', e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Type *
                      </label>
                      <select
                        value={role.payment_type}
                        onChange={(e) => updateRole(index, 'payment_type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        required
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="deferred">Deferred</option>
                        <option value="profit_share">Profit Share</option>
                      </select>
                    </div>
                    {role.payment_type === 'paid' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount ($)
                        </label>
                        <input
                          type="number"
                          value={role.payment_amount}
                          onChange={(e) => updateRole(index, 'payment_amount', e.target.value)}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {role.payment_type !== 'unpaid' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Details
                      </label>
                      <input
                        type="text"
                        value={role.payment_details}
                        onChange={(e) => updateRole(index, 'payment_details', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        placeholder="Additional payment information..."
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Project...
                </span>
              ) : (
                'Create Project'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
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

export default CreateProject;