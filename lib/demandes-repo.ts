import { query, mapDemande, mapStatusHistory } from "@/lib/db";
import type { DemandeWithRelations } from "@/lib/db-types";

export async function getAllDemandesWithRelations(): Promise<DemandeWithRelations[]> {
  const [demandeRows, historyRows] = await Promise.all([
    query<Record<string, unknown>>(
      `SELECT d.*, a.id AS agent_join_id, a.name AS agent_name
       FROM demandes d
       LEFT JOIN users a ON a.id = d.agent_id
       ORDER BY d.created_at DESC`,
    ),
    query<Record<string, unknown>>(
      `SELECT sh.*, u.name AS changed_by_name
       FROM status_history sh
       LEFT JOIN users u ON u.id = sh.changed_by_id
       ORDER BY sh.changed_at ASC`,
    ),
  ]);

  const historyByDemande = new Map<
    string,
    DemandeWithRelations["statusHistory"]
  >();
  for (const row of historyRows) {
    const entry = {
      ...mapStatusHistory(row),
      changedByUser: row.changed_by_name ? { name: row.changed_by_name as string } : null,
    };
    const list = historyByDemande.get(entry.demandeId) ?? [];
    list.push(entry);
    historyByDemande.set(entry.demandeId, list);
  }

  return demandeRows.map((row) => {
    const demande = mapDemande(row);
    return {
      ...demande,
      agent: row.agent_join_id ? { id: row.agent_join_id as string, name: row.agent_name as string } : null,
      statusHistory: historyByDemande.get(demande.id) ?? [],
    };
  });
}
