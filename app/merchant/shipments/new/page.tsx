"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Package, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AddShipmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    trackingNumber: "",
    carrier: "",
    orderNumber: "",
    buyerName: "",
    buyerEmail: "",
    itemValueCents: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - will be connected to API
    toast({
      title: "Shipment added successfully",
      description: `Tracking number ${formData.trackingNumber} has been added.`,
    });
    router.push("/merchant/shipments");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/merchant/shipments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Add Shipment
          </h1>
          <p className="text-muted-foreground">
            Manually add a new shipment with tracking details
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tracking Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Package className="h-4 w-4 text-accent" />
              Tracking Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number *</Label>
                <Input
                  id="trackingNumber"
                  placeholder="1Z999AA10123456784"
                  value={formData.trackingNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, trackingNumber: e.target.value })
                  }
                  className="h-11 font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carrier">Carrier *</Label>
                <Select
                  value={formData.carrier}
                  onValueChange={(value) =>
                    setFormData({ ...formData, carrier: value })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPS">UPS</SelectItem>
                    <SelectItem value="FedEx">FedEx</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                placeholder="ORD-2024-001"
                value={formData.orderNumber}
                onChange={(e) =>
                  setFormData({ ...formData, orderNumber: e.target.value })
                }
                className="h-11"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Buyer Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <svg
                className="h-4 w-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Buyer Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Buyer Name *</Label>
                <Input
                  id="buyerName"
                  placeholder="John Smith"
                  value={formData.buyerName}
                  onChange={(e) =>
                    setFormData({ ...formData, buyerName: e.target.value })
                  }
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerEmail">Buyer Email *</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  placeholder="buyer@email.com"
                  value={formData.buyerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, buyerEmail: e.target.value })
                  }
                  className="h-11"
                  required
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Item Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <svg
                className="h-4 w-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Item Details
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemValueCents">Item Value (cents)</Label>
              <Input
                id="itemValueCents"
                type="number"
                placeholder="89999"
                value={formData.itemValueCents}
                onChange={(e) =>
                  setFormData({ ...formData, itemValueCents: e.target.value })
                }
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Enter value in cents (e.g., 89999 = $899.99)
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="accent" className="flex-1 h-11 gap-2">
              <CheckCircle className="h-4 w-4" />
              Add Shipment
            </Button>
            <Link href="/merchant/shipments" className="flex-1">
              <Button type="button" variant="outline" className="w-full h-11">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-info/5 border border-info/20 rounded-xl p-4">
        <h3 className="font-medium text-info mb-2">Need to add multiple shipments?</h3>
        <p className="text-sm text-muted-foreground">
          Contact support to set up automated CSV imports or API integration for bulk shipment uploads.
        </p>
      </div>
    </div>
  );
}

