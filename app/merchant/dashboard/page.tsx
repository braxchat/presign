"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickAction } from "@/components/dashboard/QuickAction";
import { ShipmentStatusBadge } from "@/components/shipments/ShipmentStatusBadge";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  DollarSign, 
  Clock, 
  Package,
  Plus,
  FileText,
  TrendingUp,
  Loader2,
} from "lucide-react";

interface Shipment {
  id: string;
  tracking_number: string;
  carrier: 'UPS' | 'FedEx';
  buyer_name: string;
  carrier_status: 'PreTransit' | 'InTransit' | 'OutForDelivery' | 'Delivered';
  override_status: 'none' | 'requested' | 'completed';
  authorization_pdf_url: string | null;
}

interface Stats {
  monthlyOverrides: number;
  totalOverrides: number;
  pendingRequests: number;
  activeShipments: number;
  monthlyEarningsCents: number;
  totalEarningsCents: number;
  availableBalanceCents: number;
  totalPaidOutCents: number;
}

interface Payout {
  id: string;
  amount_cents: number;
  override_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requested_at: string;
  paid_at: string | null;
}

// Fetch functions
async function fetchShipments(): Promise<{ shipments: Shipment[]; count: number }> {
  const response = await fetch('/api/merchant/shipments?limit=5');
  if (!response.ok) {
    throw new Error('Failed to fetch shipments');
  }
  return response.json();
}

async function fetchStats(): Promise<Stats> {
  const response = await fetch('/api/merchant/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
}

async function fetchPayouts(): Promise<{ payouts: Payout[] }> {
  const response = await fetch('/api/merchant/payouts?limit=5');
  if (!response.ok) {
    throw new Error('Failed to fetch payouts');
  }
  return response.json();
}

export default function DashboardPage() {
  // Fetch shipments with auto-refresh every 15 seconds
  const { data: shipmentsData, isLoading: shipmentsLoading } = useQuery({
    queryKey: ['merchant-shipments'],
    queryFn: fetchShipments,
    refetchInterval: 15000, // 15 seconds
  });

  // Fetch stats with auto-refresh every 15 seconds
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['merchant-stats'],
    queryFn: fetchStats,
    refetchInterval: 15000, // 15 seconds
  });

  // Fetch payouts with auto-refresh every 15 seconds
  const { data: payoutsData, isLoading: payoutsLoading } = useQuery({
    queryKey: ['merchant-payouts'],
    queryFn: fetchPayouts,
    refetchInterval: 15000, // 15 seconds
  });

  const isLoading = shipmentsLoading || statsLoading || payoutsLoading;
  const recentShipments = shipmentsData?.shipments || [];
  const statsData = stats || {
    monthlyOverrides: 0,
    totalOverrides: 0,
    pendingRequests: 0,
    activeShipments: 0,
    monthlyEarningsCents: 0,
    totalEarningsCents: 0,
    availableBalanceCents: 0,
    totalPaidOutCents: 0,
  };

  // Format earnings
  const formatCents = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back
          </p>
        </div>
        <Link href="/merchant/shipments/new">
          <Button variant="accent" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Shipment
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border shadow-md p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Total Overrides"
              value={statsData.monthlyOverrides.toString()}
              subtitle="This month"
              icon={ArrowUpRight}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Merchant Earnings"
              value={formatCents(statsData.monthlyEarningsCents)}
              subtitle="$1.00 per override"
              icon={DollarSign}
              variant="accent"
            />
            <StatCard
              title="Pending Requests"
              value={statsData.pendingRequests.toString()}
              subtitle="Awaiting buyer action"
              icon={Clock}
            />
            <StatCard
              title="Active Shipments"
              value={statsData.activeShipments.toString()}
              subtitle="In transit"
              icon={Package}
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickAction
            title="Add New Shipment"
            description="Manually add a shipment with tracking details"
            icon={Plus}
            href="/merchant/shipments/new"
          />
          <QuickAction
            title="Daily Update Instructions"
            description="View instructions for daily carrier updates"
            icon={FileText}
            href="/merchant/settings"
          />
        </div>
      </div>

      {/* Recent Shipments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Recent Shipments
          </h2>
          <Link
            href="/merchant/shipments"
            className="text-sm text-accent hover:underline flex items-center gap-1"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Loading shipments...</p>
            </div>
          ) : recentShipments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No shipments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                      Tracking
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                      Carrier
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                      Buyer
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                      Override
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                      Authorization PDF
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentShipments.map((shipment) => (
                    <tr
                      key={shipment.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-foreground">
                          {shipment.tracking_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">
                          {shipment.carrier}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-foreground">
                          {shipment.buyer_name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ShipmentStatusBadge
                          type="carrier"
                          status={shipment.carrier_status}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <ShipmentStatusBadge
                          type="override"
                          status={shipment.override_status}
                        />
                      </td>
                      <td className="px-6 py-4">
                        {shipment.override_status === 'completed' && shipment.authorization_pdf_url ? (
                          <a
                            href={shipment.authorization_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            Download PDF
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Override Performance
          </h2>
        </div>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground text-sm">
            Performance chart will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
