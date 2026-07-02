import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/services/supplierService";

export const Route = createFileRoute("/suppliers")({
  component: SuppliersPage,
});

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
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

  const loadSuppliers = async () => {
    const data = await getSuppliers();

    if (data.success) setSuppliers(data.suppliers);
    else toast.error(data.message);
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return suppliers.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q) ||
        s.gstin?.toLowerCase().includes(q),
    );
  }, [suppliers, search]);

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

  if (form.name.trim() === "") missingFields.push("Supplier Name");
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
    data = await updateSupplier(id, form);
  } else {
    data = await createSupplier(form);
  }

  if (!data.success) {
    toast.error(data.message);
    return;
  }

  toast.success(editing ? "Supplier updated" : "Supplier created");
  resetForm();
  loadSuppliers();
};

  const handleEdit = (supplier: any) => {
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
  };

  const handleDelete = async (supplier: any) => {
    const id = supplier._id || supplier.id;

    const data = await deleteSupplier(id);

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success("Supplier deleted");
    loadSuppliers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">
            Manage supplier ledgers for the selected company.
          </p>
        </div>

        <Input
          className="max-w-xs"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="p-4">
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-3">
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
            icon={Truck}
            title="No suppliers found"
            description="Add your first supplier ledger."
          />
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((supplier) => (
            <Card
              key={supplier._id || supplier.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-semibold">{supplier.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {supplier.phone} · {supplier.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  GSTIN: {supplier.gstin || "-"} · State: {supplier.state || "-"}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(supplier)}
                >
                  <Pencil className="size-4" /> Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(supplier)}
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