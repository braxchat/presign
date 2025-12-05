"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingStartPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to step 1 immediately
    router.push("/onboarding/step1");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Loading onboarding...</p>
      </div>
    </div>
  );
}

