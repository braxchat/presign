"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function OnboardingStep6Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      // Redirect to dashboard
      router.push("/merchant/dashboard");
    } catch (error: any) {
      console.error("Error completing onboarding:", error);
      alert(error.message || "Failed to complete onboarding. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              You're All Set!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your PreSign account is ready to use.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="p-6 bg-muted/50 rounded-lg space-y-4">
              <h3 className="font-semibold">What's Next?</h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Start Shipping:</strong> PreSign will automatically detect signature-required orders 
                    based on your trigger rules and begin the authorization process.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Monitor Activity:</strong> Check your dashboard to see authorizations, 
                    view PDF waivers, and track delivery status.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Customize Settings:</strong> Visit Settings to adjust trigger rules, 
                    carrier preferences, and notification preferences.
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Need Help?</strong> Visit our support page or email support@presign.app 
                if you have any questions about using PreSign.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6">
            <Button
              onClick={handleComplete}
              variant="accent"
              size="lg"
              className="gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  Go to Dashboard
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

