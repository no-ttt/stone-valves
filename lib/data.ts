import { cache } from "react";
import { and, asc, desc, eq, lt, gt } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { pageContent, posts, productCategories, products, redirects, showcaseItems } from "@/lib/db/schema";
import { CONTENT_DEFAULTS, isContentKey, type Content } from "@/lib/content-fields";

// 前台用的讀取函式。用 React cache() 包起來，同一次請求裡重複呼叫只查一次資料庫。

export type CategoryRow = typeof productCategories.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
export type PostRow = typeof posts.$inferSelect;
export type PostSummary = Omit<PostRow, "contentHtml">;

/** 前台文字：資料庫有值就用資料庫的，否則用 lib/content-fields.ts 的預設值 */
export const getContent = cache(async (): Promise<Content> => {
  const db = await getDb();
  const rows = await db.select({ key: pageContent.key, value: pageContent.value }).from(pageContent).all();
  const content = { ...CONTENT_DEFAULTS };
  for (const r of rows) if (isContentKey(r.key)) content[r.key] = r.value;
  return content;
});

export const getCategories = cache(async (): Promise<(CategoryRow & { productCount: number })[]> => {
  const db = await getDb();
  const [cats, prods] = await Promise.all([
    db.select().from(productCategories).orderBy(asc(productCategories.sortOrder)).all(),
    db.select({ categorySlug: products.categorySlug }).from(products).all(),
  ]);
  return cats.map((c) => ({ ...c, productCount: prods.filter((p) => p.categorySlug === c.slug).length }));
});

export const getCategory = cache(async (slug: string) => {
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

export const getShowcase = cache(async () => {
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
export const getPublishedPosts = cache(async (limit?: number): Promise<PostSummary[]> => {
  const db = await getDb();
  const q = db
    .select(summaryColumns)
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt), desc(posts.id));
  return limit ? q.limit(limit).all() : q.all();
});

/** 已發布的單篇文章，以及前後篇 */
export const getPublishedPost = cache(async (slug: string) => {
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
