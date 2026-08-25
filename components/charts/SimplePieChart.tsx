import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { EarlyStagePieData } from "@/lib/transforms";

export function SimplePieChart({ data, height = 300 }: { data: EarlyStagePieData[], height?: number | string }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
            label={({ value }) => value}
            labelLine={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border-color)' }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
