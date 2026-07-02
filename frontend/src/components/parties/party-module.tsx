import { useMemo, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { DataTable, type Column } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import { StatusBadge } from "@/components/common/status-badge";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  PartyFormDialog,
  type Party,
  type PartyDraft,
} from "@/components/parties/party-form-dialog";
import { useTable } from "@/hooks/use-table";
import { formatCurrency } from "@/lib/format";

/**
 * Full CRUD module for customers / suppliers.
 * Shared between both routes — only the labels and balance heading differ.
 */
interface PartyModuleProps {
  title: string;
  description: string;
  entityLabel: string; // "Customer" | "Supplier"
  balanceLabel: string; // "Receivable" | "Payable"
  seed: Party[];
}

export function PartyModule({
  title,
  description,
  entityLabel,
  balanceLabel,
  seed,
}: PartyModuleProps) {
  const [parties, setParties] = useState<Party[]>(seed);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Party | null>(null);
  const [deleting, setDeleting] = useState<Party | null>(null);

  const filterFn = useMemo(
    () => (p: Party) => statusFilter === "all" || p.status === statusFilter,
    [statusFilter],
  );

  const table = useTable(parties, {
    searchKeys: ["name", "email", "city", "gstin"],
    pageSize: 8,
    filter: filterFn,
  });

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (party: Party) => {
    setEditing(party);
    setFormOpen(true);
  };

  const handleSubmit = (draft: PartyDraft) => {
    if (editing) {
      setParties((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...editing, ...draft } : p)),
      );
      toast.success(`${entityLabel} updated`);
    } else {
      setParties((prev) => [{ ...draft, id: crypto.randomUUID() }, ...prev]);
      toast.success(`${entityLabel} added`);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleting) return;
    setParties((prev) => prev.filter((p) => p.id !== deleting.id));
    toast.success(`Deleted "${deleting.name}"`);
    setDeleting(null);
  };

  const columns: Column<Party>[] = [
    {
      key: "name",
      header: entityLabel,
      cell: (p) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
              {p.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="font-medium text-foreground">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", cell: (p) => p.phone },
    { key: "city", header: "City" },
    {
      key: "gstin",
      header: "GSTIN",
      cell: (p) => <span className="font-mono text-xs">{p.gstin}</span>,
    },
    {
      key: "balance",
      header: balanceLabel,
      align: "right",
      cell: (p) => (
        <span className={p.balance > 0 ? "font-medium text-foreground" : "text-muted-foreground"}>
          {formatCurrency(p.balance)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      cell: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (p) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(p)}>
              <Pencil className="size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleting(p)}
            >
              <Trash2 className="size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title={title}
        description={description}
        actions={
  <div className="flex gap-2">
    <Button
      variant={showLowStockOnly ? "default" : "outline"}
      onClick={() => setShowLowStockOnly((prev) => !prev)}
    >
      {showLowStockOnly ? "Show All Items" : "Low Stock Only"}
    </Button>

    <Button onClick={openCreate}>
      <Plus className="size-4" /> Add Stock Item
    </Button>
  </div>
}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={table.search}
          onChange={table.setSearch}
          placeholder={`Search ${entityLabel.toLowerCase()}s…`}
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={table.rows}
        rowKey={(p) => p.id}
        emptyTitle={`No ${entityLabel.toLowerCase()}s found`}
        emptyDescription="Adjust your search or add a new record."
        emptyAction={
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Add {entityLabel}
          </Button>
        }
      />

      <DataPagination
        page={table.page}
        pageCount={table.pageCount}
        total={table.total}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
      />

      <PartyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        party={editing}
        entityLabel={entityLabel}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`Delete ${entityLabel.toLowerCase()}?`}
        description={`This will permanently remove "${deleting?.name}".`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />

    </div>
  );
}
