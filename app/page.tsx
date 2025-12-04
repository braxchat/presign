import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

export default async function Page() {
  // Check for Shopify shop cookie
  const cookieStore = await cookies();
  const shop = cookieStore.get("shop")?.value;

  // Check for Shopify headers (iframe loads)
  const headersList = await headers();
  const shopHeader = headersList.get("x-shopify-shop-domain");
  const shopifyHmac = headersList.get("x-shopify-hmac-sha256");

  // Check URL params for shop parameter
  // Note: In server components, we can't access searchParams directly in page.tsx
  // But we can check headers which is sufficient for iframe detection

  // If any Shopify indicator exists, redirect to dashboard
  if (shop || shopHeader || shopifyHmac) {
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
