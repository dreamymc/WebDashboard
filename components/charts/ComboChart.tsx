"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ComboChartProps {
  data: Record<string, string | number | null>[];
  xKey: string;
  bars: { key: string; name: string; color?: string }[];
  lines: { key: string; name: string; color?: string }[];
  height?: number;
}

export default function ComboChart({ data, xKey, bars, lines, height = 300 }: ComboChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
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
            itemStyle={{ fontSize: 12, padding: "2px 0" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "var(--text-muted)", paddingTop: 10 }}
            iconType="circle"
            iconSize={8}
          />
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color || "var(--brand)"}
              radius={[2, 2, 0, 0]}
              maxBarSize={40}
            />
          ))}
          {lines.map((line) => (
            <Line
              key={line.key}
              type="linear"
              dataKey={line.key}
              name={line.name}
              stroke={line.color || "var(--info)"}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
