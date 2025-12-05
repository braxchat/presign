export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    // Get merchant by shop cookie (Shopify) or Supabase auth (Stripe)
    const cookieStore = await request.cookies;
    const shopDomain = cookieStore.get('shop')?.value;

    let merchant;

    if (shopDomain) {
      // Shopify merchant - use shop cookie (no email/password required)
      const { data } = await supabaseAdmin
        .from('merchants')
        .select('*')
        .eq('shop_domain', shopDomain)
        .single();
      merchant = data;
    } else {
      // Stripe merchant - use Supabase auth
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user || !user.email) {
        return NextResponse.json(
          { error: 'Unauthorized. Please sign in to complete onboarding.' },
          { status: 401 }
        );
      }

      const { data } = await supabaseAdmin
        .from('merchants')
        .select('*')
        .eq('contact_email', user.email)
        .single();
      merchant = data;
    }

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Mark onboarding as completed
    const { error: updateError } = await supabaseAdmin
      .from('merchants')
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', merchant.id);

    if (updateError) {
      console.error('Error updating onboarding status:', updateError);
      return NextResponse.json(
        { error: 'Failed to complete onboarding' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

