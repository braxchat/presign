import Link from "next/link";
import { Package, Mail, CreditCard, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
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
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
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
                  Buyer authorizes delivery for $2.99
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
            <div className="mt-12 p-6 rounded-xl border border-border bg-card max-w-2xl mx-auto">
              <h3 className="font-semibold text-lg mb-3 text-center">Delivery Guarantee</h3>
              <p className="text-sm text-muted-foreground text-center">
                If a buyer authorizes release but the carrier still requires a physical signature, PreSign protects the customer with our Delivery Guarantee. Simply email a photo of the official &apos;missed delivery&apos; slip to <a href="mailto:refunds@presign.app" className="text-accent hover:underline">refunds@presign.app</a> and our team will review the refund request.
              </p>
            </div>
          </div>
        </div>
      </section>

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

