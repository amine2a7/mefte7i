"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { newId, queryOne, withTransaction, mapDemande } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatMontant } from "@/lib/constants";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const contactSchema = {
  nomContact: z.string().min(2, "Le nom est requis"),
  telephoneContact: z.string().min(6, "Téléphone invalide"),
  emailContact: z.string().email("Email invalide"),
};

const incidentSchema = z.object({
  bienType: z.enum(["VOITURE", "MAISON"]),
  problemType: z.string().min(1, "Sélectionnez un type de problème"),
  description: z.string().min(10, "Merci de décrire le problème (10 caractères min.)"),
  urgence: z.enum(["NORMAL", "URGENT", "TRES_URGENT"]),
  adresseIntervention: z.string().min(5, "Adresse requise"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  ...contactSchema,
  photos: z.array(z.string()).max(5).optional(),
});

export async function createIncidentAction(
  input: z.infer<typeof incidentSchema>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = incidentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const data = parsed.data;
  const id = newId();

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO demandes (
        id, kind, bien_type, problem_type, description, urgence,
        adresse_intervention, latitude, longitude,
        nom_contact, telephone_contact, email_contact, photos, status
      ) VALUES ($1,'INCIDENT',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'EN_ATTENTE')`,
      [
        id,
        data.bienType,
        data.problemType,
        data.description,
        data.urgence,
        data.adresseIntervention,
        data.latitude ?? null,
        data.longitude ?? null,
        data.nomContact,
        data.telephoneContact,
        data.emailContact,
        data.photos && data.photos.length > 0 ? JSON.stringify(data.photos) : null,
      ],
    );
    await client.query(
      `INSERT INTO status_history (id, demande_id, status, note) VALUES ($1,$2,'EN_ATTENTE',$3)`,
      [newId(), id, "Demande créée par le client"],
    );
  });

  revalidatePath("/agent/dashboard");
  revalidatePath("/admin/dashboard");

  return { success: true, data: { id } };
}

const commandeSchema = z
  .object({
    bienType: z.enum(["VOITURE", "MAISON"]),
    marqueModeleOuSerrure: z.string().min(1, "Ce champ est requis"),
    anneeVehicule: z.number().int().min(1970).max(new Date().getFullYear() + 1).optional(),
    avecProgrammation: z.boolean(),
    quantite: z.number().int().min(1).max(20),
    modeLivraison: z.enum(["RETRAIT", "LIVRAISON"]),
    adresseLivraison: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    ...contactSchema,
  })
  .refine(
    (data) => data.modeLivraison !== "LIVRAISON" || (data.adresseLivraison?.length ?? 0) >= 5,
    { message: "Adresse de livraison requise", path: ["adresseLivraison"] },
  )
  .refine((data) => data.bienType !== "VOITURE" || data.anneeVehicule != null, {
    message: "Année du véhicule requise",
    path: ["anneeVehicule"],
  });

export async function createCommandeAction(
  input: z.infer<typeof commandeSchema>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = commandeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const data = parsed.data;
  const id = newId();
  const adresseLivraison =
    data.modeLivraison === "LIVRAISON" ? data.adresseLivraison : "Retrait en agence";
  const latitude = data.modeLivraison === "LIVRAISON" ? (data.latitude ?? null) : null;
  const longitude = data.modeLivraison === "LIVRAISON" ? (data.longitude ?? null) : null;

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO demandes (
        id, kind, bien_type, marque_modele_ou_serrure, annee_vehicule, avec_programmation, quantite,
        mode_livraison, adresse_livraison, latitude, longitude,
        nom_contact, telephone_contact, email_contact, status
      ) VALUES ($1,'COMMANDE',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'EN_ATTENTE')`,
      [
        id,
        data.bienType,
        data.marqueModeleOuSerrure,
        data.anneeVehicule ?? null,
        data.avecProgrammation,
        data.quantite,
        data.modeLivraison,
        adresseLivraison,
        latitude,
        longitude,
        data.nomContact,
        data.telephoneContact,
        data.emailContact,
      ],
    );
    await client.query(
      `INSERT INTO status_history (id, demande_id, status, note) VALUES ($1,$2,'EN_ATTENTE',$3)`,
      [newId(), id, "Commande créée par le client"],
    );
  });

  revalidatePath("/agent/dashboard");
  revalidatePath("/admin/dashboard");

  return { success: true, data: { id } };
}

async function requireAgentOrAdmin() {
  const session = await getSession();
  if (!session || (session.role !== "AGENT" && session.role !== "ADMIN")) {
    return null;
  }
  return session;
}

