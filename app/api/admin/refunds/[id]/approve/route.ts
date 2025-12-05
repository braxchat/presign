export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { stripe } from "@/lib/stripe";
import { sendRefundApprovedEmail } from "@/lib/email";

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

    // Process Stripe refund
    let refundId: string | null = null;
    if (shipment.stripe_checkout_session_id) {
      try {
        // Get the payment intent from the checkout session
        const session = await stripe.checkout.sessions.retrieve(
          shipment.stripe_checkout_session_id
        );

        if (session.payment_intent && typeof session.payment_intent === "string") {
          // Create refund for the full amount ($2.99 = 299 cents)
          const refund = await stripe.refunds.create({
            payment_intent: session.payment_intent,
            amount: 299, // Full refund of $2.99
          });
          refundId = refund.id;
        }
      } catch (stripeError: any) {
        console.error("Stripe refund error:", stripeError);
        // Continue with refund approval even if Stripe refund fails
        // Admin can process manually if needed
      }
    }

    // Update shipment: set refund_status to approved, set merchant_earnings_cents to 0
    const { error: updateError } = await supabaseAdmin
      .from("shipments")
      .update({
        refund_status: "approved",
        merchant_earnings_cents: 0,
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

    // Send confirmation emails
    try {
      await sendRefundApprovedEmail({
        buyerEmail: shipment.buyer_email,
        buyerName: shipment.buyer_name,
        trackingNumber: shipment.tracking_number,
        carrier: shipment.carrier,
        merchantName: merchant?.business_name || "Merchant",
        refundId,
      });
    } catch (emailError) {
      console.error("Error sending refund approval email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, refundId });
  } catch (error: any) {
    console.error("Error approving refund:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

