export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureShopifySubscription } from '@/lib/shopifyBilling';

/**
 * Register a webhook using Shopify's official webhook registration system
 * Uses the REST Admin API through the Shopify client
 */
async function registerWebhook(
  session: any, // Shopify session object
  topic: string,
  callbackUrl: string
) {
  try {
    // Create a REST client for the session
    const client = new shopify.clients.Rest({ session });

    // Register webhook using REST Admin API
    const response = await client.post({
      path: 'webhooks',
      data: {
        webhook: {
          topic,
          address: callbackUrl,
          format: 'json',
        },
      },
    });

    if (response.body?.webhook?.id) {
      console.log(`Webhook ${topic} registered successfully:`, response.body.webhook.id);
      return true;
    }

    console.warn(`Failed to register webhook ${topic}:`, response.body);
    return false;
  } catch (error: any) {
    // Check if webhook already exists (409 conflict)
    if (error?.statusCode === 409) {
      console.log(`Webhook ${topic} already exists`);
      return true;
    }
    console.error(`Error registering webhook ${topic}:`, error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Log environment variables for debugging
    console.log('CALLBACK ROUTE CALLED', process.env.SHOPIFY_APP_URL);
    console.log('APP_BASE_URL:', process.env.APP_BASE_URL);

    // Complete the OAuth flow
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
      rawResponse: NextResponse.next(),
    });

    const { session } = callbackResponse;
    
    if (!session || !session.accessToken) {
      console.error('No session or access token received');
      return NextResponse.redirect(
        `${process.env.APP_BASE_URL}/login?error=oauth_failed`
      );
    }

    const shopDomain = session.shop;
    const accessToken = session.accessToken;

    // Store the full Shopify session in session storage
    try {
      await shopify.sessionStorage.storeSession(session);
      console.log('Shopify session stored:', session.id);
    } catch (storageError) {
      console.error('Error storing Shopify session:', storageError);
      // Continue even if session storage fails - we still have access_token
    }

    // Fetch merchant email and shop name from Shopify
    const client = new shopify.clients.Rest({ session });
    let merchantEmail: string | null = null;
    let merchantName: string | null = null;

    try {
      const shopInfo = await client.get({ path: 'shop' });
      merchantEmail = (shopInfo.body as any)?.shop?.email || null;
      merchantName = (shopInfo.body as any)?.shop?.name || null;
    } catch (error) {
      console.error('Failed to fetch shop info from Shopify:', error);
      // Continue with OAuth flow even if shop info fetch fails
    }

    // Upsert merchant in Supabase
    const { data: merchant, error: upsertError } = await supabaseAdmin
      .from('merchants')
      .upsert(
        {
          shop_domain: shopDomain,
          access_token: accessToken,
          business_name: merchantName || undefined,
          email: merchantEmail || undefined,
          billing_provider: 'shopify',
          shopify_session_id: session.id,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'shop_domain',
        }
      )
      .select()
      .single();

    if (upsertError || !merchant) {
      console.error('Failed to save merchant:', upsertError);
      return NextResponse.redirect(
        `${process.env.APP_BASE_URL}/login?error=database_error`
      );
    }

    // Register webhooks using Shopify's official webhook registration system
    const baseUrl = process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL;
    
    try {
      await registerWebhook(
        session,
        'fulfillments/create',
        `${baseUrl}/api/shopify/fulfillment-created`
      );

      await registerWebhook(
        session,
        'fulfillments/update',
        `${baseUrl}/api/shopify/fulfillment-updated`
      );
    } catch (webhookError) {
      // Log but don't fail the flow - webhooks can be retried
      console.error('Webhook registration error:', webhookError);
    }

    // Check onboarding status and redirect accordingly
    // This works in embedded Shopify iframe because we use full URLs
    const redirectUrl = merchant.onboarding_completed
      ? `${process.env.APP_BASE_URL}/merchant/dashboard`
      : `${process.env.APP_BASE_URL}/onboarding/start`;

    const response = NextResponse.redirect(redirectUrl);
    
    // Set shop cookie for merchant session detection
    // Important: sameSite: "none" and secure: true for iframe compatibility
    response.cookies.set("shop", shopDomain, {
      path: "/",
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });

    return response;
  } catch (error) {
    console.error('Shopify OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.APP_BASE_URL}/login?error=oauth_callback_failed`
    );
  }
}

