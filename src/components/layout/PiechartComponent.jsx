"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Label, Tooltip, ResponsiveContainer, Legend } from "recharts";
const chartData = [
  { name: "🏙️ Mumbai", value: 12 },
  { name: "🏙️ Delhi", value: 9 },
  { name: "🏙️ Bangalore", value: 7 },
  { name: "🏙️ Kolkata", value: 8 },
  { name: "🏙️ Chennai", value: 6 },
  { name: "🏙️ Hyderabad", value: 8 },
];

// WOW - Vibrant Colors
const COLORS = ["#8E44AD", "#FF3D00", "#FFC107", "#FF3D00", "#2979FF", "#00C853"];

export default function PiechartComponent() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <div className="flex flex-col bg-gradient-to-r from-white to-gray-50 items-center border-2 border-gray-200 rounded-xl shadow-lg backdrop-blur-md p-6">
      <h2 className="text-xl font-bold text-gray-900">🌍 Top 5 Cities Users Distribution</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            strokeWidth={3}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
            labelStyle={{ fontSize: "14px", fontWeight: "bold" }}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label value={totalVisitors.toLocaleString()} position="center" className="text-2xl font-bold fill-gray-800" />
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "rgba(0, 30, 91, 0.8)", color: "rgba(255, 255, 255, 0.8)", borderRadius: 8 }} />
          {/* <Legend verticalAlign="bottom" align="center" iconSize={14} wrapperStyle={{ fontSize: 14 }} /> */}
        </PieChart>
      </ResponsiveContainer>

      <p className="mt-2 text-gray-600 text-sm">📈 User distribution in the last 6 months</p>
      <p className="mt-2 text-gray-600 text-sx">All datas are in Million</p>
    </div>
  );
}
