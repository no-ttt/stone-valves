/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactBand } from "@/components/ContactBand";
import { Hero } from "@/components/Hero";
import { categories, getCategory } from "@/content/categories";

type Props = { params: Promise<{ category: string }> };

// 只產生資料檔裡有的分類，其他網址一律 404
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategory((await params).category);
  if (!c) return {};
  const url = `/products/${c.slug}`;
  return {
    title: `${c.seoTitle}｜產品資訊`,
    description: c.seoDescription,
    alternates: { canonical: url },
    openGraph: { url, title: c.seoTitle, images: [c.cardImage] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const c = getCategory((await params).category);
  if (!c) notFound();

  return (
    <>
      <Hero size="short" image="/images/1476105101.jpg" current="/products">
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
        <div className="grid">
          {c.products.map((p) => (
            <div key={p.name} className="tile">
              <div className="thumb fit">
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <div className="meta">
                <h3>{p.name}</h3>
              </div>
            </div>
          ))}
        </div>
        {c.keywords.length > 0 && <p className="kw">{c.keywords.join("・")}</p>}
      </section>

      <ContactBand eyebrow={c.contactEyebrow} headingHtml={c.contactHeading} />
    </>
  );
}
