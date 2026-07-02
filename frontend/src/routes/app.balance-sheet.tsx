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
import { getBalanceSheet } from "@/services/balanceSheetService";

export const Route = createFileRoute("/app/balance-sheet")({
  component: BalanceSheetPage,
});

function BalanceSheetPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getBalanceSheet();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setReport(data);
    }

    load();
  }, []);

  if (!report) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Balance Sheet"
        description="Assets and Liabilities of the company."
      />

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Assets */}

        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Particular</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {report.assets.map((a: any) => (
                  <TableRow key={a.name}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(a.amount)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className="font-bold">
                  <TableCell>Total Assets</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(report.totalAssets)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Liabilities */}

        <Card>
          <CardHeader>
            <CardTitle>Liabilities</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Particular</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {report.liabilities.map((l: any) => (
                  <TableRow key={l.name}>
                    <TableCell>{l.name}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(l.amount)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className="font-bold">
                  <TableCell>Total Liabilities</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(report.totalLiabilities)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}