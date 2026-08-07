"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ProvinceData {
  province: string;
  plan: number;
  actual: number;
}

interface ProvinceBarChartProps {
  data: ProvinceData[];
  height?: number;
}

export function ProvinceBarChart({ data, height = 400 }: ProvinceBarChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
          />
          <YAxis
            type="category"
            dataKey="province"
            axisLine={false}
            tickLine={false}
            width={140}
            tick={{ fontSize: 11, fill: "var(--text-secondary)", fontWeight: 500 }}
          />
          <Tooltip
            cursor={{ fill: "var(--surface-hover)" }}
            contentStyle={{
              background: "var(--surface)",
              borderColor: "var(--border-color)",
              borderRadius: 0,
              fontSize: 12,
              color: "var(--text-primary)",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "var(--text-muted)", paddingTop: 10 }}
            iconType="square"
            iconSize={8}
          />
          <Bar dataKey="plan" name="Plan" fill="var(--text-muted)" radius={[0, 2, 2, 0]} barSize={12} />
          <Bar dataKey="actual" name="Actual" fill="var(--brand)" radius={[0, 2, 2, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
