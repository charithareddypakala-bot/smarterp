import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/page-header";
import { getInventoryMovement } from "@/services/inventoryMovementService";

export const Route = createFileRoute("/app/inventory-movement")({
  component: InventoryMovementPage,
});

function InventoryMovementPage() {
  const [movements, setMovements] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getInventoryMovement();

      if (!data.success) {
        toast.error(data.message || "Failed to load inventory movement");
        return;
      }

      setMovements(data.movements || []);
    }

    load();
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory Movement"
        description="Track stock in and stock out for every item."
      />

      <Card>
        <CardHeader>
          <CardTitle>Inventory Movement Register</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Voucher</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Stock In</TableHead>
                <TableHead className="text-right">Stock Out</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {movements.map((m, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(m.date).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{m.voucherNo}</TableCell>

                  <TableCell>
                    <Badge variant="outline">{m.type}</Badge>
                  </TableCell>

                  <TableCell>{m.itemName}</TableCell>

                  <TableCell className="text-right text-green-600 font-medium">
                    {m.stockIn || "-"}
                  </TableCell>

                  <TableCell className="text-right text-red-600 font-medium">
                    {m.stockOut || "-"}
                  </TableCell>
                </TableRow>
              ))}

              {movements.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No inventory movement found.
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