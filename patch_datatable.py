import re

with open('components/tables/DataTable.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '  pageSize?: number;\n}',
    '  pageSize?: number;\n  rowClassName?: (row: T, index: number) => string;\n}'
)

content = content.replace(
    '  pageSize = 10,\n}: DataTableProps<T>) {',
    '  pageSize = 10,\n  rowClassName,\n}: DataTableProps<T>) {'
)

content = content.replace(
    '<tr key={rowIndex}>',
    '<tr key={rowIndex} className={rowClassName ? rowClassName(row, rowIndex) : ""}>'
)

with open('components/tables/DataTable.tsx', 'w') as f:
    f.write(content)
