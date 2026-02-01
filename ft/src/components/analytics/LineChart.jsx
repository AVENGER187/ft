import React from 'react';
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChart = ({ data }) => {
  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', value: 400 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 600 },
    { month: 'Apr', value: 800 },
    { month: 'May', value: 500 },
    { month: 'Jun', value: 700 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLine data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#999" />
        <YAxis stroke="#999" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="url(#colorGradient)"
          strokeWidth={3}
          dot={{ fill: '#fb923c', strokeWidth: 2 }}
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>
      </RechartsLine>
    </ResponsiveContainer>
  );
};

export default LineChart;
