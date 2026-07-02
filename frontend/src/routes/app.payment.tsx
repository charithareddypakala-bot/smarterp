import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatCurrency, formatDate } from "@/lib/format";
import { getSuppliers } from "@/services/supplierService";
import {
  createPaymentVoucher,
  getPayments,
} from "@/services/paymentService";

export const Route = createFileRoute("/app/payment")({
  head: () => ({ meta: [{ title: "Payment Voucher - SmartERP" }] }),
  component: PaymentVoucherPage,
});

const paymentModes = ["Cash", "Bank", "UPI", "Cheque"] as const;

function newPaymentNo() {
  return `PAY-${Date.now()}`;
}

function PaymentVoucherPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [paymentNo, setPaymentNo] = useState(newPaymentNo());
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<(typeof paymentModes)[number]>("Cash");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedSupplier = useMemo(
    () => suppliers.find((supplier) => supplier._id === supplierId),
    [supplierId, suppliers],
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [supplierData, paymentData] = await Promise.all([
        getSuppliers(),
        getPayments(),
      ]);

      if (supplierData.success) {
        setSuppliers(supplierData.suppliers || []);
      } else {
        toast.error(supplierData.message || "Failed to load suppliers");
      }

      if (paymentData.success) {
        setPayments(paymentData.vouchers || []);
      } else {
        toast.error(paymentData.message || "Failed to load payments");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setSupplierId("");
    setPaymentNo(newPaymentNo());
    setAmount("");
    setMode("Cash");
    setNote("");
  };

  const handleSave = async () => {
    const paymentAmount = Number(amount);

    if (!selectedSupplier) {
      toast.error("Please select a supplier");
      return;
    }

    if (!paymentNo.trim()) {
      toast.error("Please enter a payment number");
      return;
    }

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setSaving(true);
      const data = await createPaymentVoucher({
        supplierId,
        supplierName: selectedSupplier.name,
        paymentNo: paymentNo.trim(),
        amount: paymentAmount,
        mode,
        note: note.trim(),
      });

      if (!data.success) {
        toast.error(data.message || "Failed to save payment");
        return;
      }

      toast.success("Payment voucher saved", {
        description: `${selectedSupplier.name} - ${formatCurrency(paymentAmount)}`,
      });

      resetForm();
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payment Voucher"
        description="Record money paid to suppliers."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData} disabled={loading || saving}>
              <RefreshCw className="size-4" /> Refresh
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="size-4" /> {saving ? "Saving..." : "Save Payment"}
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment Details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select value={supplierId} onValueChange={setSupplierId}>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier._id} value={supplier._id}>
                    {supplier.name} - {supplier.phone || supplier.state || "Supplier"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Payment No.</Label>
            <Input value={paymentNo} onChange={(event) => setPaymentNo(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Mode</Label>
            <Select value={mode} onValueChange={(value) => setMode(value as typeof mode)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {paymentModes.map((paymentMode) => (
                  <SelectItem key={paymentMode} value={paymentMode}>
                    {paymentMode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Note</Label>
            <Input
              placeholder="Optional note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Payments</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment No.</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {loading ? "Loading payments..." : "No payment vouchers found"}
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment._id || payment.paymentNo}>
                    <TableCell className="font-medium">{payment.paymentNo}</TableCell>
                    <TableCell>{payment.supplierName}</TableCell>
                    <TableCell>{formatDate(payment.createdAt || payment.date)}</TableCell>
                    <TableCell>{payment.mode}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(Number(payment.amount || 0))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
