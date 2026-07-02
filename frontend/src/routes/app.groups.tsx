import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { DataTable, type Column } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import { useTable } from "@/hooks/use-table";
import { accountGroups, type AccountGroup } from "@/data/masters";

export const Route = createFileRoute("/app/groups")({
  head: () => ({ meta: [{ title: "Account Groups — SmartERP" }] }),
  component: GroupsPage,
});

const natureClass: Record<AccountGroup["nature"], string> = {
  Assets: "border-primary/20 bg-accent text-accent-foreground",
  Liabilities: "border-warning/30 bg-warning/15 text-warning-foreground",
  Income: "border-success/20 bg-success/12 text-success",
  Expenses: "border-destructive/20 bg-destructive/10 text-destructive",
};

const columns: Column<AccountGroup>[] = [
  {
    key: "name",
    header: "Group",
    cell: (g) => <span className="font-medium text-foreground">{g.name}</span>,
  },
  { key: "parent", header: "Under", cell: (g) => g.parent },
  {
    key: "nature",
    header: "Nature",
    cell: (g) => (
      <Badge variant="outline" className={natureClass[g.nature]}>
        {g.nature}
      </Badge>
    ),
  },
  {
    key: "ledgers",
    header: "Ledgers",
    align: "right",
    cell: (g) => <span className="font-medium">{g.ledgers}</span>,
  },
];

function GroupsPage() {
  const table = useTable(accountGroups, { searchKeys: ["name", "parent", "nature"], pageSize: 10 });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Account Groups"
        description="Classify ledgers under Assets, Liabilities, Income and Expenses (Alt + G)."
        actions={
          <Button onClick={() => toast.info("Create group form coming soon")}>
            <Plus className="size-4" /> New Group
          </Button>
        }
      />
      <SearchBar value={table.search} onChange={table.setSearch} placeholder="Search groups…" />
      <DataTable columns={columns} data={table.rows} rowKey={(g) => g.id} />
      <DataPagination
        page={table.page}
        pageCount={table.pageCount}
        total={table.total}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
      />
    </div>
  );
}
