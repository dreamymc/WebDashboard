#!/usr/bin/env tsx
/**
 * Debug: print row 1 and row 2 (headers) from the Google Sheet to understand layout.
 */
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
  const sheetId = process.env.GOOGLE_SHEET_ID!;
  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'A1:Z5' });
  const rows = res.data.values ?? [];
  rows.forEach((row, i) => {
    console.log(`Row ${i+1}:`, JSON.stringify(row));
  });
}
main().catch(e => { console.error(e); process.exit(1); });
