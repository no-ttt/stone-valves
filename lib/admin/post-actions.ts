"use server";

import { and, eq, ne } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { ContentError, renderArticleHtml } from "@/lib/editor/render";
import { SLUG_HINT, SLUG_RE, addRedirect, releasePath } from "@/lib/admin/redirects";

export type PostInput = {
  id: number | null;
  title: string;
  slug: string;
  excerpt: string;
  tag: "資訊" | "討論";
  coverImage: string | null;
  coverAlt: string;
  coverFit: boolean;
  status: "draft" | "published";
  /** YYYY-MM-DD，台灣時間 */
  publishedDate: string;
  seoTitle: string;
  seoDescription: string;
  noindex: boolean;
  /** 編輯器的 JSON（字串）。編輯器的 attrs 物件沒有一般的 prototype，直接傳給 Server Action 會變成無法讀取的參照 */
  content: string;
};

export type SaveResult = { ok: true; id: number; slug: string; savedAt: string } | { ok: false; error: string };

const clean = (s: string, max: number) => s.trim().slice(0, max);

export async function savePost(input: PostInput): Promise<SaveResult> {
  await requireAdmin();
  const title = clean(input.title, 120);
  if (!title) return { ok: false, error: "請填寫文章標題。" };
  const slug = input.slug.trim().toLowerCase();
  if (!SLUG_RE.test(slug) || slug.length > 100) return { ok: false, error: SLUG_HINT };
  const tag = input.tag === "討論" ? "討論" : "資訊";
  const status = input.status === "published" ? "published" : "draft";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.publishedDate)) return { ok: false, error: "請填寫正確的發布日期。" };
  const publishedAt = new Date(`${input.publishedDate}T00:00:00+08:00`);
  if (Number.isNaN(publishedAt.getTime())) return { ok: false, error: "請填寫正確的發布日期。" };
  if (status === "published" && !input.excerpt.trim()) return { ok: false, error: "發布前請填寫摘要（會顯示在搜尋結果和文章列表）。" };

  let html: string;
  try {
    html = renderArticleHtml(JSON.parse(input.content)).html;
  } catch (e) {
    if (e instanceof ContentError) return { ok: false, error: e.message };
    console.error("[savePost] render failed", e);
    return { ok: false, error: "內文無法儲存，請重新整理頁面後再試一次。" };
  }

  const db = await getDb();
  const taken = await db
    .select({ id: posts.id })
    .from(posts)
    .where(input.id ? and(eq(posts.slug, slug), ne(posts.id, input.id)) : eq(posts.slug, slug))
    .get();
  if (taken) return { ok: false, error: `網址「${slug}」已經有其他文章使用，請換一個。` };

  const now = new Date();
  const values = {
    title,
    slug,
    excerpt: clean(input.excerpt, 300),
    tag,
    contentHtml: html,
    coverImage: input.coverImage || null,
    coverAlt: clean(input.coverAlt, 120),
    coverFit: !!input.coverFit,
    status,
    publishedAt,
    seoTitle: clean(input.seoTitle, 80) || null,
    seoDescription: clean(input.seoDescription, 300) || null,
    noindex: !!input.noindex,
    updatedAt: now,
  } as const;

  if (!input.id) {
    const row = await db
      .insert(posts)
      .values({ ...values, createdAt: now })
      .returning({ id: posts.id })
      .get();
    await releasePath(db, `/info/${slug}`);
    return { ok: true, id: row.id, slug, savedAt: now.toISOString() };
  }

  const old = await db.select({ slug: posts.slug, status: posts.status }).from(posts).where(eq(posts.id, input.id)).get();
  if (!old) return { ok: false, error: "找不到這篇文章，可能已經被刪除。" };
  await db.update(posts).set(values).where(eq(posts.id, input.id));
  if (old.slug !== slug) {
    // 已發布過的文章才有人連過來，改網址時舊網址要轉到新網址
    if (old.status === "published") await addRedirect(db, `/info/${old.slug}`, `/info/${slug}`);
    else await releasePath(db, `/info/${slug}`);
  }
  return { ok: true, id: input.id, slug, savedAt: now.toISOString() };
}

export async function deletePost(id: number): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const db = await getDb();
  const post = await db.select({ slug: posts.slug, status: posts.status }).from(posts).where(eq(posts.id, id)).get();
  if (!post) return { ok: true };
  await db.delete(posts).where(eq(posts.id, id));
  // 已發布的文章刪掉後，舊網址轉到文章列表，不讓訪客和搜尋引擎看到 404
  if (post.status === "published") await addRedirect(db, `/info/${post.slug}`, "/info");
  return { ok: true };
}
