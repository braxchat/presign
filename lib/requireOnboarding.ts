import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';
import type { Merchant } from './supabase/types';

/**
 * Get current merchant from request
 * Handles both Supabase auth (direct signups) and Shopify shop cookie
 */
async function getCurrentMerchant(request: NextRequest): Promise<Merchant | null> {
  // Try Shopify shop cookie first
  const cookieStore = await cookies();
  const shopDomain = cookieStore.get('shop')?.value;

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

  // Fall back to Supabase auth
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
    console.warn('Error getting merchant from auth:', error);
  }

  return null;
}

/**
 * Require onboarding completion for merchant routes
 * Redirects to onboarding if not completed
 */
export async function requireOnboardingCompletion(
  request: NextRequest
): Promise<{ merchant: Merchant; response?: never } | { merchant?: never; response: NextResponse }> {
  const merchant = await getCurrentMerchant(request);

  if (!merchant) {
    const baseUrl = process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL || '';
    return {
      response: NextResponse.redirect(`${baseUrl}/onboarding/start`),
    };
  }

  if (!merchant.onboarding_completed) {
    const baseUrl = process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL || '';
    return {
      response: NextResponse.redirect(`${baseUrl}/onboarding/start`),
    };
  }

  return { merchant };
}

