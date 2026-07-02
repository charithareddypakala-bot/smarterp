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
import { getDayBook } from "@/services/dayBookService";

export const Route = createFileRoute("/app/day-book")({
  component: DayBookPage,
});

function DayBookPage() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getDayBook();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setEntries(data.entries || []);
    }

    load();
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Day Book"
        description="All vouchers recorded in chronological order."
      />

      <Card>
        <CardHeader>
          <CardTitle>Voucher Register</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Voucher</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Party</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(entry.date).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{entry.voucherNo}</TableCell>

                  <TableCell>{entry.type}</TableCell>

                  <TableCell>{entry.party}</TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(entry.amount)}
                  </TableCell>
                </TableRow>
              ))}

              {entries.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No vouchers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}