import { NextRequest, NextResponse } from 'next/server';
import { findShipmentByToken } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 400 }
      );
    }

    // Find shipment by override token
    const shipment = await findShipmentByToken(token);

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    // Get merchant info
    const { data: merchant } = await supabaseAdmin
      .from('merchants')
      .select('business_name')
      .eq('id', shipment.merchant_id)
      .single();

    // Return shipment with merchant info (exclude sensitive fields)
    return NextResponse.json({
      shipment: {
        id: shipment.id,
        tracking_number: shipment.tracking_number,
        carrier: shipment.carrier,
        carrier_status: shipment.carrier_status,
        override_status: shipment.override_status,
        buyer_name: shipment.buyer_name,
        buyer_email: shipment.buyer_email,
        requires_signature: shipment.requires_signature,
        merchant: merchant ? {
          business_name: merchant.business_name,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error fetching shipment by token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

