"use client";

import { useState } from "react";

interface RefundRequestFormProps {
  trackingNumber: string;
  buyerEmail: string;
}

export function RefundRequestForm({ trackingNumber, buyerEmail }: RefundRequestFormProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/refund/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tracking_number: trackingNumber,
          buyer_email: buyerEmail,
          refund_reason: reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit refund request");
      }

      setSuccess(true);
      setReason("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <p className="text-sm font-semibold text-green-900 mb-1">
          ✓ Refund Request Submitted
        </p>
        <p className="text-sm text-green-800">
          Your refund request has been received. We will review it and notify you via email once a decision has been made.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <div>
        <label htmlFor="refund-reason" className="block text-sm font-medium text-slate-700 mb-1">
          Describe the issue
        </label>
        <textarea
          id="refund-reason"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          placeholder="Please describe what happened. For example: 'The carrier still required a physical signature despite my authorization. I have attached a photo of the delivery attempt slip.'"
        />
        <p className="mt-1 text-xs text-slate-500">
          Please include details about the delivery attempt and any relevant information.
        </p>
      </div>
      <button
        type="submit"
        disabled={submitting || !reason.trim()}
        className="w-full inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Submitting..." : "Request Refund (Delivery Guarantee)"}
      </button>
      <p className="text-xs text-slate-500 text-center">
        By submitting, you agree that PreSign will review your request and process it according to our Delivery Guarantee policy.
      </p>
    </form>
  );
}

