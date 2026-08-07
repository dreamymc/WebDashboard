/**
 * Fixture-based unit tests for lib/transforms.ts.
 * Tests run against a frozen snapshot (tests/fixtures/data.json) — never live data.
 *
 * Key assertions (§11 of T7_WEB_DASHBOARD_MASTER_PLAN.md):
 *   totalPlan === 262
 *   q3Plan === 81       q4Plan === 72
 *   q3Actual === 62     q4Actual === 9     ← catches §6.4 stage-index trap
 *   trfsCount === 109
 *   ericssonQ3Actual === 43
 *   augConservativeFC === 41    augBndForecast === 44
 */

import { describe, it, expect } from 'vitest';
import fixtureRows from './fixtures/data.json';
import type { SiteRow } from '../lib/types';
import {
  kpiSummary,
  quarterlyPlanVsActual,
  funnelCounts,
  forecastVariance,
  wirelessIntegration,
  transport,
} from '../lib/transforms';

const rows = fixtureRows as SiteRow[];

// ── §11 Required assertions ───────────────────────────────────────────────────

describe('kpiSummary — §11 fixture assertions', () => {
  const kpi = kpiSummary(rows);

  it('totalPlan === 262', () => expect(kpi.totalPlan).toBe(262));
  it('q3Plan === 81',     () => expect(kpi.q3Plan).toBe(81));
  it('q4Plan === 72',     () => expect(kpi.q4Plan).toBe(72));

  it('q3Actual === 62 (§6.4 stage-index trap)', () => {
    // If implemented as a name-list match this would be 45, not 62.
    expect(kpi.q3Actual).toBe(62);
  });

  it('q4Actual === 9 (§6.4 stage-index trap)', () => {
    expect(kpi.q4Actual).toBe(9);
  });

  it('trfsCount === 109', () => expect(kpi.trfsCount).toBe(109));
});

// ── Per-vendor Q3/Q4 breakdown ────────────────────────────────────────────────

describe('quarterlyPlanVsActual — per-vendor breakdown (§6.4)', () => {
  const data = quarterlyPlanVsActual(rows);
  const get = (quarter: string, vendor: string) =>
    data.find(d => d.quarter === quarter && d.vendor === vendor)!;

  it('Ericsson Q3 Plan === 60', () => expect(get('Q3', 'Ericsson').plan).toBe(60));
  it('Ericsson Q3 Actual === 43', () => expect(get('Q3', 'Ericsson').actual).toBe(43));
  it('Ericsson Q4 Plan === 52',   () => expect(get('Q4', 'Ericsson').plan).toBe(52));
  it('Ericsson Q4 Actual === 4',  () => expect(get('Q4', 'Ericsson').actual).toBe(4));

  it('Nokia Q3 Plan === 7',   () => expect(get('Q3', 'Nokia').plan).toBe(7));
  it('Nokia Q3 Actual === 7', () => expect(get('Q3', 'Nokia').actual).toBe(7));
  it('Nokia Q4 Plan === 6',   () => expect(get('Q4', 'Nokia').plan).toBe(6));
  it('Nokia Q4 Actual === 4', () => expect(get('Q4', 'Nokia').actual).toBe(4));

  it('HT Q3 Plan === 14',   () => expect(get('Q3', 'HT').plan).toBe(14));
  it('HT Q3 Actual === 12', () => expect(get('Q3', 'HT').actual).toBe(12));
  it('HT Q4 Plan === 14',   () => expect(get('Q4', 'HT').plan).toBe(14));
  it('HT Q4 Actual === 1',  () => expect(get('Q4', 'HT').actual).toBe(1));
});

// ── Forecast Variance ─────────────────────────────────────────────────────────

describe('forecastVariance — §6.4 verified values', () => {
  const data = forecastVariance(rows);
  const get = (month: string) => data.find(d => d.month === month)!;

  it('JUL conservativeFC === 14', () => expect(get('JUL').conservativeFC).toBe(14));
  it('JUL bndForecast === 15',    () => expect(get('JUL').bndForecast).toBe(15));
  it('AUG conservativeFC === 41', () => expect(get('AUG').conservativeFC).toBe(41));
  it('AUG bndForecast === 44',    () => expect(get('AUG').bndForecast).toBe(44));
  it('SEP conservativeFC === 14', () => expect(get('SEP').conservativeFC).toBe(14));
  it('SEP bndForecast === 22',    () => expect(get('SEP').bndForecast).toBe(22));
  it('OCT conservativeFC === 33', () => expect(get('OCT').conservativeFC).toBe(33));
  it('OCT bndForecast === 23',    () => expect(get('OCT').bndForecast).toBe(23));
  it('NOV conservativeFC === 34', () => expect(get('NOV').conservativeFC).toBe(34));
  it('NOV bndForecast === 32',    () => expect(get('NOV').bndForecast).toBe(32));
  it('DEC conservativeFC === 17', () => expect(get('DEC').conservativeFC).toBe(17));
  it('DEC bndForecast === 17',    () => expect(get('DEC').bndForecast).toBe(17));
});

// ── §6.6 Wireless Integration ─────────────────────────────────────────────────

describe('wirelessIntegration — §6.6 target = 17', () => {
  const data = wirelessIntegration(rows);
  it('count === 17', () => expect(data.length).toBe(17));
  it('contains only [07] and [09] stages', () => {
    const stages = new Set(data.map(d => d.stage));
    expect(stages.has('[07] S-RFI w/ TRS') || stages.has('[09] RFI with TRS')).toBe(true);
    expect([...stages].every(s => s === '[07] S-RFI w/ TRS' || s === '[09] RFI with TRS')).toBe(true);
  });
});

// ── §6.6 Transport (count reported, not matched) ───────────────────────────────

describe('transport — §6.6 (true count unknown, reporting only)', () => {
  const data = transport(rows);
  it('returns an array (count reported as empirical finding)', () => {
    expect(Array.isArray(data)).toBe(true);
    console.info(`  → Transport row count: ${data.length}`);
  });
});

// ── Funnel coverage ───────────────────────────────────────────────────────────

describe('funnelCounts', () => {
  const data = funnelCounts(rows);
  it('covers all 10 stages', () => expect(data.length).toBe(10));
  it('total count across stages === 262', () => {
    const total = data.reduce((s, d) => s + d.count, 0);
    expect(total).toBe(262);
  });
  it('[11] TRFS count === 109', () => {
    expect(data.find(d => d.stage === '[11] TRFS')!.count).toBe(109);
  });
});
