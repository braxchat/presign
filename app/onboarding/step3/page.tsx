"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Tag, Zap } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function OnboardingStep3Page() {
  const router = useRouter();
  const [triggerMethod, setTriggerMethod] = useState<"auto" | "tag">("auto");

  const handleNext = async () => {
    // Save trigger method preference (you can add API call here later)
    // For now, just proceed to next step
    router.push("/onboarding/step4");
  };

  const handleBack = () => {
    router.push("/onboarding/step2");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded">Step 3 of 6</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Choose Trigger Rules
            </h1>
            <p className="text-lg text-muted-foreground">
              How should PreSign detect which orders need authorization?
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <RadioGroup value={triggerMethod} onValueChange={(value) => setTriggerMethod(value as "auto" | "tag")}>
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-6 hover:bg-muted/30 transition-colors cursor-pointer">
                  <RadioGroupItem value="auto" id="auto" className="sr-only" />
                  <Label
                    htmlFor="auto"
                    className="flex items-start gap-4 cursor-pointer"
                  >
                    <div className="mt-1">
                      <Zap className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          checked={triggerMethod === "auto"}
                          onChange={() => setTriggerMethod("auto")}
                          className="h-4 w-4 text-accent"
                        />
                        <h3 className="font-semibold">Automatic Detection</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        PreSign automatically watches for orders marked as "Signature Required" in your Shopify fulfillment settings. 
                        This is the recommended option for most merchants.
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="border border-border rounded-lg p-6 hover:bg-muted/30 transition-colors cursor-pointer">
                  <RadioGroupItem value="tag" id="tag" className="sr-only" />
                  <Label
                    htmlFor="tag"
                    className="flex items-start gap-4 cursor-pointer"
                  >
                    <div className="mt-1">
                      <Tag className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          checked={triggerMethod === "tag"}
                          onChange={() => setTriggerMethod("tag")}
                          className="h-4 w-4 text-accent"
                        />
                        <h3 className="font-semibold">Tag-Based</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        PreSign only processes orders with a specific tag (e.g., "signature-required"). 
                        You'll manually tag orders that need authorization.
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Note:</strong> You can change this setting later in your PreSign dashboard under Settings.
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

