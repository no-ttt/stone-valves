/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactBand } from "@/components/ContactBand";
import { Hero } from "@/components/Hero";
import { findRedirect, getCategories, getCategory, getContent } from "@/lib/data";
import { imageUrl } from "@/lib/images";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategory((await params).category);
  if (!c) return {};
  const url = `/products/${c.slug}`;
  const title = c.seoTitle || c.name;
  return {
    title: `${title}｜產品資訊`,
    description: c.seoDescription || undefined,
    alternates: { canonical: url },
    robots: c.noindex ? { index: false, follow: true } : undefined,
    openGraph: { url, title, images: [imageUrl(c.ogImage || c.cardImage)] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const slug = (await params).category;
  const [c, categories, content] = await Promise.all([getCategory(slug), getCategories(), getContent()]);
  if (!c) {
    const to = await findRedirect(`/products/${slug}`);
    if (to) permanentRedirect(to);
    notFound();
  }

  return (
    <>
      <Hero size="short" image={imageUrl(content["products.hero.image"])} current="/products">
        <Breadcrumbs items={[{ label: "產品資訊", href: "/products" }, { label: c.name }]} />
        <h1>{c.name}</h1>
      </Hero>

      <section className="wrap section" style={{ paddingTop: 28 }}>
        <nav className="cat-nav" aria-label="產品類別">
          {categories.map((other) => (
            <Link
              key={other.slug}
              href={`/products/${other.slug}`}
              aria-current={other.slug === c.slug ? "page" : undefined}
            >
              {other.navName}
            </Link>
          ))}
        </nav>
      </section>

      <section className="wrap section" style={{ paddingTop: 28 }}>
        <div className="section-head">
          <div>
            <h2>{c.name}</h2>
            <p>共 {c.products.length} 項產品，詳細規格歡迎來電洽詢。</p>
          </div>
        </div>
        {c.introHtml && (
          // 分類介紹由後台編輯
          <div className="article-body category-intro" dangerouslySetInnerHTML={{ __html: c.introHtml }} />
        )}
        <div className="grid">
          {c.products.map((p) => (
            <div key={p.id} className="tile">
              <div className="thumb fit">
                <img src={imageUrl(p.image)} alt={p.imageAlt || p.name} loading="lazy" />
              </div>
              <div className="meta">
                <h3>{p.name}</h3>
              </div>
            </div>
          ))}
        </div>
        {c.keywords && <p className="kw">{c.keywords.split(",").filter(Boolean).join("・")}</p>}
      </section>

      <ContactBand eyebrow={c.contactEyebrow} heading={c.contactHeading} />
    </>
  );
}
