export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * POST /api/merchant/credentials
 * Create website login credentials for Shopify merchants
 * 
 * Requirements:
 * - Must be authenticated Shopify merchant (via shop cookie)
 * - Email must be valid format
 * - Password must be at least 8 characters
 * - Email must not be already used by another merchant
 */
export async function POST(request: NextRequest) {
  try {
    // Get shop domain from cookie (Shopify authentication)
    const cookieStore = await cookies();
    const shopDomain = cookieStore.get('shop')?.value;

    if (!shopDomain) {
      return NextResponse.json(
        { error: 'Unauthorized. Shopify session required.' },
        { status: 401 }
      );
    }

    // Get merchant by shop domain
    const { data: merchant, error: merchantError } = await supabaseAdmin
      .from('merchants')
      .select('*')
      .eq('shop_domain', shopDomain)
      .single();

    if (merchantError || !merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Verify merchant is a Shopify merchant
    if (merchant.billing_provider !== 'shopify') {
      return NextResponse.json(
        { error: 'This endpoint is only available for Shopify merchants' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if email is already used by another merchant
    const { data: existingMerchant } = await supabaseAdmin
      .from('merchants')
      .select('id')
      .eq('email_login', email)
      .neq('id', merchant.id)
      .single();

    if (existingMerchant) {
      return NextResponse.json(
        { error: 'This email is already in use by another account' },
        { status: 409 }
      );
    }

    // Hash password using bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update merchant with credentials
    const { error: updateError } = await supabaseAdmin
      .from('merchants')
      .update({
        email_login: email,
        password_hash: passwordHash,
        has_password: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', merchant.id);

    if (updateError) {
      console.error('Error updating merchant credentials:', updateError);
      return NextResponse.json(
        { error: 'Failed to save credentials' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in credentials endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

