with open('components/tables/BuildPlanByMonthTable.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '{ key: "category", header: "Metric", cell: (r) => <span className="font-semibold whitespace-normal leading-tight block w-[80px]">{r.category.replace(\'BUILD PLAN\', \'BP\').replace(\'INCREMENTAL\', \'Inc\').replace(\'CUMULATIVE\', \'Cum\')}</span> },',
    '{ key: "category", header: "Metric", cell: (r) => <span className="font-semibold whitespace-normal leading-tight block w-[95px]">{r.category}</span> },'
)

with open('components/tables/BuildPlanByMonthTable.tsx', 'w') as f:
    f.write(content)
