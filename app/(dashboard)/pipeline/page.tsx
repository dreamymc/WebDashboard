/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useData } from "@/components/DataProvider";
import { DonutChart } from "@/components/charts/DonutChart";
import { StageBarChart } from "@/components/charts/StageBarChart";
import { DataTable, ColumnDef } from "@/components/tables/DataTable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QuarterlyTick = (props: any) => {
  const { x, y, payload, index } = props;
  const isMiddle = index % 3 === 1; // 0=E, 1=N, 2=H
  const quarterIndex = Math.floor(index / 3) + 1;
  const vendorName = String(payload.value).split('-')[0];
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} textAnchor="middle" fill="var(--text-muted)" fontSize={11}>
        {vendorName}
      </text>
      {isMiddle && (
        <text x={0} y={20} dy={10} textAnchor="middle" fill="var(--text-secondary)" fontSize={12} fontWeight={700}>
          Q{quarterIndex}
        </text>
      )}
    </g>
  );
};

export default function PipelinePage() {
  const { transforms } = useData();
  const { programVelocity, quarterlyPlanVsActual, techTierPerformance } = transforms;

  const techColumns: ColumnDef<any>[] = [
    { key: "tech", header: "Planned Tech", cell: (r) => <span className="font-semibold">{r.tech}</span> },
    { key: "plan", header: "Plan", cell: (r) => r.plan, align: "right" },
    { key: "actual", header: "Actual", cell: (r) => r.actual, align: "right" },
    { key: "pctTrfs", header: "% TRFS", cell: (r) => `${r.pctTrfs}%`, align: "right" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row: Quarterly Plan */}
      <div className="grid grid-cols-1 gap-6">
        <div className="panel flex flex-col">
          <div className="panel-header">Quarterly Plan vs Actual</div>
          <div className="panel-body flex-1">
            <StageBarChart
              data={quarterlyPlanVsActual
                .filter((r) => r.vendor !== "Total")
                .map((r, i) => ({ ...r, uniqueKey: `${r.vendor}-${i}` }))}
              xKey="uniqueKey"
              bars={[
                { key: "plan", name: "Plan", color: "var(--text-muted)" },
                { key: "actual", name: "Actual", color: "var(--brand)" },
              ]}
              height={350}
              tickComponent={<QuarterlyTick />}
              tooltipLabelFormatter={(label) => String(label).split('-')[0]}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Program Velocity (6) | Tech Tier (6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 panel flex flex-col">
          <div className="panel-header">Program Velocity</div>
          <div className="panel-body flex-1">
            <DonutChart
              data={programVelocity.map((pv) => ({ name: pv.program, value: pv.count }))}
              height={300}
            />
          </div>
        </div>

        <div className="lg:col-span-6 panel flex flex-col">
          <div className="panel-header">Tech Tier Performance</div>
          <div className="panel-body p-0 flex-1">
            <DataTable
              data={techTierPerformance}
              columns={techColumns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
