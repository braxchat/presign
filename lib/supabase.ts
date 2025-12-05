import { createClient as supabaseCreateClient } from '@supabase/supabase-js';
import type { Database } from './supabase/types';

// ============================================================================
// Supabase Client Factory Functions
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Creates a Supabase client using the anonymous key
 * Safe for client-side usage, respects Row Level Security (RLS)
 */
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return supabaseCreateClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Creates a Supabase client using the service role key
 * ⚠️ SERVER-SIDE ONLY - bypasses Row Level Security (RLS)
 * Use only in API routes, server components, or server actions
 */
export function createServiceClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return supabaseCreateClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Legacy export for backwards compatibility
export const supabase = typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey
  ? supabaseCreateClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Lazy-initialized service client to avoid build-time errors when env vars are missing
let _supabaseService: ReturnType<typeof createServiceClient> | null = null;

export const supabaseService = new Proxy({} as ReturnType<typeof createServiceClient>, {
  get(_, prop) {
    if (!_supabaseService) {
      _supabaseService = createServiceClient();
    }
    return _supabaseService[prop as keyof ReturnType<typeof createServiceClient>];
  },
});
