import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/services/customerService";

export const Route = createFileRoute("/customer")({
  component: CustomersPage,
});

function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: "",
    address: "",
    state: "",
    openingBalance: 0,
  });

  const loadCustomers = async () => {
    const data = await getCustomers();

    if (data.success) {
      setCustomers(data.customers);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.gstin?.toLowerCase().includes(q),
    );
  }, [customers, search]);

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      gstin: "",
      address: "",
      state: "",
      openingBalance: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const missingFields: string[] = [];

  if (form.name.trim() === "") missingFields.push("Customer Name");
  if (form.phone.trim() === "") missingFields.push("Phone Number");
  if (form.email.trim() === "") missingFields.push("Email");
  if (form.address.trim() === "") missingFields.push("Address");
  if (form.state.trim() === "") missingFields.push("State");

  if (missingFields.length > 0) {
    alert(`Please complete the following fields:\n\n${missingFields.join("\n")}`);
    return;
  }

  let data;

  if (editing) {
    const id = editing._id || editing.id;
    data = await updateCustomer(id, form);
  } else {
    data = await createCustomer(form);
  }

  if (!data.success) {
    toast.error(data.message);
    return;
  }

  toast.success(editing ? "Customer updated" : "Customer created");
  resetForm();
  loadCustomers();
};
  const handleEdit = (customer: any) => {
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
  };

  const handleDelete = async (customer: any) => {
    const id = customer._id || customer.id;

    const data = await deleteCustomer(id);

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success("Customer deleted");
    loadCustomers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer ledgers for the selected company.
          </p>
        </div>

        <Input
          className="max-w-xs"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="p-4">
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-3">
          <Input
            placeholder="Customer name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
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
            placeholder="Opening Balance"
            type="number"
            value={form.openingBalance}
            onChange={(e) =>
              setForm({ ...form, openingBalance: Number(e.target.value) })
            }
          />

          <Input
            className="md:col-span-2"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <div className="flex gap-2">
            <Button type="submit">
              <Plus className="size-4" />
              {editing ? "Update" : "Add"}
            </Button>

            {editing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="No customers found"
            description="Add your first customer ledger."
          />
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((customer) => (
            <Card
              key={customer._id || customer.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-semibold">{customer.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {customer.phone} · {customer.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  GSTIN: {customer.gstin || "-"} · State: {customer.state || "-"}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(customer)}
                >
                  <Pencil className="size-4" /> Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(customer)}
                >
                  <Trash2 className="size-4" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}