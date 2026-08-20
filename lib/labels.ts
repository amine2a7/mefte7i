export const PROBLEM_TYPE_LABELS: Record<string, string> = {
  cle_cassee: "Clé cassée",
  telecommande_hs: "Télécommande HS",
  perte_cle: "Perte de clé",
  cle_bloquee_contact: "Clé bloquée dans le contact",
  cle_cassee_serrure: "Clé cassée dans la serrure",
  serrure_bloquee: "Serrure bloquée",
  porte_claquee: "Porte claquée",
  autre: "Autre",
};

export function problemTypeLabel(value: string | null) {
  if (!value) return "";
  return PROBLEM_TYPE_LABELS[value] ?? value;
}

export function modeLivraisonLabel(value: string | null) {
  if (value === "LIVRAISON") return "Livraison";
  if (value === "RETRAIT") return "Retrait en agence";
  return value ?? "";
}

export function demandeTitle(demande: {
  kind: "INCIDENT" | "COMMANDE";
  problemType: string | null;
  marqueModeleOuSerrure: string | null;
}) {
  if (demande.kind === "INCIDENT") return problemTypeLabel(demande.problemType);
  return demande.marqueModeleOuSerrure ?? "Commande de clé";
}
