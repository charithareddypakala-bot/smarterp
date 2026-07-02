import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, IndianRupee, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";

export const Route = createFileRoute("/app/payroll")({
  head: () => ({ meta: [{ title: "Payroll - SmartERP" }] }),
  component: PayrollPage,
});

const items = [
  { title: "Employees", description: "Manage staff records and statutory details.", icon: Users },
  { title: "Salary Runs", description: "Prepare monthly salary processing batches.", icon: IndianRupee },
  { title: "Attendance", description: "Track leave, attendance and pay periods.", icon: CalendarDays },
];

function PayrollPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Payroll" description="Employee records, salary runs and attendance." />

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
