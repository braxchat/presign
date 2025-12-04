"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Package2,
  Plus,
  DollarSign,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/merchant/dashboard" },
  { icon: Package, label: "Shipments", path: "/merchant/shipments" },
  { icon: Plus, label: "Add Shipment", path: "/merchant/shipments/new" },
  { icon: DollarSign, label: "Payouts", path: "/merchant/payouts" },
  { icon: Settings, label: "Settings", path: "/merchant/settings" },
];

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Package2 className="h-6 w-6 text-sidebar-primary" />
          <span className="font-display font-bold text-sidebar-foreground">PreSign</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
            <Package2 className="h-7 w-7 text-sidebar-primary" />
            <span className="font-display font-bold text-lg text-sidebar-foreground">PreSign</span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-semibold text-sidebar-foreground">AR</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Acme Range</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">merchant@acme.com</p>
              </div>
            </div>
            <Link
              href="/login"
              className="mt-2 flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

