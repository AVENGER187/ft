import React from 'react';
import { Calendar } from 'lucide-react';

const DateRangeFilter = ({ dateFrom, dateTo, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={dateFrom || ''}
            onChange={(e) => onChange(e.target.value, dateTo)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={dateTo || ''}
            onChange={(e) => onChange(dateFrom, e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;