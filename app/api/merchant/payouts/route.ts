export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPayoutsByMerchant } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
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

    // Parse query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'pending' | 'processing' | 'completed' | 'failed' | null;
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get payouts
    const payouts = await getPayoutsByMerchant(merchant.id, {
      status: status || undefined,
      limit,
    });

    return NextResponse.json({ payouts });
  } catch (error) {
    console.error('Error fetching merchant payouts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

