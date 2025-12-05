import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhySignaturesFail } from "@/components/landing/WhySignaturesFail";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { 
  Package, 
  Mail, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  BarChart3,
  Shield,
  ArrowRight,
  Store,
  Download,
  Users,
  Zap
} from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>;
}) {
  // Check for Shopify shop cookie
  const cookieStore = await cookies();
  const shop = cookieStore.get("shop")?.value;

  // Check for Shopify headers (iframe loads)
  const headersList = await headers();
  const shopHeader = headersList.get("x-shopify-shop-domain");
  const shopifyHmac = headersList.get("x-shopify-hmac-sha256");

  // Check URL params for shop parameter
  const params = await searchParams;
  const shopParam = params?.shop;

  // If any Shopify indicator exists, check onboarding and redirect accordingly
  if (shop || shopHeader || shopifyHmac || shopParam) {
    const shopDomain = shop || shopHeader || shopParam;
    
    if (shopDomain) {
      // Get merchant onboarding status
      const { data: merchant } = await supabaseAdmin
        .from('merchants')
        .select('onboarding_completed')
        .eq('shop_domain', shopDomain)
        .single();

      const redirectPath = merchant?.onboarding_completed
        ? '/merchant/dashboard'
        : '/onboarding/start';
      
      redirect(redirectPath);
    } else {
      // Fallback to dashboard if we can't determine shop
      redirect("/merchant/dashboard");
    }
  }

  // Public landing page
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-accent" />
              <span className="font-display font-bold text-xl">PreSign</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
                Sign In
              </Link>
              <Button asChild variant="accent">
                <a href="https://apps.shopify.com/presign" target="_blank" rel="noopener noreferrer">
                  Install on Shopify
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Reduce Failed Deliveries for Signature-Required Orders.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Automate buyer authorization, collect liability waivers, and streamline UPS/FedEx exception workflows — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="accent" className="text-base px-8 py-6">
                <a href="https://apps.shopify.com/presign" target="_blank" rel="noopener noreferrer">
                  Start Free 14-Day Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base px-8 py-6">
                <a href="#how-it-works">
                  See How PreSign Works
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Signatures Fail Section */}
      <WhySignaturesFail />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
              How PreSign Fits Into Your Shipping Workflow
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Step 1 – Detect signature-required orders</h3>
                <p className="text-muted-foreground">
                  Flag orders that need a signature using your existing Shopify fulfillment flow or order tags. PreSign watches for these orders and automatically starts the authorization process.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Step 2 – Collect buyer authorization</h3>
                <p className="text-muted-foreground">
                  PreSign emails the customer a secure link to confirm their delivery preferences, accept the terms, and draw a signature. We generate a timestamped, carrier-ready authorization in the background.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Step 3 – Receive a ready-to-use waiver and instructions</h3>
                <p className="text-muted-foreground">
                  Your team receives a clean PDF waiver plus step-by-step instructions for how to process the exception through your UPS or FedEx portal. No guesswork, no frantic calls with the buyer.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Step 4 – Reduce failed deliveries and protect your business</h3>
                <p className="text-muted-foreground">
                  With buyer consent documented and clear internal steps, you cut down on failed delivery attempts, frustrated customers, and liability disputes — especially when shipping high-value items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
              Everything You Need
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl border border-border bg-card">
                <Users className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Automated buyer authorization workflow</h3>
                <p className="text-muted-foreground">
                  Seamless, secure process for customers to authorize delivery release
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <FileText className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Legally compliant PDF waiver generation</h3>
                <p className="text-muted-foreground">
                  Legally-composed PDF waivers document buyer consent and shift delivery liability
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <Download className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Clear step-by-step UPS/FedEx exception instructions</h3>
                <p className="text-muted-foreground">
                  Detailed instructions for updating carrier delivery instructions through UPS/FedEx portals
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <CheckCircle2 className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Reduce failed delivery attempts and customer frustration</h3>
                <p className="text-muted-foreground">
                  Increase first-attempt delivery success rates and improve customer satisfaction
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <Shield className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Protect your business from delivery-related disputes</h3>
                <p className="text-muted-foreground">
                  Document buyer consent to reduce chargebacks and liability disputes
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <Store className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Shopify App Integration</h3>
                <p className="text-muted-foreground">
                  Automatically syncs with your Shopify orders and fulfillments
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UI Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4">
              See PreSign in Action
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Experience the seamless flow from buyer authorization to merchant dashboard management
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Buyer Status Page */}
              <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-xs text-muted-foreground font-mono">presign.app/status/abc123</span>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Buyer Status Page</h3>
                      <p className="text-sm text-muted-foreground mb-4">Authorization Flow</p>
                    </div>
                    <div className="bg-white rounded-lg border border-border p-4 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tracking #</span>
                        <span className="text-sm font-mono text-muted-foreground">1Z999AA10123456784</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-3/4"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-muted-foreground">Signature Required</span>
                      </div>
                      <button className="w-full bg-accent text-white py-2 px-4 rounded-md text-sm font-medium">
                        Authorize Delivery
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Merchant Dashboard */}
              <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-xs text-muted-foreground font-mono">merchant.dashboard</span>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Merchant Dashboard</h3>
                      <p className="text-sm text-muted-foreground mb-4">Shipments Table</p>
                    </div>
                    <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-2 text-xs font-semibold">Tracking</th>
                            <th className="text-left p-2 text-xs font-semibold">Status</th>
                            <th className="text-left p-2 text-xs font-semibold">Override</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-border">
                            <td className="p-2 font-mono text-xs">1Z999AA...</td>
                            <td className="p-2">
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">In Transit</span>
                            </td>
                            <td className="p-2">
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span>
                            </td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="p-2 font-mono text-xs">92612901...</td>
                            <td className="p-2">
                              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Out for Delivery</span>
                            </td>
                            <td className="p-2">
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">None</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Authorization Viewer */}
              <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-xs text-muted-foreground font-mono">Authorization PDF</span>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">PDF Authorization Viewer</h3>
                      <p className="text-sm text-muted-foreground mb-4">Document Preview</p>
                    </div>
                    <div className="bg-white rounded-lg border-2 border-dashed border-border p-8 shadow-sm">
                      <div className="space-y-3 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                          <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-border space-y-2">
                          <div className="h-3 bg-muted rounded w-full"></div>
                          <div className="h-3 bg-muted rounded w-5/6 mx-auto"></div>
                          <div className="h-3 bg-muted rounded w-4/6 mx-auto"></div>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Download className="h-4 w-4" />
                          <span>Download PDF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shopify App Screen */}
              <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-xs text-muted-foreground font-mono">shopify.com/admin</span>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Shopify App</h3>
                      <p className="text-sm text-muted-foreground mb-4">Open App Screen</p>
                    </div>
                    <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold">PreSign</h4>
                          <p className="text-xs text-muted-foreground">Signature Release Management</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded w-full"></div>
                        <div className="h-2 bg-muted rounded w-3/4"></div>
                        <div className="h-2 bg-muted rounded w-1/2"></div>
                      </div>
                      <button className="mt-4 w-full bg-accent text-white py-2 px-4 rounded-md text-sm font-medium">
                        Open App
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
              Simple pricing for serious shipments.
            </h2>
            <div className="max-w-md mx-auto">
              <div className="bg-card rounded-xl border border-border p-8 shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    PreSign for Merchants
                  </h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="font-display text-5xl font-bold text-foreground">$19</span>
                    <span className="text-xl text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    14-day free trial. No contracts. Cancel anytime.
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Unlimited buyer authorizations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Unlimited PDF waivers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">UPS/FedEx exception instructions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Shopify order tagging and status updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Email notifications for buyers and merchants</span>
                  </li>
                </ul>
                <Button asChild size="lg" variant="accent" className="w-full text-base px-8 py-6">
                  <a href="https://apps.shopify.com/presign" target="_blank" rel="noopener noreferrer">
                    Start Free 14-Day Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
              Compliance & Responsibility
            </h2>
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-border bg-card">
                <Shield className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">PreSign does not alter carrier rules.</h3>
                <p className="text-muted-foreground">
                  We provide authorization documentation only. Carriers maintain their own policies and procedures.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <Users className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Buyers accept full responsibility after delivery.</h3>
                <p className="text-muted-foreground">
                  Each authorization includes a clear statement that buyers accept responsibility for packages once delivered.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <FileText className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Merchants update UPS/FedEx instructions manually.</h3>
                <p className="text-muted-foreground">
                  Merchants receive authorization PDFs and update carrier delivery instructions through their own carrier accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Ready to Reduce Failed Deliveries?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start reducing failed deliveries, chargebacks, and support tickets with automated buyer authorization.
            </p>
            <Button asChild size="lg" variant="accent" className="text-base px-8 py-6">
              <a href={`/api/shopify/auth/install?shop=your-store.myshopify.com`}>
                Install on Shopify
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Package className="h-6 w-6 text-accent" />
                <span className="font-display font-bold text-xl">PreSign</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Reduce failed deliveries for signature-required packages.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#how-it-works" className="hover:text-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/support#faq" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/support" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@presign.app" className="hover:text-foreground">
                    support@presign.app
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} PreSign. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
