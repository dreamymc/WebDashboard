with open('components/tables/BuildPlanByMonthTable.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="w-full overflow-x-auto text-[10px] sm:text-[11px] leading-tight">',
    '<div className="w-full overflow-x-auto text-[10px] sm:text-[10px] leading-none [&_.data-table_th]:px-1 [&_.data-table_th]:py-1.5 [&_.data-table_td]:px-1 [&_.data-table_td]:py-1 [&_.data-table]:w-full">'
)

with open('components/tables/BuildPlanByMonthTable.tsx', 'w') as f:
    f.write(content)
