export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { findShipmentByToken } from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, typedName } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 400 }
      );
    }

    if (!typedName || typedName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing typed signature name' },
        { status: 400 }
      );
    }

    // Capture IP address and timestamp
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || null;
    const authTimestamp = new Date().toISOString();

    // Find shipment by token
    const shipment = await findShipmentByToken(token);

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    // Check if already locked (OutForDelivery or Delivered)
    if (shipment.carrier_status === 'OutForDelivery' || shipment.carrier_status === 'Delivered') {
      return NextResponse.json(
        { error: 'Shipment is out for delivery or already delivered. Override is no longer available.' },
        { status: 400 }
      );
    }

    // Check if override already requested or completed
    if (shipment.override_status !== 'none') {
      return NextResponse.json(
        { error: 'Override already processed' },
        { status: 400 }
      );
    }

    // Get merchant info for Stripe account
    const { data: merchant, error: merchantError } = await supabaseAdmin
      .from('merchants')
      .select('stripe_account_id')
      .eq('id', shipment.merchant_id)
      .single();

    if (merchantError || !merchant) {
      console.error('Merchant not found:', merchantError);
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Create Stripe Checkout Session
    const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || '';
    const successUrl = `${baseUrl}/status/${token}?success=true`;
    const cancelUrl = `${baseUrl}/status/${token}?canceled=true`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Signature Release Authorization',
              description: `Authorize ${shipment.carrier} to release package ${shipment.tracking_number} without signature`,
            },
            unit_amount: 299, // $2.99
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        shipment_id: shipment.id,
        override_token: token,
        tracking_number: shipment.tracking_number,
        auth_name: typedName.trim(),
        auth_ip: ipAddress,
        auth_timestamp: authTimestamp,
        user_agent: userAgent || '',
      },
      customer_email: shipment.buyer_email,
    };

    // If merchant has Stripe Connect account, use it
    if (merchant.stripe_account_id) {
      sessionParams.payment_intent_data = {
        application_fee_amount: 50, // $0.50 fee to platform
      };
      sessionParams.payment_method_types = ['card'];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Update shipment with checkout session ID and mark as requested
    await supabaseAdmin
      .from('shipments')
      .update({
        override_status: 'requested',
        stripe_checkout_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', shipment.id);

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error starting buyer checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

