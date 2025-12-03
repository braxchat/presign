import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    contactEmail: "",
    password: "",
    confirmPassword: "",
    carrierPreference: "",
    dailyUpdateTime: "",
    agreeTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic
    navigate("/dashboard");
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
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your signature release shipments today"
    >
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
            When you'll receive daily shipment status updates
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
          <Link to="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
