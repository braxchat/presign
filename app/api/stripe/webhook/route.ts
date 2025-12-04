import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { sendOverrideConfirmationEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error('Missing Stripe signature or webhook secret');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const checkoutSessionId = session.id;

      // Find shipment by stripe_checkout_session_id
      const { data: shipment, error: shipmentError } = await supabaseAdmin
        .from('shipments')
        .select('*')
        .eq('stripe_checkout_session_id', checkoutSessionId)
        .single();

      if (shipmentError || !shipment) {
        console.error('Shipment not found for checkout session:', checkoutSessionId, shipmentError);
        return NextResponse.json({ received: true });
      }

      // Get merchant info
      const { data: merchant } = await supabaseAdmin
        .from('merchants')
        .select('business_name')
        .eq('id', shipment.merchant_id)
        .single();

      // Extract metadata for signature authorization
      const authName = session.metadata?.auth_name;
      const authIp = session.metadata?.auth_ip;
      const authTimestamp = session.metadata?.auth_timestamp;
      const userAgent = session.metadata?.user_agent;

      // Create signature authorization record
      if (authName && authIp && authTimestamp) {
        const { error: authError } = await supabaseAdmin
          .from('signature_authorizations')
          .insert({
            shipment_id: shipment.id,
            typed_name: authName,
            ip_address: authIp,
            user_agent: userAgent || null,
            created_at: authTimestamp,
          });

        if (authError) {
          console.error('Failed to create signature authorization:', authError);
        }
      }

      // Update shipment: mark payment as paid, set override status, set merchant earnings
      const merchantEarningsCents = 100; // $1.00 per override
      
      const { error: updateError } = await supabaseAdmin
        .from('shipments')
        .update({
          stripe_payment_status: 'paid',
          override_status: 'requested',
          merchant_earnings_cents: merchantEarningsCents,
          updated_at: new Date().toISOString(),
        })
        .eq('id', shipment.id);

      if (updateError) {
        console.error('Failed to update shipment:', updateError);
        return NextResponse.json({ received: true });
      }

      // Create payout row for merchant
      const { error: payoutError } = await supabaseAdmin
        .from('payouts')
        .insert({
          merchant_id: shipment.merchant_id,
          amount_cents: merchantEarningsCents,
          override_count: 1,
          status: 'pending',
          requested_at: new Date().toISOString(),
        });

      if (payoutError) {
        console.error('Failed to create payout:', payoutError);
        // Don't fail the webhook if payout creation fails
      }

      // Send override confirmation email
      try {
        await sendOverrideConfirmationEmail({
          buyerEmail: shipment.buyer_email,
          buyerName: shipment.buyer_name,
          trackingNumber: shipment.tracking_number,
          carrier: shipment.carrier,
          merchantName: merchant?.business_name || 'Merchant',
          buyerToken: shipment.override_token || '',
          typedName: authName || shipment.buyer_name,
        });
      } catch (emailError) {
        console.error('Failed to send override confirmation email:', emailError);
        // Don't fail the webhook if email fails
      }

      console.log('Checkout completed for shipment:', shipment.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

