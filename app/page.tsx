import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>;
}) {
  // Check for Shopify shop cookie
  const cookieStore = await cookies();
  const shop = cookieStore.get("shop")?.value;

  // Check for Shopify headers (iframe loads)
  const headersList = await headers();
  const shopHeader = headersList.get("x-shopify-shop-domain");
  const shopifyHmac = headersList.get("x-shopify-hmac-sha256");

  // Check URL params for shop parameter
  const params = await searchParams;
  const shopParam = params?.shop;

  // If any Shopify indicator exists, redirect to dashboard
  if (shop || shopHeader || shopifyHmac || shopParam) {
    redirect("/merchant/dashboard");
  }

  // Public landing page
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          PreSign – Shopify App Installed Successfully
        </h1>
      </div>
    </main>
  );
}
