export type Role = "AGENT" | "ADMIN";
export type DemandeKind = "INCIDENT" | "COMMANDE";
export type BienType = "VOITURE" | "MAISON";
export type Urgence = "NORMAL" | "URGENT" | "TRES_URGENT";
export type DemandeStatus = "EN_ATTENTE" | "EN_COURS" | "REJETE" | "VALIDE";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  role: Role;
  active: boolean;
  createdAt: Date;
}

export interface Demande {
  id: string;
  kind: DemandeKind;
  agentId: string | null;
  bienType: BienType;
  problemType: string | null;
  description: string | null;
  marqueModeleOuSerrure: string | null;
  avecProgrammation: boolean | null;
  quantite: number | null;
  modeLivraison: string | null;
  adresseLivraison: string | null;
  urgence: Urgence;
  adresseIntervention: string | null;
  latitude: number | null;
  longitude: number | null;
  nomContact: string;
  telephoneContact: string;
  emailContact: string;
  photos: string | null;
  status: DemandeStatus;
  montant: number | null;
  raisonRejet: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusHistoryEntry {
  id: string;
  demandeId: string;
  status: DemandeStatus;
  changedAt: Date;
  changedById: string | null;
  note: string | null;
}

export interface DemandeWithRelations extends Demande {
  agent: { id: string; name: string } | null;
  statusHistory: (StatusHistoryEntry & { changedByUser: { name: string } | null })[];
}
