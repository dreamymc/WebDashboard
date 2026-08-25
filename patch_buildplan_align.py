import re

with open('components/tables/BuildPlanByMonthTable.tsx', 'r') as f:
    content = f.read()

# Replace all align: "right" with align: "center"
content = content.replace('align: "right"', 'align: "center"')

with open('components/tables/BuildPlanByMonthTable.tsx', 'w') as f:
    f.write(content)
