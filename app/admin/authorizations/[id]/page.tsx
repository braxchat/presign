import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import { FileText, ExternalLink, Mail, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

async function getAuthorizationDetails(authId: string) {
  const { data: authorization, error } = await supabaseAdmin
    .from("signature_authorizations")
    .select(`
      id,
      typed_name,
      ip_address,
      user_agent,
      created_at,
      shipments:shipment_id (
        id,
        tracking_number,
        buyer_name,
        buyer_email,
        carrier,
        order_number,
        authorization_pdf_url,
        override_status,
        merchants:merchant_id (
          id,
          business_name,
          shop_domain,
          email
        )
      )
    `)
    .eq("id", authId)
    .single();

  if (error || !authorization) {
    return null;
  }

  return authorization;
}

export default async function AuthorizationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const authorization = await getAuthorizationDetails(id);

  if (!authorization) {
    notFound();
  }

  const shipment = Array.isArray(authorization.shipments)
    ? authorization.shipments[0]
    : authorization.shipments;
  const merchant = shipment?.merchants
    ? Array.isArray(shipment.merchants)
      ? shipment.merchants[0]
      : shipment.merchants
    : null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Check if merchant email was sent (this would need to be tracked separately)
  // For now, we'll check if PDF exists as a proxy
  const merchantEmailSent = !!shipment?.authorization_pdf_url;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/authorizations"
          className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
        >
          ← Back to Authorizations
        </Link>
        <h1 className="font-display text-3xl font-bold mb-2">Authorization Details</h1>
        <p className="text-muted-foreground">Complete authorization information</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Buyer Information */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Buyer Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Buyer Name</p>
              <p className="font-medium">{shipment?.buyer_name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Buyer Email</p>
              <p className="font-medium">{shipment?.buyer_email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
              <p className="font-mono font-medium">{shipment?.tracking_number || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Carrier</p>
              <p className="font-medium">{shipment?.carrier || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="font-medium">{shipment?.order_number || "—"}</p>
            </div>
          </div>
        </div>

        {/* Authorization Details */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Authorization Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Authorized By</p>
              <p className="font-medium">{authorization.typed_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">IP Address</p>
              <p className="font-mono text-sm">{authorization.ip_address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">User Agent</p>
              <p className="font-mono text-xs break-all">
                {authorization.user_agent || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Authorization Timestamp</p>
              <p className="font-medium">{formatDate(authorization.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Badge
                className={
                  shipment?.override_status === "completed"
                    ? "bg-green-100 text-green-800"
                    : shipment?.override_status === "requested"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }
              >
                {shipment?.override_status === "completed"
                  ? "Completed"
                  : shipment?.override_status === "requested"
                    ? "Requested"
                    : "None"}
              </Badge>
            </div>
          </div>
        </div>

        {/* PDF Information */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">PDF Authorization</h2>
          <div className="space-y-3">
            {shipment?.authorization_pdf_url ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">PDF Status</p>
                  <Badge className="bg-green-100 text-green-800">Generated</Badge>
                </div>
                <div>
                  <a
                    href={shipment.authorization_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    View PDF
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-1">PDF Status</p>
                <Badge className="bg-gray-100 text-gray-800">Not Generated</Badge>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Signature Preview</p>
              <div className="border border-border rounded-lg p-4 bg-muted/30">
                <p className="font-medium text-lg">{authorization.typed_name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Digital signature captured
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Merchant Information */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Merchant Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Business Name</p>
              <p className="font-medium">
                {merchant?.business_name || merchant?.shop_domain || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Merchant Email</p>
              <p className="font-medium">{merchant?.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Shop Domain</p>
              <p className="font-mono text-sm">{merchant?.shop_domain || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Merchant Email Sent</p>
              <div className="flex items-center gap-2">
                {merchantEmailSent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Sent</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-muted-foreground">Not Sent</span>
                  </>
                )}
              </div>
            </div>
            {merchant?.id && (
              <div>
                <Link
                  href={`/admin/merchants/${merchant.id}`}
                  className="text-sm text-accent hover:underline"
                >
                  View Merchant Details →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

