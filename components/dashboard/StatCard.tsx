import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "accent";
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all duration-200 hover:shadow-lg animate-fade-in",
        variant === "accent"
          ? "bg-primary text-primary-foreground"
          : "bg-card shadow-md border border-border"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              variant === "accent" ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          <p className="mt-2 font-display text-3xl font-bold">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "mt-1 text-sm",
                variant === "accent" ? "text-primary-foreground/60" : "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span
                className={cn(
                  "text-xs",
                  variant === "accent" ? "text-primary-foreground/50" : "text-muted-foreground"
                )}
              >
                vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center",
            variant === "accent" ? "bg-accent/20" : "bg-accent/10"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              variant === "accent" ? "text-primary-foreground" : "text-accent"
            )}
          />
        </div>
      </div>
    </div>
  );
}

