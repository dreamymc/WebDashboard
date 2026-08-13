/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useData } from "@/components/DataProvider";
import { DonutChart } from "@/components/charts/DonutChart";
import { StageBarChart } from "@/components/charts/StageBarChart";
import { DataTable, ColumnDef } from "@/components/tables/DataTable";

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
      {/* Top Row: Donut */}
      <div className="grid grid-cols-1 gap-6">
        <div className="panel flex flex-col">
          <div className="panel-header">Program Velocity</div>
          <div className="panel-body flex-1">
            <DonutChart
              data={programVelocity.map((pv) => ({ name: pv.program, value: pv.count }))}
              height={350}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Build Plan (6) | Tech Tier (6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 panel flex flex-col">
          <div className="panel-header">Quarterly Plan vs Actual</div>
          <div className="panel-body flex-1">
            <StageBarChart
              data={quarterlyPlanVsActual.filter((r) => r.vendor !== "Total")}
              xKey="vendor"
              bars={[
                { key: "plan", name: "Plan", color: "var(--text-muted)" },
                { key: "actual", name: "Actual", color: "var(--brand)" },
              ]}
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
