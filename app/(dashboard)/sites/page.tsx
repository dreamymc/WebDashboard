/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useData } from "@/components/DataProvider";
import SiteMap from "@/components/charts/SiteMap";
import { DataTable, ColumnDef } from "@/components/tables/DataTable";
import { StageBadge } from "@/components/tables/StageBadge";
import { STAGE_COLORS } from "@/lib/normalizers";

function SitesPageContent() {
  const { transforms } = useData();
  const searchParams = useSearchParams();
  const focusedMarkerId = searchParams.get("focus");

  const { siteTable, wirelessIntegration, transport } = transforms;

  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [hiddenStages, setHiddenStages] = useState<Set<string>>(new Set());

  const toggleStage = (stage: string) => {
    setHiddenStages(prev => {
      const next = new Set(prev);
      if (next.has(stage)) {
        next.delete(stage);
      } else {
        next.add(stage);
      }
      return next;
    });
  };

  const filteredSiteTable = useMemo(() => {
    let result = siteTable;
    if (hiddenStages.size > 0) {
      result = result.filter(s => !hiddenStages.has(s.stage));
    }
    if (selectedSiteId) {
      return result.filter((s) => s.serialNumber === selectedSiteId);
    }
    return result;
  }, [siteTable, selectedSiteId, hiddenStages]);

  const markers = useMemo(() => {
    return filteredSiteTable
      .filter((s) => s.lat !== null && s.long !== null)
      .map((s) => ({
        id: s.serialNumber,
        lat: s.lat!,
        long: s.long!,
        stage: s.stage,
        color: STAGE_COLORS[s.stage] ?? "var(--text-muted)",
        name: s.cityTown,
      }));
  }, [filteredSiteTable]);

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
          <div className="panel-header flex justify-between items-center">
            <span>Site Map</span>
            {focusedMarkerId && (
              <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-semibold border border-brand/20">
                Focused: {focusedMarkerId}
              </span>
            )}
          </div>
          <div className="panel-body p-0 flex-1 relative">
            <SiteMap markers={markers} height={450} focusedMarkerId={focusedMarkerId} />
          </div>
        </div>

        <div className="lg:col-span-3 panel flex flex-col">
          <div className="panel-header flex justify-between items-center">
            <span>Stage Legend</span>
            {hiddenStages.size > 0 && (
              <button 
                onClick={() => setHiddenStages(new Set())}
                className="text-[10px] text-text-muted hover:text-text-primary transition-colors uppercase tracking-wider font-semibold"
              >
                Reset Filter
              </button>
            )}
          </div>
          <div className="panel-body p-4 flex-1 space-y-1 overflow-auto max-h-[450px]">
            <p className="text-[10px] text-text-muted mb-3 uppercase tracking-wider font-semibold">Click to filter map</p>
            {Object.entries(STAGE_COLORS).map(([stage, color]) => {
              const isHidden = hiddenStages.has(stage);
              return (
                <div 
                  key={stage} 
                  onClick={() => toggleStage(stage)}
                  className={`flex items-center gap-3 text-sm cursor-pointer hover:bg-surface-hover p-1.5 -mx-1.5 rounded transition-all ${isHidden ? "opacity-40 grayscale" : "opacity-100"}`}
                >
                  <span className="w-3 h-3 flex-shrink-0 shadow-sm rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-text-secondary whitespace-nowrap font-medium transition-colors hover:text-text-primary">{stage}</span>
                </div>
              );
            })}
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

export default function SitesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted">Loading map data...</div>}>
      <SitesPageContent />
    </Suspense>
  );
}
