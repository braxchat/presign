import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendRefundRequestReceivedEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tracking_number, buyer_email, refund_reason, slip_image_url } = body;

    // Validate required fields
    if (!tracking_number || !buyer_email || !refund_reason) {
      return NextResponse.json(
        { error: "Missing required fields: tracking_number, buyer_email, refund_reason" },
        { status: 400 }
      );
    }

    // Look up shipment by tracking_number + buyer_email
    const { data: shipment, error: shipmentError } = await supabaseAdmin
      .from("shipments")
      .select(`
        id,
        tracking_number,
        buyer_email,
        buyer_name,
        carrier,
        order_number,
        refund_status,
        merchant_id,
        merchants:merchant_id (
          id,
          business_name,
          shop_domain,
          email
        )
      `)
      .eq("tracking_number", tracking_number)
      .eq("buyer_email", buyer_email)
      .single();

    if (shipmentError || !shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 }
      );
    }

    // Check if refund already requested
    if (shipment.refund_status !== "none") {
      return NextResponse.json(
        { error: "Refund already requested or processed" },
        { status: 400 }
      );
    }

    // Update shipment with refund request
    const now = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin
      .from("shipments")
      .update({
        refund_status: "requested",
        refund_reason: refund_reason,
        refund_requested_at: now,
        refund_updated_at: now,
      })
      .eq("id", shipment.id);

    if (updateError) {
      console.error("Error updating shipment with refund request:", updateError);
      return NextResponse.json(
        { error: "Failed to process refund request" },
        { status: 500 }
      );
    }

    // Send email to admin
    const merchant = Array.isArray(shipment.merchants)
      ? shipment.merchants[0]
      : shipment.merchants;

    const adminEmail = process.env.ADMIN_EMAIL || process.env.FROM_EMAIL || "admin@presign.app";

    try {
      await sendRefundRequestReceivedEmail({
        adminEmail,
        trackingNumber: shipment.tracking_number,
        buyerEmail: shipment.buyer_email,
        buyerName: shipment.buyer_name,
        merchantName: merchant?.business_name || null,
        merchantShopDomain: merchant?.shop_domain || null,
        carrier: shipment.carrier,
        orderId: shipment.order_number,
        shipmentId: shipment.id,
      });
    } catch (emailError) {
      console.error("Error sending refund request email to admin:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error processing refund request:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

