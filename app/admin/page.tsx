import Link from "next/link";
import { Users, CreditCard, TrendingUp, FileText, CheckCircle2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function getAdminStats() {
  // Total merchants
  const { count: totalMerchants } = await supabaseAdmin
    .from("merchants")
    .select("id", { count: "exact", head: true });

  // Active subscriptions (status = 'active' or 'trialing' with valid trial_end)
  const now = new Date().toISOString();
  const { data: activeSubscriptions } = await supabaseAdmin
    .from("merchants")
    .select("id, status, trial_end")
    .in("status", ["active", "trialing"]);

  const activeCount = (activeSubscriptions || []).filter((m) => {
    if (m.status === "active") return true;
    if (m.status === "trialing" && m.trial_end) {
      return new Date(m.trial_end) > new Date(now);
    }
    return false;
  }).length;

  // Merchants in trial
  const { count: merchantsInTrial } = await supabaseAdmin
    .from("merchants")
    .select("id", { count: "exact", head: true })
    .eq("status", "trialing")
    .gt("trial_end", now);

  // Authorizations in past 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { count: authorizationsPast7Days } = await supabaseAdmin
    .from("signature_authorizations")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString());

  // PDF success rate (shipments with authorization_pdf_url / total completed authorizations)
  const { data: completedShipments } = await supabaseAdmin
    .from("shipments")
    .select("authorization_pdf_url")
    .eq("override_status", "completed");

  const totalCompleted = completedShipments?.length || 0;
  const withPdf = (completedShipments || []).filter(
    (s) => s.authorization_pdf_url
  ).length;
  const pdfSuccessRate =
    totalCompleted > 0 ? Math.round((withPdf / totalCompleted) * 100) : 0;

  return {
    totalMerchants: totalMerchants || 0,
    activeSubscriptions: activeCount,
    merchantsInTrial: merchantsInTrial || 0,
    authorizationsPast7Days: authorizationsPast7Days || 0,
    pdfSuccessRate,
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor merchants, subscriptions, and authorization activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold">{stats.totalMerchants}</span>
          </div>
          <h3 className="font-semibold mb-1">Total Merchants</h3>
          <p className="text-sm text-muted-foreground">All registered</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold">{stats.activeSubscriptions}</span>
          </div>
          <h3 className="font-semibold mb-1">Active Subscriptions</h3>
          <p className="text-sm text-muted-foreground">Active or trialing</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold">{stats.merchantsInTrial}</span>
          </div>
          <h3 className="font-semibold mb-1">In Trial</h3>
          <p className="text-sm text-muted-foreground">Trial period active</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold">{stats.authorizationsPast7Days}</span>
          </div>
          <h3 className="font-semibold mb-1">Authorizations (7d)</h3>
          <p className="text-sm text-muted-foreground">Past week</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-teal-600" />
            </div>
            <span className="text-2xl font-bold">{stats.pdfSuccessRate}%</span>
          </div>
          <h3 className="font-semibold mb-1">PDF Success Rate</h3>
          <p className="text-sm text-muted-foreground">PDFs generated</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/merchants"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
          >
            <Users className="h-4 w-4" />
            View All Merchants
          </Link>
          <Link
            href="/admin/authorizations"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
          >
            <FileText className="h-4 w-4" />
            View Authorizations
          </Link>
        </div>
      </div>
    </div>
  );
}
