import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Color-coded status pill used across tables.
 */
type StatusTone = "success" | "warning" | "destructive" | "muted" | "primary";

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success/12 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  muted: "bg-muted text-muted-foreground border-border",
  primary: "bg-accent text-accent-foreground border-accent",
};

const statusToneMap: Record<string, StatusTone> = {
  active: "success",
  paid: "success",
  inactive: "muted",
  pending: "warning",
  overdue: "destructive",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = statusToneMap[status] ?? "muted";
  return (
    <Badge
      variant="outline"
      className={cn("capitalize font-medium", toneClasses[tone])}
    >
      {status}
    </Badge>
  );
}
