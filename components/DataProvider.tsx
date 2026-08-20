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
  locationDirectory,
} from "@/lib/transforms";

interface DataContextValue {
  rawRows: SiteRow[];
  filteredRows: SiteRow[];
  newBuildPlan: NewBuildPlanItem[];
  transforms: ReturnType<typeof computeTransforms>;
}

const DataContext = createContext<DataContextValue | null>(null);

function computeTransforms(rows: SiteRow[], buildPlan: string | null) {
  const wi = wirelessIntegration(rows);
  const tr = transport(rows);

  return {
    kpi: kpiSummary(rows),
    quarterlyPlanVsActual: quarterlyPlanVsActual(rows),
    funnelCounts: funnelCounts(rows),
    programVelocity: programVelocity(rows),
    buildPlanByMonth: buildPlanByMonth(rows, buildPlan),
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
    locationDirectory: locationDirectory(rows),
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
  const town = searchParams.get("town");
  const leadIndicator = searchParams.get("leadIndicator");
  const buildPlan = searchParams.get("buildPlan");
  const prio2 = searchParams.get("prio2");

  const filteredRows = useMemo(() => {
    return initialRows.filter((row) => {
      if (province && row.province !== province) return false;
      if (town && row.cityTown !== town) return false;
      if (leadIndicator && row.leadIndicator !== leadIndicator) return false;
      if (prio2 && row.prio2 !== prio2) return false;
      
      if (buildPlan) {
        if (buildPlan === "Q1 BP" && !row.q1Bp) return false;
        if (buildPlan === "Q2 BP" && !row.q2Bp) return false;
        if (buildPlan === "Q3 BP" && !row.q3Bp) return false;
        if (buildPlan === "Q4 BP" && !row.q4Bp) return false;
      }
      return true;
    });
  }, [initialRows, province, town, leadIndicator, buildPlan, prio2]);

  const transforms = useMemo(() => computeTransforms(filteredRows, buildPlan), [filteredRows, buildPlan]);

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
