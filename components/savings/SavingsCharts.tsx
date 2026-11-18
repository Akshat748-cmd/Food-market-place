'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

const CATEGORY_COLORS = ['#315B42', '#F8C45C', '#263D2D', '#D97706', '#877057', '#C2410C'];

export function FoodCostDonutChart({
  data = [
    { name: 'Dairy & Paneer', value: 34 },
    { name: 'Poultry & Meat', value: 28 },
    { name: 'Produce & Veg', value: 16 },
    { name: 'Oils & Ghee', value: 10 },
    { name: 'Spices & Condiments', value: 8 },
    { name: 'Packaging & Other', value: 4 },
  ],
}: {
  data?: Array<{ name: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(val: number) => [`${val}% of total food cost`, 'Share']}
          contentStyle={{ backgroundColor: '#FFF9EF', borderColor: '#E4D7C0', borderRadius: '12px', fontSize: '12px' }}
        />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SixMonthSavingsChart({
  data = [
    { month: 'Jun', before: 310000, optimized: 258000 },
    { month: 'Jul', before: 315000, optimized: 261000 },
    { month: 'Aug', before: 325000, optimized: 268000 },
    { month: 'Sep', before: 330000, optimized: 270000 },
    { month: 'Oct', before: 338000, optimized: 275000 },
    { month: 'Nov', before: 342000, optimized: 279500 },
  ],
}: {
  data?: Array<{ month: string; before: number; optimized: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#66523B' }} axisLine={{ stroke: '#E4D7C0' }} />
        <YAxis tick={{ fontSize: 10, fill: '#8A7662' }} axisLine={{ stroke: '#E4D7C0' }} tickFormatter={(val) => `₹${val / 1000}k`} />
        <Tooltip
          formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Spend']}
          contentStyle={{ backgroundColor: '#FFF9EF', borderColor: '#E4D7C0', borderRadius: '12px', fontSize: '12px' }}
        />
        <Bar dataKey="before" name="Retail Middlemen" fill="#D1BF9F" radius={[4, 4, 0, 0]} />
        <Bar dataKey="optimized" name="Mandi Pooled" fill="#315B42" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
