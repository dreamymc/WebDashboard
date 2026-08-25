import { DataTable } from "@/components/tables/DataTable";
import { ColumnDef } from "@/components/tables/DataTable";
import type { BuildPlanByMonthTableRow } from "@/lib/types";

export function BuildPlanByMonthTable({ data }: { data: BuildPlanByMonthTableRow[] }) {
  const getRowBg = (r: BuildPlanByMonthTableRow) => {
    const category = r.category;
    if (category.includes('BUILD PLAN INCREMENTAL')) return 'bg-blue-500/20';
    if (category.includes('BUILD PLAN CUMULATIVE')) return 'bg-blue-500/10';
    if (category.includes('TRFS INCREMENTAL')) return 'bg-emerald-500/20';
    if (category.includes('TRFS CUMULATIVE')) return 'bg-emerald-500/10';
    return '';
  };

  const columns: ColumnDef<BuildPlanByMonthTableRow>[] = [
    { key: "category", header: "Metric", cell: (r) => <span className="font-normal text-[10px] text-text-muted whitespace-normal leading-tight block w-[95px]">{r.category}</span> },
    { key: "jan", header: "Jan", cell: (r) => r.jan ?? "-", align: "center" },
    { key: "feb", header: "Feb", cell: (r) => r.feb ?? "-", align: "center" },
    { key: "mar", header: "Mar", cell: (r) => r.mar ?? "-", align: "center" },
    { key: "apr", header: "Apr", cell: (r) => r.apr ?? "-", align: "center" },
    { key: "may", header: "May", cell: (r) => r.may ?? "-", align: "center" },
    { key: "jun", header: "Jun", cell: (r) => r.jun ?? "-", align: "center" },
    { key: "jul", header: "Jul", cell: (r) => r.jul ?? "-", align: "center" },
    { key: "aug", header: "Aug", cell: (r) => r.aug ?? "-", align: "center" },
    { key: "sep", header: "Sep", cell: (r) => r.sep ?? "-", align: "center" },
    { key: "oct", header: "Oct", cell: (r) => r.oct ?? "-", align: "center" },
    { key: "nov", header: "Nov", cell: (r) => r.nov ?? "-", align: "center" },
    { key: "dec", header: "Dec", cell: (r) => r.dec ?? "-", align: "center" },
    { key: "total", header: "Total", cell: (r) => <span className="font-bold">{r.total ?? "-"}</span>, align: "center" },
  ];

  return (
    <div className="w-full overflow-x-auto text-xs [&_.data-table_th]:!px-1.5 [&_.data-table_th]:!py-3 [&_.data-table_th]:!text-text-primary [&_.data-table_th]:!font-bold [&_.data-table_td]:!px-1.5 [&_.data-table_td]:!py-3.5 [&_.data-table]:!w-full h-full flex flex-col justify-center">
      <DataTable data={data} columns={columns} rowClassName={getRowBg} />
    </div>
  );
}
