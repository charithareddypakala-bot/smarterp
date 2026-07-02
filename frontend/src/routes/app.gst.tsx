import { createFileRoute } from "@tanstack/react-router";
import { Download, FileCheck2, IndianRupee, Receipt } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { DataTable, type Column } from "@/components/common/data-table";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/app/gst")({
  head: () => ({ meta: [{ title: "GST — SmartERP" }] }),
  component: GstPage,
});

interface GstRow {
  id: string;
  rate: string;
  taxable: number;
  output: number;
  input: number;
}

const gstBreakup: GstRow[] = [
  { id: "g1", rate: "5%", taxable: 120000, output: 6000, input: 4200 },
  { id: "g2", rate: "12%", taxable: 240000, output: 28800, input: 18400 },
  { id: "g3", rate: "18%", taxable: 980000, output: 176400, input: 121000 },
  { id: "g4", rate: "28%", taxable: 320000, output: 89600, input: 52000 },
];

const returns = [
  { id: "GSTR-1", period: "May 2026", due: "11 Jun 2026", status: "Filed" },
  { id: "GSTR-3B", period: "May 2026", due: "20 Jun 2026", status: "Filed" },
  { id: "GSTR-1", period: "Jun 2026", due: "11 Jul 2026", status: "Pending" },
  { id: "GSTR-3B", period: "Jun 2026", due: "20 Jul 2026", status: "Pending" },
];

const columns: Column<GstRow>[] = [
  { key: "rate", header: "GST Rate", cell: (r) => <span className="font-medium">{r.rate}</span> },
  { key: "taxable", header: "Taxable Value", align: "right", cell: (r) => formatCurrency(r.taxable) },
  { key: "output", header: "Output GST", align: "right", cell: (r) => formatCurrency(r.output) },
  { key: "input", header: "Input GST", align: "right", cell: (r) => formatCurrency(r.input) },
  {
    key: "net",
    header: "Net Payable",
    align: "right",
    cell: (r) => <span className="font-medium">{formatCurrency(r.output - r.input)}</span>,
  },
];

function GstPage() {
  const output = gstBreakup.reduce((s, r) => s + r.output, 0);
  const input = gstBreakup.reduce((s, r) => s + r.input, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="GST"
        description="GST liability, input credit and return filing status."
        actions={
          <Button variant="outline">
            <Download className="size-4" /> Export GSTR
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Output GST" value={formatCurrency(output)} icon={Receipt} />
        <StatCard label="Input Credit" value={formatCurrency(input)} icon={IndianRupee} />
        <StatCard label="Net Payable" value={formatCurrency(output - input)} icon={FileCheck2} />
        <StatCard label="Returns Filed" value="2 / 4" icon={FileCheck2} />
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold tracking-tight">Rate-wise Summary</h3>
        <DataTable columns={columns} data={gstBreakup} rowKey={(r) => r.id} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Return Filing Status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {returns.map((r, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div>
                <p className="font-medium text-foreground">{r.id}</p>
                <p className="text-xs text-muted-foreground">
                  {r.period} · Due {r.due}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  r.status === "Filed"
                    ? "border-success/20 bg-success/12 text-success"
                    : "border-warning/30 bg-warning/15 text-warning-foreground"
                }
              >
                {r.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
