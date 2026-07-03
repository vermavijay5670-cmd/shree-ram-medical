"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS: Record<string, string> = {
  Delivered: "#00d9a3",
  Processing: "#3d5cff",
  Pending: "#ffb84d",
  Cancelled: "#ff6b6b",
};

export function OrdersByStatusChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius="80%" stroke="#0a0c0b" strokeWidth={3}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] ?? "#8a938f"} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#0a0c0b", border: "1px solid rgba(237,242,240,0.08)", borderRadius: 12, fontSize: 12.5 }}
          formatter={(value, name) => [`${value} orders`, name]}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={9}
          wrapperStyle={{ fontSize: 11.5, color: "#8a938f", paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
