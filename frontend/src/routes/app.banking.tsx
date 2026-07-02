import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { toast } from "sonner";

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
import { PageHeader } from "@/components/common/page-header";
import { formatCurrency } from "@/lib/format";
import {
  getBankTransactions,
  createBankTransaction,
  reconcileTransaction,
} from "@/services/bankingService";

export const Route = createFileRoute("/app/banking")({
  component: BankingPage,
});

function BankingPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionNo, setTransactionNo] = useState(`BANK-${Date.now()}`);
  const [bankName, setBankName] = useState("HDFC Bank");
  const [type, setType] = useState("Deposit");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [referenceNo, setReferenceNo] = useState("");
  const [note, setNote] = useState("");

  const loadTransactions = async () => {
    const data = await getBankTransactions();
    if (data.success) setTransactions(data.transactions || []);
    else toast.error(data.message || "Failed to load banking data");
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSave = async () => {
    if (!bankName) return toast.error("Enter bank name");
    if (!amount || amount <= 0) return toast.error("Enter valid amount");

    const data = await createBankTransaction({
      transactionNo,
      bankName,
      type,
      fromAccount,
      toAccount,
      amount,
      referenceNo,
      note,
    });

    if (!data.success) {
      toast.error(data.message || "Failed to save transaction");
      return;
    }

    toast.success("Bank transaction saved");

    setTransactionNo(`BANK-${Date.now()}`);
    setBankName("HDFC Bank");
    setType("Deposit");
    setFromAccount("");
    setToAccount("");
    setAmount(0);
    setReferenceNo("");
    setNote("");
    loadTransactions();
  };

  const handleReconcile = async (id: string) => {
    const data = await reconcileTransaction(id);
    if (!data.success) return toast.error(data.message);
    toast.success("Reconciliation updated");
    loadTransactions();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Banking"
        description="Record bank transactions, fund transfers and reconciliation."
        actions={
          <Button onClick={handleSave}>
            <Save className="size-4" /> Save Transaction
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bank Transaction</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Transaction No.</Label>
            <Input
              value={transactionNo}
              onChange={(e) => setTransactionNo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Bank Name</Label>
            <Input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deposit">Deposit</SelectItem>
                <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                <SelectItem value="Transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
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
            <Label>From Account</Label>
            <Input
              placeholder="Cash / HDFC / SBI"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>To Account</Label>
            <Input
              placeholder="Cash / HDFC / SBI"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Reference No.</Label>
            <Input
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bank Transactions</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>No.</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>
                    {new Date(t.date || t.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{t.transactionNo}</TableCell>
                  <TableCell>{t.bankName}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell>
                    {t.reconciled ? "Reconciled" : "Pending"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={t.reconciled ? "outline" : "default"}
                      onClick={() => handleReconcile(t._id)}
                    >
                      {t.reconciled ? "Undo" : "Reconcile"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No bank transactions found.
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