-- Migration: Add onboarding_completed column to merchants table
-- Date: 2025-01-02
-- Description: Tracks whether merchant has completed the onboarding wizard

-- Add onboarding_completed column
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

-- Add index for faster onboarding status checks
CREATE INDEX IF NOT EXISTS idx_merchants_onboarding_completed ON merchants(onboarding_completed);

