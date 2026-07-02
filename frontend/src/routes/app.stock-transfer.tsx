import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PageHeader } from "@/components/common/page-header";

import {
  createStockTransfer,
  getStockTransfers,
} from "@/services/stockTransferService";

import { getStockItems } from "@/services/stockItemService";

export const Route = createFileRoute("/app/stock-transfer")({
  component: StockTransferPage,
});

function StockTransferPage() {
  const [items, setItems] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);

  const [transferNo, setTransferNo] = useState(`TRF-${Date.now()}`);
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  async function load() {
    const t = await getStockTransfers();
    if (t.success) setTransfers(t.transfers);

    const s = await getStockItems();
    if (s.success) setItems(s.items);
  }

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!itemId)
      return toast.error("Select an item");

    if (quantity <= 0)
      return toast.error("Enter quantity");

    const data = await createStockTransfer({
      transferNo,
      itemId,
      itemName,
      fromLocation,
      toLocation,
      quantity,
      note,
    });

    if (!data.success)
      return toast.error(data.message);

    toast.success("Stock transferred");

    setTransferNo(`TRF-${Date.now()}`);
    setItemId("");
    setItemName("");
    setFromLocation("");
    setToLocation("");
    setQuantity(1);
    setNote("");

    load();
  };

  return (
    <div className="space-y-5">

      <PageHeader
        title="Stock Transfer"
        description="Transfer stock between locations."
        actions={
          <Button onClick={save}>
            <Save className="size-4" />
            Save
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">

          <div>
            <Label>Transfer No</Label>

            <Input
              value={transferNo}
              onChange={(e) =>
                setTransferNo(e.target.value)
              }
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

                const item = items.find(
                  (x) => x._id === id
                );

                if (item)
                  setItemName(item.name);
              }}
            >
              <option value="">
                Select Item
              </option>

              {items.map((i) => (
                <option
                  key={i._id}
                  value={i._id}
                >
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>From</Label>

            <Input
              value={fromLocation}
              onChange={(e) =>
                setFromLocation(e.target.value)
              }
            />
          </div>

          <div>
            <Label>To</Label>

            <Input
              value={toLocation}
              onChange={(e) =>
                setToLocation(e.target.value)
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

          <div>
            <Label>Note</Label>

            <Input
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
            />
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Transfer History
          </CardTitle>
        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>No.</TableHead>

                <TableHead>Item</TableHead>

                <TableHead>From</TableHead>

                <TableHead>To</TableHead>

                <TableHead>Qty</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {transfers.map((t) => (

                <TableRow key={t._id}>

                  <TableCell>{t.transferNo}</TableCell>

                  <TableCell>{t.itemName}</TableCell>

                  <TableCell>{t.fromLocation}</TableCell>

                  <TableCell>{t.toLocation}</TableCell>

                  <TableCell>{t.quantity}</TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

    </div>
  );
}