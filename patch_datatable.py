import re

with open('components/tables/DataTable.tsx', 'r') as f:
    content = f.read()

# Add useState import
content = content.replace(
    'import { ReactNode } from "react";',
    'import { ReactNode, useState } from "react";\nimport { ChevronLeft, ChevronRight } from "lucide-react";'
)

# Update interface
old_interface = """interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  emptyMessage?: string;
}"""

new_interface = """interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  emptyMessage?: string;
  pagination?: boolean;
  pageSize?: number;
}"""
content = content.replace(old_interface, new_interface)

# Update function signature and logic
old_func_start = """export function DataTable<T>({
  data,
  columns,
  className = "",
  emptyMessage = "No data available",
}: DataTableProps<T>) {"""

new_func_start = """export function DataTable<T>({
  data,
  columns,
  className = "",
  emptyMessage = "No data available",
  pagination = false,
  pageSize = 10,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const currentData = pagination 
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data;
"""
content = content.replace(old_func_start, new_func_start)

# Update render to use currentData
content = content.replace("data.length === 0", "currentData.length === 0")
content = content.replace("data.map((row, rowIndex)", "currentData.map((row, rowIndex)")

# Add pagination controls
old_render = """    </div>
  );
}"""

new_render = """    </div>
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
}"""

content = content.replace(old_render, new_render)
# Replace the outer div wrap to contain the table and pagination bar properly
content = content.replace(
    '<div className={`overflow-x-auto ${className}`}>',
    '<div className={`flex flex-col w-full ${className}`}>\n      <div className="overflow-x-auto">'
)
content = content.replace(
    '</table>\n    </div>',
    '</table>\n      </div>'
)

with open('components/tables/DataTable.tsx', 'w') as f:
    f.write(content)
