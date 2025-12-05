import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { checkShopifyMerchantAccess } from '@/lib/authMiddleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check Shopify merchant access first
  const shopifyRedirect = await checkShopifyMerchantAccess(request, pathname);
  if (shopifyRedirect) {
    return shopifyRedirect;
  }

  // Continue with Supabase session update
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

