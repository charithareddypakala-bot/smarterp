import { createFileRoute } from "@tanstack/react-router";
import { Calculator, Keyboard, Settings } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";

export const Route = createFileRoute("/app/utilities")({
  head: () => ({ meta: [{ title: "Utilities - SmartERP" }] }),
  component: UtilitiesPage,
});

const items = [
  { title: "Calculator", description: "Quick calculations for voucher entry.", icon: Calculator },
  { title: "Shortcuts", description: "Keyboard-first actions across the workspace.", icon: Keyboard },
  { title: "Preferences", description: "Operational tools and workspace settings.", icon: Settings },
];

function UtilitiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Utilities" description="Helpful tools for daily operations." />

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
