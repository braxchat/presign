export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPayout, getMerchantStats } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase-admin';

const MINIMUM_PAYOUT_CENTS = 2500; // $25.00

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

    // Get merchant by user email
    const { data: merchant, error: merchantError } = await supabaseAdmin
      .from('merchants')
      .select('id')
      .eq('contact_email', user.email)
      .single();

    if (merchantError || !merchant || !merchant.id) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Get merchant stats to calculate available balance
    const stats = await getMerchantStats(merchant.id);

    // Check minimum payout threshold
    if (stats.availableBalanceCents < MINIMUM_PAYOUT_CENTS) {
      return NextResponse.json(
        { 
          error: `Minimum payout threshold is $${(MINIMUM_PAYOUT_CENTS / 100).toFixed(2)}. Available balance: $${(stats.availableBalanceCents / 100).toFixed(2)}` 
        },
        { status: 400 }
      );
    }

    // Count completed overrides that have been paid but not yet included in a payout
    // This is the number of overrides contributing to the available balance
    const { count: unpaidOverrides } = await supabaseAdmin
      .from('shipments')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id)
      .eq('override_status', 'completed')
      .eq('stripe_payment_status', 'paid')
      .not('merchant_earnings_cents', 'is', null);

    // Create payout request
    const payout = await createPayout({
      merchantId: merchant.id,
      amountCents: stats.availableBalanceCents,
      overrideCount: unpaidOverrides || 0,
    });

    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        amountCents: payout.amount_cents,
        overrideCount: payout.override_count,
        status: payout.status,
        requestedAt: payout.requested_at,
      },
    });
  } catch (error) {
    console.error('Error creating payout request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

