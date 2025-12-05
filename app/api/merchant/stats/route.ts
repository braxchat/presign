export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { getMerchantStats } from '@/lib/db';
import { requireActiveSubscription } from '@/lib/requireActiveSubscription';

export async function GET(request: NextRequest) {
  try {
    // Get merchant and verify active subscription
    const merchant = await requireActiveSubscription(undefined, request);

    // Get stats
    const stats = await getMerchantStats(merchant.id);

    return NextResponse.json(stats);
  } catch (error: any) {
    if (error.name === 'SubscriptionRequiredError') {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    console.error('Error fetching merchant stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

