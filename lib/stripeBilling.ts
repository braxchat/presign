import 'server-only';
import Stripe from 'stripe';
import { stripe } from './stripe';
import { supabaseAdmin } from './supabase-admin';

type PlanTier = 'basic' | 'pro' | 'enterprise';

/**
 * Get Stripe price ID for a plan tier
 * These should be created in Stripe Dashboard and stored as environment variables
 */
function getPriceIdForPlan(planTier: PlanTier): string {
  const priceIds: Record<PlanTier, string> = {
    basic: process.env.STRIPE_PRICE_ID_BASIC || '',
    pro: process.env.STRIPE_PRICE_ID_PRO || '',
    enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE || '',
  };

  const priceId = priceIds[planTier];
  if (!priceId) {
    throw new Error(`Stripe price ID not configured for plan tier: ${planTier}`);
  }

  return priceId;
}

/**
 * Create a Stripe subscription for a merchant
 * Used for non-Shopify merchants who sign up directly on presign.app
 */
export async function createStripeSubscriptionForMerchant(
  merchantId: string,
  planTier: PlanTier = 'basic'
): Promise<{ subscription: Stripe.Subscription; customerPortalUrl?: string }> {
  // Look up merchant
  const { data: merchant, error: merchantError } = await supabaseAdmin
    .from('merchants')
    .select('*')
    .eq('id', merchantId)
    .single();

  if (merchantError || !merchant) {
    throw new Error('Merchant not found');
  }

  if (!merchant.email) {
    throw new Error('Merchant email is required');
  }

  // Create or retrieve Stripe customer
  let customerId = merchant.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: merchant.email,
      name: merchant.business_name || undefined,
      metadata: {
        merchant_id: merchant.id,
        shop_domain: merchant.shop_domain || '',
      },
    });

    customerId = customer.id;

    // Update merchant with customer ID
    await supabaseAdmin
      .from('merchants')
      .update({
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', merchantId);
  }

  // Get price ID for plan tier
  const priceId = getPriceIdForPlan(planTier);

  // Create subscription with 14-day trial
  const subscription: Stripe.Subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    trial_period_days: 14,
    metadata: {
      merchant_id: merchant.id,
      plan_tier: planTier,
    },
  });

  // Calculate trial end date
  // Access current_period_end using type assertion as it may not be in the type definition
  const subscriptionWithPeriod = subscription as any;
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : subscriptionWithPeriod.current_period_end
      ? new Date(subscriptionWithPeriod.current_period_end * 1000).toISOString()
      : null;

  // Update merchant with subscription details
  await supabaseAdmin
    .from('merchants')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan_tier: planTier,
      status: subscription.status === 'active' ? 'active' : 'trialing',
      trial_end: trialEnd,
      billing_provider: 'stripe',
      updated_at: new Date().toISOString(),
    })
    .eq('id', merchantId);

  // Optionally create billing portal session URL (for future use)
  let customerPortalUrl: string | undefined;
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL || ''}/merchant/billing`,
    });
    customerPortalUrl = portalSession.url;
  } catch (portalError) {
    console.warn('Failed to create billing portal session:', portalError);
    // Don't fail if portal creation fails
  }

  return { subscription, customerPortalUrl };
}

/**
 * Update merchant subscription status from Stripe webhook event
 */
export async function updateMerchantSubscriptionFromStripe(
  subscription: Stripe.Subscription
): Promise<void> {
  const merchantId = subscription.metadata?.merchant_id;

  if (!merchantId) {
    // Try to find merchant by stripe_subscription_id
    const { data: merchant } = await supabaseAdmin
      .from('merchants')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!merchant) {
      console.warn('Merchant not found for Stripe subscription:', subscription.id);
      return;
    }

    // Update using found merchant ID
    await updateMerchantSubscriptionStatus(merchant.id, subscription);
    return;
  }

  await updateMerchantSubscriptionStatus(merchantId, subscription);
}

/**
 * Helper to update merchant subscription status
 */
async function updateMerchantSubscriptionStatus(
  merchantId: string,
  subscription: Stripe.Subscription
): Promise<void> {
  const planTier = (subscription.metadata?.plan_tier as PlanTier) || 'basic';
  
  // Map Stripe subscription status to our status enum
  let status: 'trialing' | 'active' | 'canceled' | 'past_due';
  if (subscription.status === 'active') {
    status = subscription.trial_end && subscription.trial_end > Math.floor(Date.now() / 1000)
      ? 'trialing'
      : 'active';
  } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    status = 'canceled';
  } else if (subscription.status === 'past_due' || subscription.status === 'incomplete') {
    status = 'past_due';
  } else {
    status = 'trialing';
  }

  // Calculate trial end
  // Access current_period_end using type assertion as it may not be in the type definition
  const subscriptionWithPeriod = subscription as any;
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : subscriptionWithPeriod.current_period_end
      ? new Date(subscriptionWithPeriod.current_period_end * 1000).toISOString()
      : null;

  await supabaseAdmin
    .from('merchants')
    .update({
      stripe_subscription_id: subscription.id,
      plan_tier: planTier,
      status,
      trial_end: trialEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('id', merchantId);
}

