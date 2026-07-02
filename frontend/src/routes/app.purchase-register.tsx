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
import { getPurchaseRegister } from "@/services/purchaseRegisterService";

export const Route = createFileRoute("/app/purchase-register")({
  component: PurchaseRegisterPage,
});

function PurchaseRegisterPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getPurchaseRegister();

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
        title="Purchase Register"
        description="Supplier-wise purchase register."
      />

      <Card>
        <CardHeader>
          <CardTitle>Purchase Register</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">GST</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {report.entries.map((p: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(p.date).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{p.invoiceNo}</TableCell>

                  <TableCell>{p.supplierName}</TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(p.gst)}
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {formatCurrency(p.total)}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="font-bold">
                <TableCell colSpan={3}>Total</TableCell>

                <TableCell className="text-right">
                  {formatCurrency(report.totalGst)}
                </TableCell>

                <TableCell className="text-right">
                  {formatCurrency(report.totalPurchase)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
