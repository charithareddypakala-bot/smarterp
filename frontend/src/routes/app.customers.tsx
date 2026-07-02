import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MoreHorizontal, Pencil, Plus, Trash2, Users } from "lucide-react";
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
import { EmptyState } from "@/components/common/empty-state";
import { useTable } from "@/hooks/use-table";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/services/customerService";

export const Route = createFileRoute("/app/customers")({
  head: () => ({ meta: [{ title: "Customers — SmartERP" }] }),
  component: CustomersPage,
});

type Customer = {
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

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadCustomers = async () => {
    const data = await getCustomers();

    if (data.success) {
      setCustomers(data.customers);
    } else {
      toast.error(data.message || "Failed to load customers");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const table = useTable(customers, {
    searchKeys: ["name", "phone", "email", "gstin", "state"],
    pageSize: 8,
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setEditing(customer);
    setForm({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      gstin: customer.gstin || "",
      address: customer.address || "",
      state: customer.state || "",
      openingBalance: customer.openingBalance || 0,
    });
    setFormOpen(true);
  };
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let data;

    if (editing) {
      const id = editing._id || editing.id;
      data = await updateCustomer(id!, form);
    } else {
      data = await createCustomer(form);
    }

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(editing ? "Customer updated" : "Customer created");
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
    loadCustomers();
  };

  const handleDelete = async () => {
    if (!deleting) return;

    const id = deleting._id || deleting.id;
    const data = await deleteCustomer(id!);

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(`Deleted "${deleting.name}"`);
    setDeleting(null);
    loadCustomers();
  };

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      cell: (c) => (
        <div className="leading-tight">
          <p className="font-medium text-foreground">{c.name}</p>
          <p className="text-xs text-muted-foreground">{c.email || "-"}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cell: (c) => c.phone || "-",
    },
    {
      key: "gstin",
      header: "GSTIN",
      cell: (c) => c.gstin || "-",
    },
    {
      key: "state",
      header: "State",
      cell: (c) => <Badge variant="secondary">{c.state || "N/A"}</Badge>,
    },
    {
      key: "openingBalance",
      header: "Opening Balance",
      align: "right",
      cell: (c) => `₹${c.openingBalance || 0}`,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (c) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(c)}>
              <Pencil className="size-4" /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleting(c)}
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
        title="Customers"
        description="Manage customer master records and receivables."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Add Customer
          </Button>
        }
      />

      <SearchBar
        value={table.search}
        onChange={table.setSearch}
        placeholder="Search customers, phone, GSTIN…"
      />

      <DataTable
        columns={columns}
        data={table.rows}
        rowKey={(c) => c._id || c.id || c.name}
        emptyTitle="No customers found"
        emptyAction={
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Add Customer
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
        <Card className="fixed inset-0 z-50 m-auto h-fit w-[95%] max-w-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">
              {editing ? "Edit Customer" : "Add Customer"}
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="Customer name"
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
                onChange={(e) => setForm({ ...form, address: e.target.value })}
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
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete customer?"
        description={`This will permanently remove "${deleting?.name}".`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}