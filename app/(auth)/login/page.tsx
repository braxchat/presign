"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Store, AlertCircle } from "lucide-react";
import { getShopifyAppUrl } from "@/lib/shopifyHelpers";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shopifyMerchant, setShopifyMerchant] = useState<{ shop_domain: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShopifyMerchant(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if this is a Shopify merchant without credentials
        if (data.error === 'shopify_no_credentials' && data.shop_domain) {
          setShopifyMerchant({ shop_domain: data.shop_domain });
          return;
        }
        throw new Error(data.error || 'Login failed');
      }

      // Login successful, redirect to dashboard
      router.push('/merchant/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If Shopify merchant without credentials, show special message
  if (shopifyMerchant) {
    return (
      <>
        <div className="flex items-center gap-2 mb-4">
          <Store className="h-5 w-5 text-accent" />
          <h2 className="font-display text-2xl font-bold text-foreground">Access PreSign from Shopify</h2>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                Your account is managed through Shopify. To access PreSign, please open the app from Shopify Admin.
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          variant="accent"
          className="w-full h-11"
        >
          <a href={getShopifyAppUrl(shopifyMerchant.shop_domain)} target="_blank" rel="noopener noreferrer">
            <Store className="h-4 w-4 mr-2" />
            Open in Shopify
          </a>
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          If you've created website login credentials, you can{" "}
          <button
            onClick={() => setShopifyMerchant(null)}
            className="text-accent font-medium hover:underline"
          >
            try logging in again
          </button>
          .
        </p>
      </>
    );
  }

  return (
    <>
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">Welcome back</h2>
      <p className="text-muted-foreground mb-8">Sign in to manage your shipments</p>
      
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="merchant@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="h-11"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-sm text-accent hover:underline">
              Forgot password?
            </a>
          </div>
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

        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, rememberMe: checked as boolean })
            }
          />
          <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
            Remember me for 30 days
          </Label>
        </div>

        <Button type="submit" className="w-full h-11" variant="accent" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accent font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
}

