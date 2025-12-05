import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';
import type { Merchant } from './supabase/types';

/**
 * Custom error for subscription requirements
 */
export class SubscriptionRequiredError extends Error {
  constructor(message: string = 'Active subscription required') {
    super(message);
    this.name = 'SubscriptionRequiredError';
  }
}

/**
 * Get current merchant from request
 * Handles both Supabase auth (direct signups) and Shopify shop cookie
 */
async function getCurrentMerchant(request: NextRequest): Promise<Merchant | null> {
  // Try Shopify shop cookie first (for Shopify merchants)
  // Check both request.cookies (NextRequest) and cookies() (server components)
  let shopDomain: string | undefined;
  
  if (request) {
    shopDomain = request.cookies.get('shop')?.value;
  }
  
  if (!shopDomain) {
    try {
      const cookieStore = await cookies();
      shopDomain = cookieStore.get('shop')?.value;
    } catch {
      // cookies() might not be available in all contexts
    }
  }

  if (shopDomain) {
    const { data: merchant } = await supabaseAdmin
      .from('merchants')
      .select('*')
      .eq('shop_domain', shopDomain)
      .single();

    if (merchant) {
      return merchant;
    }
  }

  // Fall back to Supabase auth (for direct signups)
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.email) {
      const { data: merchant } = await supabaseAdmin
        .from('merchants')
        .select('*')
        .eq('contact_email', user.email)
        .single();

      if (merchant) {
        return merchant;
      }
    }
  } catch (error) {
    // Auth might fail, that's okay - we'll return null
    console.warn('Error getting merchant from auth:', error);
  }

  return null;
}

/**
 * Check if merchant has active subscription
 * Returns true if merchant is active or has valid trial
 */
function isMerchantActive(merchant: Merchant): boolean {
  // Merchant is active if status is 'active'
  if (merchant.status === 'active') {
    return true;
  }

  // Merchant is active if status is 'trialing' and trial_end is in the future
  if (merchant.status === 'trialing' && merchant.trial_end) {
    const trialEnd = new Date(merchant.trial_end);
    const now = new Date();
    return trialEnd > now;
  }

  return false;
}

/**
 * Require active subscription for merchant routes
 * Throws SubscriptionRequiredError if merchant is not active
 * 
 * @param merchantId - Optional merchant ID. If not provided, will attempt to get from request
 * @param request - NextRequest object for cookie/session access
 * @returns Merchant object if active
 * @throws SubscriptionRequiredError if subscription is not active
 */
export async function requireActiveSubscription(
  merchantId?: string,
  request?: NextRequest
): Promise<Merchant> {
  let merchant: Merchant | null = null;

  if (merchantId) {
    // Direct lookup by ID
    const { data } = await supabaseAdmin
      .from('merchants')
      .select('*')
      .eq('id', merchantId)
      .single();

    merchant = data || null;
  } else if (request) {
    // Get merchant from request (cookies/auth)
    merchant = await getCurrentMerchant(request);
  } else {
    throw new SubscriptionRequiredError('Merchant not found');
  }

  if (!merchant) {
    throw new SubscriptionRequiredError('Merchant not found');
  }

  if (!isMerchantActive(merchant)) {
    throw new SubscriptionRequiredError(
      `Subscription is ${merchant.status || 'inactive'}. Please activate your subscription to continue.`
    );
  }

  return merchant;
}

/**
 * Middleware helper for Next.js route handlers
 * Returns merchant if active, or redirects to billing page
 */
export async function requireActiveSubscriptionOrRedirect(
  request: NextRequest
): Promise<{ merchant: Merchant; response?: never } | { merchant?: never; response: NextResponse }> {
  try {
    const merchant = await requireActiveSubscription(undefined, request);
    return { merchant };
  } catch (error) {
    if (error instanceof SubscriptionRequiredError) {
      const baseUrl = process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL || '';
      return {
        response: NextResponse.redirect(`${baseUrl}/merchant/billing?error=subscription_required`),
      };
    }
    // Re-throw other errors
    throw error;
  }
}

