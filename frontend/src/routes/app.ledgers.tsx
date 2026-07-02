import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/common/search-bar";
import {
  getLedgers,
  createLedger,
  deleteLedger,
} from "@/services/ledgerService";

export const Route = createFileRoute("/app/ledgers")({
  component: LedgersPage,
});

const groups = [
  "Sundry Debtors",
  "Sundry Creditors",
  "Cash-in-Hand",
  "Bank Accounts",
  "Sales Accounts",
  "Purchase Accounts",
  "Direct Income",
  "Indirect Income",
  "Direct Expenses",
  "Indirect Expenses",
  "Current Assets",
  "Current Liabilities",
  "Capital Account",
  "Stock-in-Hand",
];

function LedgersPage() {
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [openingBalance, setOpeningBalance] = useState(0);
  const [balanceType, setBalanceType] = useState("Dr");
  const [phone, setPhone] = useState("");
  const [remarks, setRemarks] = useState("");

  const loadLedgers = async () => {
    const data = await getLedgers();
    if (data.success) setLedgers(data.ledgers || []);
    else toast.error(data.message || "Failed to load ledgers");
  };

  useEffect(() => {
    loadLedgers();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Ledger name is required");
    if (!group) return toast.error("Ledger group is required");

    const data = await createLedger({
      name,
      group,
      openingBalance,
      balanceType,
      phone,
      remarks,
    });

    if (!data.success) {
      toast.error(data.message || "Failed to create ledger");
      return;
    }

    toast.success("Ledger created");

    setName("");
    setGroup("");
    setOpeningBalance(0);
    setBalanceType("Dr");
    setPhone("");
    setRemarks("");

    loadLedgers();
  };

  const handleDelete = async (id: string) => {
    const data = await deleteLedger(id);

    if (!data.success) {
      toast.error(data.message || "Failed to delete ledger");
      return;
    }

    toast.success("Ledger deleted");
    loadLedgers();
  };

  const filtered = ledgers.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.name?.toLowerCase().includes(q) ||
      l.group?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Ledgers"
        description="Create and manage accounting ledgers."
        actions={
          <Button onClick={handleSave}>
            <Save className="size-4" /> Save Ledger
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create Ledger</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Ledger Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Group</Label>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Opening Balance</Label>
            <Input
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Balance Type</Label>
            <Select value={balanceType} onValueChange={setBalanceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dr">Dr</SelectItem>
                <SelectItem value="Cr">Cr</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search ledgers..."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ledger List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {filtered.map((ledger) => (
            <div
              key={ledger._id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{ledger.name}</p>
                <p className="text-xs text-muted-foreground">
                  {ledger.group} • ₹{ledger.openingBalance || 0}{" "}
                  {ledger.balanceType}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(ledger._id)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">No ledgers found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}