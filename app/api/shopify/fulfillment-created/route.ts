import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  verifyShopifyWebhook,
  detectCarrier,
  generateBuyerToken,
  requiresSignature,
  ShopifyFulfillmentWebhook,
} from '@/lib/shopify-webhook';

export async function POST(request: NextRequest) {
  try {
    // Get raw body for HMAC verification
    const rawBody = await request.text();
    const hmacHeader = request.headers.get('X-Shopify-Hmac-SHA256');
    const shopDomain = request.headers.get('X-Shopify-Shop-Domain');

    // Verify webhook signature
    if (!verifyShopifyWebhook(rawBody, hmacHeader)) {
      console.error('Invalid Shopify webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the fulfillment payload
    const fulfillment: ShopifyFulfillmentWebhook = JSON.parse(rawBody);

    console.log('Fulfillment created webhook received:', {
      id: fulfillment.id,
      order_id: fulfillment.order_id,
      tracking_number: fulfillment.tracking_number,
      shop: shopDomain,
    });

    // Look up merchant by shop domain
    if (!shopDomain) {
      console.error('Missing shop domain header');
      return NextResponse.json({ ok: true }); // Acknowledge but skip
    }

    const { data: merchant, error: merchantError } = await supabaseAdmin
      .from('merchants')
      .select('*')
      .eq('shop_domain', shopDomain)
      .single();

    if (merchantError || !merchant) {
      console.error('Merchant not found for shop:', shopDomain, merchantError);
      return NextResponse.json({ ok: true }); // Acknowledge but skip
    }

    // Extract tracking info
    const trackingNumber = fulfillment.tracking_number || fulfillment.tracking_numbers?.[0];
    
    if (!trackingNumber) {
      console.log('No tracking number in fulfillment, skipping');
      return NextResponse.json({ ok: true });
    }

    // Extract buyer info from destination
    const destination = fulfillment.destination;
    const buyerName = destination
      ? `${destination.first_name} ${destination.last_name}`.trim()
      : 'Unknown';
    const buyerEmail = destination?.email || '';

    if (!buyerEmail) {
      console.log('No buyer email in fulfillment, skipping');
      return NextResponse.json({ ok: true });
    }

    // Calculate total value from line items
    const totalValueCents = fulfillment.line_items.reduce((sum, item) => {
      return sum + Math.round(parseFloat(item.price) * 100 * item.quantity);
    }, 0);

    // Detect carrier
    const carrier = detectCarrier(
      fulfillment.tracking_company || '',
      trackingNumber
    );

    // Determine if signature is required
    const needsSignature = requiresSignature(totalValueCents);

    // Generate buyer status token
    const buyerToken = generateBuyerToken();

    // Check if shipment already exists (by tracking number and merchant)
    const { data: existingShipment } = await supabaseAdmin
      .from('shipments')
      .select('id')
      .eq('merchant_id', merchant.id)
      .eq('tracking_number', trackingNumber)
      .single();

    if (existingShipment) {
      console.log('Shipment already exists for tracking:', trackingNumber);
      return NextResponse.json({ ok: true });
    }

    // Create the shipment
    const { data: shipment, error: shipmentError } = await supabaseAdmin
      .from('shipments')
      .insert({
        merchant_id: merchant.id,
        tracking_number: trackingNumber,
        carrier,
        order_number: fulfillment.order_id?.toString() || null,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        item_value_cents: totalValueCents,
        requires_signature: needsSignature,
        carrier_status: 'PreTransit',
        override_status: 'none',
        override_token: buyerToken,
      })
      .select()
      .single();

    if (shipmentError) {
      console.error('Failed to create shipment:', shipmentError);
      return NextResponse.json({ ok: true }); // Acknowledge to prevent retries
    }

    console.log('Shipment created:', {
      id: shipment.id,
      tracking: trackingNumber,
      buyer: buyerEmail,
      requiresSignature: needsSignature,
    });

    // TODO: Trigger buyer email with status page link
    // The buyer can access their status at: /status/{buyerToken}
    // This would typically call an email service like Resend
    // 
    // Example:
    // await sendBuyerEmail({
    //   to: buyerEmail,
    //   buyerName,
    //   trackingNumber,
    //   statusUrl: `${process.env.APP_BASE_URL}/status/${buyerToken}`,
    //   merchantName: merchant.business_name,
    // });

    return NextResponse.json({ ok: true, shipmentId: shipment.id });
  } catch (error) {
    console.error('Fulfillment created webhook error:', error);
    // Return 200 to acknowledge receipt and prevent retries
    return NextResponse.json({ ok: true });
  }
}
