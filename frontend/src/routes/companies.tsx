import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Boxes,
  Building2,
  LogOut,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchBar } from "@/components/common/search-bar";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { CompanyFormDialog } from "@/components/companies/company-form-dialog";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/services/companyService";
import type { Company } from "@/types";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Select Company — SmartERP" },
      {
        name: "description",
        content: "Choose a company workspace to manage in SmartERP.",
      },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState<Company | null>(null);

  const loadCompanies = async () => {
    try {
      const data = await getCompanies();

      if (data.success) {
        setCompanies(data.companies);
      } else {
        toast.error(data.message || "Failed to load companies");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load companies");
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return companies;

    return companies.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.gstin?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q),
    );
  }, [companies, search]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (company: Company) => {
    setEditing(company);
    setFormOpen(true);
  };

  const handleSubmit = async (draft: Omit<Company, "id">) => {
    try {
      let data;

      if (editing) {
        const id = (editing as any)._id || editing.id;
        data = await updateCompany(id, draft);
      } else {
        data = await createCompany(draft);
      }

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(editing ? "Company updated" : "Company created");

      await loadCompanies();
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save company");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;

    try {
      const id = (deleting as any)._id || deleting.id;

      const data = await deleteCompany(id);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(`Deleted "${deleting.name}"`);

      await loadCompanies();
      setDeleting(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete company");
    }
  };

  const handleSelectCompany = (company: Company) => {
    const selectedId = (company as any)._id || company.id;

    localStorage.setItem("companyId", selectedId);
    localStorage.setItem("companyName", company.name);

    toast.success(`${company.name} selected`);

    navigate({ to: "/app" });
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");

    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="size-5" />
            </div>
            <span className="text-base font-bold tracking-tight">SmartERP</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground"
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Select a company
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose a workspace to continue, or create a new one.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search companies…"
            />
            <Button onClick={openCreate}>
              <Plus className="size-4" /> Create
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={Building2}
              title="No companies found"
              description="Try a different search, or create a new company workspace."
              action={
                <Button onClick={openCreate}>
                  <Plus className="size-4" /> Create company
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((company) => {
              const companyKey = (company as any)._id || company.id;

              return (
                <Card
                  key={companyKey}
                  className="card-hover group cursor-pointer"
                >
                  <CardContent
                    className="p-5"
                    onClick={() => handleSelectCompany(company)}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex size-12 items-center justify-center rounded-xl text-lg font-bold text-primary-foreground"
                        style={{
                          backgroundColor: `oklch(0.55 0.18 ${company.logoColor || "262"})`,
                        }}
                      >
                        {company.name?.charAt(0)}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreVertical className="size-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(company);
                            }}
                          >
                            <Pencil className="size-4" /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleting(company);
                            }}
                          >
                            <Trash2 className="size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="mt-4 font-semibold tracking-tight text-foreground">
                      {company.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {company.address}
                    </p>

                    <dl className="mt-4 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">GSTIN</dt>
                        <dd className="font-medium text-foreground">
                          {company.gstin}
                        </dd>
                      </div>

                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">FY</dt>
                        <dd className="font-medium text-foreground">
                          {company.financialYear}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>

                  <CardFooter className="border-t border-border px-5 py-3">
                    <Badge variant="secondary">{company.type}</Badge>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <CompanyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        company={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete company?"
        description={`This will permanently remove "${deleting?.name}" and its data.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}