import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
import { SupabaseSessionStorage } from './shopifySessionStorage';

const apiKey = process.env.SHOPIFY_API_KEY || '';
const apiSecretKey = process.env.SHOPIFY_API_SECRET || '';
const scopes = process.env.SHOPIFY_SCOPES?.split(',') || ['read_orders', 'read_fulfillments'];
const hostName = (process.env.SHOPIFY_APP_URL || '').replace(/^https?:\/\//, '');
const apiVersion = (process.env.SHOPIFY_API_VERSION || '2024-01') as ApiVersion;

// Create session storage instance
const sessionStorage = new SupabaseSessionStorage();

export const shopify = shopifyApi({
  apiKey,
  apiSecretKey,
  scopes,
  hostName,
  apiVersion,
  isEmbeddedApp: false,
  sessionStorage,
});

