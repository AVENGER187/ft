import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { searchService } from '../../services/search.service';

const SkillsFilter = ({ selectedSkills = [], onChange }) => {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const data = await searchService.getPopularSkills();
      setAvailableSkills(data.skills || data || []);
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      onChange([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill) => {
    onChange(selectedSkills.filter((s) => s !== skill));
  };

  const filteredSkills = availableSkills.filter(
    (skill) =>
      !selectedSkills.includes(skill) &&
      skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button onClick={() => removeSkill(skill)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Skills */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search skills..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent mb-2"
      />

      {/* Available Skills */}
      <div className="max-h-32 overflow-y-auto space-y-1">
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-2">Loading skills...</p>
        ) : filteredSkills.length > 0 ? (
          filteredSkills.slice(0, 10).map((skill) => (
            <button
              key={skill}
              onClick={() => addSkill(skill)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors flex items-center justify-between group"
            >
              <span className="text-sm text-gray-700">{skill}</span>
              <Plus className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-2">No skills found</p>
        )}
      </div>
    </div>
  );
};

export default SkillsFilter;