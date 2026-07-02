import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { formatCurrency } from "@/lib/format";
import { getGstSummary } from "@/services/gstSummaryService";

export const Route = createFileRoute("/app/gst-summary")({
  component: GstSummaryPage,
});

function GstSummaryPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getGstSummary();

      if (!data.success) {
        toast.error(data.message || "Failed to load GST Summary");
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
        title="GST Summary"
        description="Summary of GST collected and GST paid."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Output GST</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(report.salesGst)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              GST Collected from Sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Input GST</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(report.purchaseGst)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              GST Paid on Purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Net GST {report.status}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p
              className={`text-3xl font-bold ${
                report.netGst >= 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {formatCurrency(Math.abs(report.netGst))}
            </p>

            <p className="text-xs text-muted-foreground mt-2">
              {report.status}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}