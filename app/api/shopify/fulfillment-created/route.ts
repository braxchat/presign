export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// app/api/shopify/fulfillment-created/route.ts

import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

import crypto from "crypto";

import { sendShipmentNotificationEmail } from "@/lib/email";



export async function POST(req: NextRequest) {

  try {

    const shopDomain = req.headers.get("x-shopify-shop-domain");

    if (!shopDomain) {

      console.warn("Missing shop domain header");

      return NextResponse.json({ ok: true });

    }



    const fulfillmentPayload = await req.json();



    // 1. Lookup merchant

    const { data: merchant, error: merchantErr } = await supabaseAdmin

      .from("merchants")

      .select("*")

      .eq("shop_domain", shopDomain)

      .single();



    if (merchantErr || !merchant) {

      console.warn("Merchant not found for shop domain:", shopDomain);

      return NextResponse.json({ ok: true });

    }



    // 2. Pull fields from Shopify payload

    const fulfillment = fulfillmentPayload.fulfillment || fulfillmentPayload;



    const orderId = String(fulfillment.order_id || "");

    const fulfillmentId = String(fulfillment.id || "");

    const trackingNumber =

      fulfillment.tracking_info?.number ||

      fulfillment.tracking_number ||

      "";

    const carrierName =

      fulfillment.tracking_info?.company ||

      fulfillment.tracking_company ||

      "Unknown";

    // Map carrier name to enum

    const carrier = carrierName.toLowerCase().includes('ups') ? 'UPS' : 

                    carrierName.toLowerCase().includes('fedex') || carrierName.toLowerCase().includes('fed ex') ? 'FedEx' : 

                    'UPS'; // Default to UPS



    // Buyer details

    const shippingAddress = fulfillmentPayload.shipping_address || {};

    const buyerName =

      shippingAddress.name ||

      shippingAddress.first_name + " " + shippingAddress.last_name ||

      "Customer";



    const buyerEmail =

      fulfillmentPayload.email ||

      fulfillmentPayload.order?.email ||

      "";



    // Calculate item total

    let totalCents = 0;

    const lineItems = fulfillmentPayload.line_items || [];

    for (const item of lineItems) {

      const price = Number(item.price || 0);

      const quantity = Number(item.quantity || 1);

      totalCents += Math.round(price * 100 * quantity);

    }



    const requiresSignature = totalCents >= 50000; // $500 threshold



    // 3. IMPORTANT — generate buyer_status_token

    const buyerStatusToken = crypto.randomUUID();



    // 4. Insert shipment

    const { error: insertErr } = await supabaseAdmin.from("shipments").insert({

      merchant_id: merchant.id,

      order_number: orderId,

      tracking_number: trackingNumber,

      carrier,

      buyer_email: buyerEmail,

      buyer_name: buyerName,

      item_value_cents: totalCents,

      requires_signature: requiresSignature,

      buyer_status_token: buyerStatusToken,

      carrier_status: "PreTransit",

      override_locked: false,

      override_status: "none",

    });



    if (insertErr) {

      console.error("Failed inserting shipment:", insertErr);

      return NextResponse.json({ ok: true });

    }



    // 5. Send email if signature required

    if (requiresSignature && buyerEmail) {

      const statusUrl = `${process.env.APP_BASE_URL}/status/${buyerStatusToken}`;



      await sendShipmentNotificationEmail({

        buyerEmail,

        buyerName,

        trackingNumber,

        carrier,

        merchantName: merchant.business_name || merchant.shop_domain || shopDomain,

        buyerToken: buyerStatusToken,

        requiresSignature,

      });

    }



    return NextResponse.json({ ok: true });

  } catch (err) {

    console.error("Error in fulfillment-created webhook:", err);

    return NextResponse.json({ ok: true });

  }

}
