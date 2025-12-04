import { NextRequest, NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shop = searchParams.get('shop');

    // Validate shop parameter
    if (!shop) {
      return NextResponse.json(
        { error: 'Missing shop parameter' },
        { status: 400 }
      );
    }

    // Validate shop format (must be *.myshopify.com)
    const shopRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/;
    if (!shopRegex.test(shop)) {
      return NextResponse.json(
        { error: 'Invalid shop format. Expected: store.myshopify.com' },
        { status: 400 }
      );
    }

    // Begin OAuth flow
    const authUrl = await shopify.auth.begin({
      shop,
      callbackPath: '/api/shopify/auth/callback',
      isOnline: false,
      rawRequest: request,
    });

    // Redirect to Shopify permission screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Shopify OAuth install error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }
}

