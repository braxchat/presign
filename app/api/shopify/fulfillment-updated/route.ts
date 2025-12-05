export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { supabaseService } from "@/lib/supabase";

import { sendCutoffLockedEmail } from "@/lib/email";



function normalizeStatus(raw: string | null): "PreTransit" | "InTransit" | "OutForDelivery" | "Delivered" {

  if (!raw) return "InTransit";

  const s = raw.toLowerCase();

  if (s.includes("out_for_delivery") || s.includes("out for delivery")) return "OutForDelivery";

  if (s.includes("delivered")) return "Delivered";

  if (s.includes("in_transit") || s.includes("in transit")) return "InTransit";

  return "InTransit";

}



export async function POST(req: Request) {

  try {

    const shopDomain = req.headers.get("x-shopify-shop-domain");

    if (!shopDomain) {

      return NextResponse.json({ ok: true });

    }



    const body = await req.json();

    const fulfillment = body?.fulfillment ?? body;



    const fulfillmentId = (fulfillment.id || fulfillment.fulfillment_id)?.toString();

    if (!fulfillmentId) {

      return NextResponse.json({ ok: true });

    }



    const rawStatus =

      fulfillment.shipment_status ||

      fulfillment.delivery_status ||

      fulfillment.tracking_info?.status ||

      body?.shipment_status ||

      null;



    const newStatus = normalizeStatus(rawStatus);

    const isOutForDelivery = newStatus === "OutForDelivery";

    const isDelivered = newStatus === "Delivered";



    const { data: merchant } = await supabaseService

      .from("merchants")

      .select("id, shop_domain, business_name")

      .eq("shop_domain", shopDomain)

      .maybeSingle();



    if (!merchant) return NextResponse.json({ ok: true });



    const { data: shipment } = await supabaseService

      .from("shipments")

      .select(`

        id,

        buyer_email,

        buyer_name,

        tracking_number,

        carrier,

        override_token,

        requires_signature,

        override_status,

        override_locked

      `)

      .eq("merchant_id", merchant.id)

      .eq("shopify_fulfillment_id", fulfillmentId)

      .maybeSingle();



    if (!shipment) return NextResponse.json({ ok: true });



    await supabaseService

      .from("shipments")

      .update({

        carrier_status: newStatus,

        override_locked: isOutForDelivery || isDelivered ? true : shipment.override_locked,

        updated_at: new Date().toISOString(),

      })

      .eq("id", shipment.id);



    if (

      isOutForDelivery &&

      shipment.requires_signature &&

      shipment.override_status === "none" &&

      shipment.buyer_email

    ) {

      await sendCutoffLockedEmail({

        buyerEmail: shipment.buyer_email,

        buyerName: shipment.buyer_name,

        trackingNumber: shipment.tracking_number,

        carrier: shipment.carrier,

        merchantName: merchant.business_name || merchant.shop_domain || shopDomain,

        buyerToken: shipment.override_token || '',

      });

    }



    return NextResponse.json({ ok: true });

  } catch (err) {

    console.error("[fulfillment-updated] Exception:", err);

    return NextResponse.json({ ok: true });

  }

}
