import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { productCategories, products } from "@/lib/db/schema";
import { CategoryForm } from "./CategoryForm";

export const metadata: Metadata = { title: "編輯分類" };

export default async function EditCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const slug = (await params).slug;
  const db = await getDb();
  const [c, items] = await Promise.all([
    db.select().from(productCategories).where(eq(productCategories.slug, slug)).get(),
    db.select().from(products).where(eq(products.categorySlug, slug)).orderBy(asc(products.sortOrder), asc(products.id)).all(),
  ]);
  if (!c) notFound();

  return (
    <CategoryForm
      key={c.slug}
      initial={{
        slug: c.slug,
        name: c.name,
        tileName: c.tileName,
        navName: c.navName,
        footerName: c.footerName,
        cardImage: c.cardImage,
        introHtml: c.introHtml,
        keywords: c.keywords.split(",").filter(Boolean).join("、"),
        contactEyebrow: c.contactEyebrow,
        contactHeading: c.contactHeading,
        showOnHome: c.showOnHome,
        seoTitle: c.seoTitle ?? "",
        seoDescription: c.seoDescription ?? "",
        noindex: c.noindex,
        products: items.map((p) => ({ key: String(p.id), name: p.name, image: p.image, extra: p.imageAlt })),
      }}
    />
  );
}
