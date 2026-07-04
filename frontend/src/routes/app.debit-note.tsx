import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { EntryVoucherModule } from "@/components/transactions/entry-voucher-module";
import { DebitNoteFormDialog } from "@/components/transactions/debit-note-form-dialog";
import { Button } from "@/components/ui/button";
import type { VoucherEntry } from "@/data/vouchers";
import { getPurchaseReturns } from "@/services/purchaseReturnService";

export const Route = createFileRoute("/app/debit-note")({
  head: () => ({ meta: [{ title: "Debit Note — SmartERP" }] }),
  component: () => <DebitNotePage />,
});

function DebitNotePage() {
  const [data, setData] = useState<VoucherEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getPurchaseReturns();

      if (res && res.success) {
        const mapped = (res.vouchers || []).map((v: any) => ({
          id: v.returnNo || v._id,
          date: v.createdAt || v.date || new Date().toISOString(),
          account: v.supplierName || v.supplierId || "Supplier",
          particulars: `${(v.items || []).length} items`,
          amount: v.total || v.subtotal || 0,
        }));

        setData(mapped);
      } else {
        toast.error(res?.message || "Failed to load debit notes");
      }
    }

    load();
  }, []);

  return (
    <>
      <EntryVoucherModule
        title="Debit Note"
        description="Purchase return management (Alt + F9)."
        accountLabel="Supplier"
        actionLabel="New Debit Note"
        data={data}
        headerActions={<Button onClick={() => setOpen(true)}><span className="flex items-center gap-2"><svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg> New Debit Note</span></Button>}
      />

      <DebitNoteFormDialog
        open={open}
        onOpenChange={(v) => setOpen(v)}
        onCreated={async () => {
          const res = await getPurchaseReturns();
          if (res && res.success) {
            const mapped = (res.vouchers || []).map((v: any) => ({
              id: v.returnNo || v._id,
              date: v.createdAt || v.date || new Date().toISOString(),
              account: v.supplierName || v.supplierId || "Supplier",
              particulars: `${(v.items || []).length} items`,
              amount: v.total || v.subtotal || 0,
            }));

            setData(mapped);
          }
        }}
      />
    </>
  );
}
