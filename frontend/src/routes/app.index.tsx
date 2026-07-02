import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Boxes,
  Calendar,
  HandCoins,
  Plus,
  Receipt,
  Search,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { getDashboard } from "@/services/dashboardService";
import { CalendarDays } from "lucide-react";
export const Route = createFileRoute("/app/")({
  component: DashboardPage,
});


function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState("This Month");

  useEffect(() => {
    async function loadDashboard() {
      const res = await getDashboard();

      if (!res.success) {
        toast.error(res.message || "Failed to load dashboard");
        return;
      }

      setData(res);
    }

    loadDashboard();
  }, []);

  if (!data) return <div className="p-6">Loading dashboard...</div>;

  const s = data.summary;
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg text-blue-100">Welcome back 👋</p>
            <h1 className="mt-2 text-4xl font-bold">SmartERP Dashboard</h1>
            <p className="mt-2 text-blue-100">
              Live business overview for your company.
            </p>
          </div>

          <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to="/app/sales">
              <Plus className="mr-2 size-4" />
              Create Invoice
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customers, invoices..." className="pl-10" />
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      <CalendarDays className="mr-2 h-4 w-4" />
      {period}
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end" className="w-48">
    <DropdownMenuLabel>Dashboard Period</DropdownMenuLabel>

    <DropdownMenuSeparator />

    <DropdownMenuItem onClick={() => setPeriod("Today")}>
      Today
    </DropdownMenuItem>

    <DropdownMenuItem onClick={() => setPeriod("This Week")}>
      This Week
    </DropdownMenuItem>

    <DropdownMenuItem onClick={() => setPeriod("This Month")}>
      This Month
    </DropdownMenuItem>

    <DropdownMenuItem onClick={() => setPeriod("Last Month")}>
      Last Month
    </DropdownMenuItem>

    <DropdownMenuItem onClick={() => setPeriod("This Year")}>
      This Year
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="relative">

      <Bell className="h-4 w-4" />

      {(data.lowStock?.length || 0) > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
          {data.lowStock.length}
        </span>
      )}

    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="w-80 rounded-xl"
  >

    <DropdownMenuLabel>
      Notifications
    </DropdownMenuLabel>

    <DropdownMenuSeparator />

    {data.lowStock?.map((item: any) => (

      <DropdownMenuItem
        key={item._id}
        className="items-start py-3"
      >

        <div>

          <p className="font-semibold text-red-600">
            ⚠ Low Stock
          </p>

          <p className="text-sm">
            {item.name}
          </p>

          <p className="text-xs text-muted-foreground">
            Only {item.quantity} left in stock
          </p>

        </div>

      </DropdownMenuItem>

    ))}

    {(data.recentTransactions || [])
      .slice(0, 3)
      .map((tx: any, index: number) => (

        <DropdownMenuItem
          key={index}
          className="items-start py-3"
        >

          <div>

            <p className="font-semibold text-green-600">
              ✓ {tx.type}
            </p>

            <p className="text-sm">
              {tx.voucherNo}
            </p>

            <p className="text-xs text-muted-foreground">
              {tx.party}
            </p>

          </div>

        </DropdownMenuItem>

      ))}

    {data.lowStock?.length === 0 &&
      data.recentTransactions?.length === 0 && (
        <DropdownMenuItem>
          No Notifications
        </DropdownMenuItem>
      )}

  </DropdownMenuContent>
</DropdownMenu>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <PremiumCard title="Sales" value={s.totalSales} icon={Receipt} color="text-green-600" />
        <PremiumCard title="Purchases" value={s.totalPurchases} icon={ShoppingCart} color="text-blue-600" />
        <PremiumCard title="Receipts" value={s.totalReceipts} icon={HandCoins} color="text-purple-600" />
        <PremiumCard title="Payments" value={s.totalPayments} icon={Wallet} color="text-red-600" />
        <PremiumCard title="Stock Value" value={s.stockValue} icon={Boxes} color="text-cyan-600" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MiniCard title="Customers" value={s.customersCount} icon={Users} />
        <MiniCard title="Suppliers" value={s.suppliersCount} icon={Truck} />
        <MiniCard title="Stock Items" value={s.stockItemsCount} icon={Boxes} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SalesPurchaseChart data={data.monthlySales || []} />
        <CashFlowChart data={data.monthlyCashFlow || []} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Profit / Loss</CardTitle>
          </CardHeader>
          <CardContent>
            {s.netProfit >= 0 ? (
              <p className="text-3xl font-bold text-green-600">
                Profit {formatCurrency(s.netProfit)}
              </p>
            ) : (
              <p className="text-3xl font-bold text-red-600">
                Loss {formatCurrency(Math.abs(s.netProfit))}
              </p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Sales minus purchases
            </p>
          </CardContent>
        </Card>

        <RecentTransactions entries={data.recentTransactions || []} />
        <LowStock items={data.lowStock || []} />
      </div>
    </div>
  );
}

function PremiumCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h2 className={`mt-3 text-2xl font-bold ${color}`}>
              {formatCurrency(value)}
            </h2>
          </div>

          <div className="rounded-full bg-slate-100 p-4">
            <Icon className={`size-6 ${color}`} />
          </div>
        </div>

        <div className="mt-6 h-1 rounded-full bg-gray-100">
          <div className="h-1 w-3/4 rounded-full bg-blue-500" />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniCard({ title, value, icon: Icon }: any) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className="size-7 text-primary" />
      </CardContent>
    </Card>
  );
}

function SalesPurchaseChart({ data }: { data: any[] }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Sales vs Purchases</CardTitle>
      </CardHeader>

      <CardContent className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="purchaseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `₹${v / 100000}L`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />

            <Area
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#salesFill)"
            />

            <Area
              type="monotone"
              dataKey="purchase"
              name="Purchases"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#purchaseFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function CashFlowChart({ data }: { data: any[] }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
      </CardHeader>

      <CardContent className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `₹${v / 100000}L`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />

            <Bar dataKey="receipts" name="Receipts" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="payments" name="Payments" fill="#fb923c" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function RecentTransactions({ entries }: { entries: any[] }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {entries.map((e, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border p-3">
            <div>
              <p className="font-medium">{e.voucherNo}</p>
              <p className="text-sm text-muted-foreground">
                {e.type} • {e.party || "-"}
              </p>
            </div>
            <p className="font-semibold">{formatCurrency(e.amount || 0)}</p>
          </div>
        ))}

        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent transactions.</p>
        )}
      </CardContent>
    </Card>
  );
}

function LowStock({ items }: { items: any[] }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {items.map((i) => (
          <div key={i._id} className="flex items-center justify-between rounded-xl border p-3">
            <div>
              <p className="font-medium">{i.name}</p>
              <p className="text-sm text-muted-foreground">{i.sku || "No SKU"}</p>
            </div>

            <Badge variant={Number(i.quantity || 0) === 0 ? "destructive" : "outline"}>
              {i.quantity || 0} left
            </Badge>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No low stock items.</p>
        )}
      </CardContent>
    </Card>
  );
}