/**
 * 把 content/ 的初始資料（從舊站搬過來的分類、產品、文章）轉成 drizzle/seed.sql。
 * 用法：npm run db:seed:build，再用 npm run db:seed:local 匯入本地 D1。
 * 正式環境只在第一次上線時匯入一次，之後內容都由後台管理。
 */
import { writeFileSync } from "node:fs";
import { categories, showcase } from "../content/categories";
import { posts } from "../content/posts";

const q = (v: string | null | undefined) => (v == null ? "NULL" : `'${v.replaceAll("'", "''")}'`);
const b = (v: boolean) => (v ? 1 : 0);
const now = Math.floor(Date.now() / 1000);
/** 文章日期以台灣時間當天 00:00 計 */
const day = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00+08:00`) / 1000);

const lines: string[] = [
  "PRAGMA defer_foreign_keys=TRUE;",
  "BEGIN TRANSACTION;",
  "DELETE FROM showcase_items;",
  "DELETE FROM products;",
  "DELETE FROM product_categories;",
  "DELETE FROM posts;",
];

categories.forEach((c, i) => {
  lines.push(
    `INSERT INTO product_categories (slug, name, tile_name, nav_name, footer_name, intro_html, card_image, keywords, contact_eyebrow, contact_heading, show_on_home, sort_order, seo_title, seo_description, og_image, noindex, created_at, updated_at) VALUES (${[
      q(c.slug), q(c.name), q(c.tileName), q(c.navName), q(c.footerName), q(""), q(c.cardImage), q(c.keywords.join(",")),
      q(c.contactEyebrow), q(c.contactHeading.replace(/<br\s*\/?>/g, "\n")), b(c.slug !== "repair-accessories"), i,
      q(c.seoTitle === c.name ? null : c.seoTitle), q(c.seoDescription), "NULL", 0, now, now,
    ].join(", ")});`,
  );
  c.products.forEach((p, j) => {
    lines.push(
      `INSERT INTO products (category_slug, name, image, image_alt, sort_order) VALUES (${[q(c.slug), q(p.name), q(p.image), q(p.name), j].join(", ")});`,
    );
  });
});

showcase.forEach((s, i) => {
  lines.push(`INSERT INTO showcase_items (name, image, category_slug, sort_order) VALUES (${[q(s.name), q(s.image), q(s.category), i].join(", ")});`);
});

for (const p of posts) {
  lines.push(
    `INSERT INTO posts (slug, title, excerpt, tag, content_html, cover_image, cover_alt, cover_fit, status, published_at, seo_title, seo_description, og_image, noindex, created_at, updated_at) VALUES (${[
      q(p.slug), q(p.title), q(p.description), q(p.tag), q(p.bodyHtml), q(p.cover), q(""), b(p.coverFit), q("published"), day(p.date),
      "NULL", "NULL", "NULL", 0, day(p.date), now,
    ].join(", ")});`,
  );
}

// 舊站文章網址 → 新網址（後台改網址時會自動更新，見 lib/admin/redirects.ts）
lines.push("DELETE FROM redirects WHERE from_path LIKE '/info/post-%.html';");
for (const p of posts) {
  lines.push(`INSERT INTO redirects (from_path, to_path, created_at) VALUES (${q(`/info/post-${p.legacyId}.html`)}, ${q(`/info/${p.slug}`)}, ${now});`);
}

lines.push("COMMIT;", "");
writeFileSync(new URL("../drizzle/seed.sql", import.meta.url), lines.join("\n"));
console.log(`seed.sql：${categories.length} 個分類、${showcase.length} 個常見產品、${posts.length} 篇文章`);
