import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Building2, 
  CreditCard, 
  Clock, 
  Lock, 
  Package,
  ArrowRight,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

export function WhySignaturesFail() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Headline */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Direct-Signature Shipments Fail So Often
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Signature-required deliveries fail far more than standard packages — costing merchants time, money, and frustrated customers.
            </p>
          </div>

          {/* Industry Failure Rate Card */}
          <div className="mb-16">
            <div className="bg-card rounded-xl border border-border p-8 max-w-2xl mx-auto text-center">
              <div className="text-5xl font-bold text-accent mb-2">18–28%</div>
              <p className="text-lg text-muted-foreground">
                Industry Failure Rate
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Across UPS, FedEx, USPS, and DHL
              </p>
            </div>
          </div>

          {/* Top Causes - 2 Column Layout */}
          <div className="mb-16">
            <h3 className="font-display text-2xl font-bold text-center mb-8">
              Top Causes
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Recipient not home</h4>
                  <p className="text-muted-foreground text-sm">70% of all failures</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Apartment / access issues</h4>
                  <p className="text-muted-foreground text-sm">Complex delivery locations</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Strict ID / adult-signature requirements</h4>
                  <p className="text-muted-foreground text-sm">Verification challenges</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Deliveries attempted while customers are at work</h4>
                  <p className="text-muted-foreground text-sm">Timing mismatches</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Gated communities or missed call boxes</h4>
                  <p className="text-muted-foreground text-sm">Access barriers</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">High-value shipments requiring extra verification</h4>
                  <p className="text-muted-foreground text-sm">Additional security checks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Failure Rates by Category - 3 Column Grid */}
          <div className="mb-16">
            <h3 className="font-display text-2xl font-bold text-center mb-8">
              Failure Rates by Product Category
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="text-3xl font-bold text-accent mb-2">26–31%</div>
                <h4 className="font-semibold text-lg mb-2">Hunting Accessories & Ammunition</h4>
                <p className="text-sm text-muted-foreground">Highest failure rate category</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="text-3xl font-bold text-accent mb-2">20–28%</div>
                <h4 className="font-semibold text-lg mb-2">High-Value Electronics</h4>
                <p className="text-sm text-muted-foreground">Common delivery challenges</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="text-3xl font-bold text-accent mb-2">22–30%</div>
                <h4 className="font-semibold text-lg mb-2">Jewelry & Luxury Goods</h4>
                <p className="text-sm text-muted-foreground">Premium product category</p>
              </div>
            </div>
          </div>

          {/* Hidden Cost Section */}
          <div className="mb-16">
            <h3 className="font-display text-2xl font-bold text-center mb-8">
              The Hidden Cost of Failed Signatures
            </h3>
            <p className="text-center text-muted-foreground mb-6">
              For every 100 signature-required shipments, merchants lose:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="text-2xl font-bold text-foreground mb-2">18–28</div>
                <p className="text-sm text-muted-foreground">Failed deliveries</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="text-2xl font-bold text-foreground mb-2">18–28</div>
                <p className="text-sm text-muted-foreground">Frustrated buyers</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="text-2xl font-bold text-foreground mb-2">$2,000–$5,000</div>
                <p className="text-sm text-muted-foreground">Support, replacements, re-ships</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="text-2xl font-bold text-foreground mb-2">Increased</div>
                <p className="text-sm text-muted-foreground">Negative reviews + chargebacks</p>
              </div>
            </div>
            {/* Warning Card */}
            <div className="max-w-3xl mx-auto p-6 rounded-xl border-l-4 border-accent bg-accent/5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-2">Merchant Pain Points</h4>
                  <p className="text-muted-foreground">
                    Every failed delivery attempt increases customer service workload, damages brand reputation, and reduces customer lifetime value. The financial impact extends far beyond the cost of re-shipping.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How PreSign Solves This */}
          <div className="mb-16">
            <h3 className="font-display text-2xl font-bold text-center mb-8">
              How PreSign Solves This
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-4" />
                <h4 className="font-semibold text-lg mb-2">Secure pre-authorization from the buyer</h4>
                <p className="text-sm text-muted-foreground">
                  Buyers authorize delivery before the carrier arrives
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-4" />
                <h4 className="font-semibold text-lg mb-2">Carrier-ready PDF waiver with instructions</h4>
                <p className="text-sm text-muted-foreground">
                  Legally-composed documentation with step-by-step UPS/FedEx portal instructions
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card text-center">
                <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-4" />
                <h4 className="font-semibold text-lg mb-2">Up to 80% reduction in failed delivery attempts</h4>
                <p className="text-sm text-muted-foreground">
                  Dramatically improve first-attempt success rates
                </p>
              </div>
            </div>
            <div className="max-w-2xl mx-auto p-6 rounded-xl border border-border bg-card text-center">
              <p className="text-lg font-semibold text-foreground">
                Reduce signature-required failure rates from <span className="text-accent">28%</span> → <span className="text-accent">below 5%</span>
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto">
            <div className="p-8 rounded-xl border border-border bg-card text-center">
              <h3 className="font-display text-2xl font-bold mb-4">
                Install PreSign on Shopify — Reduce failed deliveries immediately.
              </h3>
              <Button asChild size="lg" variant="accent" className="text-base px-8 py-6 mt-6">
                <a href="/api/shopify/auth/install?shop=your-store.myshopify.com">
                  Install on Shopify
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

