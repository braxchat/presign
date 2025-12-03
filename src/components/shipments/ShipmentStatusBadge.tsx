import { Badge } from "@/components/ui/badge";

type CarrierStatus = "PreTransit" | "InTransit" | "OutForDelivery" | "Delivered";
type OverrideStatus = "none" | "requested" | "completed";

interface ShipmentStatusBadgeProps {
  type: "carrier" | "override";
  status: CarrierStatus | OverrideStatus;
}

export function ShipmentStatusBadge({ type, status }: ShipmentStatusBadgeProps) {
  if (type === "carrier") {
    const config = {
      PreTransit: { label: "Pre-Transit", variant: "muted" as const },
      InTransit: { label: "In Transit", variant: "info" as const },
      OutForDelivery: { label: "Out for Delivery", variant: "warning" as const },
      Delivered: { label: "Delivered", variant: "success" as const },
    };
    const { label, variant } = config[status as CarrierStatus];
    return <Badge variant={variant}>{label}</Badge>;
  }

  const config = {
    none: { label: "No Override", variant: "muted" as const },
    requested: { label: "Requested", variant: "warning" as const },
    completed: { label: "Completed", variant: "success" as const },
  };
  const { label, variant } = config[status as OverrideStatus];
  return <Badge variant={variant}>{label}</Badge>;
}
