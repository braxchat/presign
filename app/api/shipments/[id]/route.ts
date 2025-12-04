import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/shipments/[id] - Get single shipment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch shipment from database
    // const { data: shipment, error } = await supabase
    //   .from('shipments')
    //   .select('*')
    //   .eq('id', id)
    //   .eq('merchant_id', user.id)
    //   .single();

    return NextResponse.json({ 
      message: `Shipment ${id} API endpoint - implement database query`,
      shipment: null 
    });
  } catch (error) {
    console.error('Error fetching shipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/shipments/[id] - Update shipment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // TODO: Update shipment in database
    // const { data: shipment, error } = await supabase
    //   .from('shipments')
    //   .update(body)
    //   .eq('id', id)
    //   .eq('merchant_id', user.id)
    //   .select()
    //   .single();

    return NextResponse.json({ 
      message: `Shipment ${id} update API endpoint - implement database update`,
      shipment: null 
    });
  } catch (error) {
    console.error('Error updating shipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/shipments/[id] - Delete shipment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Delete shipment from database
    // const { error } = await supabase
    //   .from('shipments')
    //   .delete()
    //   .eq('id', id)
    //   .eq('merchant_id', user.id);

    return NextResponse.json({ 
      message: `Shipment ${id} delete API endpoint - implement database delete`,
      success: true 
    });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

