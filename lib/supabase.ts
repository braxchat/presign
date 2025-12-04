import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase/types';

// ============================================================================
// Client-side Supabase client (uses anon key)
// Safe to use in client components
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase client for client-side usage
 * Uses the anonymous key and respects Row Level Security (RLS)
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Creates a new Supabase client instance for client-side usage
 * Use this if you need a fresh client instance
 */
export function createBrowserClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
