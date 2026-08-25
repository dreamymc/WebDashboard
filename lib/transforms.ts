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
  Q1_MONTHS,
  Q2_MONTHS,
  Q3_MONTHS,
  Q4_MONTHS,
  ALL_MONTHS,
  stageIndex,
  normalizeMonth,
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
  return Math.round((actual / total) * 100); // 0 decimal places
}

// ── KPI Summary ───────────────────────────────────────────────────────────────

export function kpiSummary(rows: SiteRow[]): KpiSummary {
  const planRows = rows.filter(r => r.isPlan);
  
  // KPI summary percentages should probably be based on the Plan to make sense.
  // We use planRows for everything in KPI to be safe, as it represents the 2026 Plan performance.
  const totalPlan = planRows.length;
  
  const rtbCount = planRows.filter(r => stageIndex(r.leadIndicator) >= stageIndex('RTB')).length;
  const rftiCount = planRows.filter(r => stageIndex(r.leadIndicator) >= stageIndex('S-RFI')).length;
  const trfsCount = planRows.filter(r => r.leadIndicator === 'TRFS').length;

  return {
    totalPipeline: rows.length,
    totalPlan,
    q1Plan:      planRows.filter(r => Q1_MONTHS.has(r.bndTrfsForecast)).length,
    q2Plan:      planRows.filter(r => Q2_MONTHS.has(r.bndTrfsForecast)).length,
    q3Plan:      planRows.filter(r => Q3_MONTHS.has(r.bndTrfsForecast)).length,
    q4Plan:      planRows.filter(r => Q4_MONTHS.has(r.bndTrfsForecast)).length,
    q1Actual:    planRows.filter(r => Q1_MONTHS.has(r.bndTrfsForecast) && isActualStage(r.leadIndicator)).length,
    q2Actual:    planRows.filter(r => Q2_MONTHS.has(r.bndTrfsForecast) && isActualStage(r.leadIndicator)).length,
    q3Actual:    planRows.filter(r => Q3_MONTHS.has(r.bndTrfsForecast) && isActualStage(r.leadIndicator)).length,
    q4Actual:    planRows.filter(r => Q4_MONTHS.has(r.bndTrfsForecast) && isActualStage(r.leadIndicator)).length,
    rtbCount,
    pctRtb:      pct(rtbCount, totalPlan),
    rftiCount,
    pctRfti:     pct(rftiCount, totalPlan),
    pctTrfs:     pct(trfsCount, totalPlan),
    trfsCount,
    onAirCount:  planRows.filter(r => r.leadIndicator === 'ON-AIR').length,
    rfiCount:    planRows.filter(r => r.leadIndicator === 'RFI').length,
  };
}

// ── Quarterly Plan vs Actual ──────────────────────────────────────────────────

export function quarterlyPlanVsActual(rows: SiteRow[]): QuarterlyPlanVsActual[] {
  const planRows = rows.filter(r => r.isPlan);
  const result: QuarterlyPlanVsActual[] = [];

  for (const quarter of ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'] as const) {
    const months = quarter === 'Q1 (Jan-Mar)' ? Q1_MONTHS :
                   quarter === 'Q2 (Apr-Jun)' ? Q2_MONTHS :
                   quarter === 'Q3 (Jul-Sep)' ? Q3_MONTHS : Q4_MONTHS;

    const allPlan = planRows.filter(r => months.has(r.bndTrfsForecast)).length;
    const allActual = planRows.filter(r => months.has(r.bndTrfsForecast) && isActualStage(r.leadIndicator)).length;
    result.push({ quarter, vendor: 'Total', plan: allPlan, actual: allActual });

    for (const vendor of VENDORS) {
      const vRows = planRows.filter(r => r.vendor === vendor);
      const plan = vRows.filter(r => months.has(r.bndTrfsForecast)).length;
      const actual = vRows.filter(r => months.has(r.bndTrfsForecast) && isActualStage(r.leadIndicator)).length;
      result.push({ quarter, vendor, plan, actual });
    }
  }

  return result;
}


// ── Early Stage Pie Chart ──────────────────────────────────────────────────────

export function earlyStagePieChart(rows: SiteRow[]): EarlyStagePieData[] {
  // Use all rows (the full pipeline), because early stage sites 
  // (like 'For Awarding') do not belong to the 2026 Plan.
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.leadIndicator, (counts.get(row.leadIndicator) ?? 0) + 1);
  }

  let activeCount = 0;
  for (const [key, val] of counts.entries()) {
    if (!['w/ ISSUES', 'Returned/ Rejected', 'FOR AWARDING'].includes(key)) {
      activeCount += val;
    }
  }

  return [
    { name: 'With Issues', value: counts.get('w/ ISSUES') ?? 0, fill: '#ef4444' }, // red-500
    { name: 'Returned/Rejected', value: counts.get('Returned/ Rejected') ?? 0, fill: '#f97316' }, // orange-500
    { name: 'For Awarding', value: counts.get('FOR AWARDING') ?? 0, fill: '#64748b' }, // slate-500
    { name: 'Active', value: activeCount, fill: '#3b82f6' }, // blue-500
  ].filter(d => d.value > 0);
}

