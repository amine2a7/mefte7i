import { cn } from "@/lib/utils";
import type { Urgence, DemandeKind, BienType } from "@/lib/db-types";
import { Car, Home, Siren, Clock, CircleAlert } from "lucide-react";

const URGENCE_CONFIG: Record<Urgence, { label: string; className: string }> = {
  NORMAL: { label: "Normal", className: "bg-muted text-muted-foreground border-border" },
  URGENT: { label: "Urgent", className: "bg-accent/15 text-accent border-accent/30" },
  TRES_URGENT: {
    label: "Très urgent",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

const URGENCE_ICON: Record<Urgence, typeof Clock> = {
  NORMAL: Clock,
  URGENT: CircleAlert,
  TRES_URGENT: Siren,
};

export function UrgenceBadge({ urgence }: { urgence: Urgence }) {
  const { label, className } = URGENCE_CONFIG[urgence];
  const Icon = URGENCE_ICON[urgence];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", className)}>
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}

export function BienTypeBadge({ bienType }: { bienType: BienType }) {
  const Icon = bienType === "VOITURE" ? Car : Home;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <Icon className="size-3.5" />
      {bienType === "VOITURE" ? "Voiture" : "Maison"}
    </span>
  );
}

export function KindLabel({ kind }: { kind: DemandeKind }) {
  return <>{kind === "INCIDENT" ? "Incident" : "Commande"}</>;
}
