"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DonutData {
  name: string;
  value: number;
}

interface DonutChartProps {
  data: DonutData[];
  height?: number;
  colors?: string[];
}

const DEFAULT_COLORS = [
  "var(--brand)",
  "var(--warning)",
  "var(--success)",
  "var(--stage-03)",
  "var(--stage-08)",
  "var(--text-muted)",
];

export function DonutChart({ data, height = 300, colors = DEFAULT_COLORS }: DonutChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              borderColor: "var(--border-color)",
              borderRadius: 0,
              fontSize: 12,
              color: "var(--text-primary)",
            }}
            itemStyle={{ fontSize: 12 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "var(--text-muted)" }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
