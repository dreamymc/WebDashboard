/**
 * Google Sheets data fetcher — server-only.
 * Uses googleapis with JWT auth from the service account JSON in env.
 * Returns raw rows as string arrays, mapping columns dynamically by header names.
 */

import { google } from 'googleapis';
import type { SiteRow } from './types';
import { normalizeProgram, normalizeMonth, parseCoord, normalizeVendor } from './normalizers';

function getSheetService() {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');

  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return google.sheets({ version: 'v4', auth });
}

function cell(row: string[], idx: number): string {
  if (idx < 0 || idx >= row.length) return '';
  return (row[idx] ?? '').toString().trim();
}

function normalizeHeader(h: string): string {
  return h.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

export async function fetchSheetRows(): Promise<SiteRow[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('GOOGLE_SHEET_ID not set');

  const sheets = getSheetService();

  // Dynamically find Sheet3 or fallback to first sheet
  const metadata = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sheetNames = metadata.data.sheets?.map(s => s.properties?.title) || [];
  const targetSheet = sheetNames.find(s => s?.toLowerCase().includes('sheet3')) || sheetNames[0];

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${targetSheet}'!A1:ZZ`,
  });

  const rawData = response.data.values ?? [];
  if (rawData.length < 1) return [];

  // Dynamically find header row
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(rawData.length, 10); i++) {
    const rowStr = rawData[i].map(c => String(c).toLowerCase());
    if (rowStr.some(c => c.includes('serial number') || c.includes('vendor'))) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) return []; // Could not find headers

  const headers = rawData[headerRowIdx].map(h => normalizeHeader(h));
  const dataRows = rawData.slice(headerRowIdx + 1);

  // Helper to meticulously find columns by name, with fallbacks for slight renaming
  const findCol = (possibleNames: string[], exactOnly: boolean = false) => {
    for (const name of possibleNames) {
      const idx = headers.indexOf(name);
      if (idx !== -1) return idx;
    }
    if (exactOnly) return -1;
    // Fallback: search for partial match
    for (const name of possibleNames) {
      const idx = headers.findIndex(h => h.includes(name));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const COL = {
    SERIAL_NUMBER:     findCol(['serial number']),
    LEAD_INDICATOR:    findCol(['lead indicator (local)', 'lead indicator']),
    VENDOR:            findCol(['access vendor', 'vendor']), // Updated to prefer ACCESS VENDOR
    SR_NAME:           findCol(['sr name']),
    TCO_BAU_VENDOR:    findCol(['tco/bau vendor', 'tco vendor']),
    PLA_ID:            findCol(['pla id']),
    PROVINCE:          findCol(['province']),
    CITY_TOWN:         findCol(['city/ town', 'city/town', 'town']),
    BCF_NAME:          findCol(['bcf name']),
    PROGRAM:           findCol(['program']),
    PLANNED_TECH:      findCol(['planned tech']),
    LAT:               findCol(['lat - rtb (rre tracker)', 'lat - rtb', 'lat']),
    LONG:              findCol(['long - rtb (rre tracker)', 'long - rtb', 'long']),
    CONSERVATIVE_FC:   findCol(['conservative fc', 'conservative forecast']),
    BND_TRFS_FORECAST: findCol(['b&d trfs forecast', 'b&d']),
    FILTER_1:          findCol(['filter 1']),
    PRIO_1:            findCol(['prio 1']),
    PRIO_2:            findCol(['prio 2']),
  };

  const rows: SiteRow[] = [];
  for (const raw of dataRows) {
    const serialNumber = cell(raw, COL.SERIAL_NUMBER);
    // filter rows where SERIAL NUMBER is null/blank
    if (!serialNumber) continue;

    const filter1 = cell(raw, COL.FILTER_1);
    const prio1 = cell(raw, COL.PRIO_1);
    const prio2 = cell(raw, COL.PRIO_2);
    const isPlan = String(filter1).trim() === '2026';

    rows.push({
      serialNumber,
      leadIndicator:    cell(raw, COL.LEAD_INDICATOR),
      vendor:           normalizeVendor(cell(raw, COL.VENDOR)),
      srName:           cell(raw, COL.SR_NAME),
      tcoBauVendor:     cell(raw, COL.TCO_BAU_VENDOR),
      plaId:            cell(raw, COL.PLA_ID),
      province:         cell(raw, COL.PROVINCE),
      cityTown:         cell(raw, COL.CITY_TOWN),
      bcfName:          cell(raw, COL.BCF_NAME),
      program:          normalizeProgram(cell(raw, COL.PROGRAM)),
      plannedTech:      cell(raw, COL.PLANNED_TECH),
      lat:              parseCoord(cell(raw, COL.LAT)),
      long:             parseCoord(cell(raw, COL.LONG)),
      conservativeFC:   normalizeMonth(cell(raw, COL.CONSERVATIVE_FC)),
      bndTrfsForecast:  normalizeMonth(cell(raw, COL.BND_TRFS_FORECAST)),
      filter1,
      prio1,
      prio2,
      isPlan,
    });
  }

  return rows;
}

export async function fetchSheet2BuildPlan(): Promise<import('./types').NewBuildPlanItem[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) return [];

  const sheets = getSheetService();

  try {
    const metadata = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const sheetNames = metadata.data.sheets?.map(s => s.properties?.title) || [];
    const targetSheet = sheetNames.find(s => s?.toLowerCase().includes('sheet2'));
    if (!targetSheet) return [];

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${targetSheet}!A1:Z`,
    });

    const rawData = response.data.values ?? [];
    if (rawData.length < 2) return [];

    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
      if (rawData[i].some(c => c?.toString().toLowerCase().includes('month'))) {
        headerRowIdx = i;
        break;
      }
    }
    if (headerRowIdx === -1) return [];

    const headers = rawData[headerRowIdx].map(h => normalizeHeader(h?.toString() || ''));
    const monthCol = headers.indexOf('month');
    const planCol = headers.indexOf('plan');
    const actualCol = headers.indexOf('actual');
    
    // Find the build outlook column
    let buildOutlookCol = headers.findIndex(h => h.includes('outlook'));
    if (buildOutlookCol === -1) {
       buildOutlookCol = headers.findIndex(h => h.includes('build'));
    }

    if (monthCol === -1) return [];

    const result: import('./types').NewBuildPlanItem[] = [];
    for (let i = headerRowIdx + 1; i < rawData.length; i++) {
      const row = rawData[i];
      const monthRaw = cell(row, monthCol);
      if (!monthRaw) continue; // stop when empty
      
      const p = cell(row, planCol);
      const a = cell(row, actualCol);
      const o = buildOutlookCol !== -1 ? cell(row, buildOutlookCol) : '';

      // we only break if month is blank.
      const parsedMonth = monthRaw.substring(0, 3).toUpperCase();
      const validMonths = new Set(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']);
      if (!validMonths.has(parsedMonth)) continue;

      result.push({
        month: parsedMonth,
        plan: p ? parseFloat(p) : null,
        actual: a ? parseFloat(a) : null,
        buildOutlook: o ? parseFloat(o) : null,
      });
    }

    return result;
  } catch (err) {
    console.error("Error fetching Sheet2:", err);
    return [];
  }
}
