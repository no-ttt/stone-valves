import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { productCategories, products, showcaseItems } from "@/lib/db/schema";
import { CategoryList } from "./CategoryList";
import { ShowcaseEditor } from "./ShowcaseEditor";

export const metadata: Metadata = { title: "產品分類" };

export default async function CategoriesPage() {
  await requireAdmin();
  const db = await getDb();
  const [cats, prods, showcase] = await Promise.all([
    db.select().from(productCategories).orderBy(asc(productCategories.sortOrder)).all(),
    db.select({ categorySlug: products.categorySlug }).from(products).all(),
    db.select().from(showcaseItems).orderBy(asc(showcaseItems.sortOrder), asc(showcaseItems.id)).all(),
  ]);

  return (
    <main className="work">
      <header className="work-head">
        <h1>產品分類</h1>
      </header>
      <CategoryList
        categories={cats.map((c) => ({
          slug: c.slug,
          name: c.name,
          cardImage: c.cardImage,
          showOnHome: c.showOnHome,
          productCount: prods.filter((p) => p.categorySlug === c.slug).length,
          hasIntro: !!c.introHtml,
        }))}
      />
      <section className="card">
        <h2>產品總覽頁的「常見產品」</h2>
        <p className="muted">顯示在「產品資訊」頁下方的產品實拍，點一下會連到所屬分類。</p>
        <ShowcaseEditor
          initial={showcase.map((s) => ({ key: String(s.id), name: s.name, image: s.image, extra: s.categorySlug }))}
          categories={cats.map((c) => ({ value: c.slug, label: c.name }))}
        />
      </section>
    </main>
  );
}
