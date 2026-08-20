"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { query, queryOne, newId, mapUser } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

const addAgentSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Téléphone invalide"),
  password: z.string().min(6, "6 caractères minimum"),
});

export async function addAgentAction(
  input: z.infer<typeof addAgentSchema>,
): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Non autorisé" };

  const parsed = addAgentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  const { name, email, phone, password } = parsed.data;

  const existing = await queryOne("SELECT id FROM users WHERE email = $1", [email]);
  if (existing) return { success: false, error: "Un compte existe déjà avec cet email" };

  const passwordHash = await hashPassword(password);
  const id = newId();
  await query(
    `INSERT INTO users (id, name, email, phone, password_hash, role) VALUES ($1,$2,$3,$4,$5,'AGENT')`,
    [id, name, email, phone, passwordHash],
  );

  revalidatePath("/admin/dashboard");
  return { success: true, data: { id } };
}

export async function toggleAgentActiveAction(agentId: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) return { success: false, error: "Non autorisé" };

  const row = await queryOne("SELECT * FROM users WHERE id = $1", [agentId]);
  const agent = row ? mapUser(row) : null;
  if (!agent || agent.role !== "AGENT") {
    return { success: false, error: "Agent introuvable" };
  }

  await query("UPDATE users SET active = $1 WHERE id = $2", [!agent.active, agentId]);

  revalidatePath("/admin/dashboard");
  return { success: true, data: undefined };
}
