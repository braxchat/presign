"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BillingInfo {
  billing_provider: 'shopify' | 'stripe' | null;
  plan_tier: 'basic' | 'pro' | 'enterprise' | null;
  status: 'trialing' | 'active' | 'canceled' | 'past_due' | null;
  trial_end: string | null;
  shopify_subscription_id: string | null;
  shopify_plan_name: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export default function BillingPage() {
  const { toast } = useToast();
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    loadBillingInfo();
  }, []);

  async function loadBillingInfo() {
    try {
      const res = await fetch("/api/merchant/billing");
      if (!res.ok) {
        throw new Error('Failed to fetch billing info');
      }
      const data = await res.json();
      setBillingInfo(data);
    } catch (err) {
      console.error("Failed to load billing info:", err);
      toast({
        title: "Error",
        description: "Failed to load billing information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/merchant/billing/portal", {
        method: "POST",
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create billing portal session');
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      console.error("Failed to open billing portal:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to open billing portal",
        variant: "destructive",
      });
      setPortalLoading(false);
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </span>
        );
      case 'trialing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Clock className="h-3 w-3" />
            Trialing
          </span>
        );
      case 'canceled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <XCircle className="h-3 w-3" />
            Canceled
          </span>
        );
      case 'past_due':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertCircle className="h-3 w-3" />
            Past Due
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Inactive
          </span>
        );
    }
  };

  const getPlanTierDisplay = (tier: string | null) => {
    if (!tier) return 'No plan selected';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Subscription Status */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-accent" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Subscription Status
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            {getStatusBadge(billingInfo?.status || null)}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plan</span>
            <span className="text-sm font-medium text-foreground">
              {getPlanTierDisplay(billingInfo?.plan_tier || null)}
            </span>
          </div>

          {billingInfo?.trial_end && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trial Ends</span>
              <span className="text-sm font-medium text-foreground">
                {formatDate(billingInfo.trial_end)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Billing Provider</span>
            <span className="text-sm font-medium text-foreground">
              {billingInfo?.billing_provider 
                ? billingInfo.billing_provider.charAt(0).toUpperCase() + billingInfo.billing_provider.slice(1)
                : 'Not set'}
            </span>
          </div>
        </div>
      </div>

      {/* Billing Management */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Manage Billing
          </h2>
        </div>

        {billingInfo?.billing_provider === 'shopify' ? (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-foreground">
                Your subscription is managed through Shopify. To update or cancel your subscription, 
                go to your Shopify admin dashboard.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>
                Navigate to: <strong>Shopify Admin → Apps → PreSign</strong>
              </span>
            </div>
          </div>
        ) : billingInfo?.billing_provider === 'stripe' ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Update your payment method, view invoices, or manage your subscription through the Stripe billing portal.
            </p>
            <Button
              onClick={handleManageBilling}
              disabled={portalLoading}
              variant="accent"
              className="gap-2"
            >
              {portalLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Manage Billing
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-foreground">
                No active subscription found. Please contact support to set up your subscription.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Important Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl p-6 space-y-2">
        <h3 className="font-medium text-foreground text-sm">
          About PreSign Billing
        </h3>
        <p className="text-sm text-muted-foreground">
          PreSign is billed to merchants as a monthly subscription. Your customers never pay PreSign directly — 
          they only see a clean, professional authorization experience when needed.
        </p>
      </div>
    </div>
  );
}

