"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Eye, Mail, FileText, CheckCircle2 } from "lucide-react";

export default function OnboardingStep4Page() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/onboarding/step5");
  };

  const handleBack = () => {
    router.push("/onboarding/step3");
  };

  const handlePreview = () => {
    // Open buyer flow preview in new window
    window.open("/status/preview", "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded">Step 4 of 6</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Review Buyer Flow
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's what your customers will experience when they need to authorize a delivery:
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-accent mt-1" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">1. Buyer Receives Email</h3>
                  <p className="text-sm text-muted-foreground">
                    When a signature-required order is detected, the buyer receives a professional email with a secure link 
                    to authorize their delivery preferences.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-accent mt-1" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">2. Buyer Authorizes Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    The buyer visits the secure authorization page, confirms their address and shipment details, 
                    reads the liability terms, and draws their signature.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-1" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">3. Authorization Complete</h3>
                  <p className="text-sm text-muted-foreground">
                    The buyer sees a confirmation that their authorization was received. 
                    PreSign generates a carrier-ready PDF waiver and sends it to your team with clear instructions.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <p className="text-sm text-foreground mb-3">
                <strong>Important:</strong> Your customers never pay PreSign. They only see a clean, professional 
                authorization experience when needed.
              </p>
              <Button
                onClick={handlePreview}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview Buyer Experience
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6">
            <Button onClick={handleBack} variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} variant="accent" size="lg" className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

