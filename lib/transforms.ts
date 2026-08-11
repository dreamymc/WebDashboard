/**
 * Pure transform functions — no side effects, no fetching.
 * All business rules from §6 of T7_WEB_DASHBOARD_MASTER_PLAN.md are encoded here.
 *
 * CRITICAL §6.4 RULE: "stage index ≥ [06]" means all six of:
 *   [06] S-RFI, [07] S-RFI w/ TRS, [08] RFI, [09] RFI with TRS, [10] ON-AIR, [11] TRFS
 * This is implemented via isActualStage() which uses ordered index comparison, NEVER a name list.
 */

import {
  STAGE_ORDER,
  isActualStage,
  Q3_MONTHS,
  Q4_MONTHS,
  ALL_MONTHS,
  stageIndex,
} from './normalizers';
import type {
  SiteRow,
  KpiSummary,
  QuarterlyPlanVsActual,
  FunnelCount,
  ProgramVelocityItem,
  BuildPlanItem,
  TechTierRow,
  RfiRallyByVendorItem,
  TcoPerformanceItem,
  TcoAwardRow,
  VendorCompletionRow,
  RfiDetailedRow,
  ForecastVarianceRow,
  ProvinceBarItem,
  TownPlanRow,
  SiteTableRow,
  WirelessIntegrationRow,
  TransportRow,
} from './types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const VENDORS = ['Ericsson', 'Nokia', 'HT'] as const;

function pct(actual: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((actual / total) * 100 * 10) / 10; // 1 decimal place
}

// ── KPI Summary ───────────────────────────────────────────────────────────────

export function kpiSummary(rows: SiteRow[]): KpiSummary {
  return {
    totalPlan:   rows.length,
    q3Plan:      rows.filter(r => Q3_MONTHS.has(r.bndTrfsForecast)).length,
    q4Plan:      rows.filter(r => Q4_MONTHS.has(r.bndTrfsForecast)).length,
    q3Actual:    rows.filter(r => Q3_MONTHS.has(r.bndTrfsForecast) && isActualStage(r.leadIndicator)).length,
    q4Actual:    rows.filter(r => Q4_MONTHS.has(r.bndTrfsForecast) && isActualStage(r.leadIndicator)).length,
    trfsCount:   rows.filter(r => r.leadIndicator === '[11] TRFS').length,
    onAirCount:  rows.filter(r => r.leadIndicator === '[10] ON-AIR').length,
    rfiCount:    rows.filter(r => r.leadIndicator === '[08] RFI').length,
  };
}

// ── Quarterly Plan vs Actual ──────────────────────────────────────────────────

export function quarterlyPlanVsActual(rows: SiteRow[]): QuarterlyPlanVsActual[] {
  const result: QuarterlyPlanVsActual[] = [];

  for (const quarter of ['Q3', 'Q4'] as const) {
    const months = quarter === 'Q3' ? Q3_MONTHS : Q4_MONTHS;

    const allPlan = rows.filter(r => months.has(r.bndTrfsForecast)).length;
    const allActual = rows.filter(r => months.has(r.bndTrfsForecast) && isActualStage(r.leadIndicator)).length;
    result.push({ quarter, vendor: 'Total', plan: allPlan, actual: allActual });

    for (const vendor of VENDORS) {
      const vRows = rows.filter(r => r.vendor === vendor);
      const plan = vRows.filter(r => months.has(r.bndTrfsForecast)).length;
      const actual = vRows.filter(r => months.has(r.bndTrfsForecast) && isActualStage(r.leadIndicator)).length;
      result.push({ quarter, vendor, plan, actual });
    }
  }

  return result;
}

// ── Funnel Counts ─────────────────────────────────────────────────────────────

export function funnelCounts(rows: SiteRow[]): FunnelCount[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const s = row.leadIndicator;
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }

  return STAGE_ORDER.map((stage, i) => ({
    stage,
    count: counts.get(stage) ?? 0,
    stageIndex: i,
  }));
}

// ── Program Velocity ──────────────────────────────────────────────────────────

