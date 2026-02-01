import React, { useState } from 'react';
import { X, Briefcase, MapPin, Calendar, Users } from 'lucide-react';
import { applicationService } from '../../services/api';

/**
 * 🎬 ENHANCED PROJECT DETAIL MODAL
 * Improved UX for role application with clear filled status
 */
const ProjectDetailModal = ({ project, onClose, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [appliedRoles, setAppliedRoles] = useState(new Set());

  const handleApply = async (roleId) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      console.log('📤 Applying to role:', roleId);
      await applicationService.applyToRole(roleId, '');
      console.log('✅ Application submitted successfully');
      setSuccess('Application submitted successfully!');
      setAppliedRoles(prev => new Set([...prev, roleId]));
      
      setTimeout(() => setSuccess(''), 3000);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('❌ Application failed:', err);
      setError(err.message || 'Failed to apply');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleFillStatus = (role) => {
    const filled = role.filled || 0;
    const total = role.slots_available || role.required || 1;
    const percentage = (filled / total) * 100;

    return { filled, total, percentage, isFull: filled >= total };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-400 to-yellow-400 px-8 py-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1 text-white">
              <h2 className="text-3xl font-bold mb-2">{project.title || project.name}</h2>
              <div className="flex items-center gap-2 text-white/90">
                <Users className="w-4 h-4" />
                <span>by {project.creator_name || 'Unknown'}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">✅ {success}</p>
            </div>
          )}

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.project_type && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                  {project.project_type.replace('_', ' ')}
                </span>
              </div>
            )}
            
            {project.city && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  {[project.city, project.state, project.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            
            {project.estimated_completion && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  Due: {new Date(project.estimated_completion).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Project</h3>
            <p className="text-gray-600 leading-relaxed">{project.description}</p>
          </div>

          {/* Roles Section */}
          {project.roles && project.roles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Open Roles ({project.roles.length})
              </h3>
              <div className="space-y-3">
                {project.roles.map((role) => {
                  const { filled, total, percentage, isFull } = getRoleFillStatus(role);
                  const hasApplied = appliedRoles.has(role.id);

                  return (
                    <div
                      key={role.id}
                      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-2 rounded-xl transition-all ${
                        isFull
                          ? 'bg-gray-50 border-gray-300'
                          : 'bg-white border-orange-200 hover:border-orange-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex-1">
                        {/* Role Header */}
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${isFull ? 'bg-gray-200' : 'bg-orange-100'}`}>
                            <Briefcase className={`w-5 h-5 ${isFull ? 'text-gray-500' : 'text-orange-600'}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-lg ${isFull ? 'text-gray-500' : 'text-gray-800'}`}>
                              {role.role_title || role.name}
                            </h4>
                            {role.description && (
                              <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="ml-11">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className={isFull ? 'text-gray-600' : 'text-gray-700'}>
                              Positions filled:
                            </span>
                            <span className={`font-bold ${isFull ? 'text-gray-600' : 'text-orange-600'}`}>
                              {filled} / {total}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isFull ? 'bg-gray-400' : 'bg-orange-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          {/* Payment Info */}
                          {role.payment_type && role.payment_type !== 'unpaid' && (
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                💰 {role.payment_type.replace('_', ' ')}
                                {role.payment_amount ? ` - $${role.payment_amount}` : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Apply Button */}
                      <div className="md:w-32 flex-shrink-0">
                        {hasApplied ? (
                          <div className="w-full px-4 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold text-center border-2 border-blue-300">
                            ✓ Applied
                          </div>
                        ) : isFull ? (
                          <div className="w-full px-4 py-3 bg-gray-300 text-gray-600 rounded-lg font-semibold text-center cursor-not-allowed border-2 border-gray-400">
                            ❌ Position Filled
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApply(role.id)}
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? '...' : 'Apply'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Project Status:</span>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium text-sm">
                {(project.status || 'Active').replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;