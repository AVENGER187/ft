import React from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarChart = ({ data }) => {
  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { status: 'Pending', count: 45 },
    { status: 'Accepted', count: 78 },
    { status: 'Rejected', count: 23 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBar data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="status" stroke="#999" />
        <YAxis stroke="#999" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>
      </RechartsBar>
    </ResponsiveContainer>
  );
};

export default BarChart;
