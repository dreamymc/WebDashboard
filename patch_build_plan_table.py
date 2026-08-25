import re

with open('components/tables/BuildPlanByMonthTable.tsx', 'r') as f:
    content = f.read()

# Update the wrapper div to make it tighter
content = content.replace(
    '<div className="w-full overflow-x-auto text-[10px] sm:text-xs">',
    '<div className="w-full overflow-x-auto text-[10px] sm:text-[11px] leading-tight">'
)

# Pass a custom className to DataTable for dense padding if possible
# We can't easily pass it without modifying DataTable. Let's just modify the global css or local style for this table.
# Since we have Tailwind, we can wrap DataTable in a div that overrides generic table styling.
old_return = """  return (
    <div className="w-full overflow-x-auto text-[10px] sm:text-xs">
      <DataTable data={data} columns={columns} />
    </div>
  );"""

new_return = """  return (
    <div className="w-full overflow-x-auto text-[10px] sm:text-[11px] leading-none [&_.data-table_th]:px-1 [&_.data-table_th]:py-2 [&_.data-table_td]:px-1 [&_.data-table_td]:py-1.5 [&_.data-table]:w-full">
      <DataTable data={data} columns={columns} />
    </div>
  );"""

content = content.replace(old_return, new_return)

# Also shorten the headers from "JAN", "FEB" to "Jan", "Feb" to save pixels? User just said compress, I will use J, F, M, A... no, just Jan Feb Mar is fine, but tighter padding helps the most.
content = content.replace('header: "JAN"', 'header: "Jan"')
content = content.replace('header: "FEB"', 'header: "Feb"')
content = content.replace('header: "MAR"', 'header: "Mar"')
content = content.replace('header: "APR"', 'header: "Apr"')
content = content.replace('header: "MAY"', 'header: "May"')
content = content.replace('header: "JUN"', 'header: "Jun"')
content = content.replace('header: "JUL"', 'header: "Jul"')
content = content.replace('header: "AUG"', 'header: "Aug"')
content = content.replace('header: "SEP"', 'header: "Sep"')
content = content.replace('header: "OCT"', 'header: "Oct"')
content = content.replace('header: "NOV"', 'header: "Nov"')
content = content.replace('header: "DEC"', 'header: "Dec"')
content = content.replace('header: "TOTAL"', 'header: "Total"')
content = content.replace('header: "T7"', 'header: "Metric"')

with open('components/tables/BuildPlanByMonthTable.tsx', 'w') as f:
    f.write(content)
