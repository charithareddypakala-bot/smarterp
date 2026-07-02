import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Printer, Save, Trash2 } from "lucide-react";
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

import { getSuppliers } from "@/services/supplierService";
import { getStockItems } from "@/services/stockItemService";
import { createPurchaseVoucher } from "@/services/purchaseService";

export const Route = createFileRoute("/app/purchase")({
  head: () => ({ meta: [{ title: "Purchase Voucher — SmartERP" }] }),
  component: PurchaseVoucherPage,
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
function lineTotal(line: InvoiceLine) {
  const quantity = Number(line.quantity || 0);
  const rate = Number(line.price || 0);
  const gstRate = Number(line.gstRate || 0);

  return quantity * rate * (1 + gstRate / 100);
}
function PurchaseVoucherPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);

  const [supplierId, setSupplierId] = useState("");
  const [voucherNo, setVoucherNo] = useState(`PUR-${Date.now()}`);
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [lines, setLines] = useState<InvoiceLine[]>([newLine()]);

  useEffect(() => {
    async function loadData() {
      const supplierData = await getSuppliers();
      const stockData = await getStockItems();

      if (supplierData.success) {
        setSuppliers(supplierData.suppliers || []);
      } else {
        toast.error(supplierData.message || "Failed to load suppliers");
      }

      if (stockData.success) {
        setStockItems(stockData.items || []);
      } else {
        toast.error(stockData.message || "Failed to load stock items");
      }
    }

    loadData();
  }, []);

  const supplier = suppliers.find(
    (s) => String(s._id || s.id) === String(supplierId),
  );

  const updateLine = (id: string, patch: Partial<InvoiceLine>) => {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    );
  };

  const onSelectItem = (lineId: string, itemId: string) => {
    const item = stockItems.find(
      (stockItem) => String(stockItem._id || stockItem.id) === String(itemId),
    );

    if (!item) {
      console.log("SELECTED ITEM:", item);
      toast.error("Selected stock item was not found");
      return;
    }

    const purchasePrice = Number(
      item.purchasePrice ??
        item.purchaseRate ??
        item.costPrice ??
        item.price ??
        0,
    );

    const gstRate = Number(
  item.gstPercentage ??
  item.gstRate ??
  item.gst ??
  item.taxRate ??
  18
);

    if (purchasePrice <= 0) {
      toast.error(`${item.name} has no purchase price. Edit it in Stock Items.`);
    }

    updateLine(lineId, {
      itemId,
      name: item.name || "",
      price: purchasePrice,
      gstRate,
    });
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let gst = 0;

    for (const line of lines) {
      const quantity = Number(line.quantity || 0);
      const price = Number(line.price || 0);
      const gstRate = Number(line.gstRate || 0);

      const base = quantity * price;
      subtotal += base;
      gst += (base * gstRate) / 100;
    }

    return {
      subtotal,
      gst,
      grand: subtotal + gst,
    };
  }, [lines]);

  const handleSave = async () => {
    if (!supplier) {
      return toast.error("Please select a supplier");
    }

    if (lines.some((line) => !line.itemId)) {
      return toast.error("Please choose an item for every row");
    }

    for (const line of lines) {
      if (Number(line.quantity) <= 0) {
        return toast.error(`${line.name || "Item"} quantity must be greater than 0`);
      }

      if (Number(line.price) <= 0) {
        return toast.error(
          `${line.name || "Item"} has rate ₹0. Edit its purchase price in Stock Items.`,
        );
      }
    }

    const data = await createPurchaseVoucher({
      companyId: localStorage.getItem("companyId"),
      supplierId,
      supplierName: supplier.name,
      invoiceNo: voucherNo,
      invoiceDate,
      items: lines.map((line) => {
        const quantity = Number(line.quantity);
        const rate = Number(line.price);
        const gstPercentage = Number(line.gstRate);

        return {
          itemId: line.itemId,
          itemName: line.name,
          quantity,
          rate,
          gstPercentage,
          amount: quantity * rate * (1 + gstPercentage / 100),
        };
      }),
      subtotal: totals.subtotal,
      gst: totals.gst,
      total: totals.grand,
    });

    if (!data.success) {
      toast.error(data.message || "Failed to save purchase voucher");
      return;
    }

    toast.success(`Purchase ${voucherNo} recorded`, {
      description: `${supplier.name} · ${formatCurrency(totals.grand)}`,
    });

    setVoucherNo(`PUR-${Date.now()}`);
    setInvoiceDate(new Date().toISOString().split("T")[0]);
    setSupplierId("");
    setLines([newLine()]);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Purchase Voucher"
        description="Record a purchase from a supplier and update stock."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" /> Print
            </Button>

            <Button onClick={handleSave}>
              <Save className="size-4" /> Save Voucher
            </Button>
          </div>
        }
      />
      <style>
  {`
    @media print {
      body * {
        visibility: hidden;
      }

      #print-purchase, #print-purchase * {
        visibility: visible;
      }

      #print-purchase {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 24px;
        background: white;
        color: black;
      }
    }
  `}
