"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function TopMedicinesChart({ data }: { data: { name: string; units: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="rgba(237,242,240,0.06)" />
        <XAxis type="number" stroke="#8a938f" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#8a938f"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          contentStyle={{ background: "#0a0c0b", border: "1px solid rgba(237,242,240,0.08)", borderRadius: 12, fontSize: 12.5 }}
          formatter={(value) => [`${Number(value).toLocaleString("en-IN")} units`, "Sold"]}
        />
        <Bar dataKey="units" fill="#3d5cff" radius={[0, 8, 8, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
