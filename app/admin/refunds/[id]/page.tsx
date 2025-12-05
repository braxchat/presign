import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Badge } from "@/components/ui/badge";
import { RefundActions } from "./refund-actions";

async function getRefundDetails(shipmentId: string) {
  const { data: shipment, error } = await supabaseAdmin
    .from("shipments")
    .select(`
      id,
      tracking_number,
      buyer_email,
      buyer_name,
      carrier,
      order_number,
      refund_status,
      refund_reason,
      refund_requested_at,
      refund_updated_at,
      stripe_checkout_session_id,
      merchant_earnings_cents,
      signature_authorizations (
        typed_name,
        ip_address,
        created_at
      ),
      merchants:merchant_id (
        id,
        business_name,
        shop_domain,
        email
      )
    `)
    .eq("id", shipmentId)
    .single();

  if (error || !shipment) {
    return null;
  }

  return shipment;
}

export default async function RefundDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shipment = await getRefundDetails(id);

  if (!shipment) {
    notFound();
  }

  const merchant = Array.isArray(shipment.merchants)
    ? shipment.merchants[0]
    : shipment.merchants;
  const auth = Array.isArray(shipment.signature_authorizations)
    ? shipment.signature_authorizations[0]
    : shipment.signature_authorizations;

  function getRefundStatusBadge(status: string) {
    switch (status) {
      case "requested":
        return <Badge className="bg-amber-100 text-amber-800">Requested</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "denied":
        return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Refund Request Details</h1>
        <p className="text-muted-foreground">Review and process this refund request</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipment Details */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Shipment Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
              <p className="font-mono font-medium">{shipment.tracking_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Carrier</p>
              <p className="font-medium">{shipment.carrier}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="font-medium">{shipment.order_number || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Refund Status</p>
              {getRefundStatusBadge(shipment.refund_status)}
            </div>
          </div>
        </div>

        {/* Buyer Information */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Buyer Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Buyer Name</p>
              <p className="font-medium">{shipment.buyer_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Buyer Email</p>
              <p className="font-medium">{shipment.buyer_email}</p>
            </div>
            {auth && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Authorized By</p>
                <p className="font-medium">{auth.typed_name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  IP: {auth.ip_address} • {new Date(auth.created_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Merchant Information */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Merchant Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Business Name</p>
              <p className="font-medium">{merchant?.business_name || merchant?.shop_domain || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Merchant Email</p>
              <p className="font-medium">{merchant?.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Shop Domain</p>
              <p className="font-medium">{merchant?.shop_domain || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Merchant Earnings</p>
              <p className="font-medium">
                ${((shipment.merchant_earnings_cents || 0) / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Refund Request Details */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Refund Request</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Requested At</p>
              <p className="font-medium">
                {shipment.refund_requested_at
                  ? new Date(shipment.refund_requested_at).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Refund Reason</p>
              <p className="font-medium whitespace-pre-wrap">
                {shipment.refund_reason || "No reason provided"}
              </p>
            </div>
            {shipment.refund_updated_at && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="font-medium">
                  {new Date(shipment.refund_updated_at).toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Stripe Checkout Session</p>
              <p className="font-mono text-xs break-all">
                {shipment.stripe_checkout_session_id || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {shipment.refund_status === "requested" && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4">Process Refund</h2>
          <RefundActions shipmentId={shipment.id} />
        </div>
      )}
    </div>
  );
}

