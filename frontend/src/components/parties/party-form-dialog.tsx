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
import { Switch } from "@/components/ui/switch";
import type { Customer } from "@/types";

/** Customers and Suppliers share the same shape. */
export type Party = Customer;
export type PartyDraft = Omit<Party, "id">;

const emptyDraft: PartyDraft = {
  name: "",
  email: "",
  phone: "",
  gstin: "",
  city: "",
  balance: 0,
  status: "active",
};

interface PartyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  party: Party | null;
  /** "Customer" | "Supplier" — used for labels only. */
  entityLabel: string;
  onSubmit: (draft: PartyDraft) => void;
}

/**
 * Reusable create/edit modal form for customers and suppliers.
 */
export function PartyFormDialog({
  open,
  onOpenChange,
  party,
  entityLabel,
  onSubmit,
}: PartyFormDialogProps) {
  const [draft, setDraft] = useState<PartyDraft>(emptyDraft);

  useEffect(() => {
    if (open) setDraft(party ? { ...party } : { ...emptyDraft });
  }, [open, party]);

  const update = <K extends keyof PartyDraft>(key: K, value: PartyDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(draft);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {party ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
            </DialogTitle>
            <DialogDescription>
              Enter the {entityLabel.toLowerCase()} details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="p-name">Full name</Label>
              <Input
                id="p-name"
                value={draft.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-email">Email</Label>
                <Input
                  id="p-email"
                  type="email"
                  value={draft.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-phone">Phone</Label>
                <Input
                  id="p-phone"
                  value={draft.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-gstin">GSTIN</Label>
                <Input
                  id="p-gstin"
                  value={draft.gstin}
                  onChange={(e) => update("gstin", e.target.value.toUpperCase())}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-city">City</Label>
                <Input
                  id="p-city"
                  value={draft.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-balance">Opening balance (₹)</Label>
                <Input
                  id="p-balance"
                  type="number"
                  value={draft.balance}
                  onChange={(e) => update("balance", Number(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-input px-3 py-2">
                <Label htmlFor="p-status" className="font-normal">
                  Active
                </Label>
                <Switch
                  id="p-status"
                  checked={draft.status === "active"}
                  onCheckedChange={(c) => update("status", c ? "active" : "inactive")}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{party ? "Save changes" : `Add ${entityLabel}`}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
