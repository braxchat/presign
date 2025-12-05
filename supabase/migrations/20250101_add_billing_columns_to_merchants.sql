-- Migration: Add billing columns to merchants table
-- Date: 2025-01-01
-- Description: Adds support for dual billing (Shopify and Stripe) with subscription status tracking

-- Add billing_provider column
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS billing_provider TEXT CHECK (billing_provider IN ('shopify', 'stripe'));

-- Add plan_tier column
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS plan_tier TEXT CHECK (plan_tier IN ('basic', 'pro', 'enterprise'));

-- Add status column
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('trialing', 'active', 'canceled', 'past_due'));

-- Add trial_end column
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ;

-- Add Shopify billing columns
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS shopify_subscription_id TEXT;

ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS shopify_plan_name TEXT;

-- Add Stripe billing columns
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add index on billing_provider for faster queries
CREATE INDEX IF NOT EXISTS idx_merchants_billing_provider ON merchants(billing_provider);

-- Add index on status for subscription checks
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);

-- Add index on shopify_subscription_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_merchants_shopify_subscription_id ON merchants(shopify_subscription_id) WHERE shopify_subscription_id IS NOT NULL;

-- Add index on stripe_subscription_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_merchants_stripe_subscription_id ON merchants(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

-- Add index on stripe_customer_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_merchants_stripe_customer_id ON merchants(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

