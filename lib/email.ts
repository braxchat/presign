import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_NAME = 'PreSign';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@presign.app';

/**
 * Generate the buyer status page URL
 */
function getStatusUrl(buyerToken: string): string {
  const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  return `${baseUrl}/status/${buyerToken}`;
}

interface ShipmentNotificationParams {
  buyerEmail: string;
  buyerName: string;
  trackingNumber: string;
  carrier: 'UPS' | 'FedEx';
  merchantName: string;
  buyerToken: string;
  requiresSignature: boolean;
}

/**
 * Send initial shipment notification email to buyer
 * Includes link to status page where they can authorize signature release
 */
export async function sendShipmentNotificationEmail({
  buyerEmail,
  buyerName,
  trackingNumber,
  carrier,
  merchantName,
  buyerToken,
  requiresSignature,
}: ShipmentNotificationParams) {
  const statusUrl = getStatusUrl(buyerToken);
  
  const subject = `Your ${merchantName} order has shipped!`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">${APP_NAME}</h1>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 18px; margin-top: 0;">Hi ${buyerName},</p>
          
          <p>Great news! Your order from <strong>${merchantName}</strong> has shipped.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p style="margin: 0;"><strong>Carrier:</strong> ${carrier}</p>
          </div>
          
          ${requiresSignature ? `
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: 600;">⚠️ Signature Required</p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                This package requires a signature upon delivery. If you won't be home, you can authorize the carrier to leave the package without a signature.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${statusUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Manage Delivery Preferences
              </a>
            </div>
          ` : `
            <p>You can track your shipment status using the link below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${statusUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Track Your Package
              </a>
            </div>
          `}
          
          <p style="font-size: 14px; color: #666;">
            If you have any questions about your order, please contact ${merchantName} directly.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999; margin: 0;">
            This email was sent by ${APP_NAME} on behalf of ${merchantName}.
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${buyerName},

Great news! Your order from ${merchantName} has shipped.

Tracking Number: ${trackingNumber}
Carrier: ${carrier}

${requiresSignature ? `
SIGNATURE REQUIRED
This package requires a signature upon delivery. If you won't be home, you can authorize the carrier to leave the package without a signature.

Manage your delivery preferences: ${statusUrl}
` : `
Track your package: ${statusUrl}
`}

If you have any questions about your order, please contact ${merchantName} directly.

---
This email was sent by ${APP_NAME} on behalf of ${merchantName}.
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: buyerEmail,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Failed to send shipment notification email:', error);
      throw error;
    }

    console.log('Shipment notification email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending shipment notification email:', error);
    throw error;
  }
}

interface OverrideConfirmationParams {
  buyerEmail: string;
  buyerName: string;
  trackingNumber: string;
  carrier: 'UPS' | 'FedEx';
  merchantName: string;
  buyerToken: string;
  typedName: string;
}

/**
 * Send confirmation email after buyer authorizes signature release
 */
export async function sendOverrideConfirmationEmail({
  buyerEmail,
  buyerName,
  trackingNumber,
  carrier,
  merchantName,
  buyerToken,
  typedName,
}: OverrideConfirmationParams) {
  const statusUrl = getStatusUrl(buyerToken);
  
  const subject = `Signature release authorized for your ${merchantName} shipment`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">${APP_NAME}</h1>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; background: #d4edda; color: #155724; padding: 10px 20px; border-radius: 50px; font-weight: 600;">
              ✓ Signature Release Authorized
            </div>
          </div>
          
          <p style="font-size: 18px; margin-top: 0;">Hi ${buyerName},</p>
          
          <p>You have successfully authorized the carrier to release your package without requiring a signature at delivery.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p style="margin: 0 0 10px 0;"><strong>Carrier:</strong> ${carrier}</p>
            <p style="margin: 0;"><strong>Authorized by:</strong> ${typedName}</p>
          </div>
          
          <div style="background: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>What happens next?</strong><br>
              The carrier will leave your package at your delivery address without requiring a signature. Please ensure a safe delivery location is available.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${statusUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              View Shipment Status
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999; margin: 0;">
            This email was sent by ${APP_NAME} on behalf of ${merchantName}.
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${buyerName},

SIGNATURE RELEASE AUTHORIZED ✓

You have successfully authorized the carrier to release your package without requiring a signature at delivery.

Tracking Number: ${trackingNumber}
Carrier: ${carrier}
Authorized by: ${typedName}

WHAT HAPPENS NEXT?
The carrier will leave your package at your delivery address without requiring a signature. Please ensure a safe delivery location is available.

View shipment status: ${statusUrl}

---
This email was sent by ${APP_NAME} on behalf of ${merchantName}.
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: buyerEmail,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Failed to send override confirmation email:', error);
      throw error;
    }

    console.log('Override confirmation email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending override confirmation email:', error);
    throw error;
  }
}

interface CutoffLockedParams {
  buyerEmail: string;
  buyerName: string;
  trackingNumber: string;
  carrier: 'UPS' | 'FedEx';
  merchantName: string;
  buyerToken: string;
}

/**
 * Send notification when package is out for delivery and override is no longer available
 */
export async function sendCutoffLockedEmail({
  buyerEmail,
  buyerName,
  trackingNumber,
  carrier,
  merchantName,
  buyerToken,
}: CutoffLockedParams) {
  const statusUrl = getStatusUrl(buyerToken);
  
  const subject = `Your ${merchantName} package is out for delivery`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">${APP_NAME}</h1>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; background: #cce5ff; color: #004085; padding: 10px 20px; border-radius: 50px; font-weight: 600;">
              🚚 Out for Delivery
            </div>
          </div>
          
          <p style="font-size: 18px; margin-top: 0;">Hi ${buyerName},</p>
          
          <p>Your package from <strong>${merchantName}</strong> is out for delivery and will arrive today!</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p style="margin: 0;"><strong>Carrier:</strong> ${carrier}</p>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 600;">⚠️ Signature Required at Delivery</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">
              This package requires a signature. Since it's already out for delivery, the signature release option is no longer available. Please ensure someone is available to sign for the package.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            If you miss the delivery, the carrier will leave a notice with instructions for rescheduling or pickup.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${statusUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Track Your Package
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999; margin: 0;">
            This email was sent by ${APP_NAME} on behalf of ${merchantName}.
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${buyerName},

🚚 OUT FOR DELIVERY

Your package from ${merchantName} is out for delivery and will arrive today!

Tracking Number: ${trackingNumber}
Carrier: ${carrier}

⚠️ SIGNATURE REQUIRED AT DELIVERY
This package requires a signature. Since it's already out for delivery, the signature release option is no longer available. Please ensure someone is available to sign for the package.

If you miss the delivery, the carrier will leave a notice with instructions for rescheduling or pickup.

Track your package: ${statusUrl}

---
This email was sent by ${APP_NAME} on behalf of ${merchantName}.
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: buyerEmail,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Failed to send cutoff locked email:', error);
      throw error;
    }

    console.log('Cutoff locked email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending cutoff locked email:', error);
    throw error;
  }
}

