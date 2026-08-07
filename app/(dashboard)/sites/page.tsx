/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { useData } from "@/components/DataProvider";
import SiteMap from "@/components/charts/SiteMap";
import { DataTable, ColumnDef } from "@/components/tables/DataTable";
import { StageBadge } from "@/components/tables/StageBadge";
import { STAGE_COLORS } from "@/lib/normalizers";

export default function SitesPage() {
  const { transforms } = useData();
  const { siteTable, wirelessIntegration, transport } = transforms;

  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const filteredSiteTable = useMemo(() => {
    if (!selectedSiteId) return siteTable;
    return siteTable.filter((s) => s.serialNumber === selectedSiteId);
  }, [siteTable, selectedSiteId]);

  const markers = useMemo(() => {
    return siteTable
      .filter((s) => s.lat !== null && s.long !== null)
      .map((s) => ({
        id: s.serialNumber,
        lat: s.lat!,
        long: s.long!,
        stage: s.stage,
        color: STAGE_COLORS[s.stage] ?? "var(--text-muted)",
        name: s.cityTown,
      }));
  }, [siteTable]);

  const siteColumns: ColumnDef<any>[] = [
    { key: "id", header: "Serial Number", cell: (r) => <span className="font-mono text-[11px]">{r.serialNumber}</span> },
    { key: "net", header: "Vendor", cell: (r) => r.vendor },
    { key: "tco", header: "TCO", cell: (r) => r.tcoVendor },
    { key: "prov", header: "Province", cell: (r) => r.province },
    { key: "town", header: "Town", cell: (r) => r.cityTown },
    { key: "prog", header: "Program", cell: (r) => r.program },
    { key: "stage", header: "Stage", cell: (r) => <StageBadge stage={r.stage} /> },
  ];

  const wiColumns: ColumnDef<any>[] = [
    { key: "id", header: "Serial Number", cell: (r) => <span className="font-mono text-[11px]">{r.serialNumber}</span> },
    { key: "net", header: "Vendor", cell: (r) => r.vendor },
    { key: "town", header: "Town", cell: (r) => r.cityTown },
    { key: "stage", header: "Stage", cell: (r) => <StageBadge stage={r.stage} /> },
    { key: "trs", header: "TRS Actual", cell: (r) => r.trsActual },
  ];

  const trColumns: ColumnDef<any>[] = [
    { key: "id", header: "Serial Number", cell: (r) => <span className="font-mono text-[11px]">{r.serialNumber}</span> },
    { key: "net", header: "Vendor", cell: (r) => r.vendor },
    { key: "tco", header: "TCO", cell: (r) => r.tcoVendor },
    { key: "town", header: "Town", cell: (r) => r.cityTown },
    { key: "bnd", header: "B&D Forecast", cell: (r) => r.bndTrfsForecast },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row: Map (9) | Legend (3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 panel flex flex-col">
          <div className="panel-header">Site Map</div>
          <div className="panel-body p-0 flex-1">
            <SiteMap markers={markers} height={450} />
          </div>
        </div>

        <div className="lg:col-span-3 panel flex flex-col">
          <div className="panel-header">Stage Legend</div>
          <div className="panel-body p-4 flex-1 space-y-2 overflow-auto max-h-[450px]">
            {Object.entries(STAGE_COLORS).map(([stage, color]) => (
              <div key={stage} className="flex items-center gap-3 text-sm">
                <span className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-text-secondary whitespace-nowrap">{stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row: Site Table (full) */}
      <div className="panel">
        <div className="panel-header flex justify-between items-center">
          <span>Site Details</span>
          {selectedSiteId && (
            <button
              onClick={() => setSelectedSiteId(null)}
              className="text-xs font-semibold text-text-secondary hover:text-text-primary"
            >
              Clear Map Filter
            </button>
          )}
        </div>
        <div className="panel-body p-0 max-h-[400px] overflow-auto">
          <DataTable data={filteredSiteTable} columns={siteColumns} />
        </div>
      </div>

      {/* Bottom Row: Wireless Integration (6) | Transport (6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 panel flex flex-col">
          <div className="panel-header flex justify-between">
            <span>Ongoing Wireless Integration</span>
            <span className="text-text-muted font-mono">{wirelessIntegration.length} rows</span>
          </div>
          <div className="panel-body p-0 flex-1 max-h-[400px] overflow-auto">
            <DataTable data={wirelessIntegration} columns={wiColumns} />
          </div>
        </div>

        <div className="lg:col-span-6 panel flex flex-col">
          <div className="panel-header flex justify-between">
            <span>Ongoing Transport</span>
            <span className="text-text-muted font-mono">{transport.length} rows</span>
          </div>
          <div className="panel-body p-0 flex-1 max-h-[400px] overflow-auto">
            <DataTable data={transport} columns={trColumns} />
          </div>
        </div>
      </div>
    </div>
  );
}
