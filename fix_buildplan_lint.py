with open('components/tables/BuildPlanByMonthTable.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const renderCell = (r: BuildPlanByMonthTableRow, val: any) => (',
    'const renderCell = (r: BuildPlanByMonthTableRow, val: string | number | null | undefined) => ('
)

with open('components/tables/BuildPlanByMonthTable.tsx', 'w') as f:
    f.write(content)
