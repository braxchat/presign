import { NextRequest, NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { supabaseAdmin } from '@/lib/supabase-admin';

async function registerWebhook(
  shop: string,
  accessToken: string,
  topic: string,
  address: string
) {
  const response = await fetch(
    `https://${shop}/admin/api/2024-01/webhooks.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        webhook: {
          topic,
          address,
          format: 'json',
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.warn(`Failed to register webhook ${topic}:`, error);
    return false;
  }

  console.log(`Webhook ${topic} registered successfully`);
  return true;
}

export async function GET(request: NextRequest) {
  try {
    // Complete the OAuth flow
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
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

    // Upsert merchant in Supabase
    const { error: upsertError } = await supabaseAdmin
      .from('merchants')
      .upsert(
        {
          shop_domain: shopDomain,
          access_token: accessToken,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'shop_domain',
        }
      )
      .select()
      .single();

    if (upsertError) {
      console.error('Failed to save merchant:', upsertError);
      return NextResponse.redirect(
        `${process.env.APP_BASE_URL}/login?error=database_error`
      );
    }

    // Register webhooks using REST API
    const baseUrl = process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL;
    
    try {
      await registerWebhook(
        shopDomain,
        accessToken,
        'fulfillments/create',
        `${baseUrl}/api/shopify/fulfillment-created`
      );

      await registerWebhook(
        shopDomain,
        accessToken,
        'fulfillments/update',
        `${baseUrl}/api/shopify/fulfillment-updated`
      );
    } catch (webhookError) {
      // Log but don't fail the flow - webhooks can be retried
      console.error('Webhook registration error:', webhookError);
    }

    // Redirect to merchant dashboard
    return NextResponse.redirect(
      `${process.env.APP_BASE_URL}/merchant/dashboard`
    );
  } catch (error) {
    console.error('Shopify OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.APP_BASE_URL}/login?error=oauth_callback_failed`
    );
  }
}

