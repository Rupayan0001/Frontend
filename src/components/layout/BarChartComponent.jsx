import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "Jan", MAU: 190, DAU: 90 },
  { month: "Feb", MAU: 235, DAU: 130 },
  { month: "Mar", MAU: 255, DAU: 150 },
  { month: "Apr", MAU: 280, DAU: 170 },
  { month: "May", MAU: 295, DAU: 180 },
  { month: "Jun", MAU: 320, DAU: 190 },
];

export default function BarChartComponent() {
  return (
    <div className="p-6 flex flex-col items-center border-2 border-gray-200 bg-white rounded-xl shadow-lg backdrop-blur-md">
      <h2 className="text-xl font-bold text-gray-900">📊 User Counts</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tick={{ fontSize: 14, fill: "#333" }} />
          <Tooltip contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", borderRadius: 10, color: "#fff" }} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
          <Legend wrapperStyle={{ fontSize: 14 }} />

          {/* WOW - Gradient Bars */}
          <defs>
            <linearGradient id="colorMAU" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF3D00" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#FF8C00" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="colorDAU" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2979FF" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <Bar dataKey="MAU" fill="url(#colorMAU)" radius={[6, 6, 0, 0]} name="📅 Monthly Active Users (M)" />
          <Bar dataKey="DAU" fill="url(#colorDAU)" radius={[6, 6, 0, 0]} name="📆 Daily Active Users (M)" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-2 items-center text-lg font-medium text-gray-700">
        🚀 Grew by <span className="text-green-600 font-bold">9.2%</span> this month
        <TrendingUp className="h-5 w-5 text-green-600" />
      </div>

      <p className="mt-1 text-gray-500 text-sm">Last 6 months user engagement trends</p>
      {/* <p className="mt-2 text-gray-600 text-sx">All datas are in Million</p> */}
    </div>
  );
}
