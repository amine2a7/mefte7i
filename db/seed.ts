import bcrypt from "bcryptjs";
import { Pool } from "pg";
import type { BienType, DemandeKind, DemandeStatus, Urgence } from "@/lib/db-types";
import { formatMontant } from "@/lib/constants";

process.loadEnvFile?.();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function newId() {
  return crypto.randomUUID();
}

function daysAgo(n: number, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d;
}

type SeedUser = { id: string; name: string; email: string; phone: string };

async function upsertUser(data: {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "ADMIN" | "AGENT";
}): Promise<SeedUser> {
  const id = newId();
  const rows = await pool.query(
    `INSERT INTO users (id, name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id, name, email, phone`,
    [id, data.name, data.email, data.phone, data.passwordHash, data.role],
  );
  return rows.rows[0];
}

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  console.log("Seeding users...");

  const admin = await upsertUser({
    name: "Nadia Fontaine",
    email: "admin@securekey.fr",
    phone: "01 23 45 67 89",
    passwordHash,
    role: "ADMIN",
  });

  const agentsData = [
    { name: "Karim Belhadj", email: "karim.agent@securekey.fr" },
    { name: "Louis Fabre", email: "louis.agent@securekey.fr" },
    { name: "Amina Cherif", email: "amina.agent@securekey.fr" },
  ];
  const agents: SeedUser[] = [];
  for (const a of agentsData) {
    agents.push(
      await upsertUser({ name: a.name, email: a.email, phone: "06 11 22 33 44", passwordHash, role: "AGENT" }),
    );
  }

  // Clients have no account — this is just seed contact data embedded directly on each demande.
  const clients = [
    { name: "Camille Rousseau", email: "camille.client@example.fr", phone: "06 12 34 56 78" },
    { name: "Yanis Benali", email: "yanis.client@example.fr", phone: "06 22 33 44 55" },
    { name: "Sophie Lambert", email: "sophie.client@example.fr", phone: "06 33 44 55 66" },
    { name: "Thomas Girard", email: "thomas.client@example.fr", phone: "06 44 55 66 77" },
  ];

  console.log("Seeding demandes...");

  await pool.query("DELETE FROM status_history");
  await pool.query("DELETE FROM demandes");

  type Seed = {
    kind: DemandeKind;
    bienType: BienType;
    clientIdx: number;
    agentIdx: number | null;
    problemType?: string;
    description?: string;
    marqueModeleOuSerrure?: string;
    avecProgrammation?: boolean;
    quantite?: number;
    modeLivraison?: string;
    adresseLivraison?: string;
    urgence: Urgence;
    adresseIntervention?: string;
    status: DemandeStatus;
    montant?: number;
    raisonRejet?: string;
    createdDaysAgo: number;
    validatedDaysAgo?: number;
  };

  const seeds: Seed[] = [
    { kind: "INCIDENT", bienType: "VOITURE", clientIdx: 0, agentIdx: 0, problemType: "cle_cassee", description: "La clé s'est cassée dans le barillet de la portière conducteur.", urgence: "TRES_URGENT", adresseIntervention: "12 rue de Rivoli, 75004 Tunis ", status: "VALIDE", montant: 95, createdDaysAgo: 28, validatedDaysAgo: 27 },
    { kind: "INCIDENT", bienType: "MAISON", clientIdx: 1, agentIdx: 1, problemType: "serrure_bloquee", description: "Impossible de tourner la clé, la serrure semble grippée.", urgence: "URGENT", adresseIntervention: "8 avenue Victor Hugo, 92100 Boulogne-Billancourt", status: "VALIDE", montant: 120, createdDaysAgo: 26, validatedDaysAgo: 25 },
    { kind: "COMMANDE", bienType: "VOITURE", clientIdx: 2, agentIdx: 0, marqueModeleOuSerrure: "Peugeot 208", avecProgrammation: true, quantite: 1, modeLivraison: "LIVRAISON", adresseLivraison: "5 rue des Lilas, 93200 Saint-Denis", urgence: "NORMAL", status: "VALIDE", montant: 180, createdDaysAgo: 25, validatedDaysAgo: 22 },
    { kind: "INCIDENT", bienType: "VOITURE", clientIdx: 3, agentIdx: 2, problemType: "telecommande_hs", description: "La télécommande ne répond plus, piles changées sans succès.", urgence: "NORMAL", adresseIntervention: "20 rue Nationale, 78000 Versailles", status: "VALIDE", montant: 75, createdDaysAgo: 24, validatedDaysAgo: 23 },
    { kind: "COMMANDE", bienType: "MAISON", clientIdx: 0, agentIdx: 1, marqueModeleOuSerrure: "Cylindre européen haute sécurité", avecProgrammation: false, quantite: 2, modeLivraison: "RETRAIT", urgence: "NORMAL", status: "VALIDE", montant: 60, createdDaysAgo: 23, validatedDaysAgo: 21 },
    { kind: "INCIDENT", bienType: "MAISON", clientIdx: 1, agentIdx: 2, problemType: "porte_claquee", description: "Porte claquée avec les clés à l'intérieur.", urgence: "TRES_URGENT", adresseIntervention: "3 place Charles de Gaulle, 94000 Créteil", status: "VALIDE", montant: 110, createdDaysAgo: 21, validatedDaysAgo: 21 },
    { kind: "INCIDENT", bienType: "VOITURE", clientIdx: 2, agentIdx: 0, problemType: "perte_cle", description: "Clé de voiture perdue, besoin d'une nouvelle clé avec programmation.", urgence: "URGENT", adresseIntervention: "44 rue de la République, 92000 Nanterre", status: "VALIDE", montant: 240, createdDaysAgo: 19, validatedDaysAgo: 18 },
    { kind: "COMMANDE", bienType: "VOITURE", clientIdx: 3, agentIdx: 1, marqueModeleOuSerrure: "Citroën C3", avecProgrammation: true, quantite: 1, modeLivraison: "LIVRAISON", adresseLivraison: "9 rue Gabriel Péri, 95100 Argenteuil", urgence: "NORMAL", status: "VALIDE", montant: 195, createdDaysAgo: 17, validatedDaysAgo: 15 },
    { kind: "INCIDENT", bienType: "MAISON", clientIdx: 0, agentIdx: 2, problemType: "cle_cassee_serrure", description: "Bout de clé resté coincé dans la serrure de la porte d'entrée.", urgence: "URGENT", adresseIntervention: "17 rue Voltaire, 94300 Vincennes", status: "VALIDE", montant: 85, createdDaysAgo: 15, validatedDaysAgo: 14 },
    { kind: "COMMANDE", bienType: "MAISON", clientIdx: 1, agentIdx: 0, marqueModeleOuSerrure: "Serrure 3 points", avecProgrammation: false, quantite: 1, modeLivraison: "RETRAIT", urgence: "NORMAL", status: "VALIDE", montant: 45, createdDaysAgo: 13, validatedDaysAgo: 12 },
    { kind: "INCIDENT", bienType: "VOITURE", clientIdx: 2, agentIdx: 1, problemType: "cle_bloquee_contact", description: "La clé reste coincée dans le contact, impossible de démarrer.", urgence: "TRES_URGENT", adresseIntervention: "2 boulevard Haussmann, 75009 Tunis ", status: "VALIDE", montant: 100, createdDaysAgo: 11, validatedDaysAgo: 10 },
    { kind: "INCIDENT", bienType: "VOITURE", clientIdx: 3, agentIdx: 2, problemType: "cle_cassee", description: "La lame de la clé s'est tordue et bloque le contact.", urgence: "URGENT", adresseIntervention: "31 rue de Tunis , 91000 Évry", status: "EN_COURS", montant: 90, createdDaysAgo: 6 },
    { kind: "COMMANDE", bienType: "VOITURE", clientIdx: 0, agentIdx: 0, marqueModeleOuSerrure: "Renault Clio 5", avecProgrammation: true, quantite: 1, modeLivraison: "LIVRAISON", adresseLivraison: "12 rue de Rivoli, 75004 Tunis ", urgence: "NORMAL", status: "EN_COURS", montant: 210, createdDaysAgo: 5 },
    { kind: "INCIDENT", bienType: "MAISON", clientIdx: 1, agentIdx: 1, problemType: "serrure_bloquee", description: "La clé tourne dans le vide, le mécanisme semble usé.", urgence: "NORMAL", adresseIntervention: "8 avenue Victor Hugo, 92100 Boulogne-Billancourt", status: "EN_COURS", createdDaysAgo: 4 },
    { kind: "INCIDENT", bienType: "VOITURE", clientIdx: 2, agentIdx: 2, problemType: "perte_cle", description: "Perte de la seule clé du véhicule ce matin.", urgence: "TRES_URGENT", adresseIntervention: "5 rue des Lilas, 93200 Saint-Denis", status: "EN_ATTENTE", createdDaysAgo: 1 },
    { kind: "INCIDENT", bienType: "MAISON", clientIdx: 3, agentIdx: null, problemType: "porte_claquee", description: "Enfant enfermé dehors après avoir claqué la porte.", urgence: "TRES_URGENT", adresseIntervention: "20 rue Nationale, 78000 Versailles", status: "EN_ATTENTE", createdDaysAgo: 0 },
    { kind: "COMMANDE", bienType: "MAISON", clientIdx: 0, agentIdx: null, marqueModeleOuSerrure: "Cylindre anti-casse", avecProgrammation: false, quantite: 3, modeLivraison: "RETRAIT", urgence: "NORMAL", status: "EN_ATTENTE", createdDaysAgo: 2 },
    { kind: "INCIDENT", bienType: "VOITURE", clientIdx: 1, agentIdx: 0, problemType: "telecommande_hs", description: "Télécommande tombée dans l'eau, ne fonctionne plus.", urgence: "NORMAL", adresseIntervention: "3 place Charles de Gaulle, 94000 Créteil", status: "REJETE", raisonRejet: "Modèle de télécommande non pris en charge par notre atelier.", createdDaysAgo: 9 },
    { kind: "COMMANDE", bienType: "VOITURE", clientIdx: 2, agentIdx: 1, marqueModeleOuSerrure: "Volkswagen Golf 7", avecProgrammation: true, quantite: 1, modeLivraison: "LIVRAISON", adresseLivraison: "44 rue de la République, 92000 Nanterre", urgence: "NORMAL", status: "REJETE", raisonRejet: "Adresse de livraison hors zone de couverture.", createdDaysAgo: 7 },
    { kind: "INCIDENT", bienType: "MAISON", clientIdx: 3, agentIdx: 2, problemType: "autre", description: "Poignée de porte cassée en plus du problème de serrure.", urgence: "URGENT", adresseIntervention: "9 rue Gabriel Péri, 95100 Argenteuil", status: "REJETE", raisonRejet: "Hors périmètre serrurerie, recommandé un artisan menuisier.", createdDaysAgo: 3 },
  ];

  for (const s of seeds) {
    const createdAt = daysAgo(s.createdDaysAgo, 9);
    const client = clients[s.clientIdx];
    const agent = s.agentIdx != null ? agents[s.agentIdx] : null;

    const history: { status: DemandeStatus; changedAt: Date; changedById: string | null; note: string }[] = [
      { status: "EN_ATTENTE", changedAt: createdAt, changedById: null, note: `${s.kind === "INCIDENT" ? "Demande" : "Commande"} créée par le client` },
    ];

    if (s.status !== "EN_ATTENTE" && agent) {
      const enCoursAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000);
      history.push({ status: "EN_COURS", changedAt: enCoursAt, changedById: agent.id, note: "Client contacté, prise en charge confirmée" });

      if (s.status === "EN_COURS" && s.montant != null) {
        history.push({ status: "EN_COURS", changedAt: new Date(enCoursAt.getTime() + 60 * 60 * 1000), changedById: agent.id, note: `Montant fixé à ${formatMontant(s.montant)}` });
      }

      if (s.status === "VALIDE") {
        const validatedAt = s.validatedDaysAgo != null ? daysAgo(s.validatedDaysAgo, 17) : new Date(enCoursAt.getTime() + 26 * 60 * 60 * 1000);
        history.push({ status: "EN_COURS", changedAt: new Date(enCoursAt.getTime() + 60 * 60 * 1000), changedById: agent.id, note: `Montant fixé à ${formatMontant(s.montant ?? 0)}` });
        history.push({ status: "VALIDE", changedAt: validatedAt, changedById: agent.id, note: "Intervention terminée et payée" });
      }

      if (s.status === "REJETE") {
        history.push({ status: "REJETE", changedAt: new Date(enCoursAt.getTime() + 60 * 60 * 1000), changedById: agent.id, note: s.raisonRejet ?? "Demande rejetée" });
      }
    }

    const demandeId = newId();
    const updatedAt = history[history.length - 1].changedAt;

    await pool.query(
      `INSERT INTO demandes (
        id, kind, agent_id, bien_type, problem_type, description,
        marque_modele_ou_serrure, avec_programmation, quantite, mode_livraison, adresse_livraison,
        urgence, adresse_intervention, nom_contact, telephone_contact, email_contact,
        status, montant, raison_rejet, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
      [
        demandeId,
        s.kind,
        agent?.id ?? null,
        s.bienType,
        s.problemType ?? null,
        s.description ?? null,
        s.marqueModeleOuSerrure ?? null,
        s.avecProgrammation ?? null,
        s.quantite ?? null,
        s.modeLivraison ?? null,
        s.adresseLivraison ?? null,
        s.urgence,
        s.adresseIntervention ?? null,
        client.name,
        client.phone,
        client.email,
        s.status,
        s.montant ?? null,
        s.raisonRejet ?? null,
        createdAt,
        updatedAt,
      ],
    );

    for (const h of history) {
      await pool.query(
        `INSERT INTO status_history (id, demande_id, status, changed_at, changed_by_id, note)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [newId(), demandeId, h.status, h.changedAt, h.changedById, h.note],
      );
    }
  }

  console.log(`Seeded ${seeds.length} demandes (clients have no accounts — contact info is embedded per demande).`);
  console.log("Demo staff accounts (password: password123):");
  console.log(`  Admin: ${admin.email}`);
  agents.forEach((a) => console.log(`  Agent: ${a.email}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