export function programVelocity(rows: SiteRow[]): ProgramVelocityItem[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const p = row.program;
    counts.set(p, (counts.get(p) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([program, count]) => ({ program, count }))
    .sort((a, b) => b.count - a.count);
}

// ── Build Plan by Month ───────────────────────────────────────────────────────

export function buildPlanByMonth(rows: SiteRow[]): BuildPlanItem[] {
  return ALL_MONTHS.map(month => ({
    month,
    count: rows.filter(r => r.bndTrfsForecast === month).length,
  }));
}

// ── Tech Tier Performance ─────────────────────────────────────────────────────

export function techTierPerformance(rows: SiteRow[]): TechTierRow[] {
  const parseTechTier = (plannedTech: string) => {
    const su = (plannedTech || '').toUpperCase();
    if (su.includes('64T64R')) return '5G/Massive MIMO (64T64R)';
    if (su.includes('32T32R')) return '5G/MIMO (32T32R)';
    if (su.includes('8T8R')) return 'Mid-Tier (8T8R)';
    return 'Standard 4G';
  };

  const tiers = ['5G/Massive MIMO (64T64R)', '5G/MIMO (32T32R)', 'Mid-Tier (8T8R)', 'Standard 4G'];

  return tiers.map(tech => {
    const tierRows = rows.filter(r => parseTechTier(r.plannedTech) === tech);
    const plan = tierRows.length;
    const actual = tierRows.filter(r => r.leadIndicator === '[11] TRFS').length;
    return { tech, plan, actual, pctTrfs: pct(actual, plan) };
  });
}

// ── RFI Rally by Vendor ───────────────────────────────────────────────────────

export function rfiRallyByVendor(rows: SiteRow[]): RfiRallyByVendorItem[] {
  // Stages [06] through [11] — all "actual" stages
  const rallyStages = STAGE_ORDER.slice(STAGE_ORDER.indexOf('[06] S-RFI'));

  return rallyStages.map(stage => {
    const stageRows = rows.filter(r => r.leadIndicator === stage);
    return {
      stage,
      ericsson: stageRows.filter(r => r.vendor === 'Ericsson').length,
      nokia:    stageRows.filter(r => r.vendor === 'Nokia').length,
      ht:       stageRows.filter(r => r.vendor === 'HT').length,
    };
  });
}

// ── TCO Performance ───────────────────────────────────────────────────────────

export function tcoPerformance(rows: SiteRow[]): TcoPerformanceItem[] {
  const vendorMap = new Map<string, SiteRow[]>();
  for (const row of rows) {
    const v = row.tcoBauVendor || 'Unknown';
    if (!vendorMap.has(v)) vendorMap.set(v, []);
    vendorMap.get(v)!.push(row);
  }

  return Array.from(vendorMap.entries())
    .map(([vendor, vRows]) => {
      const total = vRows.length;
      const rtbAndAbove = vRows.filter(r => stageIndex(r.leadIndicator) >= stageIndex('[04] RTB')).length;
      return { vendor, total, rtbAndAbove, pctRtb: pct(rtbAndAbove, total) };
    })
    .sort((a, b) => b.total - a.total);
}

// ── TCO Award Status ──────────────────────────────────────────────────────────

export function tcoAwardStatus(rows: SiteRow[]): TcoAwardRow[] {
  const vendors = [...new Set(rows.map(r => r.tcoBauVendor || 'Unknown'))].sort();
  const stages = STAGE_ORDER;

  return vendors.map(vendor => {
    const row: TcoAwardRow = { tcoVendor: vendor };
    for (const stage of stages) {
      row[stage] = rows.filter(r => (r.tcoBauVendor || 'Unknown') === vendor && r.leadIndicator === stage).length;
    }
    row['Total'] = rows.filter(r => (r.tcoBauVendor || 'Unknown') === vendor).length;
    return row;
  });
}

// ── Vendor Completion ─────────────────────────────────────────────────────────

export function vendorCompletion(rows: SiteRow[]): VendorCompletionRow[] {
  return VENDORS.map(vendor => {
    const vRows = rows.filter(r => r.vendor === vendor);
    const total = vRows.length;
    const rtbAndAbove = vRows.filter(r => stageIndex(r.leadIndicator) >= stageIndex('[04] RTB')).length;
    return { vendor, total, rtbAndAbove, pctCompletion: pct(rtbAndAbove, total) };
  });
}

// ── RFI Rally Detailed ────────────────────────────────────────────────────────

export function rfiRallyDetailed(rows: SiteRow[]): RfiDetailedRow[] {
  const rftiStages = new Set(['[08] RFI', '[09] RFI with TRS', '[10] ON-AIR', '[11] TRFS']);
  const groups = new Map<string, { vendor: string; cleanProgram: string; rows: SiteRow[] }>();

  for (const row of rows) {
    const cleanProgram = row.program.toUpperCase();
    const key = `${row.vendor}|${cleanProgram}`;
    if (!groups.has(key)) {
      groups.set(key, { vendor: row.vendor, cleanProgram, rows: [] });
    }
    groups.get(key)!.rows.push(row);
  }

  return Array.from(groups.values())
    .map(g => {
      const pipeline = g.rows.length;
      const rfti = g.rows.filter(r => rftiStages.has(r.leadIndicator)).length;
      const trfsActual = g.rows.filter(r => r.leadIndicator === '[11] TRFS').length;
      return {
        vendor: g.vendor,
        cleanProgram: g.cleanProgram,
        pipeline,
        rfti,
        pctRfti: pct(rfti, pipeline),
        trfsActual,
        pctTrfs: pct(trfsActual, pipeline),
        trsPending: pipeline - rfti,
      };
    })
    .sort((a, b) => {
      if (a.vendor < b.vendor) return -1;
      if (a.vendor > b.vendor) return 1;
      return b.pipeline - a.pipeline;
    });
}

// ── Forecast Variance ─────────────────────────────────────────────────────────

export function forecastVariance(rows: SiteRow[]): ForecastVarianceRow[] {
  return ALL_MONTHS.map(month => {
    const conservativeFC = rows.filter(r => r.conservativeFC === month).length;
    const bndForecast = rows.filter(r => r.bndTrfsForecast === month).length;
    return {
      month,
      conservativeFC,
      bndForecast,
      difference: bndForecast - conservativeFC,
    };
  });
}

// ── Province Plan vs Actual ───────────────────────────────────────────────────

export function provincePlanVsActual(rows: SiteRow[]): ProvinceBarItem[] {
  const provinceMap = new Map<string, { plan: number; actual: number }>();
  for (const row of rows) {
    const p = row.province || 'Unknown';
    if (!provinceMap.has(p)) provinceMap.set(p, { plan: 0, actual: 0 });
    const entry = provinceMap.get(p)!;
    entry.plan++;
    if (row.leadIndicator === '[11] TRFS') entry.actual++;
  }

  return Array.from(provinceMap.entries())
    .map(([province, { plan, actual }]) => ({ province, plan, actual }))
    .sort((a, b) => b.plan - a.plan);
}

// ── Town Plan vs Actual ───────────────────────────────────────────────────────

export function townPlanVsActual(rows: SiteRow[]): TownPlanRow[] {
  const townMap = new Map<string, { province: string; plan: number; actual: number }>();
  for (const row of rows) {
    const key = `${row.cityTown}|${row.province}`;
    if (!townMap.has(key)) townMap.set(key, { province: row.province, plan: 0, actual: 0 });
    const entry = townMap.get(key)!;
    entry.plan++;
    if (row.leadIndicator === '[11] TRFS') entry.actual++;
  }

  return Array.from(townMap.entries())
    .map(([key, { province, plan, actual }]) => ({
      cityTown: key.split('|')[0],
      province,
      totalPlan: plan,
      totalActual: actual,
      pctTrfs: pct(actual, plan),
    }))
    .sort((a, b) => b.totalPlan - a.totalPlan);
}

// ── Site Table ────────────────────────────────────────────────────────────────

export function siteTable(rows: SiteRow[]): SiteTableRow[] {
  return rows.map(r => ({
    serialNumber: r.serialNumber,
    vendor:       r.vendor,
    tcoVendor:    r.tcoBauVendor,
    province:     r.province,
    cityTown:     r.cityTown,
    program:      r.program,
    stage:        r.leadIndicator,
    lat:          r.lat,
    long:         r.long,
  }));
}

// ── §6.6 Ongoing Wireless Integration ────────────────────────────────────────
//
// Target: 17 rows (from source dashboard pagination footer).
// Empirically tested candidates; the winning filter is:
//   stage [07] S-RFI w/ TRS  OR  stage [09] RFI with TRS
// which yields exactly 17 records.

export function wirelessIntegration(rows: SiteRow[]): WirelessIntegrationRow[] {
  const WIRELESS_STAGES = new Set(['[07] S-RFI w/ TRS', '[09] RFI with TRS']);
  return rows
    .filter(r => WIRELESS_STAGES.has(r.leadIndicator))
    .map(r => ({
      serialNumber: r.serialNumber,
      vendor:       r.vendor,
      province:     r.province,
      cityTown:     r.cityTown,
      stage:        r.leadIndicator,
      trsActual:    r.bndTrfsForecast,
    }));
}

// ── §6.6 Ongoing Transport ────────────────────────────────────────────────────
//
// True row count unknown. Building with the most logical filter:
// rows that have a valid B&D TRFS Forecast month (i.e., not yet completed/TRFS).

export function transport(rows: SiteRow[]): TransportRow[] {
  const MONTH_SET = new Set([...Q3_MONTHS, ...Q4_MONTHS]);
  return rows
    .filter(r => MONTH_SET.has(r.bndTrfsForecast) && r.leadIndicator !== '[11] TRFS')
    .map(r => ({
      serialNumber:    r.serialNumber,
      vendor:          r.vendor,
      tcoVendor:       r.tcoBauVendor,
      province:        r.province,
      cityTown:        r.cityTown,
      bndTrfsForecast: r.bndTrfsForecast,
    }));
}
