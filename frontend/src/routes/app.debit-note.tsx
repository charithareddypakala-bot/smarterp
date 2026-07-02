import { createFileRoute } from "@tanstack/react-router";
import { EntryVoucherModule } from "@/components/transactions/entry-voucher-module";
import { debitNotes } from "@/data/vouchers";

export const Route = createFileRoute("/app/debit-note")({
  head: () => ({ meta: [{ title: "Debit Note — SmartERP" }] }),
  component: () => (
    <EntryVoucherModule
      title="Debit Note"
      description="Purchase return management (Alt + F9)."
      accountLabel="Supplier"
      actionLabel="New Debit Note"
      data={debitNotes}
    />
  ),
});
