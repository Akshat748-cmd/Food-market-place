'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface ComparisonDataPoint {
  ingredient: string;
  [cityName: string]: string | number;
}

interface ChartProps {
  data: ComparisonDataPoint[];
  cities: { id: string; name: string; color: string }[];
}

export default function CityComparisonChart({ data, cities }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
        <XAxis
          dataKey="ingredient"
          tick={{ fontSize: 11, fill: '#66523B' }}
          axisLine={{ stroke: '#E4D7C0' }}
          angle={-15}
          textAnchor="end"
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#8A7662' }}
          axisLine={{ stroke: '#E4D7C0' }}
          tickFormatter={(val) => `₹${val}`}
        />
        <Tooltip
          formatter={(value: number, name: string) => [`₹${value}`, name]}
          contentStyle={{
            backgroundColor: '#FFF9EF',
            borderColor: '#E4D7C0',
            borderRadius: '12px',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
        {cities.map((city) => (
          <Bar key={city.id} dataKey={city.name} fill={city.color} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
