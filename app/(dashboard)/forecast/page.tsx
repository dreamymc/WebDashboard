/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useData } from "@/components/DataProvider";
import { ProvinceBarChart } from "@/components/charts/ProvinceBarChart";
import { DataTable, ColumnDef } from "@/components/tables/DataTable";

export default function ForecastPage() {
  const { transforms } = useData();
  const { forecastVariance, provincePlanVsActual, townPlanVsActual } = transforms;

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const pageSize = 15;

  const filteredTowns = townPlanVsActual.filter(
    (t) =>
      t.cityTown.toLowerCase().includes(search.toLowerCase()) ||
      t.province.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedTowns = filteredTowns.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filteredTowns.length / pageSize);

  const varianceColumns: ColumnDef<any>[] = [
    { key: "month", header: "Month", cell: (r) => <span className="font-semibold">{r.month}</span> },
    { key: "fc", header: "Conservative FC", cell: (r) => r.conservativeFC, align: "right" },
    { key: "bnd", header: "B&D Forecast", cell: (r) => r.bndForecast, align: "right" },
    {
      key: "diff",
      header: "Diff",
      cell: (r) => (
        <span className={r.difference > 0 ? "text-positive" : r.difference < 0 ? "text-negative" : "text-neutral"}>
          {r.difference > 0 ? `+${r.difference}` : r.difference}
        </span>
      ),
      align: "right",
    },
  ];

  const townColumns: ColumnDef<any>[] = [
    { key: "town", header: "Town", cell: (r) => <span className="font-semibold">{r.cityTown}</span> },
    { key: "prov", header: "Province", cell: (r) => r.province },
    { key: "plan", header: "Plan", cell: (r) => r.totalPlan, align: "right" },
    { key: "actual", header: "Actual", cell: (r) => r.totalActual, align: "right" },
    { key: "pct", header: "% TRFS", cell: (r) => `${r.pctTrfs}%`, align: "right" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row: Variance Table (5) | Province Bar (7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 panel flex flex-col">
          <div className="panel-header">Forecast Variance</div>
          <div className="panel-body p-0 flex-1">
            <DataTable data={forecastVariance} columns={varianceColumns} />
          </div>
        </div>

        <div className="lg:col-span-7 panel flex flex-col">
          <div className="panel-header">Province Plan vs Actual</div>
          <div className="panel-body flex-1">
            <ProvinceBarChart data={provincePlanVsActual} height={400} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Town Table (full) */}
      <div className="panel">
        <div className="panel-header flex justify-between items-center">
          <span>Town Plan vs Actual</span>
          <input
            type="text"
            placeholder="Search town or province..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); // Reset to page 0 on search
            }}
            className="filter-select py-1 px-2 text-xs font-normal ml-4 w-48"
          />
        </div>
        <div className="panel-body p-0">
          <DataTable data={paginatedTowns} columns={townColumns} />
          {/* Pagination controls */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-color bg-bg">
            <span className="text-xs text-text-muted">
              Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, filteredTowns.length)} of {filteredTowns.length} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 bg-surface border border-border-color text-xs hover:bg-surface-hover disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || totalPages === 0}
                className="px-3 py-1 bg-surface border border-border-color text-xs hover:bg-surface-hover disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
