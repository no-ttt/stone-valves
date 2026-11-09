"use server";

import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { productCategories, products, showcaseItems } from "@/lib/db/schema";
import { ContentError, renderArticleHtml } from "@/lib/editor/render";
import { SLUG_HINT, SLUG_RE, addRedirect, releasePath } from "@/lib/admin/redirects";

export type ProductInput = { name: string; image: string | null; imageAlt: string };

export type CategoryInput = {
  slug: string;
  name: string;
  tileName: string;
  navName: string;
  footerName: string;
  cardImage: string | null;
  /** 分類介紹，編輯器 JSON 字串 */
  intro: string;
  keywords: string;
  contactEyebrow: string;
  contactHeading: string;
  showOnHome: boolean;
  seoTitle: string;
  seoDescription: string;
  noindex: boolean;
  products: ProductInput[];
};

type Result = { ok: true } | { ok: false; error: string };

const t = (s: string, max: number) => s.trim().slice(0, max);

export async function saveCategory(input: CategoryInput): Promise<Result> {
  await requireAdmin();
  const name = t(input.name, 40);
  if (!name) return { ok: false, error: "請填寫分類名稱。" };
  const items = input.products
    .map((p) => ({ name: t(p.name, 60), image: p.image || null, imageAlt: t(p.imageAlt, 120) }))
    .filter((p) => p.name);

  let introHtml = "";
  try {
    const doc = JSON.parse(input.intro);
    // 編輯器空白時只有一個空段落
    const rendered = renderArticleHtml(doc);
    introHtml = rendered.text.trim() || rendered.html.includes("<figure") ? rendered.html : "";
  } catch (e) {
    return { ok: false, error: e instanceof ContentError ? e.message : "分類介紹無法儲存，請重新整理頁面後再試一次。" };
  }

  const db = await getDb();
  const exists = await db.select({ slug: productCategories.slug }).from(productCategories).where(eq(productCategories.slug, input.slug)).get();
  if (!exists) return { ok: false, error: "找不到這個分類，可能已經被刪除。" };

  const keywords = input.keywords
    .split(/[,，、\n]/)
    .map((k) => k.trim())
    .filter(Boolean)
    .join(",");

  await db.batch([
    db
      .update(productCategories)
      .set({
        name,
        tileName: t(input.tileName, 40) || name,
        navName: t(input.navName, 30) || name,
        footerName: t(input.footerName, 40) || name,
        cardImage: input.cardImage || null,
        introHtml,
        keywords,
        contactEyebrow: t(input.contactEyebrow, 60),
        contactHeading: t(input.contactHeading, 120),
        showOnHome: !!input.showOnHome,
        seoTitle: t(input.seoTitle, 80) || null,
        seoDescription: t(input.seoDescription, 300) || null,
        noindex: !!input.noindex,
        updatedAt: new Date(),
      })
      .where(eq(productCategories.slug, input.slug)),
    db.delete(products).where(eq(products.categorySlug, input.slug)),
    ...items.map((p, i) => db.insert(products).values({ categorySlug: input.slug, ...p, sortOrder: i })),
  ]);
  return { ok: true };
}

export async function createCategory(slugInput: string, nameInput: string): Promise<{ ok: true; slug: string } | { ok: false; error: string }> {
  await requireAdmin();
  const slug = slugInput.trim().toLowerCase();
  const name = t(nameInput, 40);
  if (!name) return { ok: false, error: "請填寫分類名稱。" };
  if (!SLUG_RE.test(slug) || slug.length > 60) return { ok: false, error: SLUG_HINT };
  const db = await getDb();
  const taken = await db.select({ slug: productCategories.slug }).from(productCategories).where(eq(productCategories.slug, slug)).get();
  if (taken) return { ok: false, error: `網址「${slug}」已經有分類使用。` };
  const last = await db.select({ sortOrder: productCategories.sortOrder }).from(productCategories).orderBy(asc(productCategories.sortOrder)).all();
  const now = new Date();
  await db.insert(productCategories).values({
    slug,
    name,
    tileName: name,
    navName: name,
    footerName: name,
    showOnHome: false,
    sortOrder: (last.at(-1)?.sortOrder ?? 0) + 1,
    createdAt: now,
    updatedAt: now,
  });
  await releasePath(db, `/products/${slug}`);
  return { ok: true, slug };
}

export async function deleteCategory(slug: string): Promise<Result> {
  await requireAdmin();
  const db = await getDb();
  // 產品與常見產品會跟著刪除（外鍵 ON DELETE CASCADE）
  await db.delete(productCategories).where(eq(productCategories.slug, slug));
  await addRedirect(db, `/products/${slug}`, "/products");
  return { ok: true };
}

export async function reorderCategories(slugs: string[]): Promise<Result> {
  await requireAdmin();
  const db = await getDb();
  const [first, ...rest] = slugs.map((slug, i) =>
    db.update(productCategories).set({ sortOrder: i }).where(eq(productCategories.slug, slug)),
  );
  if (first) await db.batch([first, ...rest]);
  return { ok: true };
}

export type ShowcaseInput = { name: string; image: string | null; categorySlug: string };

export async function saveShowcase(items: ShowcaseInput[]): Promise<Result> {
  await requireAdmin();
  const db = await getDb();
  const cats = new Set((await db.select({ slug: productCategories.slug }).from(productCategories).all()).map((c) => c.slug));
  const clean = items
    .map((s) => ({ name: t(s.name, 60), image: s.image ?? "", categorySlug: s.categorySlug }))
    .filter((s) => s.name && s.image && cats.has(s.categorySlug));
  await db.batch([db.delete(showcaseItems), ...clean.map((s, i) => db.insert(showcaseItems).values({ ...s, sortOrder: i }))]);
  return { ok: true };
}
