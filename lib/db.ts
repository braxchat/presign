import 'server-only';

import { supabaseAdmin } from './supabase-admin';
import type {
  Merchant,
  MerchantInsert,
  Shipment,
  ShipmentInsert,
  ShipmentUpdate,
  Payout,
  PayoutInsert,
} from './supabase/types';

// ============================================================================
// Merchant Functions
// ============================================================================

/**
 * Get or create a merchant by their auth user ID
 * Creates a new merchant record if one doesn't exist
 */
export async function getOrCreateMerchant(
  userId: string,
  data: { businessName: string; contactEmail: string }
): Promise<Merchant> {
  // First, try to find existing merchant
  const { data: existingMerchant, error: findError } = await supabaseAdmin
    .from('merchants')
    .select('*')
    .eq('id', userId)
    .single();

  if (existingMerchant) {
    return existingMerchant;
  }

  // If not found (PGRST116 = no rows returned), create new merchant
  if (findError && findError.code !== 'PGRST116') {
    throw new Error(`Failed to find merchant: ${findError.message}`);
  }

  const merchantData: MerchantInsert = {
    id: userId,
    business_name: data.businessName,
    contact_email: data.contactEmail,
  };

  const { data: newMerchant, error: createError } = await supabaseAdmin
    .from('merchants')
    .insert(merchantData)
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create merchant: ${createError.message}`);
  }

  return newMerchant;
}

/**
 * Get a merchant by their ID
 */
export async function getMerchantById(merchantId: string): Promise<Merchant | null> {
  const { data, error } = await supabaseAdmin
    .from('merchants')
    .select('*')
    .eq('id', merchantId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get merchant: ${error.message}`);
  }

  return data;
}

// ============================================================================
// Shipment Functions
// ============================================================================

/**
 * Create a new shipment
 */
export async function createShipment(data: {
  merchantId: string;
  trackingNumber: string;
  carrier: 'UPS' | 'FedEx';
  buyerName: string;
  buyerEmail: string;
  orderNumber?: string;
  itemValueCents?: number;
  overrideToken?: string;
}): Promise<Shipment> {
  const shipmentData: ShipmentInsert = {
    merchant_id: data.merchantId,
    tracking_number: data.trackingNumber,
    carrier: data.carrier,
    buyer_name: data.buyerName,
    buyer_email: data.buyerEmail,
    order_number: data.orderNumber || null,
    item_value_cents: data.itemValueCents || 0,
    override_token: data.overrideToken || null,
    requires_signature: true,
    carrier_status: 'PreTransit',
    override_status: 'none',
  };

  const { data: shipment, error } = await supabaseAdmin
    .from('shipments')
    .insert(shipmentData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create shipment: ${error.message}`);
  }

  return shipment;
}

/**
 * Update an existing shipment
 */
export async function updateShipment(
  shipmentId: string,
  updates: {
    carrierStatus?: 'PreTransit' | 'InTransit' | 'OutForDelivery' | 'Delivered';
    overrideStatus?: 'none' | 'requested' | 'completed';
    overrideToken?: string | null;
    stripeCheckoutSessionId?: string | null;
  }
): Promise<Shipment> {
  const updateData: ShipmentUpdate = {
    updated_at: new Date().toISOString(),
  };

  if (updates.carrierStatus !== undefined) {
    updateData.carrier_status = updates.carrierStatus;
  }
  if (updates.overrideStatus !== undefined) {
    updateData.override_status = updates.overrideStatus;
  }
  if (updates.overrideToken !== undefined) {
    updateData.override_token = updates.overrideToken;
  }
  if (updates.stripeCheckoutSessionId !== undefined) {
    updateData.stripe_checkout_session_id = updates.stripeCheckoutSessionId;
  }

  const { data: shipment, error } = await supabaseAdmin
    .from('shipments')
    .update(updateData)
    .eq('id', shipmentId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update shipment: ${error.message}`);
  }

  return shipment;
}

/**
 * Find a shipment by its override token
 * Used when a buyer accesses the signature release page
 */
export async function findShipmentByToken(token: string): Promise<Shipment | null> {
  const { data, error } = await supabaseAdmin
    .from('shipments')
    .select('*')
    .eq('override_token', token)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to find shipment by token: ${error.message}`);
  }

  return data;
}

/**
 * Find a shipment by its Stripe checkout session ID
 * Used when processing Stripe webhook events
 */
export async function findShipmentByStripeCheckout(
  sessionId: string
): Promise<Shipment | null> {
  const { data, error } = await supabaseAdmin
    .from('shipments')
    .select('*')
    .eq('stripe_checkout_session_id', sessionId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to find shipment by Stripe session: ${error.message}`);
  }

  return data;
}

/**
 * Get all shipments for a merchant
 * Optionally filter by status
 */
export async function getShipmentsByMerchant(
  merchantId: string,
  options?: {
    carrierStatus?: 'PreTransit' | 'InTransit' | 'OutForDelivery' | 'Delivered';
    overrideStatus?: 'none' | 'requested' | 'completed';
    limit?: number;
    offset?: number;
  }
): Promise<{ shipments: Shipment[]; count: number }> {
  let query = supabaseAdmin
    .from('shipments')
    .select('*', { count: 'exact' })
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false });

  if (options?.carrierStatus) {
    query = query.eq('carrier_status', options.carrierStatus);
  }
  if (options?.overrideStatus) {
    query = query.eq('override_status', options.overrideStatus);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to get shipments: ${error.message}`);
  }

  return { shipments: data || [], count: count || 0 };
}

/**
 * Get a single shipment by ID (with merchant verification)
 */
export async function getShipmentById(
  shipmentId: string,
  merchantId?: string
): Promise<Shipment | null> {
  let query = supabaseAdmin
    .from('shipments')
    .select('*')
    .eq('id', shipmentId);

  if (merchantId) {
    query = query.eq('merchant_id', merchantId);
  }

  const { data, error } = await query.single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get shipment: ${error.message}`);
  }

  return data;
}

