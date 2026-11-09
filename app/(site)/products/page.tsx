/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactBand } from "@/components/ContactBand";
import { Hero } from "@/components/Hero";
import { ArrowUpRight } from "@/components/icons";
import { Lines } from "@/components/Text";
import { CategoryTile } from "@/components/Tiles";
import { getCategories, getContent, getShowcase } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { companyInfo } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return { title: c["seo.products.title"], description: c["seo.products.description"], alternates: { canonical: "/products" } };
}

export default async function ProductsPage() {
  const [c, categories, showcase] = await Promise.all([getContent(), getCategories(), getShowcase()]);
  const company = companyInfo(c);

  return (
    <>
      <Hero size="mid" image={imageUrl(c["products.hero.image"])} current="/products">
        <Breadcrumbs items={[{ label: "產品資訊" }]} />
        <h1>產品資訊</h1>
        <p className="lead">
          <Lines text={c["products.hero.lead"]} />
        </p>
      </Hero>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <div className="kicker">產品列表</div>
            <h2>{categories.length} 大產品類別</h2>
          </div>
        </div>
        <div className="grid c3">
          {categories.map((cat) => (
            <CategoryTile key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      <section className="why">
        <h2>{c["products.why.title"]}</h2>
        <p>
          <Lines text={c["products.why.body"]} />
        </p>
      </section>

      {showcase.length > 0 && (
        <section className="wrap section">
          <div className="section-head">
            <div>
              <div className="kicker">產品實拍</div>
              <h2>常見產品</h2>
            </div>
            <a className="btn btn-line" href={company.facebook} rel="noopener">
              瞭解更多產品與實際應用
              <ArrowUpRight />
            </a>
          </div>
          <div className="grid c4">
            {showcase.map((item) => (
              <Link key={item.id} className="tile" href={`/products/${item.categorySlug}`}>
                <div className="thumb fit">
                  <img src={imageUrl(item.image)} alt={item.name} loading="lazy" />
                </div>
                <div className="meta">
                  <h3>{item.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ContactBand />
    </>
  );
}
