import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { EarlyStagePieData } from "@/lib/transforms";

export function SimplePieChart({ data, height = 300 }: { data: EarlyStagePieData[], height?: number | string }) {
  const renderLegendText = (value: string, entry: { payload: { value: number } }) => (
    <span className="text-text-primary">{value} - {entry.payload.value}</span>
  );

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
            label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
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
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="left" 
            iconType="circle" 
            wrapperStyle={{ fontSize: "12px", paddingLeft: "10px" }} 
            formatter={renderLegendText}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
