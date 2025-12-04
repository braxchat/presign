import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getCarrierStatus } from '@/lib/carrier-tracking';
import { sendCutoffLockedEmail } from '@/lib/email';

/**
 * Cron endpoint to update carrier statuses
 * Should be called every 30 minutes via Vercel Cron or external scheduler
 * 
 * Route: /api/cron/update-carrier-status
 * Method: GET or POST
 * Auth: Should be protected with a secret token
 */
export async function GET(request: NextRequest) {
  return await updateCarrierStatuses(request);
}

export async function POST(request: NextRequest) {
  return await updateCarrierStatuses(request);
}

async function updateCarrierStatuses(request: NextRequest) {
  try {
    // Optional: Verify cron secret token
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting carrier status update cron job...');

    // Fetch all active shipments (not delivered)
    const { data: shipments, error: fetchError } = await supabaseAdmin
      .from('shipments')
      .select('*')
      .in('carrier_status', ['PreTransit', 'InTransit', 'OutForDelivery'])
      .order('updated_at', { ascending: true });

    if (fetchError) {
      console.error('Error fetching shipments:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch shipments' },
        { status: 500 }
      );
    }

    if (!shipments || shipments.length === 0) {
      console.log('No active shipments to update');
      return NextResponse.json({ 
        updated: 0,
        message: 'No active shipments to update' 
      });
    }

    console.log(`Found ${shipments.length} active shipments to check`);

    let updatedCount = 0;
    let lockedCount = 0;
    let emailCount = 0;

    // Process each shipment
    for (const shipment of shipments) {
      try {
        // Get current status from carrier API
        const currentStatus = await getCarrierStatus(
          shipment.carrier,
          shipment.tracking_number
        );

        // Skip if API didn't return a status
        if (!currentStatus) {
          console.log(`No status update for ${shipment.tracking_number}`);
          continue;
        }

        // Skip if status hasn't changed
        if (currentStatus === shipment.carrier_status) {
          continue;
        }

        console.log(`Updating ${shipment.tracking_number}: ${shipment.carrier_status} → ${currentStatus}`);

        // Prepare update
        const updates: {
          carrier_status: typeof currentStatus;
          override_locked?: boolean;
          updated_at: string;
        } = {
          carrier_status: currentStatus,
          updated_at: new Date().toISOString(),
        };

        // If OutForDelivery, lock override and send email
        if (currentStatus === 'OutForDelivery' && !shipment.override_locked) {
          updates.override_locked = true;
          lockedCount++;

          // Get merchant info for email
          const { data: merchant } = await supabaseAdmin
            .from('merchants')
            .select('business_name')
            .eq('id', shipment.merchant_id)
            .single();

          // Send cutoff locked email
          try {
            await sendCutoffLockedEmail({
              buyerEmail: shipment.buyer_email,
              buyerName: shipment.buyer_name,
              trackingNumber: shipment.tracking_number,
              carrier: shipment.carrier,
              merchantName: merchant?.business_name || 'Merchant',
              buyerToken: shipment.override_token || '',
            });
            emailCount++;
            console.log(`Sent cutoff locked email for ${shipment.tracking_number}`);
          } catch (emailError) {
            console.error(`Failed to send cutoff locked email for ${shipment.tracking_number}:`, emailError);
            // Continue even if email fails
          }
        }

        // Update shipment
        const { error: updateError } = await supabaseAdmin
          .from('shipments')
          .update(updates)
          .eq('id', shipment.id);

        if (updateError) {
          console.error(`Failed to update shipment ${shipment.id}:`, updateError);
          continue;
        }

        updatedCount++;
      } catch (error) {
        console.error(`Error processing shipment ${shipment.id}:`, error);
        // Continue with next shipment
        continue;
      }
    }

    console.log(`Cron job completed: ${updatedCount} updated, ${lockedCount} locked, ${emailCount} emails sent`);

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      locked: lockedCount,
      emailsSent: emailCount,
      totalChecked: shipments.length,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

