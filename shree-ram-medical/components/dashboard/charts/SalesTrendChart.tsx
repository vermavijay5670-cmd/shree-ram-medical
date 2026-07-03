"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function SalesTrendChart({ data }: { data: { label: string; revenueLakh: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d9a3" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#00d9a3" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(237,242,240,0.06)" />
        <XAxis dataKey="label" stroke="#8a938f" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#8a938f" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}L`} />
        <Tooltip
          contentStyle={{ background: "#0a0c0b", border: "1px solid rgba(237,242,240,0.08)", borderRadius: 12, fontSize: 12.5 }}
          labelStyle={{ color: "#edf2f0" }}
          formatter={(value) => [`₹${value}L`, "Revenue"]}
        />
        <Area type="monotone" dataKey="revenueLakh" stroke="#00d9a3" strokeWidth={2.5} fill="url(#salesGradient)" dot={{ r: 3, fill: "#00d9a3" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
