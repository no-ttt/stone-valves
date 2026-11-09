"use server";

import { inArray } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { pageContent } from "@/lib/db/schema";
import { CONTENT_GROUPS, type ContentGroupId, type ContentField } from "@/lib/content-fields";

type Result = { ok: true } | { ok: false; error: string };

/**
 * 儲存一個分頁（例如「首頁」）的欄位。只接受這個分頁定義過的 key。
 * 跟預設值一樣的欄位不存進資料庫，之後修改程式裡的預設值時才會跟著更新。
 */
export async function saveContentGroup(group: ContentGroupId, values: Record<string, string>): Promise<Result> {
  await requireAdmin();
  const def = CONTENT_GROUPS[group];
  if (!def) return { ok: false, error: "找不到這個分頁。" };
  const fields = def.fields as Record<string, ContentField>;
  const keys = Object.keys(fields);

  for (const key of keys) {
    const f = fields[key];
    const v = (values[key] ?? "").trim();
    if (!v && f.type !== "image") return { ok: false, error: `「${f.label}」不能空白。` };
    if (f.type === "image" && !v) return { ok: false, error: `請選擇「${f.label}」。` };
    if (v.length > 2000) return { ok: false, error: `「${f.label}」太長了。` };
    if (key === "company.facebook" && !/^https:\/\//.test(v)) return { ok: false, error: "Facebook 網址請用 https:// 開頭。" };
    if (key === "company.email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { ok: false, error: "E-mail 格式不正確。" };
  }

  const db = await getDb();
  const now = new Date();
  const changed = keys.filter((k) => (values[k] ?? "").trim() !== fields[k].default);
  const unchanged = keys.filter((k) => !changed.includes(k));
  await db.batch([
    db.delete(pageContent).where(inArray(pageContent.key, unchanged.length ? unchanged : ["__none__"])),
    ...changed.map((k) => {
      const value = (values[k] ?? "").trim();
      return db
        .insert(pageContent)
        .values({ key: k, value, updatedAt: now })
        .onConflictDoUpdate({ target: pageContent.key, set: { value, updatedAt: now } });
    }),
  ]);
  return { ok: true };
}
