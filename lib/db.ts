import { Pool, type PoolClient, type QueryResultRow } from "pg";
import type { Demande, StatusHistoryEntry, User } from "@/lib/db-types";

const globalForDb = globalThis as unknown as { pgPool: Pool | undefined };

export const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pgPool = pool;

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

export function newId(): string {
  return crypto.randomUUID();
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

// --- Row -> domain object mappers (snake_case columns -> camelCase fields) ---

export function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string | null,
    passwordHash: row.password_hash as string,
    role: row.role as User["role"],
    active: row.active as boolean,
    createdAt: row.created_at as Date,
  };
}

export function mapDemande(row: Record<string, unknown>): Demande {
  return {
    id: row.id as string,
    kind: row.kind as Demande["kind"],
    agentId: row.agent_id as string | null,
    bienType: row.bien_type as Demande["bienType"],
    problemType: row.problem_type as string | null,
    description: row.description as string | null,
    marqueModeleOuSerrure: row.marque_modele_ou_serrure as string | null,
    avecProgrammation: row.avec_programmation as boolean | null,
    quantite: row.quantite as number | null,
    modeLivraison: row.mode_livraison as string | null,
    adresseLivraison: row.adresse_livraison as string | null,
    urgence: row.urgence as Demande["urgence"],
    adresseIntervention: row.adresse_intervention as string | null,
    latitude: row.latitude != null ? Number(row.latitude) : null,
    longitude: row.longitude != null ? Number(row.longitude) : null,
    nomContact: row.nom_contact as string,
    telephoneContact: row.telephone_contact as string,
    emailContact: row.email_contact as string,
    photos: row.photos as string | null,
    status: row.status as Demande["status"],
    montant: row.montant != null ? Number(row.montant) : null,
    raisonRejet: row.raison_rejet as string | null,
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  };
}

export function mapStatusHistory(row: Record<string, unknown>): StatusHistoryEntry {
  return {
    id: row.id as string,
    demandeId: row.demande_id as string,
    status: row.status as StatusHistoryEntry["status"],
    changedAt: row.changed_at as Date,
    changedById: row.changed_by_id as string | null,
    note: row.note as string | null,
  };
}
