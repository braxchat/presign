export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Handles OAuth callback from Supabase (for direct merchant signups)
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email) {
        // Check merchant onboarding status
        const { data: merchant } = await supabaseAdmin
          .from('merchants')
          .select('onboarding_completed')
          .eq('contact_email', user.email)
          .single();

        // If next parameter is provided, use it (for custom redirects)
        // Otherwise, check onboarding status
        if (next) {
          return NextResponse.redirect(`${origin}${next}`);
        }

        // Redirect based on onboarding status
        const redirectPath = merchant?.onboarding_completed
          ? '/merchant/dashboard'
          : '/onboarding/start';

        return NextResponse.redirect(`${origin}${redirectPath}`);
      }

      // Fallback to dashboard if merchant not found
      return NextResponse.redirect(`${origin}${next || '/merchant/dashboard'}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}

