import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
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
import { PageHeader } from "@/components/common/page-header";
import { getCustomers } from "@/services/customerService";
import { createReceiptVoucher } from "@/services/receiptService";

export const Route = createFileRoute("/app/receipt")({
  head: () => ({ meta: [{ title: "Receipt Voucher — SmartERP" }] }),
  component: ReceiptVoucherPage,
});

function ReceiptVoucherPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [receiptNo, setReceiptNo] = useState(`REC-${Date.now()}`);
  const [amount, setAmount] = useState(0);
  const [mode, setMode] = useState("Cash");
  const [note, setNote] = useState("");

  useEffect(() => {
    async function loadData() {
      const data = await getCustomers();
      if (data.success) setCustomers(data.customers || []);
    }

    loadData();
  }, []);

  const customer = customers.find((c) => c._id === customerId);

  const handleSave = async () => {
    if (!customer) {
      toast.error("Please select a customer");
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Please enter valid amount");
      return;
    }

    const data = await createReceiptVoucher({
      customerId,
      customerName: customer.name,
      receiptNo,
      amount,
      mode,
      note,
    });

    if (!data.success) {
      toast.error(data.message || "Failed to save receipt");
      return;
    }

    toast.success("Receipt voucher saved");

    setCustomerId("");
    setReceiptNo(`REC-${Date.now()}`);
    setAmount(0);
    setMode("Cash");
    setNote("");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Receipt Voucher"
        description="Record money received from customers."
        actions={
          <Button onClick={handleSave}>
            <Save className="size-4" /> Save Receipt
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Receipt Details</CardTitle>
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
            <Label>Receipt No.</Label>
            <Input
              value={receiptNo}
              onChange={(e) => setReceiptNo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Bank">Bank</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Note</Label>
            <Input
              placeholder="Optional note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}