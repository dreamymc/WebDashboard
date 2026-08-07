#!/usr/bin/env tsx
/**
 * One-time script to fetch the live Google Sheet and save as a frozen fixture.
 * Run: npx tsx scripts/fetch-fixture.ts
 * Output: tests/fixtures/data.json (committed, used by unit tests)
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { normalizeProgram, normalizeMonth, parseCoord, normalizeVendor } from '../lib/normalizers';


dotenv.config({ path: '.env.local' });

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

async function main() {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) { console.error('GOOGLE_SERVICE_ACCOUNT_JSON not set'); process.exit(1); }
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) { console.error('GOOGLE_SHEET_ID not set'); process.exit(1); }

  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Fetching sheet...');
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'A3:O' });
  const rawRows = res.data.values ?? [];

  const rows = [];
  for (const raw of rawRows) {
    const serialNumber = ((raw[COL.SERIAL_NUMBER] ?? '') as string).toString().trim();
    if (!serialNumber) continue;
    rows.push({
      serialNumber,
      leadIndicator:   ((raw[COL.LEAD_INDICATOR] ?? '') as string).toString().trim(),
      vendor:          normalizeVendor(((raw[COL.VENDOR] ?? '') as string).toString().trim()),
      srName:          ((raw[COL.SR_NAME] ?? '') as string).toString().trim(),
      tcoBauVendor:    ((raw[COL.TCO_BAU_VENDOR] ?? '') as string).toString().trim(),
      plaId:           ((raw[COL.PLA_ID] ?? '') as string).toString().trim(),
      province:        ((raw[COL.PROVINCE] ?? '') as string).toString().trim(),
      cityTown:        ((raw[COL.CITY_TOWN] ?? '') as string).toString().trim(),
      bcfName:         ((raw[COL.BCF_NAME] ?? '') as string).toString().trim(),
      program:         normalizeProgram(((raw[COL.PROGRAM] ?? '') as string).toString().trim()),
      plannedTech:     ((raw[COL.PLANNED_TECH] ?? '') as string).toString().trim(),
      lat:             parseCoord(((raw[COL.LAT] ?? '') as string).toString().trim()),
      long:            parseCoord(((raw[COL.LONG] ?? '') as string).toString().trim()),
      conservativeFC:  normalizeMonth(((raw[COL.CONSERVATIVE_FC] ?? '') as string).toString().trim()),
      bndTrfsForecast: normalizeMonth(((raw[COL.BND_TRFS_FORECAST] ?? '') as string).toString().trim()),
    });
  }

  console.log(`Fetched ${rows.length} valid rows.`);

  const outDir = path.join(process.cwd(), 'tests', 'fixtures');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'data.json');
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2));
  console.log(`Saved to ${outPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
