import { DataTable } from "@/components/tables/DataTable";
import { ColumnDef } from "@/components/tables/DataTable";
import type { BuildPlanByMonthTableRow } from "@/lib/types";

export function BuildPlanByMonthTable({ data }: { data: BuildPlanByMonthTableRow[] }) {
  const columns: ColumnDef<BuildPlanByMonthTableRow>[] = [
    { key: "category", header: "T7", cell: (r) => <span className="font-semibold">{r.category}</span> },
    { key: "jan", header: "JAN", cell: (r) => r.jan ?? "-", align: "right" },
    { key: "feb", header: "FEB", cell: (r) => r.feb ?? "-", align: "right" },
    { key: "mar", header: "MAR", cell: (r) => r.mar ?? "-", align: "right" },
    { key: "apr", header: "APR", cell: (r) => r.apr ?? "-", align: "right" },
    { key: "may", header: "MAY", cell: (r) => r.may ?? "-", align: "right" },
    { key: "jun", header: "JUN", cell: (r) => r.jun ?? "-", align: "right" },
    { key: "jul", header: "JUL", cell: (r) => r.jul ?? "-", align: "right" },
    { key: "aug", header: "AUG", cell: (r) => r.aug ?? "-", align: "right" },
    { key: "sep", header: "SEP", cell: (r) => r.sep ?? "-", align: "right" },
    { key: "oct", header: "OCT", cell: (r) => r.oct ?? "-", align: "right" },
    { key: "nov", header: "NOV", cell: (r) => r.nov ?? "-", align: "right" },
    { key: "dec", header: "DEC", cell: (r) => r.dec ?? "-", align: "right" },
    { key: "total", header: "TOTAL", cell: (r) => <span className="font-semibold text-brand">{r.total ?? "-"}</span>, align: "right" },
  ];

  return (
    <div className="w-full overflow-x-auto text-[10px] sm:text-xs">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
