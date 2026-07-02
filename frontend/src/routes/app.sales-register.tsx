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
import { getSalesRegister } from "@/services/salesRegisterService";

export const Route = createFileRoute("/app/sales-register")({
  component: SalesRegisterPage,
});

function SalesRegisterPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getSalesRegister();

      if (!data.success) {
        toast.error(data.message);
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
        title="Sales Register"
        description="Customer-wise sales register."
      />

      <Card>
        <CardHeader>
          <CardTitle>Sales Register</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {report.entries.map((s: any) => (
                <TableRow key={s.invoiceNo}>
                  <TableCell>
                    {new Date(s.date).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{s.invoiceNo}</TableCell>

                  <TableCell>{s.customerName}</TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(s.gst)}
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {formatCurrency(s.total)}
                  </TableCell>

                  <TableCell>{s.paymentStatus}</TableCell>
                </TableRow>
              ))}

              <TableRow className="font-bold">
                <TableCell colSpan={3}>Total</TableCell>

                <TableCell className="text-right">
                  {formatCurrency(report.totalGst)}
                </TableCell>

                <TableCell className="text-right">
                  {formatCurrency(report.totalSales)}
                </TableCell>

                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}