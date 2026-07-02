import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/page-header";
import { formatCurrency } from "@/lib/format";
import { getCashFlow } from "@/services/cashFlowService";

export const Route = createFileRoute("/app/cash-flow")({
  component: CashFlowPage,
});

function CashFlowPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getCashFlow();

      if (!data.success) {
        toast.error(data.message || "Failed to load cash flow");
        return;
      }

      setReport(data);
    }

    load();
  }, []);

  if (!report) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Cash Flow Statement"
        description="Cash inflows, outflows and net cash movement."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cash Inflow</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">
            {formatCurrency(report.totalInflow)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cash Outflow</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-600">
            {formatCurrency(report.totalOutflow)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Net Cash Flow</CardTitle>
          </CardHeader>
          <CardContent
            className={`text-2xl font-bold ${
              report.netCashFlow >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {report.netCashFlow >= 0 ? "Surplus " : "Deficit "}
            {formatCurrency(Math.abs(report.netCashFlow))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CashTable title="Cash Inflows" data={report.inflows || []} />
        <CashTable title="Cash Outflows" data={report.outflows || []} />
      </div>
    </div>
  );
}

function CashTable({ title, data }: { title: string; data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Voucher</TableHead>
              <TableHead>Party</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(entry.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{entry.voucherNo}</TableCell>
                <TableCell>{entry.party}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(entry.amount || 0)}
                </TableCell>
              </TableRow>
            ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
