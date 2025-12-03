import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, Package, AlertTriangle, CheckCircle, Lock, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function BuyerStatusPage() {
  const { token } = useParams();
  const [typedName, setTypedName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock shipment data - in real app this would come from API
  const shipment = {
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    carrierStatus: "InTransit" as const,
    merchantName: "Acme Range",
    isLocked: false, // Would be true if OutForDelivery
  };

  const carrierStatusConfig = {
    PreTransit: { label: "Pre-Transit", color: "muted" as const, description: "Package label created, awaiting pickup" },
    InTransit: { label: "In Transit", color: "info" as const, description: "Package is on its way" },
    OutForDelivery: { label: "Out for Delivery", color: "warning" as const, description: "Package will be delivered today" },
    Delivered: { label: "Delivered", color: "success" as const, description: "Package has been delivered" },
  };

  const currentStatus = carrierStatusConfig[shipment.carrierStatus];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !typedName) return;
    setSubmitted(true);
    toast({
      title: "Signature authorization submitted",
      description: "Your package delivery has been authorized.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Truck className="h-6 w-6 text-accent" />
          <span className="font-display font-bold">SignatureRelease</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Shipment Info Card */}
        <div className="bg-card rounded-xl border border-border shadow-md p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tracking Number</p>
              <p className="font-mono text-lg font-semibold text-foreground">
                {shipment.trackingNumber}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{shipment.carrier}</span>
            </div>
          </div>

          {/* Status */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Carrier Status</p>
              <Badge variant={currentStatus.color}>{currentStatus.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{currentStatus.description}</p>

            {/* Progress */}
            <div className="mt-4 flex items-center gap-2">
              {["PreTransit", "InTransit", "OutForDelivery", "Delivered"].map((status, index) => {
                const statuses = ["PreTransit", "InTransit", "OutForDelivery", "Delivered"];
                const currentIndex = statuses.indexOf(shipment.carrierStatus);
                const isComplete = index <= currentIndex;
                return (
                  <div key={status} className="flex-1 flex items-center gap-2">
                    <div
                      className={`h-2 flex-1 rounded-full ${
                        isComplete ? "bg-success" : "bg-border"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Shipped by <span className="font-medium text-foreground">{shipment.merchantName}</span>
          </div>
        </div>

        {/* Override Form */}
        {!submitted ? (
          <div className="bg-card rounded-xl border border-border shadow-md p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Remote Signature Release
                </h2>
                <p className="text-sm text-muted-foreground">
                  Authorize delivery without requiring an in-person signature
                </p>
              </div>
            </div>

            {shipment.isLocked ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Override Locked</p>
                  <p className="text-sm text-muted-foreground">
                    This shipment is out for delivery. Signature release cannot be modified at this time.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">$2.99 Service Fee</p>
                    <p className="text-sm text-muted-foreground">
                      A one-time fee is required to authorize signature release for this shipment.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typedName">Type Your Full Legal Name</Label>
                  <Input
                    id="typedName"
                    placeholder="John Smith"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    className="h-12 text-lg"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This serves as your electronic signature authorizing delivery without an in-person signature.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="agree" className="text-sm text-muted-foreground leading-relaxed">
                    I authorize {shipment.carrier} to release this package without obtaining a signature. 
                    I understand that once delivered, I assume full responsibility for the package.
                  </Label>
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full h-12 text-base gap-2"
                  disabled={!agreed || !typedName}
                >
                  Pay $2.99 & Authorize Release
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Your IP address and timestamp will be recorded for verification purposes.
                </p>
              </form>
            )}
          </div>
        ) : (
          <div className="bg-success/5 border border-success/20 rounded-xl p-6 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Authorization Complete
              </h2>
              <p className="text-muted-foreground mt-1">
                Your signature release has been successfully submitted.
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 text-left">
              <p className="text-sm text-muted-foreground mb-1">Authorized by</p>
              <p className="font-medium text-foreground">{typedName}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Timestamp: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Questions? Contact {shipment.merchantName} for support.</p>
          <p className="mt-2">Powered by SignatureRelease</p>
        </div>
      </main>
    </div>
  );
}
