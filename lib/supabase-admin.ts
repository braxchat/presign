import 'server-only';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase/types';

// ============================================================================
// Server-side Supabase client (uses service role key)
// ONLY use in server components, API routes, and server actions
// Has full access to the database, bypassing RLS
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabaseAdmin: SupabaseClient<Database> | null = null;

/**
 * Get or create the Supabase admin client
 * Uses lazy initialization to avoid build-time errors when env vars are missing
 */
function getSupabaseAdmin(): SupabaseClient<Database> {
  if (_supabaseAdmin) {
    return _supabaseAdmin;
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  _supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _supabaseAdmin;
}

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
export const supabaseAdmin = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient<Database>];
  },
});

/**
 * Creates a new Supabase admin client instance
 * Use this if you need a fresh admin client instance
 */
export function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

