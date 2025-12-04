import 'server-only';

import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Creates an authorization PDF document and uploads it to Supabase Storage
 * Returns the public URL of the uploaded PDF
 */
export async function createAuthorizationPdf({
  shipmentId,
  buyerName,
  buyerEmail,
  merchantName,
  trackingNumber,
  carrier,
  orderId,
  authTimestamp,
  buyerIp,
}: {
  shipmentId: string;
  buyerName: string;
  buyerEmail: string | null;
  merchantName: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  orderId: string | null;
  authTimestamp: string;
  buyerIp: string | null;
}): Promise<string | null> {
  try {
    const doc = new PDFDocument({ margin: 40 });
    const tmpDir = '/tmp';
    const filename = `authorization-${shipmentId}.pdf`;
    const filePath = path.join(tmpDir, filename);

    // Ensure tmp directory exists
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Header
    doc.fontSize(20).text('Delivery Release Authorization', { underline: true });
    doc.moveDown();

    // Buyer and shipment information
    doc.fontSize(12).text(`Buyer Name: ${buyerName}`);
    if (buyerEmail) doc.text(`Buyer Email: ${buyerEmail}`);
    if (merchantName) doc.text(`Merchant: ${merchantName}`);
    if (orderId) doc.text(`Order ID: ${orderId}`);
    if (trackingNumber) doc.text(`Tracking Number: ${trackingNumber}`);
    if (carrier) doc.text(`Carrier: ${carrier}`);
    doc.text(`Authorized At: ${authTimestamp}`);
    if (buyerIp) doc.text(`Buyer IP: ${buyerIp}`);
    doc.moveDown();

    // Authorization statement
    doc.fontSize(14).text('Authorization Statement');
    doc.moveDown();
    doc.fontSize(12).text(
      'I authorize the carrier to leave this package at the delivery address without obtaining an in-person signature. I accept full responsibility for the package once it is delivered, including any loss, theft, or damage that may occur after delivery.',
      { align: 'left' }
    );
    doc.moveDown();

    // Merchant instructions
    doc.fontSize(14).text('Merchant Action (UPS & FedEx)');
    doc.moveDown();

    doc.fontSize(12).text('UPS Instructions:');
    doc.text('1. Log into UPS.com → Tracking → Manage Delivery.');
    doc.text('2. Enter tracking number and, if available, choose "Release Authorized" or "Indirect Delivery Release".');
    doc.text('3. If not available, call UPS and reference this authorization document.');
    doc.moveDown();

    doc.text('FedEx Instructions:');
    doc.text('1. Log into FedEx.com → Tracking → Customize Delivery.');
    doc.text('2. Choose "Indirect Signature" or "No Signature Required" when allowed.');
    doc.text('3. If not available, call FedEx and reference this authorization document.');
    doc.moveDown();

    // Footer note
    doc.fontSize(10).fillColor('gray').text(
      'Note: This document confirms the buyer\'s consent. It does not automatically modify carrier systems. The merchant must update delivery instructions where applicable.',
      { width: 500, align: 'left' }
    );

    doc.end();

    // Wait for PDF to finish writing
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve());
      writeStream.on('error', (err) => reject(err));
    });

    // Read the file buffer
    const fileBuffer = await fs.promises.readFile(filePath);

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('buyer-authorizations')
      .upload(`auth-${shipmentId}.pdf`, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading authorization PDF:', error);
      // Clean up temp file
      try {
        await fs.promises.unlink(filePath);
      } catch (unlinkError) {
        // Ignore cleanup errors
      }
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('buyer-authorizations').getPublicUrl(
      `auth-${shipmentId}.pdf`
    );

    // Clean up temp file
    try {
      await fs.promises.unlink(filePath);
    } catch (unlinkError) {
      // Ignore cleanup errors
    }

    return publicUrl;
  } catch (error) {
    console.error('Error creating authorization PDF:', error);
    return null;
  }
}

