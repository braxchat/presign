"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RefundActionsProps {
  shipmentId: string;
}

export function RefundActions({ shipmentId }: RefundActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this refund? This will process a Stripe refund and notify the buyer and merchant.")) {
      return;
    }

    setLoading("approve");
    setError(null);

    try {
      const response = await fetch(`/api/admin/refunds/${shipmentId}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve refund");
      }

      router.refresh();
      router.push("/admin/refunds");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(null);
    }
  };

  const handleDeny = async () => {
    const reason = prompt("Please provide a reason for denying this refund:");
    if (!reason || reason.trim() === "") {
      return;
    }

    setLoading("deny");
    setError(null);

    try {
      const response = await fetch(`/api/admin/refunds/${shipmentId}/deny`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to deny refund");
      }

      router.refresh();
      router.push("/admin/refunds");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <div className="flex gap-4">
        <Button
          onClick={handleApprove}
          disabled={loading !== null}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading === "approve" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Approve Refund
        </Button>
        <Button
          onClick={handleDeny}
          disabled={loading !== null}
          variant="destructive"
        >
          {loading === "deny" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4 mr-2" />
          )}
          Deny Refund
        </Button>
      </div>
    </div>
  );
}