// ============================================================================
// Payout Functions
// ============================================================================

/**
 * Create a new payout request
 */
export async function createPayout(data: {
  merchantId: string;
  amountCents: number;
  overrideCount: number;
}): Promise<Payout> {
  const payoutData: PayoutInsert = {
    merchant_id: data.merchantId,
    amount_cents: data.amountCents,
    override_count: data.overrideCount,
    status: 'pending',
  };

  const { data: payout, error } = await supabaseAdmin
    .from('payouts')
    .insert(payoutData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create payout: ${error.message}`);
  }

  return payout;
}

/**
 * Get payouts for a merchant
 */
export async function getPayoutsByMerchant(
  merchantId: string,
  options?: {
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    limit?: number;
  }
): Promise<Payout[]> {
  let query = supabaseAdmin
    .from('payouts')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('requested_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to get payouts: ${error.message}`);
  }

  return data || [];
}

/**
 * Update a payout status
 */
export async function updatePayoutStatus(
  payoutId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  paidAt?: string
): Promise<Payout> {
  const updates: { status: string; paid_at?: string } = { status };
  
  if (paidAt) {
    updates.paid_at = paidAt;
  }

  const { data, error } = await supabaseAdmin
    .from('payouts')
    .update(updates)
    .eq('id', payoutId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update payout: ${error.message}`);
  }

  return data;
}

// ============================================================================
// Signature Authorization Functions
// ============================================================================

/**
 * Create a signature authorization record
 */
export async function createSignatureAuthorization(data: {
  shipmentId: string;
  typedName: string;
  ipAddress: string;
  userAgent?: string;
}): Promise<void> {
  const { error } = await supabaseAdmin
    .from('signature_authorizations')
    .insert({
      shipment_id: data.shipmentId,
      typed_name: data.typedName,
      ip_address: data.ipAddress,
      user_agent: data.userAgent || null,
    });

  if (error) {
    throw new Error(`Failed to create signature authorization: ${error.message}`);
  }
}

/**
 * Get signature authorization for a shipment
 */
export async function getSignatureAuthorization(shipmentId: string) {
  const { data, error } = await supabaseAdmin
    .from('signature_authorizations')
    .select('*')
    .eq('shipment_id', shipmentId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get signature authorization: ${error.message}`);
  }

  return data;
}

// ============================================================================
// Statistics Functions
// ============================================================================

/**
 * Get merchant statistics (override counts, earnings, etc.)
 */
export async function getMerchantStats(merchantId: string) {
  // Get completed overrides this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: monthlyOverrides, error: overrideError } = await supabaseAdmin
    .from('shipments')
    .select('*', { count: 'exact', head: true })
    .eq('merchant_id', merchantId)
    .eq('override_status', 'completed')
    .gte('updated_at', startOfMonth.toISOString());

  if (overrideError) {
    throw new Error(`Failed to get override count: ${overrideError.message}`);
  }

  // Get total completed overrides
  const { count: totalOverrides, error: totalError } = await supabaseAdmin
    .from('shipments')
    .select('*', { count: 'exact', head: true })
    .eq('merchant_id', merchantId)
    .eq('override_status', 'completed');

  if (totalError) {
    throw new Error(`Failed to get total overrides: ${totalError.message}`);
  }

  // Get pending shipments
  const { count: pendingCount, error: pendingError } = await supabaseAdmin
    .from('shipments')
    .select('*', { count: 'exact', head: true })
    .eq('merchant_id', merchantId)
    .eq('override_status', 'requested');

  if (pendingError) {
    throw new Error(`Failed to get pending count: ${pendingError.message}`);
  }

  // Get active shipments (in transit)
  const { count: activeCount, error: activeError } = await supabaseAdmin
    .from('shipments')
    .select('*', { count: 'exact', head: true })
    .eq('merchant_id', merchantId)
    .in('carrier_status', ['PreTransit', 'InTransit', 'OutForDelivery']);

  if (activeError) {
    throw new Error(`Failed to get active count: ${activeError.message}`);
  }

  // Calculate earnings ($1.00 per completed override)
  const EARNINGS_PER_OVERRIDE_CENTS = 100;
  const monthlyEarningsCents = (monthlyOverrides || 0) * EARNINGS_PER_OVERRIDE_CENTS;
  const totalEarningsCents = (totalOverrides || 0) * EARNINGS_PER_OVERRIDE_CENTS;

  // Get total paid out
  const { data: payouts, error: payoutError } = await supabaseAdmin
    .from('payouts')
    .select('amount_cents')
    .eq('merchant_id', merchantId)
    .eq('status', 'completed');

  if (payoutError) {
    throw new Error(`Failed to get payouts: ${payoutError.message}`);
  }

  const totalPaidOutCents = payouts?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;
  const availableBalanceCents = totalEarningsCents - totalPaidOutCents;

  return {
    monthlyOverrides: monthlyOverrides || 0,
    totalOverrides: totalOverrides || 0,
    pendingRequests: pendingCount || 0,
    activeShipments: activeCount || 0,
    monthlyEarningsCents,
    totalEarningsCents,
    availableBalanceCents,
    totalPaidOutCents,
  };
}

