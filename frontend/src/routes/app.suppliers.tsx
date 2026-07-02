import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import { DataTable, type Column } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useTable } from "@/hooks/use-table";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/services/supplierService";

export const Route = createFileRoute("/app/suppliers")({
  head: () => ({ meta: [{ title: "Suppliers — SmartERP" }] }),
  component: SuppliersPage,
});

type Supplier = {
  _id?: string;
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  gstin?: string;
  address?: string;
  state?: string;
  openingBalance?: number;
};

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  gstin: "",
  address: "",
  state: "",
  openingBalance: 0,
};

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadSuppliers = async () => {
    const data = await getSuppliers();

    if (data.success) setSuppliers(data.suppliers);
    else toast.error(data.message || "Failed to load suppliers");
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const table = useTable(suppliers, {
    searchKeys: ["name", "phone", "email", "gstin", "state"],
    pageSize: 8,
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (supplier: Supplier) => {
    setEditing(supplier);
    setForm({
      name: supplier.name || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      gstin: supplier.gstin || "",
      address: supplier.address || "",
      state: supplier.state || "",
      openingBalance: supplier.openingBalance || 0,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let data;

    if (editing) {
      const id = editing._id || editing.id;
      data = await updateSupplier(id!, form);
    } else {
      data = await createSupplier(form);
    }

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(editing ? "Supplier updated" : "Supplier created");
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
    loadSuppliers();
  };

  const handleDelete = async () => {
    if (!deleting) return;

    const id = deleting._id || deleting.id;
    const data = await deleteSupplier(id!);

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(`Deleted "${deleting.name}"`);
    setDeleting(null);
    loadSuppliers();
  };

  const columns: Column<Supplier>[] = [
    {
      key: "name",
      header: "Supplier",
      cell: (s) => (
        <div className="leading-tight">
          <p className="font-medium text-foreground">{s.name}</p>
          <p className="text-xs text-muted-foreground">{s.email || "-"}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cell: (s) => s.phone || "-",
    },
    {
      key: "gstin",
      header: "GSTIN",
      cell: (s) => s.gstin || "-",
    },
    {
      key: "state",
      header: "State",
      cell: (s) => <Badge variant="secondary">{s.state || "N/A"}</Badge>,
    },
    {
      key: "openingBalance",
      header: "Opening Balance",
      align: "right",
      cell: (s) => `₹${s.openingBalance || 0}`,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (s) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(s)}>
              <Pencil className="size-4" /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleting(s)}
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
        title="Suppliers"
        description="Manage supplier master records and outstanding payables."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Add Supplier
          </Button>
        }
      />

      <SearchBar
        value={table.search}
        onChange={table.setSearch}
        placeholder="Search suppliers, phone, GSTIN…"
      />

      <DataTable
        columns={columns}
        data={table.rows}
        rowKey={(s) => s._id || s.id || s.name}
        emptyTitle="No suppliers found"
        emptyAction={
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Add Supplier
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

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-2xl p-6 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold">
                {editing ? "Edit Supplier" : "Add Supplier"}
              </h2>

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Supplier name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <Input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <Input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <Input
                  placeholder="GSTIN"
                  value={form.gstin}
                  onChange={(e) =>
                    setForm({ ...form, gstin: e.target.value.toUpperCase() })
                  }
                />

                <Input
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />

                <Input
                  type="number"
                  placeholder="Opening Balance"
                  value={form.openingBalance}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      openingBalance: Number(e.target.value),
                    })
                  }
                />

                <Input
                  className="md:col-span-2"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormOpen(false);
                    setEditing(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit">{editing ? "Update" : "Create"}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete supplier?"
        description={`This will permanently remove "${deleting?.name}".`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}