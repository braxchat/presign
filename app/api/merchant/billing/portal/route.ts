export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { stripe } from '@/lib/stripe';
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

export async function POST(request: NextRequest) {
  try {
    // Get merchant (allow access even if subscription inactive)
    const merchant = await getCurrentMerchant(request);
    
    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    if (merchant.billing_provider !== 'stripe') {
      return NextResponse.json(
        { error: 'Billing portal is only available for Stripe subscriptions' },
        { status: 400 }
      );
    }

    if (!merchant.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Stripe customer not found' },
        { status: 404 }
      );
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: merchant.stripe_customer_id,
      return_url: `${process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL || ''}/merchant/billing`,
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error: any) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}

