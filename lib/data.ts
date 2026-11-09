import { cache } from "react";
import { unstable_cache } from "next/cache";
import { and, asc, desc, eq, lt, gt } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { pageContent, posts, productCategories, products, redirects, showcaseItems } from "@/lib/db/schema";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { CONTENT_DEFAULTS, isContentKey, type Content } from "@/lib/content-fields";

// 前台用的讀取函式。
// - unstable_cache：查詢結果存進快取，之後的訪客直接讀快取，不再查資料庫。
//   沒有時間到期，只在後台存檔時用標籤清掉（見 lib/cache-tags.ts）。
// - React cache()：同一次請求裡重複呼叫只算一次。

/** 快取裡的資料是 JSON，日期會變成字串；讀回來時轉回 Date */
const DATE_KEYS = new Set(["publishedAt", "createdAt", "updatedAt"]);
function reviveDates<T>(value: T): T {
  if (Array.isArray(value)) return value.map(reviveDates) as T;
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = DATE_KEYS.has(k) && typeof v === "string" ? new Date(v) : reviveDates(v);
    }
    return out as T;
  }
  return value;
}

/** 把查詢包成「有快取、有標籤」的版本 */
function cached<A extends unknown[], R>(key: string, tags: string[], fn: (...args: A) => Promise<R>) {
  const stored = unstable_cache(fn, [key], { tags });
  return cache(async (...args: A): Promise<R> => reviveDates(await stored(...args)));
}

export type CategoryRow = typeof productCategories.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
export type PostRow = typeof posts.$inferSelect;
export type PostSummary = Omit<PostRow, "contentHtml">;

/** 前台文字：資料庫有值就用資料庫的，否則用 lib/content-fields.ts 的預設值 */
export const getContent = cached("content", [CACHE_TAGS.content], async (): Promise<Content> => {
  const db = await getDb();
  const rows = await db.select({ key: pageContent.key, value: pageContent.value }).from(pageContent).all();
  const content = { ...CONTENT_DEFAULTS };
  for (const r of rows) if (isContentKey(r.key)) content[r.key] = r.value;
  return content;
});

export const getCategories = cached("categories", [CACHE_TAGS.categories], async (): Promise<(CategoryRow & { productCount: number })[]> => {
  const db = await getDb();
  const [cats, prods] = await Promise.all([
    db.select().from(productCategories).orderBy(asc(productCategories.sortOrder)).all(),
    db.select({ categorySlug: products.categorySlug }).from(products).all(),
  ]);
  return cats.map((c) => ({ ...c, productCount: prods.filter((p) => p.categorySlug === c.slug).length }));
});

export const getCategory = cached("category", [CACHE_TAGS.categories], async (slug: string) => {
  const db = await getDb();
  const category = await db.select().from(productCategories).where(eq(productCategories.slug, slug)).get();
  if (!category) return null;
  const items = await db
    .select()
    .from(products)
    .where(eq(products.categorySlug, slug))
    .orderBy(asc(products.sortOrder), asc(products.id))
    .all();
  return { ...category, products: items };
});

export const getShowcase = cached("showcase", [CACHE_TAGS.showcase], async () => {
  const db = await getDb();
  return db.select().from(showcaseItems).orderBy(asc(showcaseItems.sortOrder), asc(showcaseItems.id)).all();
});

const summaryColumns = {
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  tag: posts.tag,
  coverImage: posts.coverImage,
  coverAlt: posts.coverAlt,
  coverFit: posts.coverFit,
  status: posts.status,
  publishedAt: posts.publishedAt,
  seoTitle: posts.seoTitle,
  seoDescription: posts.seoDescription,
  ogImage: posts.ogImage,
  noindex: posts.noindex,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
};

/** 已發布的文章，新到舊 */
export const getPublishedPosts = cached("posts", [CACHE_TAGS.posts], async (limit?: number): Promise<PostSummary[]> => {
  const db = await getDb();
  const q = db
    .select(summaryColumns)
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt), desc(posts.id));
  return limit ? q.limit(limit).all() : q.all();
});

/** 已發布的單篇文章，以及前後篇 */
export const getPublishedPost = cached("post", [CACHE_TAGS.posts], async (slug: string) => {
  const db = await getDb();
  const post = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .get();
  if (!post || !post.publishedAt) return null;
  const published = eq(posts.status, "published");
  const [newer, older] = await Promise.all([
    db
      .select({ slug: posts.slug, title: posts.title })
      .from(posts)
      .where(and(published, gt(posts.publishedAt, post.publishedAt)))
      .orderBy(asc(posts.publishedAt))
      .limit(1)
      .get(),
    db
      .select({ slug: posts.slug, title: posts.title })
      .from(posts)
      .where(and(published, lt(posts.publishedAt, post.publishedAt)))
      .orderBy(desc(posts.publishedAt))
      .limit(1)
      .get(),
  ]);
  return { post, newer: newer ?? null, older: older ?? null };
});

/** 找不到頁面時，查是不是改過網址的舊路徑 */
export async function findRedirect(path: string) {
  const db = await getDb();
  const row = await db.select({ toPath: redirects.toPath }).from(redirects).where(eq(redirects.fromPath, path)).get();
  return row?.toPath ?? null;
}
