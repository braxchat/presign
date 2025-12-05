export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/login
 * Handle login for both Stripe and Shopify merchants
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find merchant by email_login (for Shopify merchants with website credentials)
    // or contact_email (for Stripe merchants)
    const { data: merchantByEmailLogin } = await supabaseAdmin
      .from('merchants')
      .select('*')
      .eq('email_login', email)
      .single();

    const { data: merchantByContactEmail } = await supabaseAdmin
      .from('merchants')
      .select('*')
      .eq('contact_email', email)
      .single();

    const merchant = merchantByEmailLogin || merchantByContactEmail;

    if (!merchant) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Handle Shopify merchants
    if (merchant.billing_provider === 'shopify') {
      // Shopify merchants can only login if they have created website credentials
      if (!merchant.has_password || !merchant.password_hash) {
        return NextResponse.json(
          { 
            error: 'shopify_no_credentials',
            shop_domain: merchant.shop_domain,
          },
          { status: 403 }
        );
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, merchant.password_hash);
      if (!passwordValid) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Set shop cookie for Shopify merchant
      const cookieStore = await cookies();
      cookieStore.set('shop', merchant.shop_domain || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      return NextResponse.json({ 
        success: true,
        merchant: {
          id: merchant.id,
          billing_provider: merchant.billing_provider,
        },
      });
    }

    // Handle Stripe merchants (existing flow)
    if (merchant.billing_provider === 'stripe') {
      // For Stripe merchants, we'd typically use Supabase Auth
      // For now, we'll check if they have a password_hash (if they set one)
      // Otherwise, redirect to signup or use Supabase Auth
      
      // If merchant has password_hash, verify it
      if (merchant.password_hash) {
        const passwordValid = await bcrypt.compare(password, merchant.password_hash);
        if (!passwordValid) {
          return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
          );
        }

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set('merchant_id', merchant.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });

        return NextResponse.json({ 
          success: true,
          merchant: {
            id: merchant.id,
            billing_provider: merchant.billing_provider,
          },
        });
      }

      // If no password_hash, they should use Supabase Auth
      return NextResponse.json(
        { error: 'Please use the signup page to create an account' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

