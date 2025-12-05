import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from './supabase-admin';
import { getShopifyAppUrl } from './shopifyHelpers';

/**
 * Check if request is inside Shopify embedded app
 * Detects Shopify headers that indicate embedded iframe
 */
function isInsideShopifyEmbeddedApp(request: NextRequest): boolean {
  const shopifyShopDomain = request.headers.get('x-shopify-shop-domain');
  const shopifyHmac = request.headers.get('x-shopify-hmac-sha256');
  const shopCookie = request.cookies.get('shop')?.value;
  
  // If any Shopify indicator exists, we're likely in embedded app
  return !!(shopifyShopDomain || shopifyHmac || shopCookie);
}

/**
 * Check if merchant is a Shopify merchant trying to access routes outside embedded app
 * Returns redirect response if they should be redirected
 */
export async function checkShopifyMerchantAccess(
  request: NextRequest,
  pathname: string
): Promise<NextResponse | null> {
  // Only check merchant routes and onboarding routes
  const isMerchantRoute = pathname.startsWith('/merchant/') || pathname.startsWith('/onboarding/');
  
  if (!isMerchantRoute) {
    return null; // Not a merchant route, allow through
  }

  // Skip check for OAuth callbacks and billing routes
  if (
    pathname.startsWith('/api/shopify/auth/') ||
    pathname.startsWith('/api/shopify/billing/') ||
    pathname.startsWith('/api/onboarding/')
  ) {
    return null; // Allow these routes
  }

  // If we're inside Shopify embedded app, allow access
  if (isInsideShopifyEmbeddedApp(request)) {
    return null; // Allow access
  }

  // Check if there's a shop cookie (Shopify merchant session)
  const shopDomain = request.cookies.get('shop')?.value;
  
  if (!shopDomain) {
    // No shop cookie, might be a Stripe merchant or not logged in
    // Let the route handle authentication
    return null;
  }

  // We have a shop cookie but we're not in embedded app
  // Check if merchant has website credentials
  const { data: merchant } = await supabaseAdmin
    .from('merchants')
    .select('billing_provider, has_password, shop_domain')
    .eq('shop_domain', shopDomain)
    .single();

  if (!merchant || merchant.billing_provider !== 'shopify') {
    return null; // Not a Shopify merchant, allow through
  }

  // Shopify merchant outside embedded app
  if (merchant.has_password) {
    // They have credentials, redirect to login
    const baseUrl = process.env.APP_BASE_URL || '';
    return NextResponse.redirect(`${baseUrl}/login`);
  } else {
    // No credentials, redirect to shopify-access page
    const baseUrl = process.env.APP_BASE_URL || '';
    return NextResponse.redirect(`${baseUrl}/shopify-access?shop=${shopDomain}`);
  }
}

