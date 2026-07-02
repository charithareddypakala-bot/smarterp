import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Company } from "@/types";
import { toast } from "sonner";

const COMPANY_TYPES: Company["type"][] = [
  "Private Ltd",
  "Proprietorship",
  "Partnership",
  "LLP",
];

const ACCENT_HUES = ["262", "195", "155", "75", "27", "300"];

type CompanyDraft = Omit<Company, "id">;

const emptyDraft: CompanyDraft = {
  name: "",
  gstin: "",
  financialYear: "2025-2026",
  address: "",
  logoColor: "262",
  type: "Private Ltd",
};

/**
 * Reusable create/edit company modal form.
 */
interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Existing company to edit, or null to create a new one. */
  company: Company | null;
  onSubmit: (draft: CompanyDraft) => void;
}

export function CompanyFormDialog({
  open,
  onOpenChange,
  company,
  onSubmit,
}: CompanyFormDialogProps) {
  const [draft, setDraft] = useState<CompanyDraft>(emptyDraft);

  // Sync form state whenever the dialog opens with a different target.
  useEffect(() => {
    if (open) {
      setDraft(company ? { ...company } : { ...emptyDraft });
    }
  }, [open, company]);

  const update = <K extends keyof CompanyDraft>(key: K, value: CompanyDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields = [];

    if (!draft.name.trim()) missingFields.push("Company Name");
    if (!draft.gstin.trim()) missingFields.push("GST Number");
    if (!draft.address.trim()) missingFields.push("Address");
    if (!draft.financialYear.trim()) missingFields.push("Financial Year");
    if (!draft.type) missingFields.push("Company Type");

    if (missingFields.length > 0) {
      toast.error(
        `Please complete the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    onSubmit(draft);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{company ? "Edit Company" : "Create Company"}</DialogTitle>
            <DialogDescription>
              {company
                ? "Update your company details below."
                : "Set up a new company workspace."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="c-name">Company name</Label>
              <Input
                id="c-name"
                value={draft.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Acme Industries Pvt Ltd"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="c-gstin">GSTIN</Label>
                <Input
                  id="c-gstin"
                  value={draft.gstin}
                  onChange={(e) => update("gstin", e.target.value.toUpperCase())}
                  placeholder="27AABCA1234F1Z5"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={draft.type}
                  onValueChange={(v) => update("type", v as Company["type"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="c-fy">Financial year</Label>
                <Input
                  id="c-fy"
                  value={draft.financialYear}
                  onChange={(e) => update("financialYear", e.target.value)}
                  placeholder="2025-2026"
                />
              </div>
              <div className="space-y-2">
                <Label>Accent</Label>
                <div className="flex items-center gap-2 pt-1.5">
                  {ACCENT_HUES.map((hue) => (
                    <button
                      key={hue}
                      type="button"
                      onClick={() => update("logoColor", hue)}
                      aria-label={`Accent ${hue}`}
                      className="size-6 rounded-full ring-offset-2 ring-offset-background transition-all data-[active=true]:ring-2 data-[active=true]:ring-ring"
                      data-active={draft.logoColor === hue}
                      style={{ backgroundColor: `oklch(0.6 0.16 ${hue})` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="c-addr">Address</Label>
              <Input
                id="c-addr"
                value={draft.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="City, State"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{company ? "Save changes" : "Create company"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
