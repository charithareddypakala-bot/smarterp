import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StockItem } from "@/types";

export type StockDraft = Omit<StockItem, "id">;

const CATEGORIES = [
  "Raw Material",
  "Construction",
  "Electrical",
  "Plumbing",
  "Paints",
  "Hardware",
];
const UNITS = ["pcs", "kg", "mtr", "bag", "box", "can", "sheet"];
const GST_RATES = [0, 5, 12, 18, 28];

const emptyDraft: StockDraft = {
  name: "",
  sku: "",
  category: "Raw Material",
  quantity: 0,
  unit: "pcs",
  purchasePrice: 0,
  sellingPrice: 0,
  gstRate: 18,
};

interface StockFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: StockItem | null;
  onSubmit: (draft: StockDraft) => void;
}

/** Reusable create/edit modal for stock items. */
export function StockFormDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: StockFormDialogProps) {
  const [draft, setDraft] = useState<StockDraft>(emptyDraft);

  useEffect(() => {
    if (open) setDraft(item ? { ...item } : { ...emptyDraft });
  }, [open, item]);

  const update = <K extends keyof StockDraft>(key: K, value: StockDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(draft);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{item ? "Edit Stock Item" : "Add Stock Item"}</DialogTitle>
            <DialogDescription>Define the product and its pricing.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="i-name">Item name</Label>
                <Input
                  id="i-name"
                  value={draft.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="i-sku">SKU</Label>
                <Input
                  id="i-sku"
                  value={draft.sku}
                  onChange={(e) => update("sku", e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={draft.category} onValueChange={(v) => update("category", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="i-qty">Qty</Label>
                  <Input
                    id="i-qty"
                    type="number"
                    value={draft.quantity}
                    onChange={(e) => update("quantity", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={draft.unit} onValueChange={(v) => update("unit", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="i-pp">Purchase ₹</Label>
                <Input
                  id="i-pp"
                  type="number"
                  value={draft.purchasePrice}
                  onChange={(e) => update("purchasePrice", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="i-sp">Selling ₹</Label>
                <Input
                  id="i-sp"
                  type="number"
                  value={draft.sellingPrice}
                  onChange={(e) => update("sellingPrice", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>GST %</Label>
                <Select
                  value={String(draft.gstRate)}
                  onValueChange={(v) => update("gstRate", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GST_RATES.map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{item ? "Save changes" : "Add item"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
