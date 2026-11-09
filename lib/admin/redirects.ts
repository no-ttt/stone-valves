import "server-only";
import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db/client";
import { redirects } from "@/lib/db/schema";

/**
 * 已發布的頁面改網址時呼叫：舊網址 301 到新網址。
 * 同時把原本指向舊網址的轉址改指新網址（避免連續轉址），
 * 並刪掉「新網址本身」的轉址（網址被重新使用時）。
 */
export async function addRedirect(db: Db, fromPath: string, toPath: string) {
  if (fromPath === toPath) return;
  const now = new Date();
  await db.update(redirects).set({ toPath }).where(eq(redirects.toPath, fromPath));
  await db.delete(redirects).where(eq(redirects.fromPath, toPath));
  await db
    .insert(redirects)
    .values({ fromPath, toPath, createdAt: now })
    .onConflictDoUpdate({ target: redirects.fromPath, set: { toPath, createdAt: now } });
}

/** 網址被新的頁面使用時，移除同路徑的舊轉址，否則新頁面會被轉走 */
export async function releasePath(db: Db, path: string) {
  await db.delete(redirects).where(eq(redirects.fromPath, path));
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_HINT = "網址只能用英文小寫、數字和「-」，例如 how-pneumatic-valves-work";
