"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { STAGE_COLORS } from "@/lib/normalizers";

interface FunnelData {
  stage: string;
  count: number;
}

interface FunnelBarChartProps {
  data: FunnelData[];
  height?: number;
}

export function FunnelBarChart({ data, height = 300 }: FunnelBarChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="stage"
            axisLine={false}
            tickLine={false}
            width={120}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tick={(props: any) => {
              const { x, y, payload } = props;
              const short = payload.value.replace(/^\[\d+\]\s*/, "");
              return (
                <text
                  x={x}
                  y={y}
                  dy={4}
                  textAnchor="end"
                  fill="var(--text-secondary)"
                  fontSize={11}
                  fontWeight={500}
                >
                  {short}
                </text>
              );
            }}
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [value, "Sites"]}
          />
          <Bar dataKey="count" radius={[0, 2, 2, 0]} barSize={20}>
            {data.map((entry, index) => {
              const color = STAGE_COLORS[entry.stage] ?? "var(--text-muted)";
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
