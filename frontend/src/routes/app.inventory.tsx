import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Boxes } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { DataTable, type Column } from "@/components/common/data-table";
import { formatCurrency } from "@/lib/format";
import { getStockItems } from "@/services/stockItemService";

export const Route = createFileRoute("/app/inventory")({
  component: StockSummaryPage,
});

function StockSummaryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadItems() {
      const data = await getStockItems();

      if (data.success) {
        setItems(data.items || []);
      } else {
        toast.error(data.message || "Failed to load stock summary");
      }
    }

    loadItems();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return items.filter(
      (i) =>
        i.name?.toLowerCase().includes(q) ||
        i.sku?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q),
    );
  }, [items, search]);

  const totalStockValue = useMemo(() => {
    return filtered.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.purchasePrice || 0),
      0,
    );
  }, [filtered]);

  const lowStockCount = filtered.filter((i) => Number(i.quantity || 0) < 20).length;

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "Item",
      cell: (i) => (
        <div>
          <p className="font-medium text-foreground">{i.name}</p>
          <p className="text-xs text-muted-foreground">{i.sku || "-"}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (i) => <Badge variant="secondary">{i.category || "General"}</Badge>,
    },
    {
      key: "quantity",
      header: "Quantity",
      align: "right",
      cell: (i) => `${i.quantity || 0} ${i.unit || ""}`,
    },
    {
      key: "purchasePrice",
      header: "Purchase Rate",
      align: "right",
      cell: (i) => formatCurrency(i.purchasePrice || 0),
    },
    {
      key: "stockValue",
      header: "Stock Value",
      align: "right",
      cell: (i) =>
        formatCurrency(Number(i.quantity || 0) * Number(i.purchasePrice || 0)),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      cell: (i) => {
        const qty = Number(i.quantity || 0);

        if (qty === 0) return <Badge variant="destructive">Out</Badge>;
        if (qty < 20) return <Badge variant="outline">Low</Badge>;
        return <Badge variant="secondary">In Stock</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Stock Summary"
        description="View current stock quantity and inventory value."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Items</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {filtered.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {lowStockCount}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Stock Value</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatCurrency(totalStockValue)}
          </CardContent>
        </Card>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search stock item..."
      />

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(i) => i._id || i.id}
        emptyTitle="No stock items found"
      />
    </div>
  );
}