import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/page-header";

import {
  getCompanyProfile,
  saveCompanyProfile,
} from "@/services/companyProfileService";

export const Route = createFileRoute("/app/company-profile")({
  component: CompanyProfilePage,
});

function CompanyProfilePage() {
  const [form, setForm] = useState({
    companyName: "",
    gstin: "",
    address: "",
    state: "",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    async function load() {
      const data = await getCompanyProfile();

      if (data.success && data.profile) {
        setForm({
          companyName: data.profile.companyName || "",
          gstin: data.profile.gstin || "",
          address: data.profile.address || "",
          state: data.profile.state || "",
          phone: data.profile.phone || "",
          email: data.profile.email || "",
          website: data.profile.website || "",
        });
      }
    }

    load();
  }, []);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.companyName) return toast.error("Company name is required");

    const data = await saveCompanyProfile(form);

    if (!data.success) {
      toast.error(data.message || "Failed to save profile");
      return;
    }

    localStorage.setItem("companyName", form.companyName);
    toast.success("Company profile saved");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Company Profile"
        description="Manage company details used in invoices and reports."
        actions={
          <Button onClick={handleSave}>
            <Save className="size-4" />
            Save Profile
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Company Name</Label>
            <Input
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
            />
          </div>

          <div>
            <Label>GSTIN</Label>
            <Input
              value={form.gstin}
              onChange={(e) => update("gstin", e.target.value)}
            />
          </div>

          <div>
            <Label>State</Label>
            <Input
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div>
            <Label>Website</Label>
            <Input
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}