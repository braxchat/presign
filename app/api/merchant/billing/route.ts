export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

async function getCurrentMerchant(request: NextRequest) {
  // Try Shopify shop cookie first
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

export async function GET(request: NextRequest) {
  try {
    // Get merchant (doesn't require active subscription for billing page)
    const merchant = await getCurrentMerchant(request);
    
    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Return billing information
    return NextResponse.json({
      billing_provider: merchant.billing_provider,
      plan_tier: merchant.plan_tier,
      status: merchant.status,
      trial_end: merchant.trial_end,
      shopify_subscription_id: merchant.shopify_subscription_id,
      shopify_plan_name: merchant.shopify_plan_name,
      stripe_customer_id: merchant.stripe_customer_id,
      stripe_subscription_id: merchant.stripe_subscription_id,
    });
  } catch (error: any) {
    console.error('Error fetching billing info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

