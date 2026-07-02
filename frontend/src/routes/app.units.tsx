import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { DataTable, type Column } from "@/components/common/data-table";
import { useTable } from "@/hooks/use-table";
import { units, type Unit } from "@/data/masters";

export const Route = createFileRoute("/app/units")({
  head: () => ({ meta: [{ title: "Units of Measure — SmartERP" }] }),
  component: UnitsPage,
});

const columns: Column<Unit>[] = [
  {
    key: "symbol",
    header: "Symbol",
    cell: (u) => <Badge variant="outline" className="font-mono">{u.symbol}</Badge>,
  },
  {
    key: "name",
    header: "Formal Name",
    cell: (u) => <span className="font-medium text-foreground">{u.name}</span>,
  },
  {
    key: "decimals",
    header: "Decimal Places",
    align: "right",
    cell: (u) => u.decimals,
  },
];

function UnitsPage() {
  const table = useTable(units, { searchKeys: ["symbol", "name"], pageSize: 10 });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Units of Measure"
        description="Define units such as PCS, KG, BOX and LTR for stock items (Alt + U)."
        actions={
          <Button onClick={() => toast.info("Create unit form coming soon")}>
            <Plus className="size-4" /> New Unit
          </Button>
        }
      />
      <SearchBar value={table.search} onChange={table.setSearch} placeholder="Search units…" />
      <DataTable columns={columns} data={table.rows} rowKey={(u) => u.id} />
    </div>
  );
}
