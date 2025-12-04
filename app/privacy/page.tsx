import Link from "next/link";
import { Package, Shield, Database, CreditCard, FileText, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - PreSign",
  description: "PreSign Privacy Policy - How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
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
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <p className="text-lg text-foreground">
              PreSign ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Shopify app.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-accent" />
              What Data We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Buyer Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Email address</li>
                  <li>Full name</li>
                  <li>Tracking number</li>
                  <li>Signature authorization details (typed name, IP address, timestamp)</li>
                  <li>Carrier and shipment information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Merchant Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Shop domain and business name</li>
                  <li>Email address (from Shopify)</li>
                  <li>Shopify access token (for API integration)</li>
                  <li>Carrier API credentials (if provided)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-accent" />
              How Data Is Used
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>To process and manage signature release authorizations</li>
              <li>To send email notifications to buyers and merchants</li>
              <li>To generate authorization PDF documents</li>
              <li>To track shipments and delivery status</li>
              <li>To calculate merchant earnings and process payouts</li>
              <li>To provide customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-accent" />
              Storage & Retention
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Data Storage</h3>
                <p className="text-muted-foreground">
                  All data is securely stored using <strong>Supabase</strong>, a compliant cloud database platform. 
                  We use industry-standard encryption and security measures to protect your information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Data Retention</h3>
                <p className="text-muted-foreground">
                  We retain buyer and merchant data for as long as necessary to provide our services and comply with legal obligations. 
                  Authorization PDFs are stored in Supabase Storage and remain accessible to merchants for their records.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-accent" />
              Payment Information
            </h2>
            <p className="text-muted-foreground">
              <strong>Stripe payment information is handled exclusively by Stripe.</strong> We do not store, process, or have access to your credit card details. 
              All payment processing is handled securely through Stripe's payment infrastructure. We only receive payment confirmation and transaction metadata necessary for our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-accent" />
              Authorization Documents
            </h2>
            <p className="text-muted-foreground">
              Buyer authorization documents are generated as PDFs and stored securely in Supabase Storage. 
              These documents contain buyer consent information and are accessible to merchants for their records and carrier communication purposes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4">Data Sharing</h2>
            <p className="text-muted-foreground">
              <strong>Merchant data is never shared with third parties</strong> except as necessary to provide our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
              <li>Shopify (for app integration and order/fulfillment data)</li>
              <li>Stripe (for payment processing)</li>
              <li>Supabase (for secure data storage)</li>
              <li>Resend (for email delivery)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4">Compliance</h2>
            <p className="text-muted-foreground">
              PreSign is compliant with Shopify App Store guidelines and follows industry best practices for data protection. 
              We are committed to maintaining the security and privacy of your information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of certain data processing activities</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us at <a href="mailto:support@presign.app" className="text-accent hover:underline">support@presign.app</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:support@presign.app" className="text-accent hover:underline">support@presign.app</a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              <span className="font-display font-bold">PreSign</span>
            </Link>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
              <Link href="/" className="hover:text-foreground">Home</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

