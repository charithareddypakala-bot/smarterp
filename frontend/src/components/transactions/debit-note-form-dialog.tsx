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
import { toast } from "sonner";
import { createPurchaseReturn } from "@/services/purchaseReturnService";
import { getSuppliers } from "@/services/supplierService";
import { getStockItems } from "@/services/stockItemService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemDraft {
  itemId?: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
  restock?: boolean;
  reason?: string;
}

interface DebitNoteDraft {
  supplierId?: string;
  supplierName: string;
  returnNo?: string;
  items: ItemDraft[];
}

interface DebitNoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const emptyItem: ItemDraft = { name: "", quantity: 1, price: 0, gstRate: 0 };

export function DebitNoteFormDialog({ open, onOpenChange, onCreated }: DebitNoteFormDialogProps) {
  const [draft, setDraft] = useState<DebitNoteDraft>({ supplierName: "", items: [emptyItem] });
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);

  useEffect(() => {
    if (open) setDraft({ supplierName: "", items: [emptyItem] });

    async function loadLists() {
      const sRes = await getSuppliers();
      if (sRes && sRes.success) setSuppliers(sRes.suppliers || []);

      const iRes = await getStockItems();
      if (iRes && iRes.success) setStockItems(iRes.items || []);
    }

    if (open) loadLists();
  }, [open]);

  const updateItem = (idx: number, key: keyof ItemDraft, value: any) =>
    setDraft((d) => ({ ...d, items: d.items.map((it, i) => (i === idx ? { ...it, [key]: value } : it)) }));

  const addItem = () => setDraft((d) => ({ ...d, items: [...d.items, { ...emptyItem }] }));
  const removeItem = (idx: number) => setDraft((d) => ({ ...d, items: d.items.filter((_, i) => i !== idx) }));

  const subtotal = draft.items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0);
  const gst = draft.items.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 0) * (it.gstRate || 0)) / 100, 0);
  const total = subtotal + gst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!draft.supplierId) {
      toast.error("Please select a supplier");
      return;
    }

    const payload = {
      supplierId: draft.supplierId,
      supplierName: draft.supplierName,
      returnNo: `DN-${Date.now()}`,
      items: draft.items.map((it) => ({ itemId: it.itemId, name: it.name, quantity: it.quantity, price: it.price, gstRate: it.gstRate, restock: !!it.restock, reason: it.reason })),
      subtotal,
      gst,
      total,
    };

    const res = await createPurchaseReturn(payload);

    if (res && res.success) {
      toast.success("Debit note created");
      onOpenChange(false);
      onCreated && onCreated();
    } else {
      toast.error(res?.message || "Failed to create debit note");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Debit Note</DialogTitle>
            <DialogDescription>Create a purchase return / debit note.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Select value={draft.supplierId} onValueChange={(v) => {
                const s = suppliers.find((x) => x._id === v);
                setDraft((d) => ({ ...d, supplierId: v, supplierName: s ? s.name : "" }));
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Items</Label>
              <div className="space-y-2">
                {draft.items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-6 gap-2 items-end">
                    <Select value={it.itemId} onValueChange={(v) => {
                      const selected = stockItems.find((s) => s._id === v);
                      updateItem(idx, "itemId", v);
                      updateItem(idx, "name", selected ? selected.name : "");
                      updateItem(idx, "price", selected ? selected.purchasePrice || 0 : 0);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {stockItems.map((s) => (
                          <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input type="number" placeholder="Qty" value={it.quantity} onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))} />
                    <Input type="number" placeholder="Price" value={it.price} onChange={(e) => updateItem(idx, "price", Number(e.target.value))} />
                    <Input type="text" placeholder="Reason" value={it.reason} onChange={(e) => updateItem(idx, "reason", e.target.value)} />
                    <div className="flex items-center gap-2">
                      <input id={`restock-${idx}`} type="checkbox" checked={!!it.restock} onChange={(e) => updateItem(idx, "restock", e.target.checked)} />
                      <label htmlFor={`restock-${idx}`}>Restock</label>
                    </div>

                    <div className="col-span-6 flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => removeItem(idx)}>Remove</Button>
                    </div>
                  </div>
                ))}
                <div>
                  <Button type="button" variant="ghost" onClick={addItem}>Add item</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Subtotal</Label>
                <Input value={subtotal} readOnly />
              </div>
              <div className="space-y-2">
                <Label>GST</Label>
                <Input value={gst} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Total</Label>
                <Input value={total} readOnly />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create debit note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
