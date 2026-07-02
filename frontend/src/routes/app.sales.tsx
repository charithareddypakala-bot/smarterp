import { getCompanyProfile } from "@/services/companyProfileService";
import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Printer, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { formatCurrency, formatDate } from "@/lib/format";
import type { InvoiceLine } from "@/types";

import { getCustomers } from "@/services/customerService";
import { getStockItems } from "@/services/stockItemService";
import { createSalesVoucher } from "@/services/salesService";

export const Route = createFileRoute("/app/sales")({
  head: () => ({ meta: [{ title: "Sales Invoice — SmartERP" }] }),
  component: SalesInvoicePage,
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

function SalesInvoicePage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);
const [company, setCompany] = useState({
  companyName: "SmartERP Company",
  gstin: "",
  address: "",
  state: "",
  phone: "",
  email: "",
});
  const [customerId, setCustomerId] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now()}`);
  const today = new Date().toISOString();
  const [lines, setLines] = useState<InvoiceLine[]>([newLine()]);

  useEffect(() => {
    async function loadData() {
      const customerData = await getCustomers();
      console.log("Customers in Sales:", customerData);
      const stockData = await getStockItems();
      const profile = await getCompanyProfile();

if (profile.success && profile.profile) {
  setCompany(profile.profile);
}
      const companyData = await getCompanyProfile();
      setCompany({
        companyName: companyData.name || "SmartERP Company",
        gstin: companyData.gstin || "",
        address: companyData.address || "",
        state: companyData.state || "",
        phone: companyData.phone || "",
        email: companyData.email || "",
      });

      if (customerData.success) setCustomers(customerData.customers);
      if (stockData.success) setStockItems(stockData.items);
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
      price: item.sellingPrice,
      gstRate: item.gstPercentage,
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
    const printInvoice = () => {
  window.print();
};

    return {
      subtotal,
      gst,
      grand: subtotal + gst,
    };
  }, [lines]);

  const lineTotal = (l: InvoiceLine) =>
    l.quantity * l.price * (1 + l.gstRate / 100);

  const handleSave = async () => {
    for (const line of lines) {
  const item = stockItems.find((s) => s._id === line.itemId);

  if (item && Number(line.quantity) > Number(item.quantity || 0)) {
    return toast.error(
      `${line.name} has only ${item.quantity || 0} in stock`
    );
  }

  if (line.quantity <= 0) {
    return toast.error("Quantity must be greater than 0");
  }

  if (line.price <= 0) {
    return toast.error("Price must be greater than 0");
  }
}
    if (!customer) return toast.error("Please select a customer");

    if (lines.some((l) => !l.itemId)) {
      return toast.error("Please choose items for all rows");
    }

    const data = await createSalesVoucher({
      customerId,
      customerName: customer.name,
      invoiceNo,
      invoiceDate: today.split("T")[0],
      items: lines.map((l) => ({
        itemId: l.itemId,
        itemName: l.name,
        quantity: l.quantity,
        rate: l.price,
        gstPercentage: l.gstRate,
        amount: l.quantity * l.price,
      })),
      subtotal: totals.subtotal,
      gstAmount: totals.gst,
      totalAmount: totals.grand,
      paymentStatus: "Unpaid",
    });

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(`Invoice ${invoiceNo} saved`, {
      description: `${customer.name} · ${formatCurrency(totals.grand)}`,
    });

    setInvoiceNo(`INV-${Date.now()}`);
    setCustomerId("");
    setLines([newLine()]);
  };
const printInvoice = () => {
  window.print();
};
  return (
    <div className="space-y-5">
      <PageHeader
        title="Sales Invoice"
        description="Create a GST tax invoice for a customer."
        actions={
          <>
            <Button variant="outline" onClick={printInvoice}>
              <Printer className="size-4" /> Print
            </Button>
            <Button onClick={handleSave}>
              <Save className="size-4" /> Save Invoice
            </Button>
          </>
        }
      />
      <style>
  {`
    @media print {
      body * {
        visibility: hidden;
      }

      #print-invoice, #print-invoice * {
        visibility: visible;
      }

      #print-invoice {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 24px;
        background: white;
        color: black;
      }

      .no-print {
        display: none !important;
      }
    }
  `}
</style>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invoice Details</CardTitle>
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
                        {c.name} — {c.state || c.phone || "Customer"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Invoice No.</Label>
                <Input
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="bg-muted/50"
                />
                <div id="print-invoice" className="hidden print:block">
  <div className="mx-auto max-w-4xl border border-black p-6 text-sm">
    <div className="text-center">
      <h1 className="text-2xl font-bold">{company.companyName}</h1>
      <p>{company.gstin}</p>
      <p>{company.address}</p>
      <br>
      </br>
      <p>{company.state}</p>
      <p>Warangal, Telangana</p>
      <h2 className="mt-4 border-y border-black py-2 text-lg font-bold">
        TAX INVOICE
      </h2>
    </div>

    <div className="mt-4 grid grid-cols-2 border border-black">
      <div className="border-r border-black p-3">
        <p className="font-bold">Bill To:</p>
        <p>{customer?.name || "-"}</p>
        <p>{customer?.phone || ""}</p>
        <p>{customer?.address || customer?.state || ""}</p>
      </div>

      <div className="p-3">
        <p>
          <b>Invoice No:</b> {invoiceNo}
        </p>
        <p>
          <b>Date:</b> {formatDate(today)}
        </p>
      </div>
    </div>

    <table className="mt-4 w-full border-collapse border border-black">
      <thead>
        <tr>
          <th className="border border-black p-2">S.No</th>
          <th className="border border-black p-2">Item</th>
          <th className="border border-black p-2">Qty</th>
          <th className="border border-black p-2">Rate</th>
          <th className="border border-black p-2">GST</th>
          <th className="border border-black p-2">Amount</th>
        </tr>
      </thead>

      <tbody>
        {lines
          .filter((l) => l.itemId)
          .map((l, index) => (
            <tr key={l.id}>
              <td className="border border-black p-2 text-center">
                {index + 1}
              </td>
              <td className="border border-black p-2">{l.name}</td>
              <td className="border border-black p-2 text-center">
                {l.quantity}
              </td>
              <td className="border border-black p-2 text-right">
                {formatCurrency(l.price)}
              </td>
              <td className="border border-black p-2 text-center">
                {l.gstRate}%
              </td>
              <td className="border border-black p-2 text-right">
                {formatCurrency(lineTotal(l))}
              </td>
            </tr>
          ))}
      </tbody>
    </table>

    <div className="ml-auto mt-4 w-72 border border-black">
      <div className="flex justify-between border-b border-black p-2">
        <span>Subtotal</span>
        <span>{formatCurrency(totals.subtotal)}</span>
      </div>

      <div className="flex justify-between border-b border-black p-2">
        <span>GST</span>
        <span>{formatCurrency(totals.gst)}</span>
      </div>

      <div className="flex justify-between p-2 font-bold">
        <span>Grand Total</span>
        <span>{formatCurrency(totals.grand)}</span>
      </div>
    </div>

    <div className="mt-16 flex justify-between">
      <p>Customer Signature</p>
      <p>Authorised Signature</p>
    </div>
  </div>
</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Items</CardTitle>
              <Button variant="outline" onClick={printInvoice}>
                <Printer className="size-4" /> Print
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
                        {formatCurrency(lineTotal(l))}
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
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Invoice Preview</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg border border-dashed border-border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-blue-700">
                      {company.companyName}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      Plot No. 15, IT Park
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Hanamkonda, Telangana
                    </p>

                    <p className="text-xs text-muted-foreground">
                      GSTIN : 36ABCDE1234F1Z5
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Phone : +91 9876543210
                    </p>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Billed To</p>
                    <p className="font-medium text-foreground">
                      {customer ? customer.name : "—"}
                    </p>
                   <div className="space-y-1">

  <p className="font-semibold">
    {customer?.name || "-"}
  </p>

  <p className="text-xs text-muted-foreground">
    {customer?.address || ""}
  </p>

  <p className="text-xs text-muted-foreground">
    {customer?.state || ""}
  </p>

  <p className="text-xs text-muted-foreground">
    GSTIN : {customer?.gstin || "-"}
  </p>

</div>
                  </div>

                <div className="space-y-1 text-right">

<p className="text-xs text-muted-foreground">
Invoice No.
</p>

<p className="font-semibold">
{invoiceNo}
</p>

<p className="text-xs text-muted-foreground">
Invoice Date
</p>

<p className="font-medium">
{formatDate(today)}
</p>

</div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-1.5 text-xs">
                  {lines.filter((l) => l.itemId).length === 0 ? (
                    <p className="py-2 text-center text-muted-foreground">
                      No items added yet
                    </p>
                  ) : (
                    lines
                      .filter((l) => l.itemId)
                      .map((l) => (
                        <div key={l.id} className="flex justify-between gap-2">
                          <span className="truncate text-foreground">
                            {l.name}{" "}
                            <span className="text-muted-foreground">
                              ×{l.quantity}
                            </span>
                          </span>
                          <span className="shrink-0 font-medium">
                            {formatCurrency(l.quantity * l.price)}
                          </span>
                        </div>
                      ))
                  )}
                </div>

                <Separator className="my-3" />

                <dl className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium">
                      {formatCurrency(totals.subtotal)}
                    </dd>
                  </div>

                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">GST</dt>
                    <dd className="font-medium">{formatCurrency(totals.gst)}</dd>
                  </div>

                  <div className="flex justify-between border-t border-border pt-2 text-sm">
                    <dt className="font-semibold text-foreground">
                      Grand Total
                    </dt>
                    <dd className="font-bold text-primary">
                      {formatCurrency(totals.grand)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 border-t pt-4 text-right">

  <p className="text-xs text-muted-foreground">
    For {company.companyName}
  </p>

  <div className="mt-8">
    <p className="font-semibold">
      Authorized Signatory
    </p>
  </div>

</div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}