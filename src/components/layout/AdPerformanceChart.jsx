"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

// Updated dataset (12 months)
const chartData = [
  { month: "2024-02", revenue_generated: 74.5, clicks: 57.7, cost_to_company: 8.1 },
  { month: "2024-03", revenue_generated: 86.3, clicks: 66.7, cost_to_company: 9.3 },
  { month: "2024-04", revenue_generated: 52.6, clicks: 40.7, cost_to_company: 6.7 },
  { month: "2024-05", revenue_generated: 87.0, clicks: 67.3, cost_to_company: 12.4 },
  { month: "2024-06", revenue_generated: 51.3, clicks: 39.7, cost_to_company: 5.6 },
  { month: "2024-07", revenue_generated: 78.2, clicks: 60.6, cost_to_company: 8.5 },
  { month: "2024-08", revenue_generated: 65.8, clicks: 51.0, cost_to_company: 7.1 },
  { month: "2024-09", revenue_generated: 80.4, clicks: 55.3, cost_to_company: 8.7 },
  { month: "2024-10", revenue_generated: 89.5, clicks: 69.3, cost_to_company: 13.7 },
  { month: "2024-11", revenue_generated: 60.7, clicks: 47.0, cost_to_company: 6.6 },
  { month: "2024-12", revenue_generated: 75.2, clicks: 40.1, cost_to_company: 8.1 },
  { month: "2025-01", revenue_generated: 82.3, clicks: 63.7, cost_to_company: 8.9 },
];

export default function AdPerformanceDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">📊 Ad Performance Dashboard</h1>
      <p className="text-gray-600 text-sm mb-6">Last 12 Months: Total Clicks, Revenue Generated, and Cost to Company</p>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📈 Ads Performance (12 Months)</h2>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} />
            <YAxis tick={{ fontSize: 12, fill: "#555" }} />
            <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: 8, border: "1px solid #ddd" }} />
            <Legend />

            <defs>
              <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="100%" stopColor="#4CAF50" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="100%" stopColor="#8E24AA" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6A1B9A" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            {/* Clicks - Blue */}
            <Bar dataKey="clicks" fill="url(#colorDAU)" name="Clicks (M)" barSize={12} radius={[5, 5, 0, 0]} />

            {/* Revenue Generated - Green */}
            <Bar dataKey="revenue_generated" fill="url(#revenue)" name="Revenue Generated (M)" barSize={12} radius={[5, 5, 0, 0]} />

            {/* Cost to Company - Red */}
            <Bar dataKey="cost_to_company" fill="url(#colorCost)" name="Cost to Company (M)" barSize={12} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-gray-500">All Datas are in Million</p>
      </div>
    </div>
  );
}
