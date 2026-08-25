import re

with open('lib/transforms.ts', 'r') as f:
    content = f.read()

# Modify earlyStagePieChart to use rows instead of planRows
old_func = """export function earlyStagePieChart(rows: SiteRow[]): EarlyStagePieData[] {
  const planRows = rows.filter(r => r.isPlan);
  const counts = new Map<string, number>();
  for (const row of planRows) {
    counts.set(row.leadIndicator, (counts.get(row.leadIndicator) ?? 0) + 1);
  }"""

new_func = """export function earlyStagePieChart(rows: SiteRow[]): EarlyStagePieData[] {
  // Use all rows (the full pipeline), because early stage sites 
  // (like 'For Awarding') do not belong to the 2026 Plan.
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.leadIndicator, (counts.get(row.leadIndicator) ?? 0) + 1);
  }"""

content = content.replace(old_func, new_func)

with open('lib/transforms.ts', 'w') as f:
    f.write(content)
