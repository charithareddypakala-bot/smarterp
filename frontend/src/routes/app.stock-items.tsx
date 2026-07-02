import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { DataTable, type Column } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  StockFormDialog,
  type StockDraft,
} from "@/components/stock/stock-form-dialog";
import { useTable } from "@/hooks/use-table";
import { formatCurrency } from "@/lib/format";
import type { StockItem } from "@/types";
import {
  getStockItems,
  createStockItem,
  updateStockItem,
  deleteStockItem,
} from "@/services/stockItemService";

export const Route = createFileRoute("/app/stock-items")({
  head: () => ({ meta: [{ title: "Stock Items — SmartERP" }] }),
  component: StockItemsPage,
});

function StockBadge({ qty }: { qty: number }) {
  if (qty === 0)
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20" variant="outline">Out of stock</Badge>;
  if (qty < 20)
    return <Badge className="bg-warning/15 text-warning-foreground border-warning/30" variant="outline">Low</Badge>;
  return <Badge className="bg-success/12 text-success border-success/20" variant="outline">In stock</Badge>;
}

function StockItemsPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StockItem | null>(null);
  const [deleting, setDeleting] = useState<StockItem | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const loadItems = async () => {
    const data = await getStockItems();
    if (data.success) setItems(data.items);
    else toast.error(data.message);
  };

  useEffect(() => {
    loadItems();
  }, []);
 const visibleItems = showLowStockOnly
  ? items.filter((item) => Number(item.quantity || 0) < 20)
  : items;
  const table = useTable(visibleItems, {
    searchKeys: ["name", "sku", "category"],
    pageSize: 8,
  });

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item: StockItem) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleSubmit = async (draft: StockDraft) => {
    let data;

    const fixedDraft = {
      ...draft,
      gstPercentage: (draft as any).gstRate ?? (draft as any).gstPercentage ?? 0,
    };

    if (editing) {
      const id = (editing as any)._id || editing.id;
      data = await updateStockItem(id, fixedDraft);
    } else {
      data = await createStockItem(fixedDraft);
    }

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(editing ? "Item updated" : "Item added");
    setFormOpen(false);
    setEditing(null);
    loadItems();
  };

  const handleDelete = async () => {
    if (!deleting) return;

    const id = (deleting as any)._id || deleting.id;
    const data = await deleteStockItem(id);

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(`Deleted "${deleting.name}"`);
    setDeleting(null);
    loadItems();
  };

  const columns: Column<StockItem>[] = [
    {
      key: "name",
      header: "Item",
      cell: (i) => (
        <div className="leading-tight">
          <p className="font-medium text-foreground">{i.name}</p>
          <p className="font-mono text-xs text-muted-foreground">{i.sku}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (i) => <Badge variant="secondary">{(i as any).category || "General"}</Badge>,
    },
    {
      key: "quantity",
      header: "Stock",
      align: "right",
      cell: (i) => (
        <span className="font-medium">
          {i.quantity} <span className="text-xs text-muted-foreground">{i.unit}</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      cell: (i) => <StockBadge qty={Number(i.quantity || 0)} />,
    },
    {
      key: "purchasePrice",
      header: "Purchase",
      align: "right",
      cell: (i) => formatCurrency(i.purchasePrice),
    },
    {
      key: "sellingPrice",
      header: "Selling",
      align: "right",
      cell: (i) => <span className="font-medium">{formatCurrency(i.sellingPrice)}</span>,
    },
    {
      key: "gstRate",
      header: "GST",
      align: "center",
      cell: (i) => `${(i as any).gstPercentage ?? (i as any).gstRate ?? 0}%`,
    },
    
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (i) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(i)}>
              <Pencil className="size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleting(i)}
            >
              <Trash2 className="size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
return (
  <div className="space-y-5">
    <PageHeader
      title="Stock Items"
      description="Manage products, stock levels, pricing and GST rates."
      actions={
        <div className="flex gap-2">
          <Button
            variant={showLowStockOnly ? "default" : "outline"}
            onClick={() => setShowLowStockOnly((prev) => !prev)}
          >
            {showLowStockOnly ? "Show All Items" : "Low Stock Only"}
          </Button>

          <Button onClick={openCreate}>
            <Plus className="size-4" /> Add Item
          </Button>
        </div>
      }
    />

    <SearchBar
      value={table.search}
      onChange={table.setSearch}
      placeholder="Search items, SKU, category…"
    />

    <DataTable
      columns={columns}
      data={table.rows}
      rowKey={(i) => (i as any)._id || i.id}
      emptyTitle="No stock items found"
      emptyAction={
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Add Item
        </Button>
      }
    />

    <DataPagination
      page={table.page}
      pageCount={table.pageCount}
      total={table.total}
      pageSize={table.pageSize}
      onPageChange={table.setPage}
    />

    <StockFormDialog
  open={formOpen}
  onOpenChange={setFormOpen}
  item={editing}
  onSubmit={handleSubmit}
/>

    <ConfirmDialog
      open={!!deleting}
      onOpenChange={(o) => !o && setDeleting(null)}
      title="Delete stock item?"
      description={`This will permanently remove "${deleting?.name}".`}
      confirmLabel="Delete"
      onConfirm={handleDelete}
    />
  </div>
);
}