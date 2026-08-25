import re

with open('lib/transforms.ts', 'r') as f:
    content = f.read()

# 1. Revert totalPipeline
old_total = "totalPipeline: rows.filter(r => !['FOR AWARDING', 'Returned/ Rejected', 'w/ ISSUES'].includes(r.leadIndicator)).length,"
new_total = "totalPipeline: rows.length,"
content = content.replace(old_total, new_total)

# 2. Update earlyStagePieChart
old_pie_func = """export function earlyStagePieChart(rows: SiteRow[]): EarlyStagePieData[] {
  // Use all rows (the full pipeline), because early stage sites 
  // (like 'For Awarding') do not belong to the 2026 Plan.
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.leadIndicator, (counts.get(row.leadIndicator) ?? 0) + 1);
  }

  return [
    { name: 'With Issues', value: counts.get('w/ ISSUES') ?? 0, fill: '#ef4444' }, // red-500
    { name: 'Returned/Rejected', value: counts.get('Returned/ Rejected') ?? 0, fill: '#f97316' }, // orange-500
    { name: 'For Awarding', value: counts.get('FOR AWARDING') ?? 0, fill: '#64748b' }, // slate-500
    { name: 'Active', value: counts.get('AWARDED / SITE HUNTING') ?? 0, fill: '#3b82f6' }, // blue-500
  ].filter(d => d.value > 0);
}"""

new_pie_func = """export function earlyStagePieChart(rows: SiteRow[]): EarlyStagePieData[] {
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
}"""

content = content.replace(old_pie_func, new_pie_func)

with open('lib/transforms.ts', 'w') as f:
    f.write(content)
