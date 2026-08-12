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
import { STAGE_COLORS } from "@/lib/normalizers";

interface StageBarChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  bars: { key: string; name: string; stackId?: string; color?: string }[];
  height?: number;
}

export function StageBarChart({ data, xKey, bars, height = 300 }: StageBarChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            interval={0}
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
            iconType="square"
            iconSize={8}
          />
          {bars.map((bar) => {
            // If the bar key corresponds to a stage, use the stage color.
            // Otherwise use the provided color or brand color.
            const color =
              bar.color ||
              STAGE_COLORS[bar.name] ||
              STAGE_COLORS[bar.key] ||
              "var(--brand)";

            return (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.name}
                stackId={bar.stackId}
                fill={color}
                radius={bar.stackId ? 0 : [2, 2, 0, 0]}
                maxBarSize={28}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
