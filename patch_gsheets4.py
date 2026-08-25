import re

with open('lib/google-sheets.ts', 'r') as f:
    content = f.read()

new_func = """
export async function fetchBuildPlanByMonthTable(): Promise<import('./types').BuildPlanByMonthTableRow[]> {
  try {
    const sheets = getSheetService();
    const targetSheet = 'build_plan_by_month_table';
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A1:ZZ20`,
    });

    const rawData = response.data.values;
    if (!rawData || rawData.length === 0) return [];

    // Find the header row by looking for 'JAN'
    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
      if (rawData[i].some(c => c?.toString().toUpperCase() === 'JAN')) {
        headerRowIdx = i;
        break;
      }
    }
    if (headerRowIdx === -1) return [];

    const headers = rawData[headerRowIdx].map(h => (h?.toString() || '').trim().toUpperCase());
    const cell = (r: any[], colIdx: number) => {
      if (colIdx === -1 || colIdx >= r.length) return null;
      const val = r[colIdx]?.toString().trim();
      if (!val || val === '-' || val === '–') return null; // handle dash
      const num = parseFloat(val);
      return isNaN(num) ? val : num;
    };

    const findCol = (name: string) => headers.findIndex(h => h === name);
    const catCol = findCol('T7');
    const cols = {
      jan: findCol('JAN'),
      feb: findCol('FEB'),
      mar: findCol('MAR'),
      apr: findCol('APR'),
      may: findCol('MAY'),
      jun: findCol('JUN'),
      jul: findCol('JUL'),
      aug: findCol('AUG'),
      sep: findCol('SEP'),
      oct: findCol('OCT'),
      nov: findCol('NOV'),
      dec: findCol('DEC'),
      total: findCol('TOTAL IN-YEAR')
    };

    const result: import('./types').BuildPlanByMonthTableRow[] = [];
    for (let i = headerRowIdx + 1; i < rawData.length; i++) {
      const row = rawData[i];
      const catRaw = row[catCol]?.toString().trim();
      if (!catRaw) continue; // skip empty rows

      result.push({
        category: catRaw,
        jan: cell(row, cols.jan),
        feb: cell(row, cols.feb),
        mar: cell(row, cols.mar),
        apr: cell(row, cols.apr),
        may: cell(row, cols.may),
        jun: cell(row, cols.jun),
        jul: cell(row, cols.jul),
        aug: cell(row, cols.aug),
        sep: cell(row, cols.sep),
        oct: cell(row, cols.oct),
        nov: cell(row, cols.nov),
        dec: cell(row, cols.dec),
        total: cell(row, cols.total),
      });
    }

    return result;
  } catch (err) {
    console.error("Error fetching build_plan_by_month_table:", err);
    return [];
  }
}
"""

content = content + new_func

with open('lib/google-sheets.ts', 'w') as f:
    f.write(content)
