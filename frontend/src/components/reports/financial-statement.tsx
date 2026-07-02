import { formatCurrency } from "@/lib/format";

/** One side (column) of a Tally-style T-format statement. */
export interface StatementColumn {
  heading: string;
  rows: { particulars: string; amount: number }[];
}

interface FinancialStatementProps {
  left: StatementColumn;
  right: StatementColumn;
  /** Label for the balancing total row. */
  totalLabel?: string;
}

/**
 * Tally-style two-column (T-format) statement used by the
 * Profit & Loss and Balance Sheet reports.
 */
export function FinancialStatement({
  left,
  right,
  totalLabel = "Total",
}: FinancialStatementProps) {
  const leftTotal = left.rows.reduce((s, r) => s + r.amount, 0);
  const rightTotal = right.rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
      {[left, right].map((col, i) => {
        const total = i === 0 ? leftTotal : rightTotal;
        return (
          <div key={col.heading} className="flex flex-col bg-card">
            <div className="border-b border-border bg-muted/50 px-4 py-2.5 text-sm font-semibold text-foreground">
              {col.heading}
            </div>
            <div className="flex-1 divide-y divide-border/60">
              {col.rows.map((row) => (
                <div
                  key={row.particulars}
                  className="flex items-center justify-between px-4 py-2.5 text-sm"
                >
                  <span className="text-muted-foreground">{row.particulars}</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatCurrency(row.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2.5 text-sm font-semibold">
              <span>{totalLabel}</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
