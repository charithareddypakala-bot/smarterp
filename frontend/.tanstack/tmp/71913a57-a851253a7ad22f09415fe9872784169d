import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import {
  getStockItems,
  createStockItem,
  updateStockItem,
  deleteStockItem,
} from "@/services/stockItemService";

export const Route = createFileRoute("/stock-items")({
  component: StockItemsPage,
});

function StockItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    unit: "PCS",
    purchasePrice: 0,
    sellingPrice: 0,
    quantity: 0,
    gstPercentage: 0,
  });

  const loadItems = async () => {
    const data = await getStockItems();
    if (data.success) setItems(data.items);
    else toast.error(data.message);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(
      (i) =>
        i.name?.toLowerCase().includes(q) ||
        i.sku?.toLowerCase().includes(q) ||
        i.unit?.toLowerCase().includes(q),
    );
  }, [items, search]);

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      sku: "",
      unit: "PCS",
      purchasePrice: 0,
      sellingPrice: 0,
      quantity: 0,
      gstPercentage: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let data;
    if (editing) {
      const id = editing._id || editing.id;
      data = await updateStockItem(id, form);
    } else {
      data = await createStockItem(form);
    }

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(editing ? "Stock item updated" : "Stock item created");
    resetForm();
    loadItems();
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      sku: item.sku || "",
      unit: item.unit || "PCS",
      purchasePrice: item.purchasePrice || 0,
      sellingPrice: item.sellingPrice || 0,
      quantity: item.quantity || 0,
      gstPercentage: item.gstPercentage || 0,
    });
  };

  const handleDelete = async (item: any) => {
    const id = item._id || item.id;
    const data = await deleteStockItem(id);

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success("Stock item deleted");
    loadItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stock Items</h1>
          <p className="text-sm text-muted-foreground">
            Manage item / stock master for the selected company.
          </p>
        </div>

        <Input
          className="max-w-xs"
          placeholder="Search stock items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="p-4">
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4">
          <Input
            placeholder="Item name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />

          <Input
            placeholder="Unit"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />

          <Input
            type="number"
            placeholder="GST %"
            value={form.gstPercentage}
            onChange={(e) =>
              setForm({ ...form, gstPercentage: Number(e.target.value) })
            }
          />

          <Input
            type="number"
            placeholder="Purchase Price"
            value={form.purchasePrice}
            onChange={(e) =>
              setForm({ ...form, purchasePrice: Number(e.target.value) })
            }
          />

          <Input
            type="number"
            placeholder="Selling Price"
            value={form.sellingPrice}
            onChange={(e) =>
              setForm({ ...form, sellingPrice: Number(e.target.value) })
            }
          />

          <Input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
          />

          <div className="flex gap-2">
            <Button type="submit">
              <Plus className="size-4" />
              {editing ? "Update" : "Add"}
            </Button>

            {editing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Boxes}
            title="No stock items found"
            description="Add your first stock item."
          />
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <Card
              key={item._id || item.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  SKU: {item.sku || "-"} · Unit: {item.unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity} · Purchase: ₹{item.purchasePrice} · Sale:
                  ₹{item.sellingPrice} · GST: {item.gstPercentage}%
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                  <Pencil className="size-4" /> Edit
                </Button>

                <Button variant="destructive" size="sm" onClick={() => handleDelete(item)}>
                  <Trash2 className="size-4" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}