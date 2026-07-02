import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/page-header";
import { formatCurrency } from "@/lib/format";
import type { InvoiceLine } from "@/types";

import { getCustomers } from "@/services/customerService";
import { getStockItems } from "@/services/stockItemService";
import { createSalesReturn } from "@/services/salesReturnService";

export const Route = createFileRoute("/app/credit-note")({
  component: CreditNotePage,
});

function newLine(): InvoiceLine {
  return {
    id: crypto.randomUUID(),
    itemId: "",
    name: "",
    quantity: 1,
    price: 0,
    gstRate: 18,
  };
}

function CreditNotePage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [returnNo, setReturnNo] = useState(`SR-${Date.now()}`);
  const [lines, setLines] = useState<InvoiceLine[]>([newLine()]);

  useEffect(() => {
    async function loadData() {
      const customerData = await getCustomers();
      const stockData = await getStockItems();

      if (customerData.success) setCustomers(customerData.customers || []);
      if (stockData.success) setStockItems(stockData.items || []);
    }

    loadData();
  }, []);

  const customer = customers.find((c) => c._id === customerId);

  const updateLine = (id: string, patch: Partial<InvoiceLine>) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const onSelectItem = (lineId: string, itemId: string) => {
    const item = stockItems.find((s) => s._id === itemId);
    if (!item) return;

    updateLine(lineId, {
      itemId,
      name: item.name,
      price: item.sellingPrice || 0,
      gstRate: item.gstPercentage ?? item.gstRate ?? 0,
    });
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let gst = 0;

    for (const l of lines) {
      const base = l.quantity * l.price;
      subtotal += base;
      gst += (base * l.gstRate) / 100;
    }

    return {
      subtotal,
      gst,
      grand: subtotal + gst,
    };
  }, [lines]);

  const handleSave = async () => {
    if (!customer) return toast.error("Please select a customer");

    if (lines.some((l) => !l.itemId)) {
      return toast.error("Please choose items for all rows");
    }

    const data = await createSalesReturn({
      customerId,
      customerName: customer.name,
      returnNo,
      items: lines.map((l) => ({
        itemId: l.itemId,
        name: l.name,
        quantity: l.quantity,
        price: l.price,
        gstRate: l.gstRate,
      })),
      subtotal: totals.subtotal,
      gst: totals.gst,
      total: totals.grand,
    });

    if (!data.success) {
      toast.error(data.message || "Failed to save credit note");
      return;
    }

    toast.success("Credit Note saved");

    setCustomerId("");
    setReturnNo(`SR-${Date.now()}`);
    setLines([newLine()]);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Credit Note / Sales Return"
        description="Record goods returned by customers and increase stock."
        actions={
          <Button onClick={handleSave}>
            <Save className="size-4" /> Save Credit Note
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Return Details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Customer</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name} — {c.phone || c.state || "Customer"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Return No.</Label>
            <Input
              value={returnNo}
              onChange={(e) => setReturnNo(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Returned Items</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLines((prev) => [...prev, newLine()])}
          >
            <Plus className="size-4" /> Add Row
          </Button>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Product</TableHead>
                <TableHead className="w-20">Qty</TableHead>
                <TableHead className="w-28">Price</TableHead>
                <TableHead className="w-20">GST</TableHead>
                <TableHead className="w-28 text-right">Amount</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {lines.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <Select
                      value={l.itemId}
                      onValueChange={(v) => onSelectItem(l.id, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {stockItems.map((s) => (
                          <SelectItem key={s._id} value={s._id}>
                            {s.name} — Stock: {s.quantity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={l.quantity}
                      onChange={(e) =>
                        updateLine(l.id, {
                          quantity: Math.max(1, Number(e.target.value)),
                        })
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      value={l.price}
                      onChange={(e) =>
                        updateLine(l.id, { price: Number(e.target.value) })
                      }
                    />
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {l.gstRate}%
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {formatCurrency(l.quantity * l.price * (1 + l.gstRate / 100))}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        setLines((prev) =>
                          prev.length > 1
                            ? prev.filter((x) => x.id !== l.id)
                            : prev,
                        )
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-end">
            <dl className="w-full max-w-xs space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium">{formatCurrency(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">GST</dt>
                <dd className="font-medium">{formatCurrency(totals.gst)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <dt className="font-semibold">Total</dt>
                <dd className="font-bold text-primary">
                  {formatCurrency(totals.grand)}
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}