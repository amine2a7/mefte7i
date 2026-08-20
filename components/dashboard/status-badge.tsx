import { cn } from "@/lib/utils";
import type { DemandeStatus } from "@/lib/db-types";
import { Clock, Loader2, CircleX, CircleCheck } from "lucide-react";

const CONFIG: Record<DemandeStatus, { label: string; className: string; icon: typeof Clock }> = {
  EN_ATTENTE: {
    label: "En attente",
    className: "bg-muted text-muted-foreground border-border",
    icon: Clock,
  },
  EN_COURS: {
    label: "En cours",
    className: "bg-accent/15 text-accent border-accent/30",
    icon: Loader2,
  },
  REJETE: {
    label: "Rejeté",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    icon: CircleX,
  },
  VALIDE: {
    label: "Validé",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: CircleCheck,
  },
};

export function StatusBadge({ status }: { status: DemandeStatus }) {
  const { label, className, icon: Icon } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        className,
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
