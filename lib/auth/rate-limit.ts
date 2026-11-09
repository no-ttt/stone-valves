import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { admins, loginAttempts } from "@/lib/db/schema";

// 防暴力破解，兩層：
// 1. 同一個 IP 在 15 分鐘內失敗 10 次，暫停登入到時間窗結束
// 2. 同一個帳號連續失敗 5 次，鎖 15 分鐘（不管從哪個 IP）

const WINDOW_MS = 15 * 60_000;
const MAX_IP_FAILURES = 10;
const MAX_ACCOUNT_FAILURES = 5;
const LOCK_MS = 15 * 60_000;

/** IP 是否被暫停，回傳還要等幾分鐘；沒被擋回傳 0 */
export async function ipBlockedMinutes(ip: string) {
  const db = await getDb();
  const row = await db.select().from(loginAttempts).where(eq(loginAttempts.ip, ip)).get();
  if (!row) return 0;
  const elapsed = Date.now() - row.windowStart.getTime();
  if (elapsed > WINDOW_MS || row.failures < MAX_IP_FAILURES) return 0;
  return Math.ceil((WINDOW_MS - elapsed) / 60_000);
}

export async function recordIpFailure(ip: string) {
  const db = await getDb();
  const row = await db.select().from(loginAttempts).where(eq(loginAttempts.ip, ip)).get();
  const now = new Date();
  if (!row || now.getTime() - row.windowStart.getTime() > WINDOW_MS) {
    await db
      .insert(loginAttempts)
      .values({ ip, failures: 1, windowStart: now })
      .onConflictDoUpdate({ target: loginAttempts.ip, set: { failures: 1, windowStart: now } });
  } else {
    await db.update(loginAttempts).set({ failures: row.failures + 1 }).where(eq(loginAttempts.ip, ip));
  }
}

export async function clearIpFailures(ip: string) {
  const db = await getDb();
  await db.delete(loginAttempts).where(eq(loginAttempts.ip, ip));
}

/** 帳號是否鎖定中，回傳還要等幾分鐘；沒鎖定回傳 0 */
export function accountLockedMinutes(admin: { lockedUntil: Date | null }) {
  if (!admin.lockedUntil) return 0;
  const left = admin.lockedUntil.getTime() - Date.now();
  return left > 0 ? Math.ceil(left / 60_000) : 0;
}

export async function recordAccountFailure(admin: { id: number; failedAttempts: number }) {
  const db = await getDb();
  const failures = admin.failedAttempts + 1;
  const lock = failures >= MAX_ACCOUNT_FAILURES;
  await db
    .update(admins)
    .set({ failedAttempts: lock ? 0 : failures, lockedUntil: lock ? new Date(Date.now() + LOCK_MS) : null })
    .where(eq(admins.id, admin.id));
}

export async function clearAccountFailures(adminId: number) {
  const db = await getDb();
  await db.update(admins).set({ failedAttempts: 0, lockedUntil: null }).where(eq(admins.id, adminId));
}
