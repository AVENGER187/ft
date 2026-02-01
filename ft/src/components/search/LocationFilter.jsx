import React from 'react';
import { MapPin } from 'lucide-react';

const LocationFilter = ({ location, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={location}
          onChange={(e) => onChange(e.target.value)}
          placeholder="City, Country"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default LocationFilter;