import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Package2, 
  ArrowRight, 
  Shield, 
  DollarSign, 
  Zap, 
  CheckCircle,
  Package
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Authorization",
    description: "Encrypted signature release with full audit trail and IP verification.",
  },
  {
    icon: DollarSign,
    title: "Earn Per Override",
    description: "Make $1.00 for every successful signature release authorization.",
  },
  {
    icon: Zap,
    title: "Real-time Tracking",
    description: "Automatic carrier status updates from UPS and FedEx.",
  },
  {
    icon: Package,
    title: "Easy Management",
    description: "Dashboard to track all shipments, overrides, and earnings.",
  },
];

const stats = [
  { value: "10,000+", label: "Shipments Processed" },
  { value: "98%", label: "Delivery Success Rate" },
  { value: "$50K+", label: "Merchant Earnings" },
  { value: "500+", label: "Active Merchants" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Package2 className="h-7 w-7 text-accent" />
            <span className="font-display font-bold text-xl text-foreground">PreSign</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="accent">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4" />
              Trusted by 500+ FFL Merchants
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Remote Signature Release
              <br />
              <span className="text-accent">for Gun & Ammo Merchants</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Streamline your FFL shipments with automated signature release management. 
              Increase delivery success rates, reduce failed deliveries, and earn $1.00 per override.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button variant="accent" size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-accent">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Signature Releases
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete solution for managing FFL shipments that require signature authorization.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Add Shipments",
                description: "Upload your shipments manually or via CSV import with tracking numbers.",
              },
              {
                step: "2",
                title: "Buyer Authorizes",
                description: "Buyers receive a link to authorize signature release and pay $2.99.",
              },
              {
                step: "3",
                title: "You Earn $1.00",
                description: "Get paid for every successful override. Withdraw anytime.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-14 w-14 rounded-full bg-accent text-accent-foreground font-display text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Streamline Your Shipments?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of FFL merchants who trust PreSign to manage their deliveries.
          </p>
          <Link href="/signup">
            <Button variant="accent" size="lg" className="gap-2">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Package2 className="h-6 w-6 text-accent" />
              <span className="font-display font-bold">PreSign</span>
            </Link>
            <p className="text-primary-foreground/60 text-sm">
              © 2024 PreSign. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

