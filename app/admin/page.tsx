import Link from "next/link";
import { DollarSign, Package2, TrendingUp, AlertCircle } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function getAdminStats() {
  const { data: refundRequests } = await supabaseAdmin
    .from("shipments")
    .select("id")
    .in("refund_status", ["requested"]);

  const { data: totalShipments } = await supabaseAdmin
    .from("shipments")
    .select("id");

  const { data: completedOverrides } = await supabaseAdmin
    .from("shipments")
    .select("id")
    .eq("override_status", "completed");

  return {
    refundRequests: refundRequests?.length || 0,
    totalShipments: totalShipments?.length || 0,
    completedOverrides: completedOverrides?.length || 0,
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage refunds, shipments, and system settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/refunds" className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-2xl font-bold">{stats.refundRequests}</span>
          </div>
          <h3 className="font-semibold mb-1">Pending Refund Requests</h3>
          <p className="text-sm text-muted-foreground">Requires review</p>
        </Link>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package2 className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold">{stats.totalShipments}</span>
          </div>
          <h3 className="font-semibold mb-1">Total Shipments</h3>
          <p className="text-sm text-muted-foreground">All time</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold">{stats.completedOverrides}</span>
          </div>
          <h3 className="font-semibold mb-1">Completed Overrides</h3>
          <p className="text-sm text-muted-foreground">Successful authorizations</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/refunds"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
          >
            <DollarSign className="h-4 w-4" />
            Review Refund Requests
          </Link>
          <Link
            href="/admin/shipments"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
          >
            <Package2 className="h-4 w-4" />
            View All Shipments
          </Link>
        </div>
      </div>
    </div>
  );
}

