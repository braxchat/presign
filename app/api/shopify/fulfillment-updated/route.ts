import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import {
  verifyShopifyWebhook,
  ShopifyFulfillmentWebhook,
} from '@/lib/shopify-webhook';

/**
 * Map Shopify fulfillment status to our carrier status
 */
function mapFulfillmentStatus(
  shopifyStatus: string
): 'PreTransit' | 'InTransit' | 'OutForDelivery' | 'Delivered' | null {
  const status = shopifyStatus?.toLowerCase() || '';
  
  if (status === 'delivered' || status === 'success') {
    return 'Delivered';
  }
  if (status === 'out_for_delivery') {
    return 'OutForDelivery';
  }
  if (status === 'in_transit' || status === 'confirmed') {
    return 'InTransit';
  }
  if (status === 'pending' || status === 'open') {
    return 'PreTransit';
  }
  
  return null;
}

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

    console.log('Fulfillment updated webhook received:', {
      id: fulfillment.id,
      order_id: fulfillment.order_id,
      status: fulfillment.status,
      tracking_number: fulfillment.tracking_number,
      shop: shopDomain,
    });

    // Look up merchant by shop domain
    if (!shopDomain) {
      console.error('Missing shop domain header');
      return NextResponse.json({ ok: true });
    }

    const { data: merchant, error: merchantError } = await supabaseAdmin
      .from('merchants')
      .select('id')
      .eq('shop_domain', shopDomain)
      .single();

    if (merchantError || !merchant) {
      console.error('Merchant not found for shop:', shopDomain);
      return NextResponse.json({ ok: true });
    }

    // Find the shipment by tracking number
    const trackingNumber = fulfillment.tracking_number || fulfillment.tracking_numbers?.[0];
    
    if (!trackingNumber) {
      console.log('No tracking number in fulfillment update');
      return NextResponse.json({ ok: true });
    }

    const { data: shipment, error: shipmentError } = await supabaseAdmin
      .from('shipments')
      .select('*')
      .eq('merchant_id', merchant.id)
      .eq('tracking_number', trackingNumber)
      .single();

    if (shipmentError || !shipment) {
      console.log('Shipment not found for tracking:', trackingNumber);
      return NextResponse.json({ ok: true });
    }

    // Map the status
    const newStatus = mapFulfillmentStatus(fulfillment.status);
    
    if (!newStatus) {
      console.log('Unknown fulfillment status:', fulfillment.status);
      return NextResponse.json({ ok: true });
    }

    // Prepare update payload
    const updates: {
      carrier_status: typeof newStatus;
      override_status?: 'none' | 'requested' | 'completed';
      updated_at: string;
    } = {
      carrier_status: newStatus,
      updated_at: new Date().toISOString(),
    };

    // Lock override if OutForDelivery (prevent new override requests)
    // Only lock if override hasn't been completed
    if (newStatus === 'OutForDelivery' && shipment.override_status === 'none') {
      // The shipment is out for delivery - buyer can no longer request override
      // We keep override_status as 'none' but the UI should check carrier_status
      console.log('Shipment is out for delivery, override requests will be blocked');
    }

    // If delivered, also prevent overrides
    if (newStatus === 'Delivered' && shipment.override_status === 'none') {
      console.log('Shipment delivered, no override needed');
    }

    // Update the shipment
    const { error: updateError } = await supabaseAdmin
      .from('shipments')
      .update(updates)
      .eq('id', shipment.id);

    if (updateError) {
      console.error('Failed to update shipment:', updateError);
      return NextResponse.json({ ok: true });
    }

    console.log('Shipment updated:', {
      id: shipment.id,
      tracking: trackingNumber,
      oldStatus: shipment.carrier_status,
      newStatus,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Fulfillment updated webhook error:', error);
    return NextResponse.json({ ok: true });
  }
}
