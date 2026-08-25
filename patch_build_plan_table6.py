with open('components/tables/BuildPlanByMonthTable.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="w-full overflow-x-auto text-xs [&_.data-table_th]:!px-1.5 [&_.data-table_th]:!py-2 [&_.data-table_td]:!px-1.5 [&_.data-table_td]:!py-2 [&_.data-table]:!w-full">',
    '<div className="w-full overflow-x-auto text-xs [&_.data-table_th]:!px-1.5 [&_.data-table_th]:!py-3 [&_.data-table_td]:!px-1.5 [&_.data-table_td]:!py-3.5 [&_.data-table]:!w-full h-full flex flex-col justify-center">'
)

with open('components/tables/BuildPlanByMonthTable.tsx', 'w') as f:
    f.write(content)
