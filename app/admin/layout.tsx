import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, DollarSign, Package2, Settings } from "lucide-react";

async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("admin_auth");
  return adminAuth?.value === "true";
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-6 w-6 text-accent" />
              <h1 className="font-display font-bold text-2xl">PreSign Admin</h1>
            </div>
            <form action="/api/admin/login" method="POST" className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Admin Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter admin password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent text-white py-2 px-4 rounded-md font-medium hover:bg-accent/90 transition-colors"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-accent" />
              <span className="font-display font-bold text-xl">PreSign Admin</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/admin/refunds"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <DollarSign className="h-4 w-4" />
                Refunds
              </Link>
              <Link
                href="/admin/shipments"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Package2 className="h-4 w-4" />
                Shipments
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <form action="/api/admin/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

