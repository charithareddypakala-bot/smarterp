import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Lightweight pagination control for client-side tables.
 */
interface DataPaginationProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function DataPagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
}: DataPaginationProps) {
  if (pageCount <= 1) {
    return (
      <div className="flex items-center justify-between px-1 py-3 text-sm text-muted-foreground">
        <span>{total} records</span>
      </div>
    );
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}</span>–
        <span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" /> Prev
        </Button>
        {Array.from({ length: pageCount }).map((_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? "default" : "outline"}
            size="icon"
            className="size-8"
            onClick={() => onPageChange(i + 1)}
            aria-label={`Page ${i + 1}`}
            aria-current={page === i + 1 ? "page" : undefined}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