async function getDemande(id: string) {
  const row = await queryOne("SELECT * FROM demandes WHERE id = $1", [id]);
  return row ? mapDemande(row) : null;
}

export async function markEnCoursAction(demandeId: string): Promise<ActionResult> {
  const session = await requireAgentOrAdmin();
  if (!session) return { success: false, error: "Non autorisé" };

  const demande = await getDemande(demandeId);
  if (!demande) return { success: false, error: "Demande introuvable" };
  if (demande.status !== "EN_ATTENTE") {
    return { success: false, error: "Cette demande n'est plus en attente" };
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE demandes SET status = 'EN_COURS', agent_id = COALESCE(agent_id, $1), updated_at = now() WHERE id = $2`,
      [session.userId, demandeId],
    );
    await client.query(
      `INSERT INTO status_history (id, demande_id, status, changed_by_id, note) VALUES ($1,$2,'EN_COURS',$3,$4)`,
      [newId(), demandeId, session.userId, "Client contacté, prise en charge confirmée"],
    );
  });

  revalidatePath("/agent/dashboard");
  revalidatePath("/admin/dashboard");
  return { success: true, data: undefined };
}

const montantSchema = z.number().positive().max(100000);

export async function setMontantAction(
  demandeId: string,
  montant: number,
): Promise<ActionResult> {
  const session = await requireAgentOrAdmin();
  if (!session) return { success: false, error: "Non autorisé" };

  const parsed = montantSchema.safeParse(montant);
  if (!parsed.success) return { success: false, error: "Montant invalide" };

  const demande = await getDemande(demandeId);
  if (!demande) return { success: false, error: "Demande introuvable" };
  if (demande.status === "VALIDE" || demande.status === "REJETE") {
    return { success: false, error: "Cette demande est déjà clôturée" };
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE demandes SET montant = $1, agent_id = COALESCE(agent_id, $2), updated_at = now() WHERE id = $3`,
      [parsed.data, session.userId, demandeId],
    );
    await client.query(
      `INSERT INTO status_history (id, demande_id, status, changed_by_id, note) VALUES ($1,$2,$3,$4,$5)`,
      [newId(), demandeId, demande.status, session.userId, `Montant fixé à ${formatMontant(parsed.data)}`],
    );
  });

  revalidatePath("/agent/dashboard");
  revalidatePath("/admin/dashboard");
  return { success: true, data: undefined };
}

export async function rejectDemandeAction(
  demandeId: string,
  raison: string,
): Promise<ActionResult> {
  const session = await requireAgentOrAdmin();
  if (!session) return { success: false, error: "Non autorisé" };

  if (!raison || raison.trim().length < 5) {
    return { success: false, error: "La raison du rejet est obligatoire (5 caractères min.)" };
  }

  const demande = await getDemande(demandeId);
  if (!demande) return { success: false, error: "Demande introuvable" };
  if (demande.status === "VALIDE" || demande.status === "REJETE") {
    return { success: false, error: "Cette demande est déjà clôturée" };
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE demandes SET status = 'REJETE', raison_rejet = $1, agent_id = COALESCE(agent_id, $2), updated_at = now() WHERE id = $3`,
      [raison, session.userId, demandeId],
    );
    await client.query(
      `INSERT INTO status_history (id, demande_id, status, changed_by_id, note) VALUES ($1,$2,'REJETE',$3,$4)`,
      [newId(), demandeId, session.userId, raison],
    );
  });

  revalidatePath("/agent/dashboard");
  revalidatePath("/admin/dashboard");
  return { success: true, data: undefined };
}

export async function validateDemandeAction(demandeId: string): Promise<ActionResult> {
  const session = await requireAgentOrAdmin();
  if (!session) return { success: false, error: "Non autorisé" };

  const demande = await getDemande(demandeId);
  if (!demande) return { success: false, error: "Demande introuvable" };
  if (demande.status !== "EN_COURS") {
    return { success: false, error: "La demande doit être en cours pour être validée" };
  }
  if (demande.montant === null || demande.montant === undefined) {
    return { success: false, error: "Un montant doit être renseigné avant validation" };
  }

  await withTransaction(async (client) => {
    await client.query(`UPDATE demandes SET status = 'VALIDE', updated_at = now() WHERE id = $1`, [
      demandeId,
    ]);
    await client.query(
      `INSERT INTO status_history (id, demande_id, status, changed_by_id, note) VALUES ($1,$2,'VALIDE',$3,$4)`,
      [newId(), demandeId, session.userId, "Intervention terminée et payée"],
    );
  });

  revalidatePath("/agent/dashboard");
  revalidatePath("/admin/dashboard");
  return { success: true, data: undefined };
}
