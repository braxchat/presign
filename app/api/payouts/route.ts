import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/payouts - Get payout history for authenticated merchant
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch payouts from database
    // const { data: payouts, error } = await supabase
    //   .from('payouts')
    //   .select('*')
    //   .eq('merchant_id', user.id)
    //   .order('requested_at', { ascending: false });

    return NextResponse.json({ 
      message: 'Payouts API endpoint - implement database query',
      payouts: [],
      balance: {
        available: 0,
        pending: 0,
        totalEarned: 0,
      }
    });
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/payouts - Request a new payout
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Calculate available balance
    // TODO: Verify minimum payout threshold ($25)
    // TODO: Create payout request
    // TODO: Initiate payout processing

    return NextResponse.json({ 
      message: 'Payout request API endpoint - implement payout processing',
      payout: null
    });
  } catch (error) {
    console.error('Error requesting payout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

