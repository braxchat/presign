export async function getFedexSignatureStatus({
  trackingNumber,
  apiKey,
  secretKey,
  meterNumber,
  accountNumber,
}: {
  trackingNumber: string;
  apiKey: string;
  secretKey: string;
  meterNumber: string;
  accountNumber: string;
}) {
  try {
    const body = {
      trackingInfo: [
        {
          trackingNumberInfo: { trackingNumber }
        }
      ]
    };

    const response = await fetch("https://apis.fedex.com/track/v1/trackingnumbers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-locale": "en_US",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    const sig = json?.output?.completeTrackResults?.[0]?.trackResults?.[0]?.standardSignatureDescription;

    return sig || null; // DIRECT / ADULT / INDIRECT / NONE
  } catch (err) {
    console.error("FedEx tracking error:", err);
    return null;
  }
}

