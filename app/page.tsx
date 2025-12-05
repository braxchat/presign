import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhySignaturesFail } from "@/components/landing/WhySignaturesFail";
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

  // If any Shopify indicator exists, redirect to dashboard
  if (shop || shopHeader || shopifyHmac || shopParam) {
    redirect("/merchant/dashboard");
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
              Reduce Failed Deliveries for
              <br />
              <span className="text-accent">Signature-Required Packages</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Give customers a simple, secure way to authorize delivery—before the carrier arrives.
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">
            Merchants earn an extra $1.00 on every remote authorization from the customer, with no fees and free installation. If a carrier still requires a physical signature, customers can request a refund by submitting the missed-delivery notice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="accent" className="text-base px-8 py-6">
                <a href="https://apps.shopify.com/presign" target="_blank" rel="noopener noreferrer">
                  Install on Shopify
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base px-8 py-6">
                <a href="#how-it-works">
                  Learn How It Works
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
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Step 1</h3>
                <p className="text-muted-foreground">
                After free installation - Merchants can ship an order that requires Direct Signature
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Step 2</h3>
                <p className="text-muted-foreground">
                  PreSign automatically emails the buyer
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Step 3</h3>
                <p className="text-muted-foreground">
                Buyer authorizes remote signature delivery for $2.99
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Step 4</h3>
                <p className="text-muted-foreground">
                The merchant receives the documentation, updates the delivery instructions, and earns $1 once the process is completed.
                </p>
              </div>
            </div>
            <div className="mt-12 p-6 rounded-xl border border-border bg-card max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground text-center">
                <strong className="text-foreground">PreSign Delivery Guarantee</strong> — If the carrier does not honor the authorized release and leaves an official missed-delivery slip, customers can request a refund by sending us a photo of the slip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
              Everything You Need
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl border border-border bg-card">
                <Users className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Buyer Authorization Flow</h3>
                <p className="text-muted-foreground">
                  Seamless, secure process for customers to authorize delivery release
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <BarChart3 className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Merchant Dashboard</h3>
                <p className="text-muted-foreground">
                  Track all shipments, overrides, and earnings in one place
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <Store className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Shopify App Integration</h3>
                <p className="text-muted-foreground">
                  Automatically syncs with your Shopify orders and fulfillments
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <Download className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Authorization PDFs</h3>
                <p className="text-muted-foreground">
                  Downloadable documentation for each authorization
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <CheckCircle2 className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Reduced Failed Delivery Attempts</h3>
                <p className="text-muted-foreground">
                  Increase first-attempt delivery success rates
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <Shield className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">100% Buyer-Initiated</h3>
                <p className="text-muted-foreground">
                  Customers choose when and how to authorize delivery
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
                        Authorize Delivery — $2.99
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

      {/* Carrier Integrations Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4">
              Carrier Integrations
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Coming Soon
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {/* UPS Card */}
              <div className="p-8 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-[#7BAB6E] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">UPS</span>
                  </div>
                </div>
                <h3 className="font-semibold text-xl text-center mb-2">UPS</h3>
                <p className="text-center text-sm font-medium text-muted-foreground mb-4">
                  Coming Soon
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  OAuth-based API integration coming after UPS approval.
                </p>
              </div>

              {/* FedEx Card */}
              <div className="p-8 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-[#4D148C] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">FedEx</span>
                  </div>
                </div>
                <h3 className="font-semibold text-xl text-center mb-2">FedEx</h3>
                <p className="text-center text-sm font-medium text-muted-foreground mb-4">
                  Coming Soon
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Delivery instruction automation coming soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shopify App Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Store className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Available for Shopify Merchants
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Install PreSign in minutes and start reducing failed deliveries today
            </p>
            <Button asChild size="lg" variant="accent" className="text-base px-8 py-6">
              <a href={`/api/shopify/auth/install?shop=your-store.myshopify.com`}>
                Install on Shopify
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>Free to install</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>No monthly fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>Earn $1.00 per override</span>
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
              Start using PreSign today and give your customers the flexibility they need.
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
            <p className="mt-2 text-xs">Guarantee applies only when an official UPS or FedEx delivery attempt slip is provided.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
