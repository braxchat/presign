export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { sendOverrideConfirmationEmail, sendAuthorizationPdfToMerchant } from '@/lib/email';
import { createAuthorizationPdf } from '@/lib/pdf';
import { stripe } from '@/lib/stripe';
import { updateMerchantSubscriptionFromStripe } from '@/lib/stripeBilling';

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
        .select('email, business_name')
        .eq('id', shipment.merchant_id)
        .single();

      // Extract metadata for signature authorization
      const authName = session.metadata?.auth_name;
      const authIp = session.metadata?.auth_ip;
      const authTimestampFromMetadata = session.metadata?.auth_timestamp;
      const userAgent = session.metadata?.user_agent;

      // Create signature authorization record only if all required metadata exists
      if (authName && authIp && authTimestampFromMetadata) {
        const { error: authError } = await supabaseAdmin
          .from('signature_authorizations')
          .insert({
            shipment_id: shipment.id,
            typed_name: authName,
            ip_address: authIp,
            user_agent: userAgent || null,
            created_at: authTimestampFromMetadata,
          });

        if (authError) {
          console.error('Failed to create signature authorization:', authError);
        }
      }

      // Generate authorization PDF
      // Use metadata timestamp if available, otherwise fallback to current time
      const authTimestampForPdf = authTimestampFromMetadata || new Date().toISOString();
      let pdfUrl: string | null = null;
      try {
        pdfUrl = await createAuthorizationPdf({
          shipmentId: shipment.id,
          buyerName: shipment.buyer_name,
          buyerEmail: shipment.buyer_email,
          merchantName: merchant?.business_name || null,
          trackingNumber: shipment.tracking_number,
          carrier: shipment.carrier,
          orderId: shipment.order_number,
          authTimestamp: authTimestampForPdf,
          buyerIp: authIp || null,
        });

        if (!pdfUrl) {
          console.error('Failed to generate authorization PDF');
        }
      } catch (pdfError) {
        console.error('Error generating authorization PDF:', pdfError);
        // Continue with webhook processing even if PDF generation fails
      }

      // Update shipment: mark payment as paid, set override status to completed, set merchant earnings, store PDF URL
      const merchantEarningsCents = 100; // $1.00 per override
      
      const { error: updateError } = await supabaseAdmin
        .from('shipments')
        .update({
          stripe_payment_status: 'paid',
          override_status: 'completed',
          merchant_earnings_cents: merchantEarningsCents,
          authorization_pdf_url: pdfUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', shipment.id);

      if (updateError) {
        console.error('Failed to update shipment:', updateError);
        return NextResponse.json({ received: true });
      }

      // Create payout row for merchant
      // Only create payout if refund_status is 'none' (no refund requested)
      if (shipment.refund_status === 'none' || !shipment.refund_status) {
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
      } else {
        console.log(`Skipping payout creation for shipment ${shipment.id} - refund_status is ${shipment.refund_status}`);
      }

      // Send override confirmation email to buyer
      try {
        await sendOverrideConfirmationEmail({
          buyerEmail: shipment.buyer_email,
          buyerName: shipment.buyer_name,
          trackingNumber: shipment.tracking_number,
          carrier: shipment.carrier,
          merchantName: merchant?.business_name || 'Merchant',
          buyerToken: shipment.buyer_status_token || shipment.override_token || '',
          typedName: authName || shipment.buyer_name,
        });
      } catch (emailError) {
        console.error('Failed to send override confirmation email:', emailError);
        // Don't fail the webhook if email fails
      }

      // Send authorization PDF email to merchant
      if (pdfUrl && merchant?.email) {
        try {
          await sendAuthorizationPdfToMerchant({
            merchantEmail: merchant.email,
            merchantName: merchant.business_name,
            buyerName: shipment.buyer_name,
            trackingNumber: shipment.tracking_number,
            carrier: shipment.carrier,
            orderId: shipment.order_number,
            pdfUrl,
            dashboardUrl: `${process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL || ''}/merchant/dashboard`,
          });
        } catch (merchantEmailError) {
          console.error('Failed to send merchant authorization email:', merchantEmailError);
          // Don't fail the webhook if merchant email fails
        }
      } else {
        if (!pdfUrl) {
          console.warn('PDF URL not available, skipping merchant email');
        }
        if (!merchant?.email) {
          console.warn('Merchant email not available, skipping merchant email');
        }
      }

      console.log('Checkout completed for shipment:', shipment.id);
    }

    // Handle subscription events for merchant billing
    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object as Stripe.Subscription;
      await updateMerchantSubscriptionFromStripe(subscription);
      console.log('Subscription created for merchant:', subscription.metadata?.merchant_id);
    }

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      await updateMerchantSubscriptionFromStripe(subscription);
      console.log('Subscription updated for merchant:', subscription.metadata?.merchant_id);
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      await updateMerchantSubscriptionFromStripe(subscription);
      console.log('Subscription deleted for merchant:', subscription.metadata?.merchant_id);
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      // Access subscription property using bracket notation to bypass TypeScript strict checking
      // Stripe Invoice objects do have a subscription property, but it's not always in the type definition
      const subscriptionId = (invoice as any).subscription as string | Stripe.Subscription | null;
      if (subscriptionId) {
        const subscriptionIdString = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId.id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionIdString);
        await updateMerchantSubscriptionFromStripe(subscription);
        console.log('Payment failed for subscription:', subscription.id);
      }
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

