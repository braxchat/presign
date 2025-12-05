import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Mail, 
  Clock,
  ArrowRight,
  HelpCircle,
  CheckCircle2
} from "lucide-react";

export default function SupportPage() {
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

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Support
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're here to help you reduce failed deliveries and improve customer satisfaction.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-card rounded-xl border border-border p-8 mb-12">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email Support</h3>
                    <a 
                      href="mailto:support@presign.app" 
                      className="text-accent hover:underline text-lg"
                    >
                      support@presign.app
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Send us an email and we'll respond as soon as possible.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pt-4 border-t border-border">
                  <Clock className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Support Hours</h3>
                    <p className="text-foreground text-lg">Mon–Fri, 9am–5pm CST</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We typically respond within 24 hours during business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <HelpCircle className="h-8 w-8 text-accent" />
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-6">
                {/* FAQ Item 1 */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    How does PreSign work?
                  </h3>
                  <p className="text-muted-foreground">
                    When a merchant ships a signature-required package, PreSign automatically emails the buyer with a link to authorize delivery. The buyer pays $2.99 to authorize release, and the merchant receives a PDF authorization document to update carrier delivery instructions.
                  </p>
                </div>

                {/* FAQ Item 2 */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    What carriers does PreSign support?
                  </h3>
                  <p className="text-muted-foreground">
                    PreSign is currently proccessing a partnership with UPS and FedEx to Automatically process remote signature delivery for shipments without the need for manual intervention from  the merchant. We're working on additional carrier integrations and will notify merchants when they become available.
                  </p>
                </div>

                {/* FAQ Item 3 */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    How much does PreSign cost?
                  </h3>
                  <p className="text-muted-foreground">
                    PreSign is free to install with no monthly fees. Merchants earn $1.00 per successful override authorization. Buyers pay $2.99 to authorize delivery release.
                  </p>
                </div>

                {/* FAQ Item 4 */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Is PreSign compliant with carrier policies?
                  </h3>
                  <p className="text-muted-foreground">
                    PreSign provides authorization documentation only. We do not alter carrier rules or policies. Merchants must manually update delivery instructions with UPS or FedEx using the provided PDF authorization documents.
                  </p>
                </div>

                {/* FAQ Item 5 */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    What is the PreSign Delivery Guarantee?
                  </h3>
                  <p className="text-muted-foreground">
                    If a carrier still requires a physical signature after a buyer has authorized release, the buyer can request a refund by emailing a photo of the official delivery attempt slip to refunds@presign.app. This guarantee applies only when an official UPS or FedEx delivery attempt slip is provided.
                  </p>
                </div>

                {/* FAQ Item 6 */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    How do I install PreSign on my Shopify store?
                  </h3>
                  <p className="text-muted-foreground">
                    Visit our Shopify App Store listing and click "Install app". You'll be redirected to complete the OAuth installation process. Once installed, PreSign will automatically sync with your Shopify orders and fulfillments.
                  </p>
                </div>

                {/* FAQ Item 7 */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Can buyers authorize delivery after the package is out for delivery?
                  </h3>
                  <p className="text-muted-foreground">
                    No. Once a package is marked as "Out for Delivery" by the carrier, the authorization option is locked. This ensures buyers have time to authorize before the delivery attempt.
                  </p>
                </div>

                {/* FAQ Item 8 */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    How do I receive my merchant earnings?
                  </h3>
                  <p className="text-muted-foreground">
                    Merchant earnings ($1.00 per override) are tracked in your dashboard. You can request payouts through the merchant dashboard. Payouts are processed according to your account settings.
                  </p>
                </div>

                {/* FAQ Item 9 */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    What happens if a buyer doesn't authorize delivery?
                  </h3>
                  <p className="text-muted-foreground">
                    If a buyer doesn't authorize delivery, the package will follow standard carrier procedures and require a signature at delivery. PreSign does not interfere with normal carrier operations.
                  </p>
                </div>

                {/* FAQ Item 10 */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Is buyer information secure?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes. PreSign uses industry-standard security practices to protect buyer information. All authorization transactions are processed securely through Stripe, and we comply with data protection regulations.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="bg-muted/30 rounded-xl border border-border p-8 text-center">
              <h3 className="font-semibold text-lg mb-4">Legal Documents</h3>
              <p className="text-muted-foreground mb-6">
                Review our policies and terms of service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/privacy">
                    Privacy Policy
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/terms">
                    Terms of Service
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 mt-20">
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
                  <Link href="/#how-it-works" className="hover:text-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="hover:text-foreground">
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

