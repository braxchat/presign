import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { shopify } from '@/lib/shopify';
import { supabaseAdmin } from '@/lib/supabase-admin';

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

    // Create redirect response with cookie
    const response = NextResponse.redirect(
      `${process.env.APP_BASE_URL}/merchant/dashboard`
    );
    
    // Set shop cookie for merchant session detection
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

