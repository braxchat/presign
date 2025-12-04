"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    contactEmail: "",
    password: "",
    confirmPassword: "",
    carrierPreference: "",
    dailyUpdateTime: "",
    agreeTerms: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Handle signup logic - will be connected to Supabase
    router.push("/merchant/dashboard");
  };

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

  return (
    <>
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">Create your account</h2>
      <p className="text-muted-foreground mb-8">Start managing your signature release shipments today</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            placeholder="Acme Firearms & Range"
            value={formData.businessName}
            onChange={(e) =>
              setFormData({ ...formData, businessName: e.target.value })
            }
            className="h-11"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="merchant@example.com"
            value={formData.contactEmail}
            onChange={(e) =>
              setFormData({ ...formData, contactEmail: e.target.value })
            }
            className="h-11"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="h-11"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="h-11"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

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
            When you&apos;ll receive daily shipment status updates
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="agreeTerms"
            checked={formData.agreeTerms}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, agreeTerms: checked as boolean })
            }
            className="mt-1"
          />
          <Label htmlFor="agreeTerms" className="text-sm text-muted-foreground leading-relaxed">
            I agree to the{" "}
            <a href="#" className="text-accent hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-accent hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button type="submit" className="w-full h-11" variant="accent">
          Create Account
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}

