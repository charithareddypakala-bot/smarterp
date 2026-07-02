import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/page-header";
import { formatCurrency } from "@/lib/format";

import { getCustomers } from "@/services/customerService";
import { getCustomerLedger } from "@/services/customerLedgerService";

export const Route = createFileRoute("/app/customer-ledger")({
  component: CustomerLedgerPage,
});

function CustomerLedgerPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    async function loadCustomers() {
      const data = await getCustomers();

      if (data.success) {
        setCustomers(data.customers || []);
      } else {
        toast.error(data.message || "Failed to load customers");
      }
    }

    loadCustomers();
  }, []);

  useEffect(() => {
    async function loadLedger() {
      if (!customerId) {
        setLedger([]);
        return;
      }

      const data = await getCustomerLedger(customerId);

      if (data.success) {
        setLedger(data.ledger || []);
      } else {
        toast.error(data.message || "Failed to load customer ledger");
      }
    }

    loadLedger();
  }, [customerId]);

  const selectedCustomer = customers.find((c) => c._id === customerId);
  const closingBalance =
    ledger.length > 0 ? ledger[ledger.length - 1].balance : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customer Ledger"
        description="View customer-wise sales, receipts and closing balance."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Customer</CardTitle>
        </CardHeader>

        <CardContent className="max-w-md space-y-2">
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
        </CardContent>
      </Card>

      {customerId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Ledger Statement {selectedCustomer ? `- ${selectedCustomer.name}` : ""}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Voucher</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {ledger.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{entry.voucher}</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell className="text-right">
                      {entry.debit ? formatCurrency(entry.debit) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.credit ? formatCurrency(entry.credit) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(Math.abs(entry.balance))}{" "}
                      {entry.balance >= 0 ? "Dr" : "Cr"}
                    </TableCell>
                  </TableRow>
                ))}

                {ledger.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No transactions found for this customer.
                    </TableCell>
                  </TableRow>
                )}

                {ledger.length > 0 && (
                  <TableRow className="font-bold">
                    <TableCell colSpan={5}>Closing Balance</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Math.abs(closingBalance))}{" "}
                      {closingBalance >= 0 ? "Dr" : "Cr"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}