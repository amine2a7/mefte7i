"use server";

import { z } from "zod";
import { queryOne, mapUser } from "@/lib/db";
import {
  createSessionCookie,
  clearSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { dashboardPathForRole } from "@/lib/session";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export async function loginAction(
  input: z.infer<typeof loginSchema>,
): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { email, password } = parsed.data;

  const row = await queryOne("SELECT * FROM users WHERE email = $1", [email]);
  const user = row ? mapUser(row) : null;
  if (!user) {
    return { success: false, error: "Email ou mot de passe incorrect" };
  }
  if (!user.active) {
    return { success: false, error: "Ce compte a été désactivé" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Email ou mot de passe incorrect" };
  }

  await createSessionCookie({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  return { success: true, data: { redirectTo: dashboardPathForRole(user.role) } };
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
}
