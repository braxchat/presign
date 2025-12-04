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
} from "lucide-react";

const recentShipments = [
  {
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    buyerName: "John Smith",
    carrierStatus: "InTransit" as const,
    overrideStatus: "requested" as const,
  },
  {
    trackingNumber: "9261290100130612345",
    carrier: "FedEx",
    buyerName: "Sarah Johnson",
    carrierStatus: "OutForDelivery" as const,
    overrideStatus: "completed" as const,
  },
  {
    trackingNumber: "1Z999AA10123456785",
    carrier: "UPS",
    buyerName: "Mike Davis",
    carrierStatus: "PreTransit" as const,
    overrideStatus: "none" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, Acme Range
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
        <StatCard
          title="Total Overrides"
          value="127"
          subtitle="This month"
          icon={ArrowUpRight}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Merchant Earnings"
          value="$127.00"
          subtitle="$1.00 per override"
          icon={DollarSign}
          variant="accent"
        />
        <StatCard
          title="Pending Requests"
          value="8"
          subtitle="Awaiting buyer action"
          icon={Clock}
        />
        <StatCard
          title="Active Shipments"
          value="23"
          subtitle="In transit"
          icon={Package}
        />
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentShipments.map((shipment) => (
                  <tr
                    key={shipment.trackingNumber}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-foreground">
                        {shipment.trackingNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">
                        {shipment.carrier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">
                        {shipment.buyerName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ShipmentStatusBadge
                        type="carrier"
                        status={shipment.carrierStatus}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <ShipmentStatusBadge
                        type="override"
                        status={shipment.overrideStatus}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

