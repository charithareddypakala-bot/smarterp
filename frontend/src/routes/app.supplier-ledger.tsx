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

import { getSuppliers } from "@/services/supplierService";
import { getSupplierLedger } from "@/services/supplierLedgerService";

export const Route = createFileRoute("/app/supplier-ledger")({
  component: SupplierLedgerPage,
});

function SupplierLedgerPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    async function loadSuppliers() {
      const data = await getSuppliers();

      if (data.success) {
        setSuppliers(data.suppliers || []);
      } else {
        toast.error(data.message);
      }
    }

    loadSuppliers();
  }, []);

  useEffect(() => {
    async function loadLedger() {
      if (!supplierId) {
        setLedger([]);
        return;
      }

      const data = await getSupplierLedger(supplierId);

      if (data.success) {
        setLedger(data.ledger || []);
      } else {
        toast.error(data.message);
      }
    }

    loadLedger();
  }, [supplierId]);

  const supplier = suppliers.find((s) => s._id === supplierId);
  const closing =
    ledger.length > 0 ? ledger[ledger.length - 1].balance : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Supplier Ledger"
        description="View supplier purchases, payments and outstanding balance."
      />

      <Card>
        <CardHeader>
          <CardTitle>Select Supplier</CardTitle>
        </CardHeader>

        <CardContent className="max-w-md space-y-2">
          <Label>Supplier</Label>

          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>

            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s._id} value={s._id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {supplierId && (
        <Card>
          <CardHeader>
            <CardTitle>
              Ledger Statement {supplier ? `- ${supplier.name}` : ""}
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
                {ledger.map((e, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {new Date(e.date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{e.voucher}</TableCell>

                    <TableCell>{e.type}</TableCell>

                    <TableCell className="text-right">
                      {e.debit ? formatCurrency(e.debit) : "-"}
                    </TableCell>

                    <TableCell className="text-right">
                      {e.credit ? formatCurrency(e.credit) : "-"}
                    </TableCell>

                    <TableCell className="text-right font-medium">
                      {formatCurrency(Math.abs(e.balance))}{" "}
                      {e.balance >= 0 ? "Cr" : "Dr"}
                    </TableCell>
                  </TableRow>
                ))}

                {ledger.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}

                {ledger.length > 0 && (
                  <TableRow className="font-bold">
                    <TableCell colSpan={5}>
                      Closing Balance
                    </TableCell>

                    <TableCell className="text-right">
                      {formatCurrency(Math.abs(closing))}{" "}
                      {closing >= 0 ? "Cr" : "Dr"}
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