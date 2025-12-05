import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendRefundDeniedEmail } from "@/lib/email";

async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("admin_auth");
  return adminAuth?.value === "true";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason || reason.trim() === "") {
      return NextResponse.json(
        { error: "Refund denial reason is required" },
        { status: 400 }
      );
    }

    // Fetch shipment details
    const { data: shipment, error: shipmentError } = await supabaseAdmin
      .from("shipments")
      .select(`
        *,
        merchants:merchant_id (
          email,
          business_name
        )
      `)
      .eq("id", id)
      .single();

    if (shipmentError || !shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 }
      );
    }

    if (shipment.refund_status !== "requested") {
      return NextResponse.json(
        { error: "Refund is not in requested status" },
        { status: 400 }
      );
    }

    const merchant = Array.isArray(shipment.merchants)
      ? shipment.merchants[0]
      : shipment.merchants;

    // Update shipment: set refund_status to denied, store reason
    const { error: updateError } = await supabaseAdmin
      .from("shipments")
      .update({
        refund_status: "denied",
        refund_reason: reason,
        refund_updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating shipment:", updateError);
      return NextResponse.json(
        { error: "Failed to update shipment" },
        { status: 500 }
      );
    }

    // Send denial email to buyer
    try {
      await sendRefundDeniedEmail({
        buyerEmail: shipment.buyer_email,
        buyerName: shipment.buyer_name,
        trackingNumber: shipment.tracking_number,
        carrier: shipment.carrier,
        merchantName: merchant?.business_name || "Merchant",
        reason,
      });
    } catch (emailError) {
      console.error("Error sending refund denial email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error denying refund:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

