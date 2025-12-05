"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Store, AlertCircle, Lock } from "lucide-react";
import { getShopifyAppUrl } from "@/lib/shopifyHelpers";
import Link from "next/link";

export default function ShopifyAccessPage() {
  const [merchantInfo, setMerchantInfo] = useState<{
    shop_domain: string | null;
    has_password: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get merchant info from email in URL params or check if they're logged in
    async function checkMerchant() {
      try {
        // Check if there's a shop domain in the URL or try to get merchant info
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');

        if (shop) {
          // Try to fetch merchant info
          const response = await fetch(`/api/merchant/info?shop=${shop}`);
          if (response.ok) {
            const data = await response.json();
            setMerchantInfo({
              shop_domain: data.shop_domain,
              has_password: data.has_password,
            });
          } else {
            // If we have shop domain from URL, use it
            setMerchantInfo({
              shop_domain: shop,
              has_password: false,
            });
          }
        } else {
          // Try to get merchant info from current session
          const response = await fetch('/api/merchant/info');
          if (response.ok) {
            const data = await response.json();
            if (data.billing_provider === 'shopify') {
              setMerchantInfo({
                shop_domain: data.shop_domain,
                has_password: data.has_password,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error checking merchant:', error);
      } finally {
        setLoading(false);
      }
    }
    checkMerchant();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const shopDomain = merchantInfo?.shop_domain;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <Store className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Access PreSign from Shopify
            </h1>
            <p className="text-muted-foreground">
              You installed PreSign through Shopify. To access your dashboard, open the app from your Shopify Admin.
            </p>
          </div>

          {shopDomain ? (
            <div className="space-y-4">
              <Button
                asChild
                variant="accent"
                className="w-full h-11"
              >
                <a href={getShopifyAppUrl(shopDomain)} target="_blank" rel="noopener noreferrer">
                  <Store className="h-4 w-4 mr-2" />
                  Open in Shopify
                </a>
              </Button>

              {merchantInfo?.has_password && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">Website login available</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can also access PreSign using your website login credentials.
                  </p>
                  <Link href="/login" className="text-sm text-accent hover:underline">
                    Sign in with email →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-foreground">
                    We couldn't detect your Shopify store. Please access PreSign from your Shopify Admin.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <a href="https://apps.shopify.com/presign" target="_blank" rel="noopener noreferrer">
                      Go to Shopify App Store
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Need help?{" "}
              <Link href="/support" className="text-accent hover:underline">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

