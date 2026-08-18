/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useData } from "@/components/DataProvider";
import SiteMap from "@/components/charts/SiteMap";
import { DataTable, ColumnDef } from "@/components/tables/DataTable";
import { StageBadge } from "@/components/tables/StageBadge";
import { STAGE_COLORS } from "@/lib/normalizers";

function SitesPageContent() {
  const { transforms } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusedMarkerId = searchParams.get("focus");
  const searchedMarkerId = searchParams.get("search");

  const { siteTable, wirelessIntegration, transport } = transforms;

  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [hiddenStages, setHiddenStages] = useState<Set<string>>(new Set());

  const clearAllFilters = () => {
    setSelectedSiteId(null);
    setHiddenStages(new Set());
    if (focusedMarkerId || searchedMarkerId) {
      router.push("/sites");
    }
  };

  // Automatically sync the selected site with the focused marker from URL
  useEffect(() => {
    if (focusedMarkerId) {
      setSelectedSiteId(focusedMarkerId);
    } else if (searchedMarkerId) {
      setSelectedSiteId(searchedMarkerId);
    }
  }, [focusedMarkerId, searchedMarkerId]);

  const toggleStage = (stage: string) => {
    setHiddenStages(prev => {
      if (prev.size === 0) {
        // If all are visible, clicking one isolates it (hides everything else)
        const allStages = Object.keys(STAGE_COLORS);
        const next = new Set(allStages);
        next.delete(stage);
        return next;
      } else {
        // Otherwise act as a normal toggle
        const next = new Set(prev);
        if (next.has(stage)) {
          next.delete(stage); // Turn ON (unhide)
        } else {
          next.add(stage); // Turn OFF (hide)
        }
        
        // If they just turned ON the very last hidden item, reset the filter completely
        if (next.size === 0) {
          return new Set();
        }
        return next;
      }
    });
  };

  const filteredSiteTable = useMemo(() => {
    const result = siteTable;
    if (selectedSiteId) {
      return result.filter((s) => s.serialNumber === selectedSiteId);
    }
    return result;
  }, [siteTable, selectedSiteId]);

  const filteredWI = useMemo(() => {
    const result = wirelessIntegration;
    if (selectedSiteId) return result.filter((s) => s.serialNumber === selectedSiteId);
    return result;
  }, [wirelessIntegration, selectedSiteId]);

  const filteredTR = useMemo(() => {
    const result = transport;
    if (selectedSiteId) return result.filter((s) => s.serialNumber === selectedSiteId);
    return result;
  }, [transport, selectedSiteId]);

  const markers = useMemo(() => {
    return filteredSiteTable
      .filter((s) => hiddenStages.size === 0 || !hiddenStages.has(s.stage))
      .filter((s) => s.lat !== null && s.long !== null)
      .map((s) => ({
        id: s.serialNumber,
        lat: s.lat!,
        long: s.long!,
        stage: s.stage,
        color: STAGE_COLORS[s.stage] ?? "var(--text-muted)",
        name: s.cityTown,
      }));
  }, [filteredSiteTable, hiddenStages]);

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
      {(selectedSiteId || hiddenStages.size > 0) && (
        <div className="flex justify-between items-center bg-brand/5 border border-brand/20 p-3 rounded-md shadow-sm">
          <div className="text-sm font-medium text-brand">
            {selectedSiteId 
              ? `Site isolated: Showing data & map for Site ${selectedSiteId}.` 
              : "Map filter active: Showing selected stages on the map."}
          </div>
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold bg-surface hover:bg-surface-hover border border-border-color text-text-primary px-3 py-1.5 rounded transition-colors uppercase tracking-wider"
          >
            Clear All Filters & Highlighting
          </button>
        </div>
      )}

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
                  <span className="text-text-secondary whitespace-nowrap font-medium transition-colors hover:text-text-primary">{stage.replace(/^\[\d+\]\s*/, "")}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Row: Site Table (full) */}
      <div id="site-details" className="panel scroll-mt-20">
        <div className="panel-header flex justify-between items-center">
          <span>Site Details</span>
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
            <span className="text-text-muted font-mono">{filteredWI.length} rows</span>
          </div>
          <div className="panel-body p-0 flex-1 max-h-[400px] overflow-auto">
            <DataTable data={filteredWI} columns={wiColumns} />
          </div>
        </div>

        <div className="lg:col-span-6 panel flex flex-col">
          <div className="panel-header flex justify-between">
            <span>Ongoing Transport</span>
            <span className="text-text-muted font-mono">{filteredTR.length} rows</span>
          </div>
          <div className="panel-body p-0 flex-1 max-h-[400px] overflow-auto">
            <DataTable data={filteredTR} columns={trColumns} />
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
