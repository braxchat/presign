import crypto from 'crypto';

/**
 * Verify Shopify webhook HMAC signature
 */
export function verifyShopifyWebhook(
  rawBody: string,
  hmacHeader: string | null
): boolean {
  if (!hmacHeader) {
    return false;
  }

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error('SHOPIFY_API_SECRET not configured');
    return false;
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(hmacHeader)
  );
}

/**
 * Detect carrier from tracking number or company name
 */
export function detectCarrier(trackingCompany: string, trackingNumber: string): 'UPS' | 'FedEx' {
  const company = trackingCompany?.toLowerCase() || '';
  
  if (company.includes('ups')) {
    return 'UPS';
  }
  if (company.includes('fedex') || company.includes('fed ex')) {
    return 'FedEx';
  }
  
  // Detect by tracking number pattern
  if (trackingNumber) {
    // UPS tracking numbers typically start with 1Z
    if (trackingNumber.startsWith('1Z')) {
      return 'UPS';
    }
    // FedEx tracking numbers are typically 12-22 digits
    if (/^\d{12,22}$/.test(trackingNumber)) {
      return 'FedEx';
    }
  }
  
  // Default to UPS
  return 'UPS';
}

/**
 * Generate a unique token for buyer status page
 */
export function generateBuyerToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Determine if shipment requires signature based on value and preferences
 */
export function requiresSignature(
  totalPriceCents: number,
  merchantPreference?: boolean
): boolean {
  // If merchant has explicit preference, use it
  if (merchantPreference !== undefined) {
    return merchantPreference;
  }
  
  // Default: require signature for orders >= $500
  const SIGNATURE_THRESHOLD_CENTS = 50000; // $500.00
  return totalPriceCents >= SIGNATURE_THRESHOLD_CENTS;
}

// Shopify fulfillment webhook payload types
export interface ShopifyFulfillmentWebhook {
  id: number;
  order_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  tracking_company: string | null;
  tracking_number: string | null;
  tracking_numbers: string[];
  tracking_url: string | null;
  tracking_urls: string[];
  destination: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    country: string;
    zip: string;
  } | null;
  line_items: Array<{
    id: number;
    variant_id: number;
    title: string;
    quantity: number;
    price: string;
    sku: string;
    variant_title: string;
    vendor: string;
    fulfillment_service: string;
    product_id: number;
    requires_shipping: boolean;
    taxable: boolean;
    gift_card: boolean;
    name: string;
    variant_inventory_management: string;
    properties: any[];
    product_exists: boolean;
    fulfillable_quantity: number;
    grams: number;
    total_discount: string;
    fulfillment_status: string | null;
  }>;
  name: string;
  admin_graphql_api_id: string;
}

export interface ShopifyOrderWebhookMeta {
  'X-Shopify-Shop-Domain': string;
  'X-Shopify-Order-Id': string;
  'X-Shopify-Hmac-SHA256': string;
}

