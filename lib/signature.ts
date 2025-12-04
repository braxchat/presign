export function detectSignatureRequirement({
  upsCode,
  fedexSignature,
  shippingLines,
  itemValueCents,
}: {
  upsCode?: string | null;
  fedexSignature?: string | null;
  shippingLines?: Array<{ title: string }> | null;
  itemValueCents?: number;
}): "DIRECT" | "ADULT" | "NONE" {
  // 1. UPS — strongest signal
  if (upsCode === "3") return "DIRECT";
  if (upsCode === "2") return "ADULT";

  // 2. FedEx
  if (fedexSignature === "DIRECT") return "DIRECT";
  if (fedexSignature === "ADULT") return "ADULT";

  // 3. Shopify shipping rate name
  const signatureWords = ["signature", "direct signature", "adult signature"];
  if (shippingLines?.some(line =>
    signatureWords.some(word => line.title.toLowerCase().includes(word))
  )) {
    return "DIRECT";
  }

  // 4. Value threshold fallback
  if (itemValueCents && itemValueCents >= 50000) return "DIRECT";

  return "NONE";
}

