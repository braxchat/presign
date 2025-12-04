import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/shipments - List all shipments for authenticated merchant
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch shipments from database
    // const { data: shipments, error } = await supabase
    //   .from('shipments')
    //   .select('*')
    //   .eq('merchant_id', user.id)
    //   .order('created_at', { ascending: false });

    return NextResponse.json({ 
      message: 'Shipments API endpoint - implement database query',
      shipments: [] 
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/shipments - Create a new shipment
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { trackingNumber, carrier, buyerName, buyerEmail, orderNumber, itemValueCents } = body;

    // Validate required fields
    if (!trackingNumber || !carrier || !buyerName || !buyerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Create shipment in database
    // const { data: shipment, error } = await supabase
    //   .from('shipments')
    //   .insert({
    //     merchant_id: user.id,
    //     tracking_number: trackingNumber,
    //     carrier,
    //     buyer_name: buyerName,
    //     buyer_email: buyerEmail,
    //     order_number: orderNumber,
    //     item_value_cents: itemValueCents,
    //   })
    //   .select()
    //   .single();

    return NextResponse.json({ 
      message: 'Shipment creation API endpoint - implement database insert',
      shipment: { trackingNumber, carrier, buyerName, buyerEmail }
    });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

