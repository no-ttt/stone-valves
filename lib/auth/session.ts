import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, lt, ne } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { admins, sessions } from "@/lib/db/schema";
import { toBase64Url } from "@/lib/auth/password";

export const SESSION_COOKIE = "sv_admin";
const SESSION_DAYS = 7;

async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return toBase64Url(new Uint8Array(digest));
}

/** 登入成功後建立 session，cookie 存原始 token，資料庫只存雜湊 */
export async function createSession(adminId: number) {
  const token = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 86400_000);
  const db = await getDb();
  // 順便清掉已過期的 session
  await db.delete(sessions).where(lt(sessions.expiresAt, now));
  await db.insert(sessions).values({ id: await sha256(token), adminId, expiresAt, createdAt: now });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** 目前登入的管理員；沒有登入或 session 過期時回傳 null */
export const getCurrentAdmin = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await getDb();
  const row = await db
    .select({ id: admins.id, email: admins.email, name: admins.name, sessionId: sessions.id })
    .from(sessions)
    .innerJoin(admins, eq(admins.id, sessions.adminId))
    .where(and(eq(sessions.id, await sha256(token)), gt(sessions.expiresAt, new Date())))
    .get();
  return row ?? null;
});

export type CurrentAdmin = NonNullable<Awaited<ReturnType<typeof getCurrentAdmin>>>;

/**
 * 每個後台頁面與每個寫入資料的 Server Action 一開始都要呼叫。
 * 沒有登入就導到登入頁（Server Action 會因此中止，不會執行後面的寫入）。
 */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.delete(sessions).where(eq(sessions.id, await sha256(token)));
  }
  jar.delete(SESSION_COOKIE);
}

/** 改密碼後，讓這個帳號在其他裝置的登入全部失效 */
export async function destroyOtherSessions(adminId: number, keepSessionId: string) {
  const db = await getDb();
  await db.delete(sessions).where(and(eq(sessions.adminId, adminId), ne(sessions.id, keepSessionId)));
}
