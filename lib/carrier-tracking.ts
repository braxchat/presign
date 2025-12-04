/**
 * Carrier tracking API helpers
 * These functions query UPS and FedEx APIs to get current shipment status
 */

export type CarrierStatus = 'PreTransit' | 'InTransit' | 'OutForDelivery' | 'Delivered';

/**
 * Get current tracking status from UPS API
 */
export async function getUPSStatus(trackingNumber: string): Promise<CarrierStatus | null> {
  const apiKey = process.env.UPS_API_KEY;
  
  if (!apiKey) {
    console.warn('UPS_API_KEY not configured, skipping UPS tracking');
    return null;
  }

  try {
    // TODO: Implement actual UPS API call
    // Example: https://developer.ups.com/api/reference
    // 
    // const response = await fetch('https://onlinetools.ups.com/track/v1/details/{trackingNumber}', {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // 
    // const data = await response.json();
    // return mapUPSStatus(data.trackResponse.shipment[0].package[0].activity[0].status);

    // Placeholder: Return null to skip for now
    console.log('UPS tracking not implemented yet for:', trackingNumber);
    return null;
  } catch (error) {
    console.error('Error fetching UPS status:', error);
    return null;
  }
}

/**
 * Get current tracking status from FedEx API
 */
export async function getFedExStatus(trackingNumber: string): Promise<CarrierStatus | null> {
  const apiKey = process.env.FEDEX_API_KEY;
  
  if (!apiKey) {
    console.warn('FEDEX_API_KEY not configured, skipping FedEx tracking');
    return null;
  }

  try {
    // TODO: Implement actual FedEx API call
    // Example: https://developer.fedex.com/api/en-us/catalog/track/v1/docs.html
    // 
    // const response = await fetch('https://apis.fedex.com/track/v1/trackingnumbers', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     trackingInfo: [{
    //       trackingNumberInfo: {
    //         trackingNumber,
    //       },
    //     }],
    //   }),
    // });
    // 
    // const data = await response.json();
    // return mapFedExStatus(data.output.completeTrackResults[0].trackResults[0].latestStatusDetail);

    // Placeholder: Return null to skip for now
    console.log('FedEx tracking not implemented yet for:', trackingNumber);
    return null;
  } catch (error) {
    console.error('Error fetching FedEx status:', error);
    return null;
  }
}

/**
 * Get current carrier status for a tracking number
 */
export async function getCarrierStatus(
  carrier: 'UPS' | 'FedEx',
  trackingNumber: string
): Promise<CarrierStatus | null> {
  if (carrier === 'UPS') {
    return await getUPSStatus(trackingNumber);
  } else if (carrier === 'FedEx') {
    return await getFedExStatus(trackingNumber);
  }
  
  return null;
}

/**
 * Map UPS API status to our CarrierStatus enum
 */
function mapUPSStatus(upsStatus: string): CarrierStatus {
  const status = upsStatus?.toLowerCase() || '';
  
  if (status.includes('delivered')) {
    return 'Delivered';
  }
  if (status.includes('out for delivery') || status.includes('out_for_delivery')) {
    return 'OutForDelivery';
  }
  if (status.includes('in transit') || status.includes('in_transit')) {
    return 'InTransit';
  }
  
  return 'PreTransit';
}

/**
 * Map FedEx API status to our CarrierStatus enum
 */
function mapFedExStatus(fedexStatus: string): CarrierStatus {
  const status = fedexStatus?.toLowerCase() || '';
  
  if (status.includes('delivered')) {
    return 'Delivered';
  }
  if (status.includes('out for delivery') || status.includes('on_fedex_vehicle')) {
    return 'OutForDelivery';
  }
  if (status.includes('in transit') || status.includes('in_transit')) {
    return 'InTransit';
  }
  
  return 'PreTransit';
}

