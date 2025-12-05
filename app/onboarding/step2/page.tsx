"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Mail, FileText, Shield, CheckCircle2 } from "lucide-react";

export default function OnboardingStep2Page() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/onboarding/step3");
  };

  const handleBack = () => {
    router.push("/onboarding/step1");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded">Step 2 of 6</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              How PreSign Works
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's how PreSign fits into your shipping workflow:
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="font-semibold text-accent">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Detect Signature-Required Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    PreSign watches for orders that need a signature using your Shopify fulfillment flow or order tags. 
                    We automatically start the authorization process when detected.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Collect Buyer Authorization</h3>
                  <p className="text-sm text-muted-foreground">
                    PreSign emails the customer a secure link to confirm delivery preferences, accept terms, and draw a signature. 
                    We generate a timestamped, carrier-ready authorization in the background.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Receive Ready-to-Use Waiver</h3>
                  <p className="text-sm text-muted-foreground">
                    Your team receives a clean PDF waiver plus step-by-step instructions for processing the exception 
                    through your UPS or FedEx portal. No guesswork, no frantic calls with the buyer.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Reduce Failed Deliveries</h3>
                  <p className="text-sm text-muted-foreground">
                    With buyer consent documented and clear internal steps, you cut down on failed delivery attempts, 
                    frustrated customers, and liability disputes — especially when shipping high-value items.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Important:</strong> PreSign is a merchant tool. Your customers never pay PreSign directly — 
                they only see a clean, professional authorization experience when needed.
              </p>
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

