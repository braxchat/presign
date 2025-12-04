"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic - will be connected to Supabase
    router.push("/merchant/dashboard");
  };

  return (
    <>
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">Welcome back</h2>
      <p className="text-muted-foreground mb-8">Sign in to manage your shipments</p>
      
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

        <Button type="submit" className="w-full h-11" variant="accent">
          Sign In
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

