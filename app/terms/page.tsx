import Link from "next/link";
import { Package, AlertTriangle, FileText, DollarSign, Shield } from "lucide-react";

export const metadata = {
  title: "Terms of Service - PreSign",
  description: "PreSign Terms of Service - Rules and guidelines for using our service.",
};

export default function TermsPage() {
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
          <h1 className="font-display text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <p className="text-lg text-foreground">
              By using PreSign ("the Service"), you agree to be bound by these Terms of Service. 
              Please read these terms carefully before using our service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-accent" />
              PreSign Is Not a Carrier
            </h2>
            <p className="text-muted-foreground">
              <strong>PreSign is not a shipping carrier.</strong> We are a technology platform that facilitates 
              communication between merchants and buyers regarding signature-required deliveries. We do not handle, 
              transport, or deliver packages. All shipping and delivery services are provided by third-party carriers 
              (UPS, FedEx, etc.) according to their own terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-accent" />
              Merchant Responsibilities
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Manual Carrier Updates Required</h3>
                <p className="text-muted-foreground">
                  <strong>Merchants must update UPS/FedEx delivery instructions manually.</strong> PreSign provides 
                  authorization documentation (PDFs) that merchants can use to update carrier delivery preferences 
                  through their own carrier accounts. PreSign does not automatically modify carrier systems or delivery 
                  instructions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Carrier Account Management</h3>
                <p className="text-muted-foreground">
                  Merchants are responsible for maintaining their own carrier accounts and ensuring that delivery 
                  instructions are properly updated. PreSign is not responsible for carrier system limitations or 
                  failures to update delivery preferences.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4">No Delivery Guarantees</h2>
            <p className="text-muted-foreground">
              <strong>PreSign does not guarantee delivery outcomes.</strong> While we facilitate the authorization 
              process and provide documentation, we cannot guarantee that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
              <li>Carriers will accept or process delivery instruction changes</li>
              <li>Packages will be delivered successfully</li>
              <li>Delivery attempts will be reduced</li>
              <li>Buyer authorizations will result in successful deliveries</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Delivery outcomes depend on carrier policies, local regulations, and other factors beyond our control.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-accent" />
              Buyer Responsibility
            </h2>
            <p className="text-muted-foreground">
              <strong>Buyers accept full responsibility after delivery.</strong> By authorizing delivery release through 
              PreSign, buyers acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
              <li>They accept full responsibility for the package once it is delivered</li>
              <li>They are responsible for any loss, theft, or damage that occurs after delivery</li>
              <li>The authorization is a binding agreement to accept delivery without requiring an in-person signature</li>
              <li>They understand that carriers may still require signatures based on their own policies</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-accent" />
              Payment Terms
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Authorization Fee</h3>
                <p className="text-muted-foreground">
                  Buyers pay a <strong>$2.99 authorization fee</strong> to authorize delivery release. 
                  <strong>This fee is non-refundable once submitted</strong>, regardless of delivery outcome, 
                  carrier acceptance, or any other circumstances.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Merchant Earnings</h3>
                <p className="text-muted-foreground">
                  <strong>Merchants earn $1.00 per completed authorization.</strong> Earnings are calculated when a buyer 
                  successfully completes the authorization process and payment is confirmed. Merchant earnings are tracked 
                  in the merchant dashboard and can be requested for payout according to our payout terms.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4">Service Availability</h2>
            <p className="text-muted-foreground">
              PreSign is provided "as is" and "as available." We do not guarantee that the Service will be uninterrupted, 
              error-free, or available at all times. We reserve the right to modify, suspend, or discontinue the Service 
              at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, PreSign shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including but not limited to loss of profits, data, or business 
              opportunities, arising from the use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4">Modifications to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms of Service at any time. We will notify users of material 
              changes by posting the updated terms on this page and updating the "Last updated" date. Your continued 
              use of the Service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, please contact us at{" "}
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

