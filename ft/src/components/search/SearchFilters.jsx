import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import SkillsFilter from './SkillsFilter';
import LocationFilter from './LocationFilter';
import DateRangeFilter from './DateRangeFilter';

const SearchFilters = ({ filters, onFiltersChange, type = 'projects' }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key] && (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
  ).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {showFilters && (
        <div className="absolute z-20 right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Skills Filter */}
          <SkillsFilter
            selectedSkills={filters.skills || []}
            onChange={(skills) => handleFilterChange('skills', skills)}
          />

          {/* Location Filter */}
          <LocationFilter
            location={filters.location || ''}
            onChange={(location) => handleFilterChange('location', location)}
          />

          {/* Date Range Filter (for projects) */}
          {type === 'projects' && (
            <DateRangeFilter
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              onChange={(dateFrom, dateTo) => {
                handleFilterChange('dateFrom', dateFrom);
                handleFilterChange('dateTo', dateTo);
              }}
            />
          )}

          {/* Status Filter (for projects) */}
          {type === 'projects' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;

