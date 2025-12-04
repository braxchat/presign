import { randomUUID } from 'crypto';

export async function getUpsSignatureStatus({
  trackingNumber,
  apiKey,
  username,
  password,
}: {
  trackingNumber: string;
  apiKey: string;
  username: string;
  password: string;
}) {
  try {
    const url = "https://onlinetools.ups.com/api/track/v2/details/" + trackingNumber;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "AccessLicenseNumber": apiKey,
        "Username": username,
        "Password": password,
        "transId": randomUUID(),
        "transactionSrc": "presign",
      },
    });

    const json = await response.json();
    const code = json?.trackResponse?.shipment?.[0]?.package?.[0]?.deliveryConfirmation?.code;

    return code || null; // 1, 2, 3
  } catch (err) {
    console.error("UPS tracking error:", err);
    return null;
  }
}

