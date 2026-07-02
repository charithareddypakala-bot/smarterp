import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { cn } from "@/lib/utils";

/** Column definition for the generic data table. */
export interface Column<T> {
  key: string;
  header: string;
  /** Custom cell renderer; falls back to the raw value. */
  cell?: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

const alignMap = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

/**
 * Reusable, type-safe data table built on shadcn primitives.
 * Handles loading skeletons and empty states internally.
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search or filters.",
  emptyAction,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "whitespace-nowrap font-semibold text-foreground",
                  col.align && alignMap[col.align],
                  col.className,
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableSkeleton columns={columns.length} />
          ) : data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                <EmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  action={emptyAction}
                />
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={rowKey(row)} className="transition-colors">
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      "whitespace-nowrap",
                      col.align && alignMap[col.align],
                      col.className,
                    )}
                  >
                    {col.cell
                      ? col.cell(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
