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

  // Fetch from row 2 downward. Row 2 is headers, Row 3+ is data.
  // Using A2:ZZ ensures we capture all columns even if they are added or moved.
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A2:ZZ',
  });

  const rawData = response.data.values ?? [];
  if (rawData.length < 2) return []; // Need at least headers and one data row

  const headers = rawData[0].map(h => normalizeHeader(h));
  const dataRows = rawData.slice(1);

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
    VENDOR:            headers.indexOf('vendor'), // Exact match to avoid 'tco/bau vendor'
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
  };

  const rows: SiteRow[] = [];
  for (const raw of dataRows) {
    const serialNumber = cell(raw, COL.SERIAL_NUMBER);
    // §6.1: filter rows where SERIAL NUMBER is null/blank
    if (!serialNumber) continue;

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
    });
  }

  return rows;
}
