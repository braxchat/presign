export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

async function getCurrentMerchant(request: NextRequest) {
  const cookieStore = await cookies();
  const shopDomain = cookieStore.get('shop')?.value;

  if (!shopDomain) {
    return null;
  }

  const { data: merchant } = await supabaseAdmin
    .from('merchants')
    .select('*')
    .eq('shop_domain', shopDomain)
    .single();

  return merchant;
}

export async function POST(request: NextRequest) {
  try {
    const merchant = await getCurrentMerchant(request);

    if (!merchant || !merchant.shop_domain) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    if (!merchant.shopify_session_id) {
      return NextResponse.json(
        { error: 'Merchant session not found. Please reinstall the app.' },
        { status: 404 }
      );
    }

    // Load the actual Shopify session from storage
    const session = await shopify.config.sessionStorage.loadSession(merchant.shopify_session_id);

    if (!session) {
      console.error('Failed to load Shopify session:', merchant.shopify_session_id);
      return NextResponse.json(
        { error: 'Failed to load session. Please reinstall the app.' },
        { status: 500 }
      );
    }

    // Use the existing ensureShopifySubscription function
    const { ensureShopifySubscription } = await import('@/lib/shopifyBilling');
    const confirmationUrl = await ensureShopifySubscription(merchant, session);

    if (!confirmationUrl) {
      // Subscription already exists
      return NextResponse.json({
        success: true,
        message: 'Subscription already active',
      });
    }

    return NextResponse.json({
      success: true,
      confirmationUrl,
    });
  } catch (error: any) {
    console.error('Error creating Shopify subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

