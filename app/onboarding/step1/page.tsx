"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package2, ArrowRight } from "lucide-react";

export default function OnboardingStep1Page() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/onboarding/step2");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-accent/10 rounded-full">
                <Package2 className="h-12 w-12 text-accent" />
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Welcome to PreSign
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Reduce failed signature-required deliveries by automating buyer authorization and generating carrier-ready documentation.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground">
                PreSign helps Shopify merchants who ship high-value, signature-required orders streamline their delivery process. 
                Instead of dealing with missed deliveries and frustrated customers, you'll automate the authorization workflow.
              </p>
              <p className="text-foreground">
                In the next few steps, we'll walk you through how PreSign works and help you configure it for your store.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Automated Authorization</h3>
                <p className="text-sm text-muted-foreground">
                  Buyers receive secure links to authorize delivery preferences and provide signatures.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Carrier-Ready PDFs</h3>
                <p className="text-sm text-muted-foreground">
                  Generate legally compliant waivers with step-by-step UPS/FedEx instructions.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6">
            <Button onClick={handleNext} variant="accent" size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

