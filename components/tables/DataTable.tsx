import { ReactNode, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  emptyMessage?: string;
  pagination?: boolean;
  pageSize?: number;
  rowClassName?: (row: T, index: number) => string;
}

export function DataTable<T>({
  data,
  columns,
  className = "",
  emptyMessage = "No data available",
  pagination = false,
  pageSize = 10,
  rowClassName,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const currentData = pagination 
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data;

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ textAlign: col.headerAlign || col.align || "left" }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-text-muted italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowClassName ? rowClassName(row, rowIndex) : ""}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ textAlign: col.align || "left" }}
                  >
                    {col.cell(row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-color bg-surface-hover/50">
          <div className="text-xs text-text-muted">
            Showing <span className="font-medium text-text-primary">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-text-primary">{Math.min(currentPage * pageSize, data.length)}</span> of <span className="font-medium text-text-primary">{data.length}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-surface border border-transparent hover:border-border-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-text-secondary hover:text-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-xs font-medium text-text-primary px-2">
              {currentPage} <span className="text-text-muted font-normal">/ {totalPages}</span>
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md hover:bg-surface border border-transparent hover:border-border-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-text-secondary hover:text-text-primary"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
