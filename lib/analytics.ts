import { COMMISSION_RATE } from "@/lib/constants";
import type { DemandeWithRelations } from "@/lib/types";

export function getValidationDate(demande: DemandeWithRelations): Date | null {
  const entry = demande.statusHistory.find((h) => h.status === "VALIDE");
  return entry ? entry.changedAt : demande.status === "VALIDE" ? demande.updatedAt : null;
}

export function computeKpis(demandes: DemandeWithRelations[]) {
  const incidents = demandes.filter((d) => d.kind === "INCIDENT");
  const commandes = demandes.filter((d) => d.kind === "COMMANDE");
  const enAttente = demandes.filter((d) => d.status === "EN_ATTENTE").length;
  const enCours = demandes.filter((d) => d.status === "EN_COURS").length;
  const validees = demandes.filter((d) => d.status === "VALIDE");
  const rejetees = demandes.filter((d) => d.status === "REJETE").length;

  const chiffreAffaires = validees.reduce((sum, d) => sum + (d.montant ?? 0), 0);
  const commission = chiffreAffaires * COMMISSION_RATE;
  const panierMoyen = validees.length > 0 ? chiffreAffaires / validees.length : 0;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const commissionSince = (since: Date) =>
    validees.reduce((sum, d) => {
      const vDate = getValidationDate(d);
      if (vDate && vDate >= since) return sum + (d.montant ?? 0) * COMMISSION_RATE;
      return sum;
    }, 0);

  return {
    totalDemandes: demandes.length,
    totalIncidents: incidents.length,
    totalCommandes: commandes.length,
    enAttente,
    enCours,
    valideesCount: validees.length,
    rejetees,
    chiffreAffaires,
    commission,
    panierMoyen,
    commissionJour: commissionSince(startOfDay),
    commissionSemaine: commissionSince(startOfWeek),
    commissionMois: commissionSince(startOfMonth),
  };
}

export function computeDailyRevenue(demandes: DemandeWithRelations[], days = 30) {
  const buckets = new Map<string, { revenue: number; commission: number }>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), { revenue: 0, commission: 0 });
  }

  for (const demande of demandes) {
    if (demande.status !== "VALIDE") continue;
    const vDate = getValidationDate(demande);
    if (!vDate) continue;
    const key = vDate.toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    const montant = demande.montant ?? 0;
    bucket.revenue += montant;
    bucket.commission += montant * COMMISSION_RATE;
  }

  return Array.from(buckets.entries()).map(([date, values]) => ({
    date,
    revenue: Math.round(values.revenue * 100) / 100,
    commission: Math.round(values.commission * 100) / 100,
  }));
}

export function computeSplitByBien(demandes: DemandeWithRelations[]) {
  const voiture = demandes.filter((d) => d.bienType === "VOITURE").length;
  const maison = demandes.filter((d) => d.bienType === "MAISON").length;
  return [
    { name: "Voiture", value: voiture },
    { name: "Maison", value: maison },
  ];
}

export function computeSplitByKind(demandes: DemandeWithRelations[]) {
  const incident = demandes.filter((d) => d.kind === "INCIDENT").length;
  const commande = demandes.filter((d) => d.kind === "COMMANDE").length;
  return [
    { name: "Incident", value: incident },
    { name: "Commande", value: commande },
  ];
}

export function computeAgentPerformance(
  demandes: DemandeWithRelations[],
  agents: { id: string; name: string }[],
) {
  return agents.map((agent) => {
    const assigned = demandes.filter((d) => d.agentId === agent.id);
    const validees = assigned.filter((d) => d.status === "VALIDE").length;
    const traitees = assigned.filter((d) => d.status !== "EN_ATTENTE").length;
    return {
      agentName: agent.name,
      traitees,
      validees,
      tauxValidation: traitees > 0 ? Math.round((validees / traitees) * 100) : 0,
    };
  });
}
