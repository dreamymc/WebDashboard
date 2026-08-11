/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useData } from "@/components/DataProvider";
import { FunnelBarChart } from "@/components/charts/FunnelBarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { StageBarChart } from "@/components/charts/StageBarChart";
import { DataTable, ColumnDef } from "@/components/tables/DataTable";

export default function PipelinePage() {
  const { transforms } = useData();
  const { funnelCounts, programVelocity, buildPlanByMonth, techTierPerformance } = transforms;

  const techColumns: ColumnDef<any>[] = [
    { key: "tech", header: "Planned Tech", cell: (r) => <span className="font-semibold">{r.tech}</span> },
    { key: "plan", header: "Plan", cell: (r) => r.plan, align: "right" },
    { key: "actual", header: "Actual", cell: (r) => r.actual, align: "right" },
    { key: "pctTrfs", header: "% TRFS", cell: (r) => `${r.pctTrfs}%`, align: "right" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row: Funnel (7) | Donut (5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 panel flex flex-col">
          <div className="panel-header">Lead Indicator (LOCAL)</div>
          <div className="panel-body flex-1">
            <FunnelBarChart data={funnelCounts} height={350} />
          </div>
        </div>

        <div className="lg:col-span-5 panel flex flex-col">
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
          <div className="panel-header">Build Plan by Month</div>
          <div className="panel-body flex-1">
            <StageBarChart
              data={buildPlanByMonth}
              xKey="month"
              bars={[{ key: "count", name: "Sites", color: "var(--info)" }]}
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
