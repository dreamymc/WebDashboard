import re

with open('lib/transforms.ts', 'r') as f:
    content = f.read()

# Add Pie Data interface
content = content.replace(
  "export interface FunnelCount {",
  "export interface EarlyStagePieData {\n  name: string;\n  value: number;\n  fill: string;\n}\n\nexport interface FunnelCount {"
)

# Add earlyStagePieChart transform
pie_transform = """
// ── Early Stage Pie Chart ──────────────────────────────────────────────────────

export function earlyStagePieChart(rows: SiteRow[]): EarlyStagePieData[] {
  const planRows = rows.filter(r => r.isPlan);
  const counts = new Map<string, number>();
  for (const row of planRows) {
    counts.set(row.leadIndicator, (counts.get(row.leadIndicator) ?? 0) + 1);
  }

  return [
    { name: 'With Issues', value: counts.get('w/ ISSUES') ?? 0, fill: '#ef4444' }, // red-500
    { name: 'Returned/Rejected', value: counts.get('Returned/ Rejected') ?? 0, fill: '#f97316' }, // orange-500
    { name: 'For Awarding', value: counts.get('FOR AWARDING') ?? 0, fill: '#64748b' }, // slate-500
    { name: 'Awarded/Site Hunting', value: counts.get('AWARDED / SITE HUNTING') ?? 0, fill: '#3b82f6' }, // blue-500
  ].filter(d => d.value > 0);
}

// ── Funnel Counts ─────────────────────────────────────────────────────────────"""

content = content.replace("// ── Funnel Counts ─────────────────────────────────────────────────────────────", pie_transform)

# Export the pie chart transform
content = content.replace(
  "  funnelCounts,\n  programVelocity,",
  "  earlyStagePieChart,\n  funnelCounts,\n  programVelocity,"
)

with open('lib/transforms.ts', 'w') as f:
    f.write(content)
