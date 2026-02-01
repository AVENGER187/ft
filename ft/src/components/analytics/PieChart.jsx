import React from 'react';
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PieChart = ({ data }) => {
  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { name: 'Active', value: 45 },
    { name: 'Completed', value: 30 },
    { name: 'Cancelled', value: 10 },
  ];

  const COLORS = ['#fb923c', '#facc15', '#f87171', '#60a5fa', '#a78bfa'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPie>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPie>
    </ResponsiveContainer>
  );
};

export default PieChart;