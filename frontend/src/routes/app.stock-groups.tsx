import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { DataTable, type Column } from "@/components/common/data-table";
import { useTable } from "@/hooks/use-table";
import { stockGroups, type StockGroup } from "@/data/masters";

export const Route = createFileRoute("/app/stock-groups")({
  head: () => ({ meta: [{ title: "Stock Groups — SmartERP" }] }),
  component: StockGroupsPage,
});

const columns: Column<StockGroup>[] = [
  {
    key: "name",
    header: "Stock Group",
    cell: (g) => <span className="font-medium text-foreground">{g.name}</span>,
  },
  { key: "parent", header: "Under", cell: (g) => <Badge variant="secondary">{g.parent}</Badge> },
  {
    key: "items",
    header: "Items",
    align: "right",
    cell: (g) => <span className="font-medium">{g.items}</span>,
  },
];

function StockGroupsPage() {
  const table = useTable(stockGroups, { searchKeys: ["name", "parent"], pageSize: 10 });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Stock Groups"
        description="Categorise inventory items — Electronics, Furniture, Groceries, Medical and more."
        actions={
          <Button onClick={() => toast.info("Create stock group form coming soon")}>
            <Plus className="size-4" /> New Stock Group
          </Button>
        }
      />
      <SearchBar value={table.search} onChange={table.setSearch} placeholder="Search stock groups…" />
      <DataTable columns={columns} data={table.rows} rowKey={(g) => g.id} />
    </div>
  );
}
