"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
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
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
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
              const words = short.split(" ");
              let line1 = short;
              let line2 = "";
              if (words.length > 1 && short.length > 12) {
                const mid = Math.ceil(words.length / 2);
                line1 = words.slice(0, mid).join(" ");
                line2 = words.slice(mid).join(" ");
              }
              return (
                <text x={x} y={y} textAnchor="end" fill="var(--text-secondary)" fontSize={12} fontWeight={500}>
                  {line2 ? (
                    <>
                      <tspan x={x} dy="-0.2em">{line1}</tspan>
                      <tspan x={x} dy="1.1em">{line2}</tspan>
                    </>
                  ) : (
                    <tspan x={x} dy="0.35em">{line1}</tspan>
                  )}
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
            labelFormatter={(label: any) => typeof label === 'string' ? label.replace(/^\[\d+\]\s*/, "") : label}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [value, "Sites"]}
          />
          <Bar dataKey="count" radius={[0, 2, 2, 0]} barSize={20}>
            <LabelList 
              dataKey="count" 
              position="right" 
              fill="var(--text-primary)"
              fontSize={12}
              fontWeight={700}
            />
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
