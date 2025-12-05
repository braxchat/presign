import { NextRequest, NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  try {
    // Log environment variables for debugging
    console.log('INSTALL ROUTE CALLED', process.env.SHOPIFY_APP_URL);
    console.log('APP_BASE_URL:', process.env.APP_BASE_URL);
    console.log('SHOPIFY_API_KEY:', process.env.SHOPIFY_API_KEY ? '***set***' : 'MISSING');
    console.log('SHOPIFY_API_SECRET:', process.env.SHOPIFY_API_SECRET ? '***set***' : 'MISSING');

    // Validate environment variables first
    if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
      console.error('Missing Shopify API credentials');
      return NextResponse.json(
        { error: 'Shopify API credentials not configured' },
        { status: 500 }
      );
    }

    if (!process.env.SHOPIFY_APP_URL) {
      console.error('Missing SHOPIFY_APP_URL');
      return NextResponse.json(
        { error: 'Shopify app URL not configured' },
        { status: 500 }
      );
    }

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

    // Convert NextRequest to format expected by Shopify Node adapter
    const url = new URL(request.url);
    const rawRequest = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      query: Object.fromEntries(url.searchParams.entries()),
    };

    // Begin OAuth flow
    const authUrl = await shopify.auth.begin({
      shop,
      callbackPath: '/api/shopify/auth/callback',
      isOnline: false,
      rawRequest: rawRequest as any,
    });

    // Redirect to Shopify permission screen
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    // Log the actual error for debugging
    console.error('Shopify OAuth install error:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      apiKey: process.env.SHOPIFY_API_KEY ? '***set***' : 'MISSING',
      apiSecret: process.env.SHOPIFY_API_SECRET ? '***set***' : 'MISSING',
      appUrl: process.env.SHOPIFY_APP_URL || 'MISSING',
      hostName: (process.env.SHOPIFY_APP_URL || '').replace(/^https?:\/\//, ''),
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to initiate OAuth flow',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

