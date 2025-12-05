-- Migration: Add Shopify session storage table and shopify_session_id to merchants
-- Date: 2025-01-03
-- Description: Stores Shopify sessions for proper session management

-- Create shopify_sessions table for session storage
CREATE TABLE IF NOT EXISTS shopify_sessions (
  id TEXT PRIMARY KEY,
  shop TEXT NOT NULL,
  state TEXT,
  is_online BOOLEAN DEFAULT false,
  scope TEXT,
  expires TIMESTAMPTZ,
  access_token TEXT,
  user_id TEXT,
  session_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on shop for faster lookups
CREATE INDEX IF NOT EXISTS idx_shopify_sessions_shop ON shopify_sessions(shop);

-- Add index on expires for cleanup queries
CREATE INDEX IF NOT EXISTS idx_shopify_sessions_expires ON shopify_sessions(expires) WHERE expires IS NOT NULL;

-- Add shopify_session_id column to merchants table
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS shopify_session_id TEXT;

-- Add index on shopify_session_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_merchants_shopify_session_id ON merchants(shopify_session_id) WHERE shopify_session_id IS NOT NULL;

