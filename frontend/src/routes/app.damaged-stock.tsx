import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/page-header";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  createDamagedStock,
  getDamagedStock,
} from "@/services/damagedStockService";

import { getStockItems } from "@/services/stockItemService";

export const Route = createFileRoute("/app/damaged-stock")({
  component: DamagedStockPage,
});

function DamagedStockPage() {
  const [items, setItems] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  const [damageNo, setDamageNo] = useState(`DMG-${Date.now()}`);
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  async function load() {
    const stock = await getStockItems();
    if (stock.success) setItems(stock.items || []);

    const damaged = await getDamagedStock();
    if (damaged.success) setRecords(damaged.records || []);
  }

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!itemId) return toast.error("Select an item");
    if (quantity <= 0) return toast.error("Enter quantity");
    if (!reason) return toast.error("Enter damage reason");

    const data = await createDamagedStock({
      damageNo,
      itemId,
      itemName,
      quantity,
      reason,
      note,
    });

    if (!data.success) {
      return toast.error(data.message || "Failed to save damaged stock");
    }

    toast.success("Damaged stock recorded");

    setDamageNo(`DMG-${Date.now()}`);
    setItemId("");
    setItemName("");
    setQuantity(1);
    setReason("");
    setNote("");

    load();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Damaged Stock"
        description="Record damaged, expired, or unusable inventory."
        actions={
          <Button onClick={save}>
            <Save className="size-4" />
            Save
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Damage Entry</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Damage No.</Label>
            <Input
              value={damageNo}
              onChange={(e) => setDamageNo(e.target.value)}
            />
          </div>

          <div>
            <Label>Item</Label>
            <select
              className="w-full rounded-md border p-2"
              value={itemId}
              onChange={(e) => {
                const id = e.target.value;
                setItemId(id);

                const item = items.find((i) => i._id === id);
                if (item) setItemName(item.name);
              }}
            >
              <option value="">Select Item</option>

              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} — Stock: {item.quantity}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Reason</Label>
            <Input
              placeholder="Broken / expired / damaged"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Note</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Damaged Stock History</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.damageNo}</TableCell>
                  <TableCell>{r.itemName}</TableCell>
                  <TableCell>{r.quantity}</TableCell>
                  <TableCell>{r.reason}</TableCell>
                  <TableCell>{r.note || "-"}</TableCell>
                </TableRow>
              ))}

              {records.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No damaged stock records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}