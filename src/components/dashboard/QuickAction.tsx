import { Link } from "react-router-dom";
import { LucideIcon, ChevronRight } from "lucide-react";

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export function QuickAction({ title, description, icon: Icon, href }: QuickActionProps) {
  return (
    <Link
      to={href}
      className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200"
    >
      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
