/**
 * Get Shopify App URL for a shop domain
 * Returns the deep link URL to open the app in Shopify Admin
 */
export function getShopifyAppUrl(shopDomain: string | null): string {
  if (!shopDomain) {
    return 'https://apps.shopify.com/presign';
  }
  return `https://${shopDomain}/admin/apps/presign`;
}

