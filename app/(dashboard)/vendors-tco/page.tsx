/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useData } from "@/components/DataProvider";
import { StageBarChart } from "@/components/charts/StageBarChart";
import { DataTable, ColumnDef } from "@/components/tables/DataTable";

export default function VendorsTcoPage() {
  const { transforms } = useData();
  const {
    rfiRallyByVendor,
    tcoPerformance,
    tcoAwardStatus,
    vendorCompletion,
    rfiRallyDetailed,
  } = transforms;

  const tcoAwardColumns: ColumnDef<any>[] = [
    { key: "tcoVendor", header: "TCO Vendor", cell: (r) => <span className="font-semibold">{r.tcoVendor}</span> },
    { key: "01", header: "AWARDED", cell: (r) => r["[01] AWARDED / SITE HUNTING"] || "-", align: "right" },
    { key: "03", header: "TSSR APPROVED", cell: (r) => r["[03] TSSR APPROVED"] || "-", align: "right" },
    { key: "04", header: "RTB", cell: (r) => r["[04] RTB"] || "-", align: "right" },
    { key: "05", header: "CW DOING", cell: (r) => r["[05] CW DOING"] || "-", align: "right" },
  ];

  const vendorCompletionColumns: ColumnDef<any>[] = [
    { key: "vendor", header: "Vendor", cell: (r) => <span className="font-semibold">{r.vendor}</span> },
    { key: "rtb", header: "RTB+", cell: (r) => r.rtbAndAbove, align: "right" },
    { key: "total", header: "Total", cell: (r) => r.total, align: "right" },
    { key: "pct", header: "% Completion", cell: (r) => `${r.pctCompletion}%`, align: "right" },
  ];

  const rfiDetailedColumns: ColumnDef<any>[] = [
    { key: "vendor", header: "Vendor", cell: (r) => <span className="font-semibold">{r.vendor}</span> },
    { key: "prog", header: "Program", cell: (r) => r.cleanProgram },
    { key: "pipeline", header: "Pipeline", cell: (r) => r.pipeline, align: "right" },
    { key: "rfti", header: "RFTI", cell: (r) => r.rfti, align: "right" },
    { key: "pctRfti", header: "% RFTI", cell: (r) => `${r.pctRfti}%`, align: "right" },
    { key: "trfs", header: "TRFS Actual Count", cell: (r) => r.trfsActual, align: "right" },
    { key: "pctTrfs", header: "% TRFS", cell: (r) => `${r.pctTrfs}%`, align: "right" },
    { key: "pending", header: "TRS Pending", cell: (r) => r.trsPending, align: "right" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row: RFI Rally (6) | TCO Performance (6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 panel flex flex-col">
          <div className="panel-header">RFI Rally by Vendor</div>
          <div className="panel-body flex-1">
            <StageBarChart
              data={rfiRallyByVendor}
              xKey="stage"
              bars={[
                { key: "ericsson", name: "Ericsson", stackId: "a", color: "var(--brand)" },
                { key: "nokia", name: "Nokia", stackId: "a", color: "var(--warning)" },
                { key: "ht", name: "HT", stackId: "a", color: "var(--success)" },
              ]}
              height={300}
            />
          </div>
        </div>

        <div className="lg:col-span-6 panel flex flex-col">
          <div className="panel-header">TCO Performance (RTB & Above)</div>
          <div className="panel-body flex-1">
            <StageBarChart
              data={tcoPerformance}
              xKey="vendor"
              bars={[
                { key: "rtbAndAbove", name: "RTB+", color: "var(--brand)" },
                { key: "total", name: "Total", color: "var(--text-muted)" },
              ]}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Middle Row: TCO Award (5) | Vendor Completion (7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 panel flex flex-col">
          <div className="panel-header">TCO Award Status</div>
          <div className="panel-body p-0 flex-1">
            <DataTable data={tcoAwardStatus} columns={tcoAwardColumns} />
          </div>
        </div>

        <div className="lg:col-span-7 panel flex flex-col">
          <div className="panel-header">Vendor Completion</div>
          <div className="panel-body p-0 flex-1">
            <DataTable data={vendorCompletion} columns={vendorCompletionColumns} />
          </div>
        </div>
      </div>

      {/* Bottom Row: RFI Rally Detailed (full) */}
      <div className="panel">
        <div className="panel-header">RFI Rally Detailed</div>
        <div className="panel-body p-0">
          <DataTable data={rfiRallyDetailed} columns={rfiDetailedColumns} />
        </div>
      </div>
    </div>
  );
}
