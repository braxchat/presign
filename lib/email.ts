import { Resend } from 'resend';
import { DEFAULT_SENDER } from './email/sender';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_NAME = 'PreSign';

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
  
  const subject = `Your package requires a Direct Signature — authorize delivery`;
  
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
          Sent automatically by <strong style="color: #6b7280;">${APP_NAME}</strong>
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
Sent automatically by ${APP_NAME}
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
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
        
        <!-- Delivery Guarantee Box -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 6px;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #92400e;">
                PreSign Delivery Guarantee
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #78350f;">
                If your carrier still requires a physical signature even after authorizing release, PreSign provides a Delivery Guarantee. If this occurs, take a photo of the official ${carrier} delivery attempt slip and email it to <a href="mailto:refunds@presign.app" style="color: #92400e; text-decoration: underline;">refunds@presign.app</a>.
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
          Sent automatically by <strong style="color: #6b7280;">${APP_NAME}</strong>
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

PRESIGN DELIVERY GUARANTEE
If your carrier still requires a physical signature even after authorizing release, PreSign provides a Delivery Guarantee. If this occurs, take a photo of the official ${carrier} delivery attempt slip and email it to refunds@presign.app.

View shipment status: ${statusUrl}

---
Sent automatically by ${APP_NAME}
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
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
  
  const subject = `Delivery in Progress — Signature Cannot Be Removed`;
  
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
          Sent automatically by <strong style="color: #6b7280;">${APP_NAME}</strong>
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
Sent automatically by ${APP_NAME}
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
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

interface AuthorizationPdfToMerchantParams {
  merchantEmail: string;
  merchantName: string | null;
  buyerName: string;
  trackingNumber: string | null;
  carrier: string | null;
  orderId: string | null;
  pdfUrl: string;
  dashboardUrl: string;
}

/**
 * Send authorization PDF to merchant via Resend
 * Includes PDF download link, shipment info, and dashboard link
 */
