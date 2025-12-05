"use client";

import { useState, useEffect } from "react";
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
import { Save, Building2, Mail, Truck, Clock, Lock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MerchantInfo {
  id: string;
  business_name: string;
  contact_email: string;
  email: string | null;
  billing_provider: 'shopify' | 'stripe' | null;
  shop_domain: string | null;
  has_password: boolean;
  email_login: string | null;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    businessName: "Acme Range",
    contactEmail: "merchant@acme.com",
    carrierPreference: "both",
    dailyUpdateTime: "8:00 AM",
  });
  const [websiteCredentials, setWebsiteCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [savingCredentials, setSavingCredentials] = useState(false);

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

  // Fetch merchant info on mount
  useEffect(() => {
    async function fetchMerchantInfo() {
      try {
        const response = await fetch('/api/merchant/info');
        if (response.ok) {
          const data = await response.json();
          setMerchantInfo(data);
          // Update form data with actual merchant data
          setFormData({
            businessName: data.business_name || "",
            contactEmail: data.contact_email || "",
            carrierPreference: "both",
            dailyUpdateTime: "8:00 AM",
          });
          // Set email_login if it exists
          if (data.email_login) {
            setWebsiteCredentials(prev => ({ ...prev, email: data.email_login }));
          }
        }
      } catch (error) {
        console.error('Error fetching merchant info:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMerchantInfo();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated.",
    });
  };

  const handleWebsiteCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(websiteCredentials.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (websiteCredentials.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    // Validate passwords match
    if (websiteCredentials.password !== websiteCredentials.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    setSavingCredentials(true);
    try {
      const response = await fetch('/api/merchant/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: websiteCredentials.email,
          password: websiteCredentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save credentials');
      }

      toast({
        title: "Website login created",
        description: "You can now access PreSign from presign.app using these credentials.",
      });

      // Update merchant info
      if (merchantInfo) {
        setMerchantInfo({
          ...merchantInfo,
          has_password: true,
          email_login: websiteCredentials.email,
        });
      }

      // Clear password fields
      setWebsiteCredentials({
        email: websiteCredentials.email,
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingCredentials(false);
    }
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

        {/* Website Access Section - Only for Shopify merchants */}
        {merchantInfo?.billing_provider === 'shopify' && (
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-accent" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Website Access (Optional)
              </h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Create login credentials to access your PreSign dashboard directly from presign.app. This does not affect your Shopify login.
            </p>

            {merchantInfo.has_password ? (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-foreground">Website login is enabled</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Email: {merchantInfo.email_login}
                </p>
                <p className="text-xs text-muted-foreground">
                  You can log in at presign.app/login using these credentials.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWebsiteCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="websiteEmail">Email</Label>
                  <Input
                    id="websiteEmail"
                    type="email"
                    value={websiteCredentials.email}
                    onChange={(e) =>
                      setWebsiteCredentials({ ...websiteCredentials, email: e.target.value })
                    }
                    className="h-11"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websitePassword">Password</Label>
                  <Input
                    id="websitePassword"
                    type="password"
                    value={websiteCredentials.password}
                    onChange={(e) =>
                      setWebsiteCredentials({ ...websiteCredentials, password: e.target.value })
                    }
                    className="h-11"
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={websiteCredentials.confirmPassword}
                    onChange={(e) =>
                      setWebsiteCredentials({ ...websiteCredentials, confirmPassword: e.target.value })
                    }
                    className="h-11"
                    placeholder="Re-enter password"
                    required
                    minLength={8}
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="accent" 
                  className="w-full h-11 gap-2"
                  disabled={savingCredentials}
                >
                  <Save className="h-4 w-4" />
                  {savingCredentials ? "Saving..." : "Save Website Login"}
                </Button>
              </form>
            )}
          </div>
        )}

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

