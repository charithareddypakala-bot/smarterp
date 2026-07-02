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
  createReservedStock,
  getReservedStock,
} from "@/services/reservedStockService";

import { getStockItems } from "@/services/stockItemService";

export const Route = createFileRoute("/app/reserved-stock")({
  component: ReservedStockPage,
});

function ReservedStockPage() {
  const [items, setItems] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  const [reserveNo, setReserveNo] = useState(`RSV-${Date.now()}`);
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  async function load() {
    const stock = await getStockItems();
    if (stock.success) setItems(stock.items);

    const reserved = await getReservedStock();
    if (reserved.success) setRecords(reserved.records);
  }

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!itemId) return toast.error("Select an item");
    if (!customerName) return toast.error("Enter customer name");
    if (quantity <= 0) return toast.error("Enter quantity");

    const data = await createReservedStock({
      reserveNo,
      itemId,
      itemName,
      customerName,
      quantity,
      note,
    });

    if (!data.success) {
      return toast.error(data.message);
    }

    toast.success("Stock reserved");

    setReserveNo(`RSV-${Date.now()}`);
    setItemId("");
    setItemName("");
    setCustomerName("");
    setQuantity(1);
    setNote("");

    load();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reserved Stock"
        description="Reserve stock for customers before dispatch."
        actions={
          <Button onClick={save}>
            <Save className="size-4" />
            Save
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Reserve Stock</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Reserve No.</Label>
            <Input
              value={reserveNo}
              onChange={(e) => setReserveNo(e.target.value)}
            />
          </div>

          <div>
            <Label>Item</Label>

            <select
              className="w-full rounded-md border p-2"
              value={itemId}
              onChange={(e) => {
                setItemId(e.target.value);

                const item = items.find(
                  (i) => i._id === e.target.value
                );

                if (item) setItemName(item.name);
              }}
            >
              <option value="">Select Item</option>

              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Customer</Label>
            <Input
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value))
              }
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Note</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reserved Stock History</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.reserveNo}</TableCell>
                  <TableCell>{r.itemName}</TableCell>
                  <TableCell>{r.customerName}</TableCell>
                  <TableCell>{r.quantity}</TableCell>
                  <TableCell>{r.status}</TableCell>
                </TableRow>
              ))}

              {records.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No reserved stock found.
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