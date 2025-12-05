export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createStripeSubscriptionForMerchant } from '@/lib/stripeBilling';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get merchant by user email using admin client
    const { data: merchant } = await supabaseAdmin
      .from('merchants')
      .select('*')
      .eq('contact_email', user.email)
      .single();

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Create Stripe subscription
    const { subscription } = await createStripeSubscriptionForMerchant(merchant.id, 'basic');

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
    });
  } catch (error: any) {
    console.error('Error creating Stripe subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

