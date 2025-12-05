import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

function getStatusBadge(status: string | null) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case "trialing":
      return <Badge className="bg-blue-100 text-blue-800">Trialing</Badge>;
    case "canceled":
      return <Badge className="bg-gray-100 text-gray-800">Canceled</Badge>;
    case "past_due":
      return <Badge className="bg-red-100 text-red-800">Past Due</Badge>;
    default:
      return <Badge variant="outline">Inactive</Badge>;
  }
}

function getBillingProviderBadge(provider: string | null) {
  switch (provider) {
    case "shopify":
      return <Badge className="bg-indigo-100 text-indigo-800">Shopify</Badge>;
    case "stripe":
      return <Badge className="bg-purple-100 text-purple-800">Stripe</Badge>;
    default:
      return <Badge variant="outline">Not Set</Badge>;
  }
}

export default async function MerchantsPage() {
  const { data: merchants, error } = await supabaseAdmin
    .from("merchants")
    .select(`
      id,
      business_name,
      email,
      shop_domain,
      billing_provider,
      plan_tier,
      status,
      trial_end,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching merchants:", error);
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading merchants</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Merchants</h1>
        <p className="text-muted-foreground">
          View and manage all merchant accounts
        </p>
      </div>

      {!merchants || merchants.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No merchants found</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Business Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Email</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Shop Domain</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Plan</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Billing</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {merchants.map((merchant: any) => (
                <tr key={merchant.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <span className="font-medium">{merchant.business_name || "—"}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">{merchant.email || "—"}</td>
                  <td className="px-6 py-4 text-sm">
                    {merchant.shop_domain ? (
                      <span className="font-mono text-xs">{merchant.shop_domain}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm capitalize">
                      {merchant.plan_tier || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getBillingProviderBadge(merchant.billing_provider)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(merchant.status)}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/merchants/${merchant.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

