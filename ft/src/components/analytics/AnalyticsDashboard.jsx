import React from 'react';
import { TrendingUp, Users, Briefcase, CheckCircle } from 'lucide-react';
import { useAnalytics } from '../../hooks/phase3-hooks';
import StatsCard from './StatsCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';

const AnalyticsDashboard = () => {
  const { data, isLoading, error } = useAnalytics('dashboard');

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Failed to load analytics: {error}</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Projects',
      value: data?.total_projects || 0,
      change: '+12%',
      icon: Briefcase,
      color: 'blue',
    },
    {
      label: 'Active Members',
      value: data?.active_members || 0,
      change: '+8%',
      icon: Users,
      color: 'green',
    },
    {
      label: 'Completed',
      value: data?.completed_projects || 0,
      change: '+23%',
      icon: CheckCircle,
      color: 'purple',
    },
    {
      label: 'Success Rate',
      value: `${data?.success_rate || 0}%`,
      change: '+5%',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Project Growth */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Growth</h3>
          <LineChart data={data?.project_growth || []} />
        </div>

        {/* Bar Chart - Applications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Applications by Status</h3>
          <BarChart data={data?.applications_by_status || []} />
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Project Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Projects by Status</h3>
          <PieChart data={data?.projects_by_status || []} />
        </div>

        {/* Popular Skills */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Skills</h3>
          <div className="space-y-3">
            {(data?.popular_skills || []).slice(0, 5).map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{skill.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full"
                      style={{ width: `${(skill.count / (data.popular_skills[0]?.count || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{skill.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;