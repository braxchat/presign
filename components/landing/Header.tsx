"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package, Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle anchor link clicks
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-accent" />
            <span className="font-display font-bold text-xl">PreSign</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="#features" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => handleAnchorClick(e, '#features')}
            >
              Features
            </Link>
            <Link 
              href="#pricing" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => handleAnchorClick(e, '#pricing')}
            >
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Button asChild variant="accent" size="default">
              <a href="https://apps.shopify.com/presign" target="_blank" rel="noopener noreferrer">
                Install on Shopify
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3 animate-in slide-in-from-top-2">
            <Link
              href="#features"
              className="block px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => handleAnchorClick(e, '#features')}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => handleAnchorClick(e, '#pricing')}
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="block px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <div className="px-2 pt-2">
              <Button asChild variant="accent" className="w-full" size="default">
                <a href="https://apps.shopify.com/presign" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                  Install on Shopify
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

