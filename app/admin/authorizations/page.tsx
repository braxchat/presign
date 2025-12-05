import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, ExternalLink } from "lucide-react";

export default async function AuthorizationsPage() {
  const { data: authorizations, error } = await supabaseAdmin
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
        authorization_pdf_url,
        merchants:merchant_id (
          business_name,
          shop_domain
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching authorizations:", error);
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading authorizations</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Authorizations</h1>
        <p className="text-muted-foreground">
          View all buyer delivery authorizations
        </p>
      </div>

      {!authorizations || authorizations.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No authorizations found</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Buyer</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Tracking</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Merchant</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Authorized By</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">PDF</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {authorizations.map((auth: any) => {
                const shipment = Array.isArray(auth.shipments)
                  ? auth.shipments[0]
                  : auth.shipments;
                const merchant = shipment?.merchants
                  ? Array.isArray(shipment.merchants)
                    ? shipment.merchants[0]
                    : shipment.merchants
                  : null;
                const merchantName =
                  merchant?.business_name || merchant?.shop_domain || "Unknown";

                return (
                  <tr key={auth.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-sm">{shipment?.buyer_name || "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {shipment?.buyer_email || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-mono text-sm font-medium">
                          {shipment?.tracking_number || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {shipment?.carrier || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{merchantName}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-sm">{auth.typed_name}</p>
                        <p className="text-xs text-muted-foreground">IP: {auth.ip_address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(auth.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      {shipment?.authorization_pdf_url ? (
                        <a
                          href={shipment.authorization_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                        >
                          <FileText className="h-3 w-3" />
                          View
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">No PDF</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/authorizations/${auth.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

