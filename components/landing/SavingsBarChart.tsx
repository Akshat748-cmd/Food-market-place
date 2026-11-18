'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface ChartProps {
  data: Array<{ category: string; current: number; optimized: number; saved: number }>;
}

export default function SavingsBarChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#66523B' }} axisLine={{ stroke: '#E4D7C0' }} />
        <YAxis
          tick={{ fontSize: 10, fill: '#8A7662' }}
          axisLine={{ stroke: '#E4D7C0' }}
          tickFormatter={(val) => `₹${val / 1000}k`}
        />
        <Tooltip
          formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Monthly Spend']}
          contentStyle={{
            backgroundColor: '#FFF9EF',
            borderColor: '#E4D7C0',
            borderRadius: '12px',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="current" name="Current Spend" fill="#D1BF9F" radius={[6, 6, 0, 0]} />
        <Bar dataKey="optimized" name="With Food Market Hub" fill="#315B42" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
