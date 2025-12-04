import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase/types';

// ============================================================================
// Server-side Supabase client (uses service role key)
// ONLY use in server components, API routes, and server actions
// Has full access to the database, bypassing RLS
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Supabase admin client for server-side usage ONLY
 * Uses the service role key and bypasses Row Level Security (RLS)
 * 
 * ⚠️ WARNING: Never expose this client to the browser
 * Only import this file in:
 * - Server Components
 * - API Routes (app/api/*)
 * - Server Actions
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Creates a new Supabase admin client instance
 * Use this if you need a fresh admin client instance
 */
export function createAdminClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

