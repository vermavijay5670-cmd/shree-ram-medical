"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#00d9a3", "#3d5cff", "#6ee7f2", "#ffb84d", "rgba(255,255,255,0.16)"];

export function RevenueByCompanyChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="82%"
          paddingAngle={2}
          stroke="#0a0c0b"
          strokeWidth={3}
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#0a0c0b", border: "1px solid rgba(237,242,240,0.08)", borderRadius: 12, fontSize: 12.5 }}
          formatter={(value, name) => [`${value}%`, name]}
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
