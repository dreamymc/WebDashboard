with open('components/tables/BuildPlanByMonthTable.tsx', 'r') as f:
    content = f.read()

# Revert the aggressive tiny font size and padding to a more reasonable text-xs with tight padding
content = content.replace(
    '<div className="w-full overflow-x-auto text-[10px] sm:text-[10px] leading-none [&_.data-table_th]:!px-1 [&_.data-table_th]:!py-1.5 [&_.data-table_th]:!text-[9px] [&_.data-table_td]:!px-1 [&_.data-table_td]:!py-1 [&_.data-table_td]:!text-[10px] [&_.data-table]:!w-full">',
    '<div className="w-full overflow-x-auto text-xs [&_.data-table_th]:!px-1.5 [&_.data-table_th]:!py-2 [&_.data-table_td]:!px-1.5 [&_.data-table_td]:!py-2 [&_.data-table]:!w-full">'
)

# Shorten the category names to fit
content = content.replace(
    '{ key: "category", header: "Metric", cell: (r) => <span className="font-semibold">{r.category}</span> },',
    '{ key: "category", header: "Metric", cell: (r) => <span className="font-semibold whitespace-normal leading-tight block w-[80px]">{r.category.replace(\'BUILD PLAN\', \'BP\').replace(\'INCREMENTAL\', \'Inc\').replace(\'CUMULATIVE\', \'Cum\')}</span> },'
)

with open('components/tables/BuildPlanByMonthTable.tsx', 'w') as f:
    f.write(content)
