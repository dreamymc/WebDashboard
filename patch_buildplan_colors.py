import re

with open('components/tables/BuildPlanByMonthTable.tsx', 'r') as f:
    content = f.read()

new_content = """import { DataTable } from "@/components/tables/DataTable";
import { ColumnDef } from "@/components/tables/DataTable";
import type { BuildPlanByMonthTableRow } from "@/lib/types";

export function BuildPlanByMonthTable({ data }: { data: BuildPlanByMonthTableRow[] }) {
  const getRowColor = (category: string) => {
    if (category.includes('BUILD PLAN INCREMENTAL')) return 'text-blue-600 dark:text-blue-400 font-semibold';
    if (category.includes('BUILD PLAN CUMULATIVE')) return 'text-blue-400 dark:text-blue-300 font-medium';
    if (category.includes('TRFS INCREMENTAL')) return 'text-emerald-600 dark:text-emerald-500 font-semibold';
    if (category.includes('TRFS CUMULATIVE')) return 'text-emerald-400 dark:text-emerald-300 font-medium';
    return '';
  };

  const renderCell = (r: BuildPlanByMonthTableRow, val: any) => (
    <span className={getRowColor(r.category)}>{val ?? "-"}</span>
  );

  const columns: ColumnDef<BuildPlanByMonthTableRow>[] = [
    { key: "category", header: "Metric", cell: (r) => <span className="font-normal text-[10px] text-text-muted whitespace-normal leading-tight block w-[95px]">{r.category}</span> },
    { key: "jan", header: "Jan", cell: (r) => renderCell(r, r.jan), align: "right" },
    { key: "feb", header: "Feb", cell: (r) => renderCell(r, r.feb), align: "right" },
    { key: "mar", header: "Mar", cell: (r) => renderCell(r, r.mar), align: "right" },
    { key: "apr", header: "Apr", cell: (r) => renderCell(r, r.apr), align: "right" },
    { key: "may", header: "May", cell: (r) => renderCell(r, r.may), align: "right" },
    { key: "jun", header: "Jun", cell: (r) => renderCell(r, r.jun), align: "right" },
    { key: "jul", header: "Jul", cell: (r) => renderCell(r, r.jul), align: "right" },
    { key: "aug", header: "Aug", cell: (r) => renderCell(r, r.aug), align: "right" },
    { key: "sep", header: "Sep", cell: (r) => renderCell(r, r.sep), align: "right" },
    { key: "oct", header: "Oct", cell: (r) => renderCell(r, r.oct), align: "right" },
    { key: "nov", header: "Nov", cell: (r) => renderCell(r, r.nov), align: "right" },
    { key: "dec", header: "Dec", cell: (r) => renderCell(r, r.dec), align: "right" },
    { key: "total", header: "Total", cell: (r) => <span className={`font-bold ${getRowColor(r.category)}`}>{r.total ?? "-"}</span>, align: "right" },
  ];

  return (
    <div className="w-full overflow-x-auto text-xs [&_.data-table_th]:!px-1.5 [&_.data-table_th]:!py-3 [&_.data-table_th]:!text-text-primary [&_.data-table_th]:!font-bold [&_.data-table_td]:!px-1.5 [&_.data-table_td]:!py-3.5 [&_.data-table]:!w-full h-full flex flex-col justify-center">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
"""

with open('components/tables/BuildPlanByMonthTable.tsx', 'w') as f:
    f.write(new_content)
