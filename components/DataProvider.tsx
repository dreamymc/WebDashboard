"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { SiteRow } from "@/lib/types";
import {
  kpiSummary,
  quarterlyPlanVsActual,
  funnelCounts,
  programVelocity,
  buildPlanByMonth,
  techTierPerformance,
  rfiRallyByVendor,
  tcoPerformance,
  tcoAwardStatus,
  vendorCompletion,
  rfiRallyDetailed,
  forecastVariance,
  provincePlanVsActual,
  townPlanVsActual,
  siteTable,
  wirelessIntegration,
  transport,
} from "@/lib/transforms";

interface DataContextValue {
  rawRows: SiteRow[];
  filteredRows: SiteRow[];
  transforms: ReturnType<typeof computeTransforms>;
}

const DataContext = createContext<DataContextValue | null>(null);

function computeTransforms(rows: SiteRow[]) {
  const wi = wirelessIntegration(rows);
  const tr = transport(rows);

  return {
    kpi: kpiSummary(rows),
    quarterlyPlanVsActual: quarterlyPlanVsActual(rows),
    funnelCounts: funnelCounts(rows),
    programVelocity: programVelocity(rows),
    buildPlanByMonth: buildPlanByMonth(rows),
    techTierPerformance: techTierPerformance(rows),
    rfiRallyByVendor: rfiRallyByVendor(rows),
    tcoPerformance: tcoPerformance(rows),
    tcoAwardStatus: tcoAwardStatus(rows),
    vendorCompletion: vendorCompletion(rows),
    rfiRallyDetailed: rfiRallyDetailed(rows),
    forecastVariance: forecastVariance(rows),
    provincePlanVsActual: provincePlanVsActual(rows),
    townPlanVsActual: townPlanVsActual(rows),
    siteTable: siteTable(rows),
    wirelessIntegration: wi,
    transport: tr,
    wirelessIntegrationCount: wi.length,
    transportCount: tr.length,
  };
}

export function DataProvider({
  initialRows,
  children,
}: {
  initialRows: SiteRow[];
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const province = searchParams.get("province");
  const program = searchParams.get("program");
  const vendor = searchParams.get("vendor");

  const filteredRows = useMemo(() => {
    return initialRows.filter((row) => {
      if (province && row.province !== province) return false;
      if (program && row.program !== program) return false;
      if (vendor && row.vendor !== vendor) return false;
      return true;
    });
  }, [initialRows, province, program, vendor]);

  const transforms = useMemo(() => computeTransforms(filteredRows), [filteredRows]);

  const value = useMemo(
    () => ({ rawRows: initialRows, filteredRows, transforms }),
    [initialRows, filteredRows, transforms]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
