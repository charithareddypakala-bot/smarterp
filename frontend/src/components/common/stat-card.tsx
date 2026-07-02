import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Compact KPI / statistic card with trend indicator.
 * Used on the dashboard and reports pages.
 */
interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
}

export function StatCard({ label, value, change, icon: Icon }: StatCardProps) {
  const positive = (change ?? 0) >= 0;

  return (
    <Card className="card-hover">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {change !== undefined && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                positive ? "text-success" : "text-destructive",
              )}
            >
              {positive ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {Math.abs(change)}%<span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className="rounded-xl bg-accent p-3 text-accent-foreground">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
