import Link from "next/link";
import { Package2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <Package2 className="h-12 w-12 text-accent" />
            <span className="font-display font-bold text-3xl text-primary-foreground">PreSign</span>
          </Link>
          <h1 className="font-display text-4xl font-bold text-primary-foreground mb-4">
            Remote Signature Release
            <br />
            <span className="text-accent">Made Simple</span>
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-md">
            Streamline your FFL shipments with automated signature release management. 
            Increase delivery success rates and earn more per shipment.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-accent">98%</p>
              <p className="text-sm text-primary-foreground/60">Delivery Rate</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-accent">$1.00</p>
              <p className="text-sm text-primary-foreground/60">Per Override</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-accent">24hr</p>
              <p className="text-sm text-primary-foreground/60">Processing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-16">
        <Link href="/" className="lg:hidden flex items-center gap-3 mb-12">
          <Package2 className="h-8 w-8 text-accent" />
          <span className="font-display font-bold text-xl text-foreground">PreSign</span>
        </Link>
        <div className="max-w-md w-full mx-auto lg:mx-0">
          {children}
        </div>
      </div>
    </div>
  );
}

