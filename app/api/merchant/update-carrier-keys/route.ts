export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

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

    // Parse request body
    const body = await request.json();
    const {
      upsApiKey,
      upsUsername,
      upsPassword,
      upsAccountNumber,
      fedexApiKey,
      fedexSecretKey,
      fedexAccountNumber,
      fedexMeterNumber,
    } = body;

    // Update merchant carrier keys using admin client
    const { error: updateError } = await supabaseAdmin
      .from('merchants')
      .update({
        ups_api_key: upsApiKey || null,
        ups_username: upsUsername || null,
        ups_password: upsPassword || null,
        ups_account_number: upsAccountNumber || null,
        fedex_api_key: fedexApiKey || null,
        fedex_secret_key: fedexSecretKey || null,
        fedex_account_number: fedexAccountNumber || null,
        fedex_meter_number: fedexMeterNumber || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', merchant.id);

    if (updateError) {
      console.error('Error updating carrier keys:', updateError);
      return NextResponse.json(
        { error: 'Failed to update carrier keys' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Carrier key save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

