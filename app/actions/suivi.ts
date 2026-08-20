"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { newId, query, queryOne, withTransaction, mapDemande } from "@/lib/db";
import { formatMontant } from "@/lib/constants";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

// Public-safe view of a demande: no client_code, and no internal agent id.
export type SuiviDemande = ReturnType<typeof toSuiviDemande>;

function toSuiviDemande(row: Record<string, unknown>) {
  const d = mapDemande(row);
  return {
    id: d.id,
    kind: d.kind,
    bienType: d.bienType,
    problemType: d.problemType,
    marqueModeleOuSerrure: d.marqueModeleOuSerrure,
    anneeVehicule: d.anneeVehicule,
    status: d.status,
    montant: d.montant,
    raisonRejet: d.raisonRejet,
    clientDispute: d.clientDispute,
    createdAt: d.createdAt,
  };
}

const phoneSchema = z.string().min(6, "Numéro de téléphone invalide");

export async function searchDemandesByPhoneAction(
  phone: string,
): Promise<ActionResult<SuiviDemande[]>> {
  const parsed = phoneSchema.safeParse(phone);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const normalized = normalizePhone(parsed.data);
  if (normalized.length < 6) return { success: false, error: "Numéro de téléphone invalide" };

  const rows = await query<Record<string, unknown>>(
    `SELECT * FROM demandes WHERE regexp_replace(telephone_contact, '\\D', '', 'g') = $1
     ORDER BY created_at DESC`,
    [normalized],
  );

  return { success: true, data: rows.map(toSuiviDemande) };
}

async function getDemandeForClient(demandeId: string, phone: string, code: string) {
  const row = await queryOne<Record<string, unknown>>(
    `SELECT * FROM demandes WHERE id = $1 AND regexp_replace(telephone_contact, '\\D', '', 'g') = $2`,
    [demandeId, normalizePhone(phone)],
  );
  if (!row) return null;
  const demande = mapDemande(row);
  if (demande.clientCode.toUpperCase() !== code.trim().toUpperCase()) return null;
  return demande;
}

export async function clientValidateDemandeAction(
  demandeId: string,
  phone: string,
  code: string,
  montantConfirme: number,
): Promise<ActionResult<{ validated: boolean }>> {
  const demande = await getDemandeForClient(demandeId, phone, code);
  if (!demande) {
    return { success: false, error: "Demande introuvable. Vérifiez le numéro et le code." };
  }
  if (demande.status !== "EN_COURS") {
    return { success: false, error: "Cette demande n'est pas en attente de confirmation." };
  }
  if (demande.montant == null) {
    return { success: false, error: "Aucun montant n'a encore été fixé par l'agent." };
  }

  const matches = Math.abs(demande.montant - montantConfirme) < 0.01;

  await withTransaction(async (client) => {
    if (matches) {
      await client.query(
        `UPDATE demandes SET status = 'VALIDE', client_valide_at = now(), updated_at = now() WHERE id = $1`,
        [demandeId],
      );
      await client.query(
        `INSERT INTO status_history (id, demande_id, status, note) VALUES ($1,$2,'VALIDE',$3)`,
        [newId(), demandeId, `Confirmé par le client — paiement de ${formatMontant(montantConfirme)}`],
      );
    } else {
      await client.query(
        `UPDATE demandes SET client_dispute = true, client_dispute_note = $1, updated_at = now() WHERE id = $2`,
        [
          `Le client indique avoir payé ${formatMontant(montantConfirme)}, l'agent a renseigné ${formatMontant(demande.montant ?? 0)}.`,
          demandeId,
        ],
      );
      await client.query(
        `INSERT INTO status_history (id, demande_id, status, note) VALUES ($1,$2,$3,$4)`,
        [
          newId(),
          demandeId,
          demande.status,
          `⚠️ Écart signalé par le client : montant payé déclaré ${formatMontant(montantConfirme)} ≠ montant agent ${formatMontant(demande.montant ?? 0)}`,
        ],
      );
    }
  });

  revalidatePath("/agent/dashboard");
  revalidatePath("/admin/dashboard");

  return { success: true, data: { validated: matches } };
}

const disputeNoteSchema = z.string().min(5, "Merci de préciser votre signalement (5 caractères min.)");

export async function clientDisputeAction(
  demandeId: string,
  phone: string,
  code: string,
  note: string,
): Promise<ActionResult> {
  const parsedNote = disputeNoteSchema.safeParse(note);
  if (!parsedNote.success) return { success: false, error: parsedNote.error.issues[0].message };

  const demande = await getDemandeForClient(demandeId, phone, code);
  if (!demande) {
    return { success: false, error: "Demande introuvable. Vérifiez le numéro et le code." };
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE demandes SET client_dispute = true, client_dispute_note = $1, updated_at = now() WHERE id = $2`,
      [parsedNote.data, demandeId],
    );
    await client.query(
      `INSERT INTO status_history (id, demande_id, status, note) VALUES ($1,$2,$3,$4)`,
      [newId(), demandeId, demande.status, `⚠️ Litige signalé par le client : ${parsedNote.data}`],
    );
  });

  revalidatePath("/agent/dashboard");
  revalidatePath("/admin/dashboard");

  return { success: true, data: undefined };
}
