import React from 'react';
import { Volume2, Scissors, Video } from 'lucide-react';

/**
 * 🎭 ROLE CATEGORIZATION COMPONENT
 * Groups skills into Audio, Edit, and Video sections
 */

// Skill category mapping (you can customize this based on your actual skill names)
const SKILL_CATEGORIES = {
  audio: {
    icon: Volume2,
    title: '🔊 Audio',
    color: 'purple',
    keywords: [
      'dubbing', 'lyric', 'music', 'composer', 'sound', 'audio',
      'mixing', 'mastering', 'recording', 'foley', 'dialogue'
    ]
  },
  edit: {
    icon: Scissors,
    title: '✂️ Edit',
    color: 'blue',
    keywords: [
      'editor', 'editing', 'vfx', 'sfx', 'color', 'grading',
      'post-production', 'motion graphics', 'animation', 'compositing'
    ]
  },
  video: {
    icon: Video,
    title: '🎬 Video',
    color: 'orange',
    keywords: [
      'director', 'writer', 'dop', 'cinematographer', 'camera',
      'assistant director', 'producer', 'screenplay', 'gaffer',
      'production', 'lighting', 'grip', 'actor', 'actress'
    ]
  }
};

const categorizeSkill = (skillName) => {
  const name = skillName.toLowerCase();
  
  for (const [category, data] of Object.entries(SKILL_CATEGORIES)) {
    if (data.keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'other'; // Uncategorized skills
};

const RoleCategorization = ({ skills, isEditing, selectedSkills, onToggle }) => {
  // Categorize skills
  const categorized = {
    audio: [],
    edit: [],
    video: [],
    other: []
  };

  skills.forEach(skill => {
    const category = categorizeSkill(skill.name);
    categorized[category].push(skill);
  });

  const getCategoryColor = (category) => {
    const colors = {
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-500',
        hover: 'hover:bg-purple-200'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-500',
        hover: 'hover:bg-blue-200'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        badge: 'bg-orange-500',
        hover: 'hover:bg-orange-200'
      },
      gray: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
        badge: 'bg-gray-500',
        hover: 'hover:bg-gray-200'
      }
    };
    return colors[category] || colors.gray;
  };

  const renderCategory = (categoryKey, categoryData) => {
    const skills = categorized[categoryKey];
    if (skills.length === 0) return null;

    const Icon = categoryData.icon;
    const colors = getCategoryColor(categoryData.color);

    return (
      <div key={categoryKey} className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 ${colors.badge} rounded-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-lg font-bold ${colors.text}`}>
            {categoryData.title}
          </h3>
          <span className={`ml-auto px-3 py-1 ${colors.badge} text-white rounded-full text-sm font-medium`}>
            {skills.filter(s => selectedSkills?.includes(s.id)).length || skills.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => {
            const isSelected = selectedSkills?.includes(skill.id);
            
            if (isEditing) {
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => onToggle(skill.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? `${colors.badge} text-white`
                      : `bg-white ${colors.text} ${colors.hover}`
                  }`}
                >
                  {skill.name}
                </button>
              );
            } else {
              return (
                <span
                  key={skill.id}
                  className={`px-3 py-1.5 ${colors.badge} text-white rounded-lg text-sm font-medium`}
                >
                  {skill.name}
                </span>
              );
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Audio Section */}
      {renderCategory('audio', SKILL_CATEGORIES.audio)}

      {/* Edit Section */}
      {renderCategory('edit', SKILL_CATEGORIES.edit)}

      {/* Video Section */}
      {renderCategory('video', SKILL_CATEGORIES.video)}

      {/* Other/Uncategorized */}
      {categorized.other.length > 0 && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            📋 Other Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {categorized.other.map((skill) => {
              const isSelected = selectedSkills?.includes(skill.id);
              
              if (isEditing) {
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => onToggle(skill.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-gray-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill.name}
                  </button>
                );
              } else {
                return (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm font-medium"
                  >
                    {skill.name}
                  </span>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleCategorization;