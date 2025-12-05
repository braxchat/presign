import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

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

async function getMerchantDetails(merchantId: string) {
  const { data: merchant, error } = await supabaseAdmin
    .from("merchants")
    .select("*")
    .eq("id", merchantId)
    .single();

  if (error || !merchant) {
    return null;
  }

  // Get shipments for this merchant first
  const { data: merchantShipments } = await supabaseAdmin
    .from("shipments")
    .select("id")
    .eq("merchant_id", merchantId);

  const shipmentIds = merchantShipments?.map((s) => s.id) || [];

  // Get authorization count
  const { count: authorizationCount } = await supabaseAdmin
    .from("signature_authorizations")
    .select("id", { count: "exact", head: true })
    .in("shipment_id", shipmentIds);

  // Get last 10 authorizations with shipment details
  const { data: recentAuthorizations } = await supabaseAdmin
    .from("signature_authorizations")
    .select(`
      id,
      typed_name,
      ip_address,
      created_at,
      shipments:shipment_id (
        id,
        tracking_number,
        buyer_name,
        buyer_email,
        authorization_pdf_url,
        carrier
      )
    `)
    .in("shipment_id", shipmentIds)
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    merchant,
    authorizationCount: authorizationCount || 0,
    recentAuthorizations: recentAuthorizations || [],
  };
}

export default async function MerchantDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getMerchantDetails(id);

  if (!data) {
    notFound();
  }

  const { merchant, authorizationCount, recentAuthorizations } = data;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/merchants"
          className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
        >
          ← Back to Merchants
        </Link>
        <h1 className="font-display text-3xl font-bold mb-2">
          {merchant.business_name || merchant.shop_domain || "Merchant Details"}
        </h1>
        <p className="text-muted-foreground">Merchant account information and activity</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Merchant Information */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Merchant Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Business Name</p>
              <p className="font-medium">{merchant.business_name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{merchant.email || merchant.contact_email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Shop Domain</p>
              <p className="font-medium font-mono text-sm">
                {merchant.shop_domain || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created At</p>
              <p className="font-medium">{formatDate(merchant.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Subscription Information */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Subscription Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Plan Tier</p>
              <p className="font-medium capitalize">
                {merchant.plan_tier || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Billing Provider</p>
              {getBillingProviderBadge(merchant.billing_provider)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              {getStatusBadge(merchant.status)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Trial End</p>
              <p className="font-medium">{formatDate(merchant.trial_end)}</p>
            </div>
            {merchant.stripe_customer_id && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Stripe Customer ID</p>
                <p className="font-mono text-xs break-all">{merchant.stripe_customer_id}</p>
              </div>
            )}
            {merchant.stripe_subscription_id && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Stripe Subscription ID</p>
                <p className="font-mono text-xs break-all">{merchant.stripe_subscription_id}</p>
              </div>
            )}
            {merchant.shopify_subscription_id && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Shopify Subscription ID</p>
                <p className="font-mono text-xs break-all">{merchant.shopify_subscription_id}</p>
              </div>
            )}
            {merchant.shopify_plan_name && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Shopify Plan Name</p>
                <p className="font-medium">{merchant.shopify_plan_name}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Authorization Statistics */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">Authorization Statistics</h2>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Authorizations</p>
            <p className="text-2xl font-bold">{authorizationCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Authorizations */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">Last 10 Authorizations</h2>
        {recentAuthorizations.length === 0 ? (
          <p className="text-muted-foreground">No authorizations yet</p>
        ) : (
          <div className="space-y-3">
            {recentAuthorizations.map((auth: any) => {
              const shipment = Array.isArray(auth.shipments)
                ? auth.shipments[0]
                : auth.shipments;
              return (
                <div
                  key={auth.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Buyer</p>
                          <p className="font-medium">{shipment?.buyer_name || "—"}</p>
                          <p className="text-xs text-muted-foreground">
                            {shipment?.buyer_email || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tracking</p>
                          <p className="font-mono text-sm font-medium">
                            {shipment?.tracking_number || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {shipment?.carrier || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Authorized By</p>
                          <p className="font-medium">{auth.typed_name}</p>
                          <p className="text-xs text-muted-foreground">
                            IP: {auth.ip_address}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="text-sm">{formatDate(auth.created_at)}</p>
                        </div>
                      </div>
                    </div>
                    {shipment?.authorization_pdf_url && (
                      <a
                        href={shipment.authorization_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 inline-flex items-center gap-2 text-sm text-accent hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        View PDF
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

