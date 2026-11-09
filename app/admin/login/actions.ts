"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { admins } from "@/lib/db/schema";
import { dummyVerify, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import {
  accountLockedMinutes,
  clearAccountFailures,
  clearIpFailures,
  ipBlockedMinutes,
  recordAccountFailure,
  recordIpFailure,
} from "@/lib/auth/rate-limit";

export type LoginState = { error?: string; email?: string };

const WRONG = "帳號或密碼不正確。";
const tooMany = (min: number) => `登入失敗次數太多，請 ${min} 分鐘後再試。`;

async function clientIp() {
  const h = await headers();
  return h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "請輸入帳號和密碼。", email };

  const ip = await clientIp();
  const ipWait = await ipBlockedMinutes(ip);
  if (ipWait) return { error: tooMany(ipWait), email };

  const db = await getDb();
  const admin = await db.select().from(admins).where(eq(admins.email, email)).get();
  if (!admin) {
    await dummyVerify(password);
    await recordIpFailure(ip);
    return { error: WRONG, email };
  }

  const lockWait = accountLockedMinutes(admin);
  if (lockWait) return { error: tooMany(lockWait), email };

  if (!(await verifyPassword(password, admin.passwordHash))) {
    await Promise.all([recordAccountFailure(admin), recordIpFailure(ip)]);
    return { error: WRONG, email };
  }

  await Promise.all([clearAccountFailures(admin.id), clearIpFailures(ip)]);
  await createSession(admin.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
