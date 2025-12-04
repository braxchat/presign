import { randomUUID } from 'crypto';
import { getUpsSignatureStatus } from "./ups";
import { getFedexSignatureStatus } from "./fedex";
import { detectSignatureRequirement } from "./signature";
import { sendShipmentNotificationEmail } from "./email";
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase/types';

const SIGNATURE_THRESHOLD_CENTS = 50000;

export async function createShipmentFromFulfillment({
  supabase,
  merchantId,
  merchantRecord,
  shopDomain,
  fulfillmentPayload,
}: {
  supabase: SupabaseClient<Database>;
  merchantId: string;
  merchantRecord: Database['public']['Tables']['merchants']['Row'];
  shopDomain: string;
  fulfillmentPayload: any;
}) {
  try {
    const orderId = fulfillmentPayload.order_id;
    const fulfillmentId = fulfillmentPayload.id;
    const trackingNumber = fulfillmentPayload?.tracking_info?.number || fulfillmentPayload?.tracking_number;
    const carrierName = fulfillmentPayload?.tracking_info?.company || fulfillmentPayload?.tracking_company || "Unknown";
    
    // Map carrier name to our enum
    const carrier = carrierName.toLowerCase().includes('ups') ? 'UPS' : 
                    carrierName.toLowerCase().includes('fedex') || carrierName.toLowerCase().includes('fed ex') ? 'FedEx' : 
                    'UPS'; // Default to UPS

    const buyerName =
      fulfillmentPayload?.destination?.name ||
      fulfillmentPayload?.shipping_address?.name ||
      `${fulfillmentPayload?.destination?.first_name || ''} ${fulfillmentPayload?.destination?.last_name || ''}`.trim() ||
      "Customer";

    const buyerEmail =
      fulfillmentPayload?.email ||
      fulfillmentPayload?.shipping_address?.email ||
      fulfillmentPayload?.destination?.email ||
      null;

    const lineItems = fulfillmentPayload?.line_items || [];
    const itemValueCents = lineItems.reduce((sum: number, li: any) => {
      const price = Number(li.price || 0);
      const qty = li.quantity || 1;
      return sum + Math.round(price * qty * 100);
    }, 0);

    // 1. UPS lookup
    let upsCode = null;
    if (merchantRecord.ups_api_key && merchantRecord.ups_username && merchantRecord.ups_password && trackingNumber) {
      try {
        upsCode = await getUpsSignatureStatus({
          trackingNumber,
          apiKey: merchantRecord.ups_api_key,
          username: merchantRecord.ups_username,
          password: merchantRecord.ups_password,
        });
      } catch (err) {
        console.error('UPS lookup error:', err);
      }
    }

    // 2. FedEx lookup
    let fedexSignature = null;
    if (merchantRecord.fedex_api_key && merchantRecord.fedex_secret_key && merchantRecord.fedex_meter_number && merchantRecord.fedex_account_number && trackingNumber) {
      try {
        fedexSignature = await getFedexSignatureStatus({
          trackingNumber,
          apiKey: merchantRecord.fedex_api_key,
          secretKey: merchantRecord.fedex_secret_key,
          meterNumber: merchantRecord.fedex_meter_number,
          accountNumber: merchantRecord.fedex_account_number,
        });
      } catch (err) {
        console.error('FedEx lookup error:', err);
      }
    }

    // 3. Shopify shipping rates
    const shippingLines = fulfillmentPayload?.shipping_lines || [];

    // 4. Determine signature requirement
    const signatureRequirement = detectSignatureRequirement({
      upsCode,
      fedexSignature,
      shippingLines,
      itemValueCents,
    });

    const requiresSignature = signatureRequirement !== "NONE";

    // 5. Generate buyer token
    const buyerStatusToken = randomUUID();

    // 6. Insert shipment
    const { error } = await supabase.from("shipments").insert({
      merchant_id: merchantId,
      order_number: orderId?.toString() || null,
      tracking_number: trackingNumber,
      carrier,
      buyer_email: buyerEmail || 'unknown@example.com', // Required field, use placeholder if missing
      buyer_name: buyerName,
      item_value_cents: itemValueCents,
      requires_signature: requiresSignature,
      override_token: buyerStatusToken,
      carrier_status: "PreTransit",
      override_locked: false,
      override_status: "none",
    });

    if (error) throw error;

    // 7. Send email ONLY if signature required
    if (requiresSignature && buyerEmail) {
      await sendShipmentNotificationEmail({
        buyerEmail,
        buyerName,
        trackingNumber,
        carrier,
        merchantName: merchantRecord.business_name || shopDomain,
        buyerToken: buyerStatusToken,
        requiresSignature,
      });
    }
  } catch (err) {
    console.error("Error creating shipment:", err);
    throw err; // Re-throw to allow caller to handle
  }
}

