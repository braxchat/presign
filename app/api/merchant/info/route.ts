export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { requireActiveSubscription } from '@/lib/requireActiveSubscription';

/**
 * GET /api/merchant/info
 * Get current merchant information
 * Returns merchant data including billing_provider and has_password
 */
export async function GET(request: NextRequest) {
  try {
    // Get merchant (validates authentication)
    const merchant = await requireActiveSubscription(undefined, request);

    // Return merchant info (exclude sensitive fields like password_hash)
    return NextResponse.json({
      id: merchant.id,
      business_name: merchant.business_name,
      contact_email: merchant.contact_email,
      email: merchant.email,
      billing_provider: merchant.billing_provider,
      shop_domain: merchant.shop_domain,
      has_password: merchant.has_password,
      email_login: merchant.email_login, // Return email_login so UI can show it
    });
  } catch (error: any) {
    if (error.name === 'SubscriptionRequiredError') {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    console.error('Error fetching merchant info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

