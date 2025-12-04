"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Building2, Mail, Truck, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: "Acme Range",
    contactEmail: "merchant@acme.com",
    carrierPreference: "both",
    dailyUpdateTime: "8:00 AM",
  });

  const timeOptions = [
    "6:00 AM",
    "6:30 AM",
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-accent" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Business Information
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  className="h-11 pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Carrier Settings */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-accent" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Carrier Settings
            </h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrierPreference">Carrier Preference</Label>
            <Select
              value={formData.carrierPreference}
              onValueChange={(value) =>
                setFormData({ ...formData, carrierPreference: value })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select carriers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ups">UPS Only</SelectItem>
                <SelectItem value="fedex">FedEx Only</SelectItem>
                <SelectItem value="both">Both UPS & FedEx</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select which carrier services you use for shipments
            </p>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Daily Updates
            </h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyUpdateTime">Daily Update Time</Label>
            <Select
              value={formData.dailyUpdateTime}
              onValueChange={(value) =>
                setFormData({ ...formData, dailyUpdateTime: value })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Time when you&apos;ll receive daily shipment status updates via email
            </p>
          </div>

          {/* Daily Update Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-foreground text-sm">
              Daily Update Instructions
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Review shipments with &quot;Out for Delivery&quot; status</li>
              <li>Send override links to buyers who haven&apos;t authorized yet</li>
              <li>Check for any failed delivery attempts</li>
              <li>Update tracking for new orders shipped today</li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <Button type="submit" variant="accent" className="w-full h-11 gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </form>

      {/* Danger Zone */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-destructive">
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="destructive" className="gap-2">
          Delete Account
        </Button>
      </div>
    </div>
  );
}

