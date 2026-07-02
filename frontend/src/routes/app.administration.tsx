import { createFileRoute } from "@tanstack/react-router";
import { Building2, Shield, UserCog } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";

export const Route = createFileRoute("/app/administration")({
  head: () => ({ meta: [{ title: "Administration - SmartERP" }] }),
  component: AdministrationPage,
});

const items = [
  { title: "Users", description: "Manage roles, access and account security.", icon: UserCog },
  { title: "Company", description: "Control company profile and workspace defaults.", icon: Building2 },
  { title: "Audit", description: "Review administrative controls and permissions.", icon: Shield },
];

function AdministrationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description="User access, company controls and audit settings."
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
