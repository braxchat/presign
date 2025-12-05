export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { findShipmentByToken, createSignatureAuthorization } from '@/lib/db';
import { createAuthorizationPdf } from '@/lib/pdf';
import { sendAuthorizationPdfToMerchant, sendOverrideConfirmationEmail } from '@/lib/email';

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
        { error: 'Shipment is out for delivery or already delivered. Authorization is no longer available.' },
        { status: 400 }
      );
    }

    // Check if authorization already requested or completed
    if (shipment.override_status !== 'none') {
      return NextResponse.json(
        { error: 'Authorization already processed' },
        { status: 400 }
      );
    }

    // Get merchant info
    const { data: merchant, error: merchantError } = await supabaseAdmin
      .from('merchants')
      .select('id, business_name, email')
      .eq('id', shipment.merchant_id)
      .single();

    if (merchantError || !merchant) {
      console.error('Merchant not found:', merchantError);
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Create signature authorization record
    try {
      await createSignatureAuthorization({
        shipmentId: shipment.id,
        typedName: typedName.trim(),
        ipAddress,
        userAgent: userAgent || undefined,
      });
    } catch (authError: any) {
      console.error('Error creating signature authorization:', authError);
      return NextResponse.json(
        { error: 'Failed to create authorization' },
        { status: 500 }
      );
    }

    // Generate authorization PDF
    let pdfUrl: string | null = null;
    try {
      pdfUrl = await createAuthorizationPdf({
        shipmentId: shipment.id,
        buyerName: shipment.buyer_name,
        buyerEmail: shipment.buyer_email,
        merchantName: merchant.business_name || null,
        trackingNumber: shipment.tracking_number,
        carrier: shipment.carrier,
        orderId: shipment.order_number,
        authTimestamp,
        buyerIp: ipAddress,
      });
    } catch (pdfError) {
      console.error('Error generating authorization PDF:', pdfError);
      // Continue even if PDF generation fails
    }

    // Update shipment: mark as requested and store PDF URL
    const { error: updateError } = await supabaseAdmin
      .from('shipments')
      .update({
        override_status: 'requested',
        authorization_pdf_url: pdfUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', shipment.id);

    if (updateError) {
      console.error('Failed to update shipment:', updateError);
      return NextResponse.json(
        { error: 'Failed to update shipment' },
        { status: 500 }
      );
    }

    // Send confirmation email to buyer
    try {
      await sendOverrideConfirmationEmail({
        buyerEmail: shipment.buyer_email,
        buyerName: shipment.buyer_name,
        trackingNumber: shipment.tracking_number,
        carrier: shipment.carrier,
        merchantName: merchant.business_name || 'Merchant',
        buyerToken: shipment.buyer_status_token || shipment.override_token || token,
        typedName: typedName.trim(),
      });
    } catch (emailError) {
      console.error('Failed to send buyer confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send authorization PDF email to merchant
    if (pdfUrl && merchant.email) {
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
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error starting buyer authorization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
