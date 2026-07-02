import { createFileRoute } from "@tanstack/react-router";
import { Building2, Palette, Shield, User } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/page-header";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — SmartERP" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const save = (section: string) => toast.success(`${section} settings saved`);

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" description="Manage your profile, company and preferences." />

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList className="grid w-full max-w-xl grid-cols-4">
          <TabsTrigger value="profile">
            <User className="mr-1.5 size-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building2 className="mr-1.5 size-4" /> Company
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Palette className="mr-1.5 size-4" /> Prefs
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-1.5 size-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fname">Full name</Label>
                  <Input id="fname" defaultValue="Rahul Sharma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@smarterp.in" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+91 98200 11223" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Administrator" readOnly className="bg-muted/50" />
                </div>
              </div>
              <Separator />
              <Button onClick={() => save("Profile")}>Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company</CardTitle>
              <CardDescription>Details used across invoices and reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cname">Company name</Label>
                  <Input id="cname" defaultValue="Apex Traders Pvt Ltd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input id="gstin" defaultValue="27AABCA1234F1Z5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addr">Address</Label>
                  <Input id="addr" defaultValue="Andheri East, Mumbai, MH" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fy">Financial year</Label>
                  <Input id="fy" defaultValue="2025-2026" />
                </div>
              </div>
              <Separator />
              <Button onClick={() => save("Company")}>Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferences</CardTitle>
              <CardDescription>Customize how SmartERP works for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">₹ Indian Rupee (INR)</SelectItem>
                      <SelectItem value="usd">$ US Dollar (USD)</SelectItem>
                      <SelectItem value="eur">€ Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date format</Label>
                  <Select defaultValue="dmy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              {[
                { label: "Email notifications", desc: "Receive invoice and payment alerts." },
                { label: "Low stock alerts", desc: "Notify when items fall below reorder level." },
                { label: "Keyboard shortcuts", desc: "Enable fast keyboard-first navigation." },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
              <Separator />
              <Button onClick={() => save("Preferences")}>Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription>Update your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid max-w-md gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cur">Current password</Label>
                  <Input id="cur" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conf">Confirm password</Label>
                  <Input id="conf" type="password" placeholder="••••••••" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <Button onClick={() => save("Security")}>Update password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
