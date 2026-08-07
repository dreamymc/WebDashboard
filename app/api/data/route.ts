import { NextResponse } from 'next/server';
import { fetchSheetRows } from '@/lib/google-sheets';
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
} from '@/lib/transforms';
import type { DashboardData } from '@/lib/types';

// ISR: revalidate every 60 seconds (§6.8)
export const revalidate = 60;

export async function GET() {
  try {
    const rows = await fetchSheetRows();
    const wi = wirelessIntegration(rows);
    const tr = transport(rows);

    const data: DashboardData = {
      kpi:                  kpiSummary(rows),
      quarterlyPlanVsActual: quarterlyPlanVsActual(rows),
      funnelCounts:         funnelCounts(rows),
      programVelocity:      programVelocity(rows),
      buildPlanByMonth:     buildPlanByMonth(rows),
      techTierPerformance:  techTierPerformance(rows),
      rfiRallyByVendor:     rfiRallyByVendor(rows),
      tcoPerformance:       tcoPerformance(rows),
      tcoAwardStatus:       tcoAwardStatus(rows),
      vendorCompletion:     vendorCompletion(rows),
      rfiRallyDetailed:     rfiRallyDetailed(rows),
      forecastVariance:     forecastVariance(rows),
      provincePlanVsActual: provincePlanVsActual(rows),
      townPlanVsActual:     townPlanVsActual(rows),
      siteTable:            siteTable(rows),
      wirelessIntegration:  wi,
      transport:            tr,
      wirelessIntegrationCount: wi.length,
      transportCount:       tr.length,
      fetchedAt:            new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error('Data fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
