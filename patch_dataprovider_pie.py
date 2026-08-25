import re

with open('components/DataProvider.tsx', 'r') as f:
    content = f.read()

content = content.replace(
  "  funnelCounts,",
  "  earlyStagePieChart,\n  funnelCounts,"
)

content = content.replace(
  "    funnelCounts: funnelCounts(rows),",
  "    earlyStagePieChart: earlyStagePieChart(rows),\n    funnelCounts: funnelCounts(rows),"
)

with open('components/DataProvider.tsx', 'w') as f:
    f.write(content)
