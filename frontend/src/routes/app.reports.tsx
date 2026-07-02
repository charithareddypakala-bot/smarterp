import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Download, IndianRupee, ShoppingCart, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { DataTable, type Column } from "@/components/common/data-table";
import { categoryShare, monthlyTrend } from "@/data/dashboard";
import { stockItems } from "@/data/stock-items";
import { formatCompact, formatCurrency } from "@/lib/format";
import type { StockItem } from "@/types";

export const Route = createFileRoute("/app/reports")({
  head: () => ({ meta: [{ title: "Reports — SmartERP" }] }),
  component: ReportsPage,
});

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const summaryCards = [
  { label: "Net Sales", value: "₹18.4L", change: 12.5, icon: IndianRupee },
  { label: "Net Purchase", value: "₹11.2L", change: 6.2, icon: ShoppingCart },
  { label: "Gross Profit", value: "₹7.2L", change: 9.4, icon: TrendingUp },
  { label: "Stock Value", value: "₹9.8L", change: 4.8, icon: Boxes },
];

const inventoryColumns: Column<StockItem>[] = [
  { key: "name", header: "Item", cell: (i) => <span className="font-medium">{i.name}</span> },
  { key: "category", header: "Category", cell: (i) => i.category },
  { key: "quantity", header: "Qty", align: "right", cell: (i) => `${i.quantity} ${i.unit}` },
  {
    key: "value",
    header: "Stock Value",
    align: "right",
    cell: (i) => (
      <span className="font-medium">{formatCurrency(i.quantity * i.purchasePrice)}</span>
    ),
  },
];

function ReportsPage() {
  // Top items by stock value for the inventory summary table.
  const topInventory = [...stockItems]
    .sort((a, b) => b.quantity * b.purchasePrice - a.quantity * a.purchasePrice)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Sales, purchase and inventory performance at a glance."
        actions={
          <Button variant="outline">
            <Download className="size-4" /> Export
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} change={c.change} icon={c.icon} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales vs Purchase report */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Sales & Purchase Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatCompact(v)}
                />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "var(--color-muted)" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="sales" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} name="Sales" />
                <Bar
                  dataKey="purchase"
                  fill="var(--color-chart-2)"
                  radius={[4, 4, 0, 0]}
                  name="Purchase"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category share pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryShare}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {categoryShare.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => `${v}%`}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Inventory summary */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold tracking-tight">Inventory Summary</h3>
        <DataTable
          columns={inventoryColumns}
          data={topInventory}
          rowKey={(i) => i.id}
        />
      </div>
    </div>
  );
}
