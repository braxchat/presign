import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, ArrowUpRight, Clock, CheckCircle, Wallet } from "lucide-react";

const payoutHistory = [
  {
    id: "PAY-001",
    amount: 125.0,
    overrides: 125,
    status: "completed" as const,
    requestedAt: "Nov 28, 2024",
    paidAt: "Nov 30, 2024",
  },
  {
    id: "PAY-002",
    amount: 89.0,
    overrides: 89,
    status: "completed" as const,
    requestedAt: "Oct 28, 2024",
    paidAt: "Oct 30, 2024",
  },
  {
    id: "PAY-003",
    amount: 156.0,
    overrides: 156,
    status: "completed" as const,
    requestedAt: "Sep 28, 2024",
    paidAt: "Sep 30, 2024",
  },
];

export default function PayoutsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Payouts
            </h1>
            <p className="text-muted-foreground">
              Manage your earnings and payout requests
            </p>
          </div>
          <Button variant="accent" className="gap-2">
            <Wallet className="h-4 w-4" />
            Request Payout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Available Balance"
            value="$127.00"
            subtitle="Ready to withdraw"
            icon={DollarSign}
            variant="accent"
          />
          <StatCard
            title="Pending Payouts"
            value="$0.00"
            subtitle="Processing"
            icon={Clock}
          />
          <StatCard
            title="Total Earned"
            value="$497.00"
            subtitle="All time"
            icon={ArrowUpRight}
            trend={{ value: 23, isPositive: true }}
          />
          <StatCard
            title="Overrides This Month"
            value="127"
            subtitle="$1.00 each"
            icon={CheckCircle}
          />
        </div>

        {/* Payout Info */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Payout Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Payout Method</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">Bank Transfer (ACH)</p>
                  <p className="text-sm text-muted-foreground">****4567</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Change
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Minimum Payout</p>
              <p className="text-2xl font-display font-bold text-foreground">$25.00</p>
              <p className="text-xs text-muted-foreground">
                Payouts are processed within 2 business days
              </p>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Payout History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Payout ID
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Amount
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Overrides
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Requested
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Paid
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payoutHistory.map((payout) => (
                  <tr key={payout.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-foreground">
                        {payout.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-success">
                        ${payout.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">
                        {payout.overrides}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">Completed</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {payout.requestedAt}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {payout.paidAt}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
