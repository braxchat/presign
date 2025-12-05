export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const shopDomain = cookieStore.get('shop')?.value;

    if (!shopDomain) {
      return NextResponse.redirect(`${process.env.APP_BASE_URL}/onboarding/step5?error=no_shop`);
    }

    // Get merchant
    const { data: merchant } = await supabaseAdmin
      .from('merchants')
      .select('*')
      .eq('shop_domain', shopDomain)
      .single();

    if (!merchant) {
      return NextResponse.redirect(`${process.env.APP_BASE_URL}/onboarding/step5?error=merchant_not_found`);
    }

    if (!merchant.shopify_session_id) {
      console.error('Merchant missing shopify_session_id:', merchant.id);
      return NextResponse.redirect(`${process.env.APP_BASE_URL}/onboarding/step5?error=session_not_found`);
    }

    // Load the actual Shopify session from storage
    const session = await shopify.sessionStorage.loadSession(merchant.shopify_session_id);

    if (!session) {
      console.error('Failed to load Shopify session:', merchant.shopify_session_id);
      return NextResponse.redirect(`${process.env.APP_BASE_URL}/onboarding/step5?error=session_load_failed`);
    }

    // Create GraphQL client with the full session
    const client = new shopify.clients.Graphql({ session });

    // Query current subscription
    const subscriptionQuery = `
      query {
        currentAppInstallation {
          activeSubscriptions {
            id
            name
            status
            currentPeriodEnd
            trialDays
          }
        }
      }
    `;

    const response = await client.request(subscriptionQuery);
    const activeSubscriptions = (response.body as any)?.data?.currentAppInstallation?.activeSubscriptions || [];

    if (activeSubscriptions.length > 0) {
      const subscription = activeSubscriptions[0];
      const trialEnd = subscription.trialDays
        ? new Date(Date.now() + subscription.trialDays * 24 * 60 * 60 * 1000).toISOString()
        : subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd).toISOString()
          : null;

      // Update merchant subscription status
      await supabaseAdmin
        .from('merchants')
        .update({
          shopify_subscription_id: subscription.id,
          shopify_plan_name: subscription.name || 'PreSign Subscription',
          plan_tier: 'basic',
          status: subscription.status === 'ACTIVE' ? 'active' : 'trialing',
          trial_end: trialEnd,
          updated_at: new Date().toISOString(),
        })
        .eq('id', merchant.id);

      // Redirect to step 6 (onboarding completion)
      return NextResponse.redirect(`${process.env.APP_BASE_URL}/onboarding/step6`);
    }

    // No subscription found, redirect back to step 5
    return NextResponse.redirect(`${process.env.APP_BASE_URL}/onboarding/step5?error=no_subscription`);
  } catch (error: any) {
    console.error('Error confirming Shopify billing:', error);
    return NextResponse.redirect(`${process.env.APP_BASE_URL}/onboarding/step5?error=confirmation_failed`);
  }
}

