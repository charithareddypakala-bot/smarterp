import { useState } from "react";
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
import { createContraVoucher } from "@/services/contraService";

export const Route = createFileRoute("/app/contra")({
  component: ContraVoucherPage,
});

function ContraVoucherPage() {
  const [contraNo, setContraNo] = useState(`CON-${Date.now()}`);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");

  const handleSave = async () => {
    if (!fromAccount || !toAccount) return toast.error("Select accounts");
    if (fromAccount === toAccount) return toast.error("Accounts cannot be same");
    if (!amount || amount <= 0) return toast.error("Enter valid amount");

    const data = await createContraVoucher({
      contraNo,
      fromAccount,
      toAccount,
      amount,
      note,
    });

    if (!data.success) {
      toast.error(data.message || "Failed to save contra");
      return;
    }

    toast.success("Contra voucher saved");

    setContraNo(`CON-${Date.now()}`);
    setFromAccount("");
    setToAccount("");
    setAmount(0);
    setNote("");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Contra Voucher"
        description="Record cash to bank, bank to cash, or bank to bank transfers."
        actions={
          <Button onClick={handleSave}>
            <Save className="size-4" /> Save Contra
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contra Details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Contra No.</Label>
            <Input value={contraNo} onChange={(e) => setContraNo(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>

          <div className="space-y-2">
            <Label>From Account</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select from account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                <SelectItem value="SBI Bank">SBI Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>To Account</Label>
            <Select value={toAccount} onValueChange={setToAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select to account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                <SelectItem value="SBI Bank">SBI Bank</SelectItem>
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
