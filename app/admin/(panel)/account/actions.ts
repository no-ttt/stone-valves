"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { admins } from "@/lib/db/schema";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/auth/password";
import { destroyOtherSessions, requireAdmin } from "@/lib/auth/session";

export type PasswordState = { error?: string; ok?: boolean };

export async function changePassword(_prev: PasswordState, form: FormData): Promise<PasswordState> {
  const me = await requireAdmin();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  const db = await getDb();
  const admin = await db.select().from(admins).where(eq(admins.id, me.id)).get();
  if (!admin || !(await verifyPassword(current, admin.passwordHash))) return { error: "目前的密碼不正確。" };
  const problem = passwordProblem(next);
  if (problem) return { error: problem };
  if (next !== confirm) return { error: "兩次輸入的新密碼不一樣。" };

  await db
    .update(admins)
    .set({ passwordHash: await hashPassword(next), updatedAt: new Date() })
    .where(eq(admins.id, me.id));
  await destroyOtherSessions(me.id, me.sessionId);
  return { ok: true };
}