export async function sendAuthorizationPdfToMerchant({
  merchantEmail,
  merchantName,
  buyerName,
  trackingNumber,
  carrier,
  orderId,
  pdfUrl,
  dashboardUrl,
}: AuthorizationPdfToMerchantParams) {
  if (!merchantEmail) {
    console.warn('No merchant email provided, skipping email');
    return;
  }

  const safeMerchantName = merchantName || 'Merchant';
  const safeCarrier = carrier || 'Carrier';
  const safeTracking = trackingNumber || 'N/A';
  const safeOrderId = orderId || 'N/A';

  const subject = `Buyer Authorized Remote Delivery — Action Required`;

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
        <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6; color: #1f2937; font-weight: 500;">Hello ${safeMerchantName},</p>
        
        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
          Your buyer <strong style="color: #1f2937;">${buyerName}</strong> has completed a remote delivery authorization for:
        </p>
        
        <!-- Shipment Info Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 20px;">
              <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #374151;"><strong>Order ID:</strong> ${safeOrderId}</p>
              <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #374151;"><strong>Tracking:</strong> ${safeTracking}</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151;"><strong>Carrier:</strong> ${safeCarrier}</p>
            </td>
          </tr>
        </table>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
          You can download the signed authorization PDF here:
        </p>
        
        <!-- PDF Download Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
          <tr>
            <td align="center" style="padding: 0;">
              <a href="${pdfUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);">
                Download Authorization PDF
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Action Required Alert -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #92400e;">
                ⚠️ Action Required
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #78350f;">
                You must manually update UPS/FedEx delivery instructions before the next delivery attempt. This PDF authorization confirms the buyer's consent but does not automatically modify carrier systems.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Divider -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
          <tr>
            <td style="border-top: 1px solid #e5e7eb;"></td>
          </tr>
        </table>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
          Manage this shipment and all overrides in your dashboard:
        </p>
        
        <!-- Dashboard Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
          <tr>
            <td align="center" style="padding: 0;">
              <a href="${dashboardUrl}" style="display: inline-block; background-color: #1a1a2e; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 6px rgba(26, 26, 46, 0.25);">
                Open Merchant Dashboard
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Warning Note -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 0 0; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 6px;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #92400e;">
                <strong>Note:</strong> This authorization confirms the buyer accepts responsibility for the package after delivery,
                including loss, theft, or damage. You may still need to update delivery options with the carrier.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  const html = getEmailTemplate(content);

  const text = `
Hello ${safeMerchantName},

Your buyer ${buyerName} has completed a remote delivery authorization for:

Order ID: ${safeOrderId}
Tracking: ${safeTracking}
Carrier: ${safeCarrier}

Download the signed authorization PDF: ${pdfUrl}

⚠️ ACTION REQUIRED: You must manually update UPS/FedEx delivery instructions before the next delivery attempt. This PDF authorization confirms the buyer's consent but does not automatically modify carrier systems.

Manage this shipment and all overrides in your dashboard: ${dashboardUrl}

Note: This authorization confirms the buyer accepts responsibility for the package after delivery,
including loss, theft, or damage. You may still need to update delivery options with the carrier.
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
      to: merchantEmail,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Failed to send merchant authorization email:', error);
      throw error;
    }

    console.log('Merchant authorization email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending merchant authorization email:', error);
    throw error;
  }
}

interface RefundApprovedParams {
  buyerEmail: string;
  buyerName: string;
  trackingNumber: string;
  carrier: string;
  merchantName: string;
  refundId: string | null;
}

/**
 * Send refund approval confirmation email to buyer
 */
export async function sendRefundApprovedEmail({
  buyerEmail,
  buyerName,
  trackingNumber,
  carrier,
  merchantName,
  refundId,
}: RefundApprovedParams) {
  const subject = `Refund Approved – Tracking #${trackingNumber}`;

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
        <span style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 8px 20px; border-radius: 50px; font-weight: 600; font-size: 14px;">
          ✓ Refund Approved
        </span>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6; color: #1f2937; font-weight: 500;">Hi ${buyerName},</p>
        
        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
          Your refund request has been approved. We have processed a full refund of $2.99 to your original payment method.
        </p>
        
        <!-- Refund Info Card -->
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
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Refund Amount</p>
                    <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: 600; color: #1f2937;">$2.99</p>
                  </td>
                </tr>
                ${refundId ? `
                <tr>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Refund ID</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; font-family: 'Courier New', monospace; font-weight: 500; color: #1f2937;">${refundId}</p>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Info Alert -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #e0f2fe; border-left: 4px solid #3b82f6; border-radius: 6px;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1e40af;">
                What happens next?
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1c3c8c;">
                The refund will appear in your account within 5-10 business days, depending on your bank or card issuer.
              </p>
            </td>
          </tr>
        </table>
        
        <p style="margin: 0 0 0 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
          If you have any questions, please contact us at <a href="mailto:support@presign.app" style="color: #4f46e5; text-decoration: underline;">support@presign.app</a>.
        </p>
      </td>
    </tr>
  `;

  const html = getEmailTemplate(content);

  const text = `
Hi ${buyerName},

REFUND APPROVED ✓

Your refund request has been approved. We have processed a full refund of $2.99 to your original payment method.

Tracking Number: ${trackingNumber}
Refund Amount: $2.99
${refundId ? `Refund ID: ${refundId}` : ''}

WHAT HAPPENS NEXT?
The refund will appear in your account within 5-10 business days, depending on your bank or card issuer.

If you have any questions, please contact us at support@presign.app.
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
      to: buyerEmail,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Failed to send refund approval email:', error);
      throw error;
    }

    console.log('Refund approval email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending refund approval email:', error);
    throw error;
  }
}

interface RefundDeniedParams {
  buyerEmail: string;
  buyerName: string;
  trackingNumber: string;
  carrier: string;
  merchantName: string;
  reason: string;
}

/**
 * Send refund denial email to buyer
 */
export async function sendRefundDeniedEmail({
  buyerEmail,
  buyerName,
  trackingNumber,
  carrier,
  merchantName,
  reason,
}: RefundDeniedParams) {
  const subject = `Refund Request Denied – Tracking #${trackingNumber}`;

  const content = `
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${APP_NAME}</h1>
      </td>
    </tr>
    
    <!-- Alert Badge -->
    <tr>
      <td style="padding: 30px 30px 0 30px; text-align: center;">
        <span style="display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 8px 20px; border-radius: 50px; font-weight: 600; font-size: 14px;">
          Refund Request Denied
        </span>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6; color: #1f2937; font-weight: 500;">Hi ${buyerName},</p>
        
        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
          We have reviewed your refund request and unfortunately, we are unable to approve it at this time.
        </p>
        
        <!-- Refund Info Card -->
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
        
        <!-- Denial Reason -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #92400e;">
                Reason for Denial
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #78350f; white-space: pre-wrap;">${reason}</p>
            </td>
          </tr>
        </table>
        
        <p style="margin: 0 0 0 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
          If you have any questions or would like to appeal this decision, please contact us at <a href="mailto:support@presign.app" style="color: #4f46e5; text-decoration: underline;">support@presign.app</a>.
        </p>
      </td>
    </tr>
  `;

  const html = getEmailTemplate(content);

  const text = `
Hi ${buyerName},

REFUND REQUEST DENIED

We have reviewed your refund request and unfortunately, we are unable to approve it at this time.

Tracking Number: ${trackingNumber}
Carrier: ${carrier}

REASON FOR DENIAL:
${reason}

If you have any questions or would like to appeal this decision, please contact us at support@presign.app.
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
      to: buyerEmail,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Failed to send refund denial email:', error);
      throw error;
    }

    console.log('Refund denial email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending refund denial email:', error);
    throw error;
  }
}

interface RefundRequestReceivedParams {
  adminEmail: string;
  trackingNumber: string;
  buyerEmail: string;
  buyerName: string;
  merchantName: string | null;
  merchantShopDomain: string | null;
  carrier: string;
  orderId: string | null;
  shipmentId: string;
}

/**
 * Send refund request notification to admin
 * Notifies admin when a buyer submits a delivery attempt slip for refund review
 */
export async function sendRefundRequestReceivedEmail({
  adminEmail,
  trackingNumber,
  buyerEmail,
  buyerName,
  merchantName,
  merchantShopDomain,
  carrier,
  orderId,
  shipmentId,
}: RefundRequestReceivedParams) {
  if (!adminEmail) {
    console.warn('No admin email provided, skipping email');
    return;
  }

  const safeMerchantName = merchantName || merchantShopDomain || 'Unknown Merchant';
  const safeOrderId = orderId || 'N/A';
  const safeCarrier = carrier || 'Carrier';

  const subject = `Refund Request Submitted – Tracking #${trackingNumber}`;

  const content = `
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${APP_NAME}</h1>
      </td>
    </tr>
    
    <!-- Alert Badge -->
    <tr>
      <td style="padding: 30px 30px 0 30px; text-align: center;">
        <span style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 8px 20px; border-radius: 50px; font-weight: 600; font-size: 14px;">
          ⚠️ Refund Request Submitted
        </span>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6; color: #1f2937; font-weight: 500;">Hello Admin,</p>
        
        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
          A buyer has submitted a delivery attempt slip for refund review under PreSign's Delivery Guarantee.
        </p>
        
        <!-- Shipment Info Card -->
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
                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 500; color: #1f2937;">${safeCarrier}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Order ID</p>
                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 500; color: #1f2937;">${safeOrderId}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Buyer</p>
                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 500; color: #1f2937;">${buyerName} (${buyerEmail})</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Merchant</p>
                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 500; color: #1f2937;">${safeMerchantName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Shipment ID</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; font-family: 'Courier New', monospace; font-weight: 500; color: #1f2937;">${shipmentId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Action Required Alert -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #92400e;">
                Action Required
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #78350f;">
                Please review this refund request in the PreSign Admin dashboard. Verify the delivery attempt slip and process the refund according to PreSign's Delivery Guarantee policy.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
          <tr>
            <td align="center" style="padding: 0;">
              <a href="${process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL || ''}/admin/refunds/${shipmentId}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);">
                Review in Admin Dashboard
              </a>
            </td>
          </tr>
        </table>
        
        <p style="margin: 0 0 0 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
          This refund request was submitted by the buyer via email to refunds@presign.app.
        </p>
      </td>
    </tr>
  `;

  const html = getEmailTemplate(content);

  const text = `
Hello Admin,

A buyer has submitted a delivery attempt slip for refund review under PreSign's Delivery Guarantee.

SHIPMENT DETAILS:
Tracking Number: ${trackingNumber}
Carrier: ${safeCarrier}
Order ID: ${safeOrderId}
Buyer: ${buyerName} (${buyerEmail})
Merchant: ${safeMerchantName}
Shipment ID: ${shipmentId}

ACTION REQUIRED:
Please review this refund request in the PreSign Admin dashboard. Verify the delivery attempt slip and process the refund according to PreSign's Delivery Guarantee policy.

Review in Admin Dashboard: ${process.env.APP_BASE_URL || process.env.SHOPIFY_APP_URL || ''}/admin/refunds/${shipmentId}

This refund request was submitted by the buyer via email to refunds@presign.app.
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
      to: adminEmail,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Failed to send refund request received email:', error);
      throw error;
    }

    console.log('Refund request received email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Error sending refund request received email:', error);
    throw error;
  }
}
