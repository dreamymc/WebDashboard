/**
 * Google Sheets data fetcher — server-only.
 * Uses googleapis with JWT auth from the service account JSON in env.
 * Returns raw rows as string arrays, starting from row 3 (headers on row 2).
 */

import { google } from 'googleapis';
import type { SiteRow } from './types';
import { normalizeProgram, normalizeMonth, parseCoord, normalizeVendor } from './normalizers';

// Column indices (0-based) matching the sheet layout:
// SERIAL NUMBER, Lead Indicator (LOCAL), VENDOR, SR Name, TCO/BAU VENDOR,
// PLA ID, Province, CITY/ TOWN, BCF NAME, PROGRAM, PLANNED TECH,
// LAT, LONG, CONSERVATIVE FC, B&D TRFS Forecast
const COL = {
  SERIAL_NUMBER:     0,
  LEAD_INDICATOR:    1,
  VENDOR:            2,
  SR_NAME:           3,
  TCO_BAU_VENDOR:    4,
  PLA_ID:            5,
  PROVINCE:          6,
  CITY_TOWN:         7,
  BCF_NAME:          8,
  PROGRAM:           9,
  PLANNED_TECH:      10,
  LAT:               11,
  LONG:              12,
  CONSERVATIVE_FC:   13,
  BND_TRFS_FORECAST: 14,
} as const;

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
  return (row[idx] ?? '').toString().trim();
}

export async function fetchSheetRows(): Promise<SiteRow[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('GOOGLE_SHEET_ID not set');

  const sheets = getSheetService();

  // Headers on row 2, data from row 3.
  // Fetch from row 3 downward. Column range A–O covers all 15 columns.
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A3:O',   // row 3 onwards, columns A–O
  });

  const rawRows = response.data.values ?? [];

  const rows: SiteRow[] = [];
  for (const raw of rawRows) {
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
      program:          normalizeProgram(cell(raw, COL.PROGRAM)),         // §6.5
      plannedTech:      cell(raw, COL.PLANNED_TECH),
      lat:              parseCoord(cell(raw, COL.LAT)),                   // §6.5
      long:             parseCoord(cell(raw, COL.LONG)),                  // §6.5
      conservativeFC:   normalizeMonth(cell(raw, COL.CONSERVATIVE_FC)),
      bndTrfsForecast:  normalizeMonth(cell(raw, COL.BND_TRFS_FORECAST)),
    });
  }

  return rows;
}
