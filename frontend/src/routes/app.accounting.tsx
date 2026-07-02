import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Scale, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";

export const Route = createFileRoute("/app/accounting")({
  head: () => ({ meta: [{ title: "Accounting - SmartERP" }] }),
  component: AccountingPage,
});

const items = [
  { title: "Ledgers", description: "Maintain party, expense and income ledgers.", icon: BookOpen },
  { title: "Vouchers", description: "Review accounting entries from daily transactions.", icon: Wallet },
  { title: "Statements", description: "Track balances across books and periods.", icon: Scale },
];

function AccountingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounting"
        description="Core books, ledger balances and voucher controls."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <CardContent className="p-5">
              <item.icon className="size-5 text-primary" />
              <h3 className="mt-4 text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
