/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useData } from "@/components/DataProvider";
import { KpiCard } from "@/components/charts/KpiCard";
import { StageBarChart } from "@/components/charts/StageBarChart";
import { DataTable, ColumnDef } from "@/components/tables/DataTable";

export default function OverviewPage() {
  const { transforms } = useData();
  const { kpi, quarterlyPlanVsActual } = transforms;

  const qTableColumns: ColumnDef<any>[] = [
    { key: "vendor", header: "Vendor", cell: (r) => <span className="font-semibold">{r.vendor}</span> },
    { key: "quarter", header: "Quarter", cell: (r) => r.quarter },
    { key: "plan", header: "Plan", cell: (r) => r.plan, align: "right" },
    { key: "actual", header: "Actual", cell: (r) => r.actual, align: "right" },
  ];

  return (
    <div className="space-y-6">
      {/* 8 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Pipeline" value={kpi.totalPlan} />
        <KpiCard label="Q3 Plan" value={kpi.q3Plan} />
        <KpiCard label="Q3 Actual" value={kpi.q3Actual} />
        <KpiCard label="Q4 Plan" value={kpi.q4Plan} />
        <KpiCard label="Q4 Actual" value={kpi.q4Actual} />
        <KpiCard label="TRFS" value={kpi.trfsCount} />
        <KpiCard label="On-Air" value={kpi.onAirCount} />
        <KpiCard label="RFI" value={kpi.rfiCount} />
      </div>

      {/* Grid: Bar Chart | Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 panel flex flex-col">
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

        <div className="lg:col-span-5 panel flex flex-col">
          <div className="panel-header">Quarterly Details</div>
          <div className="panel-body p-0 flex-1">
            <DataTable
              data={quarterlyPlanVsActual}
              columns={qTableColumns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
