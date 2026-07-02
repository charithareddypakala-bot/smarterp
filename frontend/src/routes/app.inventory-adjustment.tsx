import { useEffect, useMemo, useState } from "react";
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
  getInventoryAdjustments,
  createInventoryAdjustment,
} from "@/services/inventoryAdjustmentService";

import { getStockItems } from "@/services/stockItemService";

export const Route = createFileRoute("/app/inventory-adjustment")({
  component: InventoryAdjustmentPage,
});

function InventoryAdjustmentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const [adjustmentNo, setAdjustmentNo] = useState(
    `ADJ-${Date.now()}`
  );

  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [currentStock, setCurrentStock] = useState(0);
  const [physicalStock, setPhysicalStock] = useState(0);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const difference = useMemo(
    () => physicalStock - currentStock,
    [physicalStock, currentStock]
  );

  async function load() {
    const stock = await getStockItems();
    if (stock.success) setItems(stock.items);

    const adj = await getInventoryAdjustments();
    if (adj.success) setHistory(adj.adjustments);
  }

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!itemId)
      return toast.error("Select stock item");

    const data = await createInventoryAdjustment({
      adjustmentNo,
      itemId,
      itemName,
      currentStock,
      physicalStock,
      difference,
      reason,
      note,
    });

    if (!data.success)
      return toast.error(data.message);

    toast.success("Inventory adjusted");

    setAdjustmentNo(`ADJ-${Date.now()}`);
    setItemId("");
    setItemName("");
    setCurrentStock(0);
    setPhysicalStock(0);
    setReason("");
    setNote("");

    load();
  };

  return (
    <div className="space-y-5">

      <PageHeader
        title="Inventory Adjustment"
        description="Adjust stock after physical verification."
        actions={
          <Button onClick={save}>
            <Save className="size-4"/>
            Save Adjustment
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Adjustment Details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">

          <div>
            <Label>Adjustment No</Label>
            <Input
              value={adjustmentNo}
              onChange={(e)=>setAdjustmentNo(e.target.value)}
            />
          </div>

          <div>
            <Label>Item</Label>

            <select
              className="w-full rounded-md border p-2"
              value={itemId}
              onChange={(e)=>{
                const id=e.target.value;
                setItemId(id);

                const item=items.find(x=>x._id===id);

                if(item){
                  setItemName(item.name);
                  setCurrentStock(item.quantity);
                  setPhysicalStock(item.quantity);
                }
              }}
            >
              <option value="">Select Item</option>

              {items.map(i=>(
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}

            </select>

          </div>

          <div>
            <Label>Current Stock</Label>
            <Input value={currentStock} disabled />
          </div>

          <div>
            <Label>Physical Stock</Label>
            <Input
              type="number"
              value={physicalStock}
              onChange={(e)=>
                setPhysicalStock(Number(e.target.value))
              }
            />
          </div>

          <div>
            <Label>Difference</Label>
            <Input value={difference} disabled />
          </div>

          <div>
            <Label>Reason</Label>
            <Input
              value={reason}
              onChange={(e)=>setReason(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Note</Label>
            <Input
              value={note}
              onChange={(e)=>setNote(e.target.value)}
            />
          </div>

        </CardContent>
      </Card>

      <Card>

        <CardHeader>
          <CardTitle>Adjustment History</CardTitle>
        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>No.</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Physical</TableHead>
                <TableHead>Difference</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {history.map((h)=>(
                <TableRow key={h._id}>
                  <TableCell>{h.adjustmentNo}</TableCell>
                  <TableCell>{h.itemName}</TableCell>
                  <TableCell>{h.currentStock}</TableCell>
                  <TableCell>{h.physicalStock}</TableCell>
                  <TableCell>{h.difference}</TableCell>
                </TableRow>
              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </div>
  );
}
