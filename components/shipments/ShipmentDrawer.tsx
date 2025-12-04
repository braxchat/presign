"use client";

import { X, Package, User, CreditCard, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShipmentStatusBadge } from "./ShipmentStatusBadge";

interface ShipmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: {
    trackingNumber: string;
    carrier: string;
    buyerName: string;
    buyerEmail: string;
    orderNumber: string;
    itemValue: number;
    carrierStatus: "PreTransit" | "InTransit" | "OutForDelivery" | "Delivered";
    overrideStatus: "none" | "requested" | "completed";
    requiresSignature: boolean;
    createdAt: string;
    signatureAuth?: {
      typedName: string;
      ip: string;
      timestamp: string;
    };
    paymentStatus?: "pending" | "paid";
  } | null;
}

export function ShipmentDrawer({ isOpen, onClose, shipment }: ShipmentDrawerProps) {
  if (!shipment) return null;

  const timeline = [
    { label: "Shipment Created", time: shipment.createdAt, completed: true },
    { label: "In Transit", time: "Dec 2, 2024 2:30 PM", completed: shipment.carrierStatus !== "PreTransit" },
    { label: "Out for Delivery", time: "Dec 3, 2024 8:15 AM", completed: shipment.carrierStatus === "OutForDelivery" || shipment.carrierStatus === "Delivered" },
    { label: "Delivered", time: "-", completed: shipment.carrierStatus === "Delivered" },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-card shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Shipment Details</h2>
              <p className="text-sm text-muted-foreground mt-1">{shipment.trackingNumber}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status */}
            <div className="flex items-center gap-3">
              <ShipmentStatusBadge type="carrier" status={shipment.carrierStatus} />
              <ShipmentStatusBadge type="override" status={shipment.overrideStatus} />
              {shipment.requiresSignature && (
                <Badge variant="outline">Signature Required</Badge>
              )}
            </div>

            {/* Buyer Info */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="h-4 w-4 text-accent" />
                Buyer Information
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{shipment.buyerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{shipment.buyerEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Order Number</p>
                  <p className="font-medium text-foreground">{shipment.orderNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Item Value</p>
                  <p className="font-medium text-foreground">${(shipment.itemValue / 100).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Shipment Info */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Package className="h-4 w-4 text-accent" />
                Shipment Information
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Carrier</p>
                  <p className="font-medium text-foreground">{shipment.carrier}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tracking</p>
                  <p className="font-medium text-foreground font-mono">{shipment.trackingNumber}</p>
                </div>
              </div>
            </div>

            {/* Signature Authorization */}
            {shipment.signatureAuth && (
              <div className="bg-success/5 border border-success/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-success">
                  <CheckCircle className="h-4 w-4" />
                  Signature Authorization
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Typed Name</p>
                    <p className="font-medium text-foreground">{shipment.signatureAuth.typedName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">IP Address</p>
                    <p className="font-medium text-foreground font-mono">{shipment.signatureAuth.ip}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Timestamp</p>
                    <p className="font-medium text-foreground">{shipment.signatureAuth.timestamp}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Status */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CreditCard className="h-4 w-4 text-accent" />
                Payment Status
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Merchant Earnings</p>
                  <p className="text-lg font-bold text-foreground">$1.00</p>
                </div>
                <Badge variant={shipment.overrideStatus === "completed" ? "success" : "muted"}>
                  {shipment.overrideStatus === "completed" ? "Paid" : "Pending"}
                </Badge>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock className="h-4 w-4 text-accent" />
                Timeline
              </div>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        item.completed ? "bg-success" : "bg-border"
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

