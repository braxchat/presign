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

/**
 * Base email template wrapper
 */
function getEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>PreSign - Package Delivery Management</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse:collapse;border-spacing:0;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    /* Client-specific styles */
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      min-width: 100%;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    /* Prevent iOS blue links */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    /* Desktop styles */
    @media only screen and (min-width: 600px) {
      .email-container {
        width: 600px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; width: 100%; background-color: #f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
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
  
  const content = `
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${APP_NAME}</h1>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6; color: #1f2937; font-weight: 500;">Hi ${buyerName},</p>
        
        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
          Great news! Your order from <strong style="color: #1f2937;">${merchantName}</strong> has shipped.
        </p>
        
        <!-- Tracking Info Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 0 0 12px 0;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Tracking Number</p>
                    <p style="margin: 8px 0 0 0; font-size: 18px; font-family: 'Courier New', monospace; font-weight: 600; color: #1f2937; word-break: break-all;">${trackingNumber}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Carrier</p>
                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 500; color: #1f2937;">${carrier}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        ${requiresSignature ? `
          <!-- Signature Required Alert -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 6px;">
            <tr>
              <td style="padding: 16px 20px;">
                <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #92400e;">
                  ⚠️ Signature Required
                </p>
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #78350f;">
                  This package requires a signature upon delivery. If you won't be home, you can authorize the carrier to leave the package without a signature.
                </p>
              </td>
            </tr>
          </table>
          
          <!-- CTA Button -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
            <tr>
              <td align="center" style="padding: 0;">
                <a href="${statusUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);">
                  Manage Delivery Preferences
                </a>
              </td>
            </tr>
          </table>
        ` : `
          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
            You can track your shipment status using the link below:
          </p>
          
          <!-- CTA Button -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
            <tr>
              <td align="center" style="padding: 0;">
                <a href="${statusUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);">
                  Track Your Package
                </a>
              </td>
            </tr>
          </table>
        `}
        
        <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
          If you have any questions about your order, please contact <strong style="color: #1f2937;">${merchantName}</strong> directly.
        </p>
        
        <!-- Divider -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px 0;">
          <tr>
            <td style="border-top: 1px solid #e5e7eb;"></td>
          </tr>
        </table>
        
        <!-- Footer -->
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
          This email was sent by <strong style="color: #6b7280;">${APP_NAME}</strong> on behalf of ${merchantName}.
        </p>
      </td>
    </tr>
  `;
  
  const html = getEmailTemplate(content);

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
  
  const content = `
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${APP_NAME}</h1>
      </td>
    </tr>
    
    <!-- Success Badge -->
    <tr>
      <td style="padding: 30px 30px 0 30px; text-align: center;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto; background-color: #d1fae5; border-radius: 50px; padding: 12px 24px;">
          <tr>
            <td>
              <p style="margin: 0; font-size: 15px; font-weight: 600; color: #065f46; letter-spacing: 0.3px;">
                ✓ Signature Release Authorized
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 30px 30px 40px 30px;">
        <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6; color: #1f2937; font-weight: 500;">Hi ${buyerName},</p>
        
        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
          You have successfully authorized the carrier to release your package without requiring a signature at delivery.
        </p>
        
        <!-- Tracking Info Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 0 0 12px 0;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Tracking Number</p>
                    <p style="margin: 8px 0 0 0; font-size: 18px; font-family: 'Courier New', monospace; font-weight: 600; color: #1f2937; word-break: break-all;">${trackingNumber}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Carrier</p>
                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 500; color: #1f2937;">${carrier}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Authorized by</p>
                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 500; color: #1f2937;">${typedName}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Info Box -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 6px;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1e40af;">
                What happens next?
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1e3a8a;">
                The carrier will leave your package at your delivery address without requiring a signature. Please ensure a safe delivery location is available.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
          <tr>
            <td align="center" style="padding: 0;">
              <a href="${statusUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);">
                View Shipment Status
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Divider -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px 0;">
          <tr>
            <td style="border-top: 1px solid #e5e7eb;"></td>
          </tr>
        </table>
        
        <!-- Footer -->
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
          This email was sent by <strong style="color: #6b7280;">${APP_NAME}</strong> on behalf of ${merchantName}.
        </p>
      </td>
    </tr>
  `;
  
  const html = getEmailTemplate(content);

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
  
  const content = `
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${APP_NAME}</h1>
      </td>
    </tr>
    
    <!-- Delivery Badge -->
    <tr>
      <td style="padding: 30px 30px 0 30px; text-align: center;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto; background-color: #dbeafe; border-radius: 50px; padding: 12px 24px;">
          <tr>
            <td>
              <p style="margin: 0; font-size: 15px; font-weight: 600; color: #1e40af; letter-spacing: 0.3px;">
                🚚 Out for Delivery
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 30px 30px 40px 30px;">
        <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6; color: #1f2937; font-weight: 500;">Hi ${buyerName},</p>
        
        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
          Your package from <strong style="color: #1f2937;">${merchantName}</strong> is out for delivery and will arrive today!
        </p>
        
        <!-- Tracking Info Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 0 0 12px 0;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Tracking Number</p>
                    <p style="margin: 8px 0 0 0; font-size: 18px; font-family: 'Courier New', monospace; font-weight: 600; color: #1f2937; word-break: break-all;">${trackingNumber}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Carrier</p>
                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 500; color: #1f2937;">${carrier}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Warning Alert -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 6px;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #92400e;">
                ⚠️ Signature Required at Delivery
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #78350f;">
                This package requires a signature. Since it's already out for delivery, the signature release option is no longer available. Please ensure someone is available to sign for the package.
              </p>
            </td>
          </tr>
        </table>
        
        <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
          If you miss the delivery, the carrier will leave a notice with instructions for rescheduling or pickup.
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
          <tr>
            <td align="center" style="padding: 0;">
              <a href="${statusUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);">
                Track Your Package
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Divider -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px 0;">
          <tr>
            <td style="border-top: 1px solid #e5e7eb;"></td>
          </tr>
        </table>
        
        <!-- Footer -->
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
          This email was sent by <strong style="color: #6b7280;">${APP_NAME}</strong> on behalf of ${merchantName}.
        </p>
      </td>
    </tr>
  `;
  
  const html = getEmailTemplate(content);

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