// ── Funnel Counts ─────────────────────────────────────────────────────────────

export function funnelCounts(rows: SiteRow[]): FunnelCount[] {
  const planRows = rows.filter(r => r.isPlan);
  const counts = new Map<string, number>();
  for (const row of planRows) {
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
  const planRows = rows.filter(r => r.isPlan);
  const counts = new Map<string, number>();
  for (const row of planRows) {
    const p = row.program;
    counts.set(p, (counts.get(p) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([program, count]) => ({ program, count }))
    .sort((a, b) => b.count - a.count);
}

// ── Build Plan by Month ───────────────────────────────────────────────────────

export function buildPlanByMonth(rows: SiteRow[], buildPlanFilter: string | null = null): BuildPlanItem[] {
  const planRows = rows.filter(r => r.isPlan);
  return ALL_MONTHS.map(month => ({
    month,
    count: planRows.filter(r => {
      let targetVal = r.bndTrfsForecast;
      
      if (buildPlanFilter === "Q1 BP") {
        targetVal = normalizeMonth(r.q1Bp);
      } else if (buildPlanFilter === "Q2 BP") {
        targetVal = normalizeMonth(r.q2Bp);
      } else if (buildPlanFilter === "Q3 BP") {
        targetVal = normalizeMonth(r.q3Bp);
      } else if (buildPlanFilter === "Q4 BP") {
        targetVal = normalizeMonth(r.q4Bp);
      }
      
      return targetVal === month;
    }).length,
  }));
}

// ── Tech Tier Performance ─────────────────────────────────────────────────────

export function techTierPerformance(rows: SiteRow[]): TechTierRow[] {
  const planRows = rows.filter(r => r.isPlan);
  const parseTechTier = (plannedTech: string) => {
    const su = (plannedTech || '').toUpperCase();
    if (su.includes('64T64R')) return '5G/Massive MIMO (64T64R)';
    if (su.includes('32T32R')) return '5G/MIMO (32T32R)';
    if (su.includes('8T8R')) return 'Mid-Tier (8T8R)';
    return 'Standard 4G';
  };

  const tiers = ['5G/Massive MIMO (64T64R)', '5G/MIMO (32T32R)', 'Mid-Tier (8T8R)', 'Standard 4G'];

  return tiers.map(tech => {
    const tierRows = planRows.filter(r => parseTechTier(r.plannedTech) === tech);
    const plan = tierRows.length;
    const actual = tierRows.filter(r => r.leadIndicator === 'TRFS').length;
    return { tech, plan, actual, pctTrfs: pct(actual, plan) };
  });
}

// ── RFI Rally by Vendor ───────────────────────────────────────────────────────

export function rfiRallyByVendor(rows: SiteRow[]): RfiRallyByVendorItem[] {
  const planRows = rows.filter(r => r.isPlan);
  // Stages [06] through [11] — all "actual" stages
  const rallyStages = STAGE_ORDER.slice(STAGE_ORDER.indexOf('S-RFI'));

  return rallyStages.map(stage => {
    const stageRows = planRows.filter(r => r.leadIndicator === stage);
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
  const planRows = rows.filter(r => r.isPlan);
  const vendorMap = new Map<string, SiteRow[]>();
  for (const row of planRows) {
    const v = row.tcoBauVendor || 'Unknown';
    if (!vendorMap.has(v)) vendorMap.set(v, []);
    vendorMap.get(v)!.push(row);
  }

  return Array.from(vendorMap.entries())
    .map(([vendor, vRows]) => {
      const total = vRows.length;
      const rtbAndAbove = vRows.filter(r => stageIndex(r.leadIndicator) >= stageIndex('RTB')).length;
      return { vendor, total, rtbAndAbove, pctRtb: pct(rtbAndAbove, total) };
    })
    .sort((a, b) => b.total - a.total);
}

// ── TCO Award Status ──────────────────────────────────────────────────────────

export function tcoAwardStatus(rows: SiteRow[]): TcoAwardRow[] {
  const planRows = rows.filter(r => r.isPlan);
  const vendors = [...new Set(planRows.map(r => r.tcoBauVendor || 'Unknown'))].sort();
  const stages = STAGE_ORDER;

  return vendors.map(vendor => {
    const row: TcoAwardRow = { tcoVendor: vendor };
    for (const stage of stages) {
      row[stage] = planRows.filter(r => (r.tcoBauVendor || 'Unknown') === vendor && r.leadIndicator === stage).length;
    }
    row['Total'] = planRows.filter(r => (r.tcoBauVendor || 'Unknown') === vendor).length;
    return row;
  });
}

// ── Vendor Completion ─────────────────────────────────────────────────────────

export function vendorCompletion(rows: SiteRow[]): VendorCompletionRow[] {
  const planRows = rows.filter(r => r.isPlan);
  return VENDORS.map(vendor => {
    const vRows = planRows.filter(r => r.vendor === vendor);
    const total = vRows.length;
    const rtbAndAbove = vRows.filter(r => stageIndex(r.leadIndicator) >= stageIndex('RTB')).length;
    return { vendor, total, rtbAndAbove, pctCompletion: pct(rtbAndAbove, total) };
  });
}

// ── RFI Rally Detailed ────────────────────────────────────────────────────────

export function rfiRallyDetailed(rows: SiteRow[]): RfiDetailedRow[] {
  const planRows = rows.filter(r => r.isPlan);
  const rftiStages = new Set(['RFI', 'RFI with TRS', 'ON-AIR', 'TRFS']);
  const groups = new Map<string, { vendor: string; cleanProgram: string; planRows: SiteRow[] }>();

  for (const row of planRows) {
    const cleanProgram = row.program.toUpperCase();
    const key = `${row.vendor}|${cleanProgram}`;
    if (!groups.has(key)) {
      groups.set(key, { vendor: row.vendor, cleanProgram, planRows: [] });
    }
    groups.get(key)!.planRows.push(row);
  }

  return Array.from(groups.values())
    .map(g => {
      const pipeline = g.planRows.length;
      const rfti = g.planRows.filter(r => rftiStages.has(r.leadIndicator)).length;
      const trfsActual = g.planRows.filter(r => r.leadIndicator === 'TRFS').length;
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
  const planRows = rows.filter(r => r.isPlan);
  return ALL_MONTHS.map(month => {
    const conservativeFC = planRows.filter(r => r.conservativeFC === month).length;
    const bndForecast = planRows.filter(r => r.bndTrfsForecast === month).length;
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
  const planRows = rows.filter(r => r.isPlan);
  const provinceMap = new Map<string, { plan: number; actual: number }>();
  for (const row of planRows) {
    const p = row.province || 'Unknown';
    if (!provinceMap.has(p)) provinceMap.set(p, { plan: 0, actual: 0 });
    const entry = provinceMap.get(p)!;
    entry.plan++;
    if (row.leadIndicator === 'TRFS') entry.actual++;
  }

  return Array.from(provinceMap.entries())
    .map(([province, { plan, actual }]) => ({ province, plan, actual }))
    .sort((a, b) => b.plan - a.plan);
}

// ── Town Plan vs Actual ───────────────────────────────────────────────────────

export function townPlanVsActual(rows: SiteRow[]): TownPlanRow[] {
  const planRows = rows.filter(r => r.isPlan);
  const townMap = new Map<string, { province: string; plan: number; actual: number }>();
  for (const row of planRows) {
    const key = `${row.cityTown}|${row.province}`;
    if (!townMap.has(key)) townMap.set(key, { province: row.province, plan: 0, actual: 0 });
    const entry = townMap.get(key)!;
    entry.plan++;
    if (row.leadIndicator === 'TRFS') entry.actual++;
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
  const planRows = rows.filter(r => r.isPlan);
  return planRows.map(r => ({
    serialNumber: r.serialNumber,
    srName: r.srName,
    plaId: r.plaId,
    bcfName: r.bcfName,
    vendor: r.vendor,
    tcoVendor: r.tcoBauVendor,
    program: r.program,
    leadIndicator: r.leadIndicator,
    buildForecast: r.conservativeFC,
    lat: r.lat,
    long: r.long,
    province: r.province,
    cityTown: r.cityTown,
  }));
}

// ── §6.6 Ongoing Wireless Integration ────────────────────────────────────────
//
// Target: 17 rows (from source dashboard pagination footer).
// Empirically tested candidates; the winning filter is:
//   stage [07] S-RFI w/ TRS  OR  stage [09] RFI with TRS
// which yields exactly 17 records.

export function wirelessIntegration(rows: SiteRow[]): WirelessIntegrationRow[] {
  const planRows = rows.filter(r => r.isPlan);
  const WIRELESS_STAGES = new Set(['S-RFI w/ TRS', 'RFI with TRS']);
  return planRows
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
  const planRows = rows.filter(r => r.isPlan);
  const MONTH_SET = new Set([...Q3_MONTHS, ...Q4_MONTHS]);
  return planRows
    .filter(r => MONTH_SET.has(r.bndTrfsForecast) && r.leadIndicator !== 'TRFS')
    .map(r => ({
      serialNumber:    r.serialNumber,
      vendor:          r.vendor,
      tcoVendor:       r.tcoBauVendor,
      province:        r.province,
      cityTown:        r.cityTown,
      bndTrfsForecast: r.bndTrfsForecast,
    }));
}

export function locationDirectory(rows: SiteRow[]) {
  const planRows = rows.filter(r => r.isPlan);
  return planRows.map(r => ({
    serialNumber: r.serialNumber,
    province: r.province,
    town: r.cityTown,
    address: r.address,
    lat: r.lat,
    long: r.long,
  }));
}
export interface EarlyStagePieData {
  name: string;
  value: number;
  fill: string;
}
