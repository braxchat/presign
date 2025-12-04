"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShipmentStatusBadge } from "@/components/shipments/ShipmentStatusBadge";
import { ShipmentDrawer } from "@/components/shipments/ShipmentDrawer";
import { Plus, Search, Filter, Download } from "lucide-react";

const shipmentsData = [
  {
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    buyerName: "John Smith",
    buyerEmail: "john.smith@email.com",
    orderNumber: "ORD-2024-001",
    itemValue: 89999,
    requiresSignature: true,
    carrierStatus: "InTransit" as const,
    overrideStatus: "requested" as const,
    earnings: 1.0,
    createdAt: "Dec 1, 2024 10:30 AM",
    signatureAuth: {
      typedName: "John Smith",
      ip: "192.168.1.100",
      timestamp: "Dec 2, 2024 3:45 PM",
    },
  },
  {
    trackingNumber: "9261290100130612345",
    carrier: "FedEx",
    buyerName: "Sarah Johnson",
    buyerEmail: "sarah.j@email.com",
    orderNumber: "ORD-2024-002",
    itemValue: 45000,
    requiresSignature: true,
    carrierStatus: "OutForDelivery" as const,
    overrideStatus: "completed" as const,
    earnings: 1.0,
    createdAt: "Nov 30, 2024 2:15 PM",
    signatureAuth: {
      typedName: "Sarah Johnson",
      ip: "10.0.0.55",
      timestamp: "Dec 1, 2024 9:20 AM",
    },
  },
  {
    trackingNumber: "1Z999AA10123456785",
    carrier: "UPS",
    buyerName: "Mike Davis",
    buyerEmail: "mike.d@email.com",
    orderNumber: "ORD-2024-003",
    itemValue: 125000,
    requiresSignature: true,
    carrierStatus: "PreTransit" as const,
    overrideStatus: "none" as const,
    earnings: 0,
    createdAt: "Dec 2, 2024 8:00 AM",
  },
  {
    trackingNumber: "9261290100130612346",
    carrier: "FedEx",
    buyerName: "Emily Chen",
    buyerEmail: "emily.c@email.com",
    orderNumber: "ORD-2024-004",
    itemValue: 67500,
    requiresSignature: true,
    carrierStatus: "Delivered" as const,
    overrideStatus: "completed" as const,
    earnings: 1.0,
    createdAt: "Nov 28, 2024 11:45 AM",
    signatureAuth: {
      typedName: "Emily Chen",
      ip: "172.16.0.22",
      timestamp: "Nov 29, 2024 4:30 PM",
    },
  },
  {
    trackingNumber: "1Z999AA10123456786",
    carrier: "UPS",
    buyerName: "Robert Wilson",
    buyerEmail: "r.wilson@email.com",
    orderNumber: "ORD-2024-005",
    itemValue: 32000,
    requiresSignature: true,
    carrierStatus: "InTransit" as const,
    overrideStatus: "none" as const,
    earnings: 0,
    createdAt: "Dec 2, 2024 9:30 AM",
  },
];

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState<typeof shipmentsData[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredShipments = shipmentsData.filter((shipment) => {
    const matchesSearch =
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCarrier =
      carrierFilter === "all" || shipment.carrier.toLowerCase() === carrierFilter;
    const matchesStatus =
      statusFilter === "all" || shipment.carrierStatus === statusFilter;
    return matchesSearch && matchesCarrier && matchesStatus;
  });

  const handleRowClick = (shipment: typeof shipmentsData[0]) => {
    setSelectedShipment(shipment);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Shipments
          </h1>
          <p className="text-muted-foreground">
            Manage all your signature release shipments
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/merchant/shipments/new">
            <Button variant="accent" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Shipment
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tracking, buyer name, or order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Carriers</SelectItem>
                <SelectItem value="ups">UPS</SelectItem>
                <SelectItem value="fedex">FedEx</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PreTransit">Pre-Transit</SelectItem>
                <SelectItem value="InTransit">In Transit</SelectItem>
                <SelectItem value="OutForDelivery">Out for Delivery</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Tracking Number
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Carrier
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Buyer Name
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Signature
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Carrier Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Override Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Earnings
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredShipments.map((shipment) => (
                <tr
                  key={shipment.trackingNumber}
                  onClick={() => handleRowClick(shipment)}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-foreground">
                      {shipment.trackingNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground font-medium">
                      {shipment.carrier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">
                      {shipment.buyerName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${shipment.requiresSignature ? "text-accent font-medium" : "text-muted-foreground"}`}>
                      {shipment.requiresSignature ? "Required" : "Not Required"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <ShipmentStatusBadge type="carrier" status={shipment.carrierStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <ShipmentStatusBadge type="override" status={shipment.overrideStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${shipment.earnings > 0 ? "text-success" : "text-muted-foreground"}`}>
                      {shipment.earnings > 0 ? `$${shipment.earnings.toFixed(2)}` : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {shipment.createdAt}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredShipments.length} of {shipmentsData.length} shipments
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Shipment Detail Drawer */}
      <ShipmentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        shipment={selectedShipment}
      />
    </div>
  );
}

