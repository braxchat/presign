import 'server-only';
import { shopify } from './shopify';
import { supabaseAdmin } from './supabase-admin';
import type { Merchant } from './supabase/types';

/**
 * Ensure a Shopify merchant has an active or trialing subscription
 * Returns a confirmation URL if subscription needs to be created/confirmed, null if already active
 */
export async function ensureShopifySubscription(
  merchant: Merchant,
  session: any // Shopify session object
): Promise<string | null> {
  const now = new Date();
  
  // Check if merchant already has active or trialing status with valid trial
  if (
    merchant.status === 'active' ||
    (merchant.status === 'trialing' && merchant.trial_end && new Date(merchant.trial_end) > now)
  ) {
    // Merchant is already active or has valid trial, no redirect needed
    return null;
  }

  try {
    // Create GraphQL client for the session
    const client = new shopify.clients.Graphql({ session });

    // Check if there's an existing subscription
    const existingSubscriptionQuery = `
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

    const existingResponse = await client.request(existingSubscriptionQuery);
    const activeSubscriptions = (existingResponse.body as any)?.data?.currentAppInstallation?.activeSubscriptions || [];

    // If there's an active subscription, update merchant record
    if (activeSubscriptions.length > 0) {
      const subscription = activeSubscriptions[0];
      const trialEnd = subscription.trialDays 
        ? new Date(Date.now() + subscription.trialDays * 24 * 60 * 60 * 1000).toISOString()
        : subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd).toISOString()
          : null;

      await supabaseAdmin
        .from('merchants')
        .update({
          shopify_subscription_id: subscription.id,
          shopify_plan_name: subscription.name || 'PreSign Subscription',
          plan_tier: 'basic',
          status: subscription.status === 'ACTIVE' ? 'active' : 'trialing',
          trial_end: trialEnd,
          billing_provider: 'shopify',
          updated_at: new Date().toISOString(),
        })
        .eq('id', merchant.id);

      return null; // No redirect needed, subscription already exists
    }

    // Create new subscription using GraphQL mutation
    const createSubscriptionMutation = `
      mutation appSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int!) {
        appSubscriptionCreate(
          name: $name
          lineItems: $lineItems
          returnUrl: $returnUrl
          trialDays: $trialDays
        ) {
          appSubscription {
            id
            name
            status
            currentPeriodEnd
            trialDays
          }
          confirmationUrl
          userErrors {
            field
            message
          }
        }
      }
    `;

    const returnUrl = `${process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL}/api/shopify/auth/callback?shop=${session.shop}`;
    
    const variables = {
      name: 'PreSign Subscription',
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: {
                amount: 19.0,
                currencyCode: 'USD',
              },
              interval: 'EVERY_30_DAYS',
            },
          },
        },
      ],
      returnUrl,
      trialDays: 14,
    };

    const response = await client.request(createSubscriptionMutation, { variables });
    const result = (response.body as any)?.data?.appSubscriptionCreate;

    if (result?.userErrors && result.userErrors.length > 0) {
      console.error('Shopify subscription creation errors:', result.userErrors);
      throw new Error(`Failed to create subscription: ${result.userErrors.map((e: any) => e.message).join(', ')}`);
    }

    if (!result?.confirmationUrl) {
      throw new Error('No confirmation URL returned from Shopify');
    }

    // Store subscription details (will be confirmed after merchant accepts)
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    await supabaseAdmin
      .from('merchants')
      .update({
        shopify_subscription_id: result.appSubscription?.id || null,
        shopify_plan_name: 'PreSign Subscription',
        plan_tier: 'basic',
        status: 'trialing', // Will be confirmed after merchant accepts
        trial_end: trialEnd,
        billing_provider: 'shopify',
        updated_at: new Date().toISOString(),
      })
      .eq('id', merchant.id);

    return result.confirmationUrl;
  } catch (error: any) {
    console.error('Error ensuring Shopify subscription:', error);
    throw error;
  }
}

/**
 * Update merchant subscription status after Shopify confirms the subscription
 * Called from webhook or after redirect from confirmation URL
 */
export async function updateShopifySubscriptionStatus(
  merchantId: string,
  subscriptionId: string
): Promise<void> {
  try {
    // Get merchant to access Shopify session
    const { data: merchant, error: merchantError } = await supabaseAdmin
      .from('merchants')
      .select('*')
      .eq('id', merchantId)
      .single();

    if (merchantError || !merchant) {
      throw new Error('Merchant not found');
    }

    if (!merchant.shop_domain || !merchant.access_token) {
      throw new Error('Merchant missing Shopify credentials');
    }

    // Create session for GraphQL query
    const session = {
      shop: merchant.shop_domain,
      accessToken: merchant.access_token,
    };

    const client = new shopify.clients.Graphql({ session });

    // Query subscription status
    const subscriptionQuery = `
      query getAppSubscription($id: ID!) {
        node(id: $id) {
          ... on AppSubscription {
            id
            name
            status
            currentPeriodEnd
            trialDays
          }
        }
      }
    `;

    const response = await client.request(subscriptionQuery, {
      variables: { id: subscriptionId },
    });

    const subscription = (response.body as any)?.data?.node;

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Calculate trial end
    const trialEnd = subscription.trialDays
      ? new Date(Date.now() + subscription.trialDays * 24 * 60 * 60 * 1000).toISOString()
      : subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd).toISOString()
        : null;

    // Update merchant status
    await supabaseAdmin
      .from('merchants')
      .update({
        shopify_subscription_id: subscription.id,
        shopify_plan_name: subscription.name || 'PreSign Subscription',
        status: subscription.status === 'ACTIVE' ? 'active' : 'trialing',
        trial_end: trialEnd,
        updated_at: new Date().toISOString(),
      })
      .eq('id', merchantId);
  } catch (error: any) {
    console.error('Error updating Shopify subscription status:', error);
    throw error;
  }
}

