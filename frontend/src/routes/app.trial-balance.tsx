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
import { getTrialBalance } from "@/services/trialBalanceService";

export const Route = createFileRoute("/app/trial-balance")({
  component: TrialBalancePage,
});

function TrialBalancePage() {
  const [rows, setRows] = useState<any[]>([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  useEffect(() => {
    async function load() {
      const data = await getTrialBalance();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setRows(data.rows);
      setTotalDebit(data.totalDebit);
      setTotalCredit(data.totalCredit);
    }

    load();
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Trial Balance"
        description="Live Trial Balance generated from vouchers."
      />

      <Card>
        <CardHeader>
          <CardTitle>Trial Balance</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ledger</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.ledger}>
                  <TableCell>{r.ledger}</TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(r.debit)}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(r.credit)}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="font-bold">
                <TableCell>Total</TableCell>

                <TableCell className="text-right">
                  {formatCurrency(totalDebit)}
                </TableCell>

                <TableCell className="text-right">
                  {formatCurrency(totalCredit)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}