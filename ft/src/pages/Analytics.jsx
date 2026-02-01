import React from 'react';
import { TrendingUp } from 'lucide-react';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          </div>
          <p className="text-gray-600">Track your projects and team performance</p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default Analytics;
