"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { SiteRow, NewBuildPlanItem } from "@/lib/types";
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
  newBuildPlan: NewBuildPlanItem[];
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
  initialNewBuildPlan,
  children,
}: {
  initialRows: SiteRow[];
  initialNewBuildPlan: NewBuildPlanItem[];
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const province = searchParams.get("province");
  const program = searchParams.get("program");
  const vendor = searchParams.get("vendor");
  const prio1 = searchParams.get("prio1");
  const prio2 = searchParams.get("prio2");

  const filteredRows = useMemo(() => {
    return initialRows.filter((row) => {
      if (province && row.province !== province) return false;
      if (program && row.program !== program) return false;
      if (vendor && row.vendor !== vendor) return false;
      if (prio1 && row.prio1 !== prio1) return false;
      if (prio2 && row.prio2 !== prio2) return false;
      return true;
    });
  }, [initialRows, province, program, vendor, prio1, prio2]);

  const transforms = useMemo(() => computeTransforms(filteredRows), [filteredRows]);

  const value = useMemo(
    () => ({ rawRows: initialRows, filteredRows, newBuildPlan: initialNewBuildPlan, transforms }),
    [initialRows, filteredRows, initialNewBuildPlan, transforms]
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
