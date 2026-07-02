import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { formatCurrency } from "@/lib/format";
import { getProfitLoss } from "@/services/profitLossService";

export const Route = createFileRoute("/app/profit-loss")({
  component: ProfitLossPage,
});

function ProfitLossPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getProfitLoss();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setReport(data);
    }

    load();
  }, []);

  if (!report) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Profit & Loss"
        description="Live Profit & Loss statement."
      />

      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex justify-between">
            <span>Sales</span>
            <span>{formatCurrency(report.salesTotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Purchases</span>
            <span>{formatCurrency(report.purchaseTotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Other Income</span>
            <span>{formatCurrency(report.incomeTotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Expenses</span>
            <span>{formatCurrency(report.expenseTotal)}</span>
          </div>

          <hr />

          <div className="flex justify-between font-semibold">
  {report.grossProfit >= 0 ? (
    <>
      <span>Gross Profit</span>
      <span className="text-green-600">
        {formatCurrency(report.grossProfit)}
      </span>
    </>
  ) : (
    <>
      <span>Gross Loss</span>
      <span className="text-red-600">
        {formatCurrency(Math.abs(report.grossProfit))}
      </span>
    </>
  )}
</div>

          <div className="border-t pt-4">
  {report.netProfit >= 0 ? (
    <div className="flex justify-between text-lg font-bold text-green-600">
      <span>Net Profit</span>
      <span>{formatCurrency(report.netProfit)}</span>
    </div>
  ) : (
    <div className="flex justify-between text-lg font-bold text-red-600">
      <span>Net Loss</span>
      <span>{formatCurrency(Math.abs(report.netProfit))}</span>
    </div>
  )}
</div>

        </CardContent>
      </Card>
    </div>
  );
}