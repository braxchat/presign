-- Add website login credentials fields to merchants table
-- These fields allow Shopify merchants to optionally create website login credentials

ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS email_login text NULL,
ADD COLUMN IF NOT EXISTS password_hash text NULL,
ADD COLUMN IF NOT EXISTS has_password boolean NOT NULL DEFAULT false;

-- Create unique index on email_login (only when not null)
CREATE UNIQUE INDEX IF NOT EXISTS merchants_email_login_unique 
ON merchants (email_login) 
WHERE email_login IS NOT NULL;

-- Add comment to explain the fields
COMMENT ON COLUMN merchants.email_login IS 'Optional email for website login (Shopify merchants only)';
COMMENT ON COLUMN merchants.password_hash IS 'Bcrypt hashed password for website login';
COMMENT ON COLUMN merchants.has_password IS 'Whether merchant has created website login credentials';