</style>
<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
  <div className="space-y-5">
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Purchase Details</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>

            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s._id || s.id} value={String(s._id || s.id)}>
                  {s.name} — {s.state || s.phone || "Supplier"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Purchase No.</Label>
          <Input
            value={voucherNo}
            onChange={(e) => setVoucherNo(e.target.value)}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label>Purchase Date</Label>
          <Input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Items</CardTitle>

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
            <TableHead className="min-w-[200px]">Item</TableHead>
            <TableHead className="w-24">Qty</TableHead>
            <TableHead className="w-32">Rate</TableHead>
            <TableHead className="w-20">GST</TableHead>
            <TableHead className="w-32 text-right">Amount</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {lines.map((line) => (
            <TableRow key={line.id}>
              <TableCell>
                <Select
                  value={line.itemId}
                  onValueChange={(value) => onSelectItem(line.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>

                  <SelectContent>
                    {stockItems.map((stockItem) => (
                      <SelectItem
                        key={stockItem._id || stockItem.id}
                        value={String(stockItem._id || stockItem.id)}
                      >
                        {stockItem.name} — Stock: {stockItem.quantity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell>
                <Input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) =>
                    updateLine(line.id, {
                      quantity: Math.max(1, Number(e.target.value)),
                    })
                  }
                />
              </TableCell>

              <TableCell>
                <Input
                  type="number"
                  min={0}
                  value={line.price}
                  onChange={(e) =>
                    updateLine(line.id, {
                      price: Math.max(0, Number(e.target.value)),
                    })
                  }
                />
              </TableCell>

              <TableCell className="text-sm text-muted-foreground">
                {line.gstRate}%
              </TableCell>

              <TableCell className="text-right font-medium">
                {formatCurrency(lineTotal(line))}
              </TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setLines((prev) =>
                      prev.length > 1
                        ? prev.filter((item) => item.id !== line.id)
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
    </CardContent>
  </Card>
  </div>

        {/* RIGHT: PURCHASE VOUCHER PREVIEW */}
        <Card className="h-fit xl:sticky xl:top-5">
          <CardHeader>
            <CardTitle className="text-base">Purchase Preview</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-dashed p-5 text-sm">
              <div className="border-b pb-4">
                <p className="text-lg font-bold">
                  {localStorage.getItem("companyName") || "SmartERP Company"}
                </p>
                <p className="text-muted-foreground">Purchase Voucher</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b py-4">
                <div>
                  <p className="text-muted-foreground">Supplier</p>
                  <p className="mt-1 font-medium">{supplier?.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {supplier?.phone || ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    GSTIN: {supplier?.gstin || "—"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-muted-foreground">Voucher No.</p>
                  <p className="mt-1 font-medium">{voucherNo}</p>
                  <p className="mt-3 text-muted-foreground">Invoice Date</p>
                  <p className="font-medium">
                    {new Date(invoiceDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="border-b py-4">
                {lines.some((line) => line.itemId) ? (
                  <div className="space-y-2">
                    {lines
                      .filter((line) => line.itemId)
                      .map((line) => (
                        <div
                          key={line.id}
                          className="flex items-start justify-between gap-3"
                        >
                          <div>
                            <p className="font-medium">{line.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {line.quantity} × {formatCurrency(line.price)} · GST{" "}
                              {line.gstRate}%
                            </p>
                          </div>

                          <p className="font-medium">
                            {formatCurrency(lineTotal(line))}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="py-5 text-center text-muted-foreground">
                    No items added yet
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST</span>
                  <span>{formatCurrency(totals.gst)}</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-base font-bold">
                  <span>Grand Total</span>
                  <span className="text-primary">
                    {formatCurrency(totals.grand)}
                  </span>
                </div>
              </div>

              <div className="mt-10 border-t pt-4 text-right">
                <p className="text-xs text-muted-foreground">
                  For {localStorage.getItem("companyName") || "SmartERP Company"}
                </p>

                <div className="mt-8">
                  <p className="font-semibold">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="print-purchase" className="hidden print:block">
        <div className="mx-auto max-w-4xl border border-black p-6 text-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {localStorage.getItem("companyName") || "SmartERP Company"}
            </h1>
            <p>Purchase Voucher</p>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Print preview available here.
          </p>
        </div>
      </div>
    </div>
  );
}
