"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { query, queryOne } from "@/lib/db";
import { getSession } from "@/lib/auth";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

const rangeSchema = z
  .object({
    startDate: z.string().min(1, "Date de début requise"),
    endDate: z.string().min(1, "Date de fin requise"),
    kind: z.enum(["TOUS", "INCIDENT", "COMMANDE"]),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "La date de début doit précéder la date de fin",
    path: ["endDate"],
  });

type RangeInput = z.infer<typeof rangeSchema>;

function buildWhere(data: RangeInput) {
  const conditions = ["created_at >= $1", "created_at < ($2::date + interval '1 day')"];
  const params: unknown[] = [data.startDate, data.endDate];
  if (data.kind !== "TOUS") {
    conditions.push(`kind = $3`);
    params.push(data.kind);
  }
  return { where: conditions.join(" AND "), params };
}

export async function previewDemandesCountAction(
  input: RangeInput,
): Promise<ActionResult<{ count: number }>> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Non autorisé" };

  const parsed = rangeSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { where, params } = buildWhere(parsed.data);
  const row = await queryOne<{ count: string }>(
    `SELECT COUNT(*) FROM demandes WHERE ${where}`,
    params,
  );

  return { success: true, data: { count: Number(row?.count ?? 0) } };
}

export async function deleteDemandesInRangeAction(
  input: RangeInput,
): Promise<ActionResult<{ count: number }>> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Non autorisé" };

  const parsed = rangeSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { where, params } = buildWhere(parsed.data);
  const deleted = await query<{ id: string }>(
    `DELETE FROM demandes WHERE ${where} RETURNING id`,
    params,
  );

  revalidatePath("/admin/dashboard");
  revalidatePath("/agent/dashboard");

  return { success: true, data: { count: deleted.length } };
}
