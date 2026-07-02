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
import { getStockItems } from "@/services/stockItemService";

export const Route = createFileRoute("/app/low-stock")({
  component: LowStockPage,
});

function LowStockPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadItems() {
      const data = await getStockItems();

      if (data.success) {
        setItems((data.items || []).filter((i: any) => Number(i.quantity || 0) < 20));
      } else {
        toast.error(data.message || "Failed to load low stock report");
      }
    }

    loadItems();
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Low Stock Report"
        description="Items with stock quantity below 20."
      />

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Items</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((i) => (
                <TableRow key={i._id}>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>{i.sku || "-"}</TableCell>
                  <TableCell>{i.category || "General"}</TableCell>
                  <TableCell className="text-right">
                    {i.quantity || 0} {i.unit || ""}
                  </TableCell>
                  <TableCell>
                    {Number(i.quantity || 0) === 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : (
                      <Badge variant="outline">Low Stock</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No low stock items found.
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