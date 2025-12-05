import 'server-only';
import Stripe from 'stripe';

/**
 * Centralized Stripe instance for server-side operations
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

