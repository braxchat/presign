import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/override/[token] - Get shipment by override token (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = await createClient();

    // TODO: Fetch shipment by override token
    // const { data: shipment, error } = await supabase
    //   .from('shipments')
    //   .select('tracking_number, carrier, carrier_status, override_status')
    //   .eq('override_token', token)
    //   .single();

    return NextResponse.json({ 
      message: `Override token ${token} lookup - implement database query`,
      shipment: null 
    });
  } catch (error) {
    console.error('Error fetching override:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/override/[token] - Submit signature authorization (public)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = await createClient();
    
    const body = await request.json();
    const { typedName, agreed } = body;

    // Get client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!typedName || !agreed) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Verify token and check if override is allowed
    // TODO: Create signature authorization record
    // TODO: Update shipment override_status
    // TODO: Process payment

    return NextResponse.json({ 
      message: `Signature authorization for token ${token} - implement backend logic`,
      authorization: {
        typedName,
        ip,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error processing override:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

