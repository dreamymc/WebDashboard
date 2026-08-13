import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
  try {
    const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!credentialsJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');

    const credentials = JSON.parse(credentialsJson);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    // First, let's see what tabs exist
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    
    const sheetNames = metadata.data.sheets?.map(s => s.properties?.title) || [];
    console.log("Found tabs:", sheetNames);
    
    // If there is a second sheet (usually 'Sheet2'), fetch its data
    const targetSheet = sheetNames.find(s => s?.toLowerCase().includes('sheet2')) || sheetNames[1];
    
    if (targetSheet) {
      console.log(`\nFetching data from: ${targetSheet}`);
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${targetSheet}!A1:Z10`, // Just get the first 10 rows to peek
      });
      console.log("Data:");
      console.table(response.data.values);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

check();
