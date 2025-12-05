import Link from "next/link";
import { Package, Mail, CheckCircle2, FileText, ArrowLeft } from "lucide-react";
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
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Step 3</h3>
                <p className="text-muted-foreground">
                  Buyer authorizes delivery and signs the waiver
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Step 4</h3>
                <p className="text-muted-foreground">
                  Merchant receives PDF waiver and step-by-step instructions to update UPS/FedEx delivery instructions
                </p>
              </div>
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

