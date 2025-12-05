import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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

export default async function RefundsPage() {
  const { data: shipments, error } = await supabaseAdmin
    .from("shipments")
    .select(`
      id,
      tracking_number,
      buyer_email,
      buyer_name,
      refund_status,
      refund_requested_at,
      merchants:merchant_id (
        business_name,
        shop_domain
      )
    `)
    .neq("refund_status", "none")
    .order("refund_requested_at", { ascending: false });

  if (error) {
    console.error("Error fetching refunds:", error);
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading refund requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Refund Requests</h1>
        <p className="text-muted-foreground">
          Review and process refund requests from buyers
        </p>
      </div>

      {!shipments || shipments.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No refund requests at this time</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Tracking #</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Buyer Email</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Merchant</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Requested At</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shipments.map((shipment: any) => {
                const merchant = Array.isArray(shipment.merchants) 
                  ? shipment.merchants[0] 
                  : shipment.merchants;
                const merchantName = merchant?.business_name || merchant?.shop_domain || "Unknown";

                return (
                  <tr key={shipment.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">{shipment.tracking_number}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">{shipment.buyer_email}</td>
                    <td className="px-6 py-4 text-sm">{merchantName}</td>
                    <td className="px-6 py-4">
                      {getRefundStatusBadge(shipment.refund_status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {shipment.refund_requested_at
                        ? new Date(shipment.refund_requested_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/refunds/${shipment.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
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

