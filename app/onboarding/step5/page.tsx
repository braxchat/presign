"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CreditCard, Loader2, CheckCircle2 } from "lucide-react";

export default function OnboardingStep5Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [billingProvider, setBillingProvider] = useState<"shopify" | "stripe" | null>(null);

  useEffect(() => {
    // Fetch merchant billing provider
    fetch("/api/merchant/billing")
      .then((res) => res.json())
      .then((data) => {
        setBillingProvider(data.billing_provider);
      })
      .catch((err) => {
        console.error("Failed to fetch billing info:", err);
      });
  }, []);

  const handleActivateTrial = async () => {
    setLoading(true);
    try {
      if (billingProvider === "shopify") {
        // For Shopify, create subscription and redirect to confirmation
        const response = await fetch("/api/shopify/billing/create", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to create Shopify subscription");
        }

        const { confirmationUrl } = await response.json();
        if (confirmationUrl) {
          window.location.href = confirmationUrl;
          return;
        }
      } else {
        // For Stripe, create subscription
        const response = await fetch("/api/stripe/create-subscription", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to create Stripe subscription");
        }

        const data = await response.json();
        // Stripe subscription created, proceed to next step
        router.push("/onboarding/step6");
      }
    } catch (error: any) {
      console.error("Error activating trial:", error);
      alert(error.message || "Failed to activate trial. Please try again.");
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/onboarding/step4");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded">Step 5 of 6</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Billing & Trial Activation
            </h1>
            <p className="text-lg text-muted-foreground">
              Start your 14-day free trial. No credit card required for Shopify merchants.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="p-6 bg-muted/50 rounded-lg space-y-4">
              <div className="flex items-start gap-4">
                <CreditCard className="h-6 w-6 text-accent mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">PreSign for Merchants</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    $19/month after your 14-day free trial
                  </p>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Unlimited buyer authorizations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Unlimited PDF waivers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>UPS/FedEx exception instructions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Shopify order tagging and status updates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Email notifications for buyers and merchants</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {billingProvider === "shopify" && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Shopify Billing:</strong> Your subscription will be managed through Shopify. 
                  You'll be redirected to confirm your subscription in Shopify Admin.
                </p>
              </div>
            )}

            {billingProvider === "stripe" && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Stripe Billing:</strong> Your subscription will be managed through Stripe. 
                  You can update or cancel anytime from your billing settings.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6">
            <Button onClick={handleBack} variant="outline" size="lg" className="gap-2" disabled={loading}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleActivateTrial}
              variant="accent"
              size="lg"
              className="gap-2"
              disabled={loading || !billingProvider}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  Start Free 14-Day Trial
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

