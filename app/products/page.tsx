/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactBand } from "@/components/ContactBand";
import { Hero } from "@/components/Hero";
import { ArrowUpRight } from "@/components/icons";
import { CategoryTile } from "@/components/Tiles";
import { categories, showcase } from "@/content/categories";
import { COMPANY } from "@/lib/site";

export const metadata: Metadata = {
  title: "產品資訊",
  description: `寔黈企業產品：${categories.map((c) => c.name).join("、")}。`,
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <Hero size="mid" image="/images/1476105101.jpg" current="/products">
        <Breadcrumbs items={[{ label: "產品資訊" }]} />
        <h1>產品資訊</h1>
        <p className="lead">從氣動執行器到各式閥門與配件安裝，九大類產品一次看齊。</p>
      </Hero>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <div className="kicker">產品列表</div>
            <h2>九大產品類別</h2>
          </div>
        </div>
        <div className="grid c3">
          {categories.map((c) => (
            <CategoryTile key={c.slug} category={c} />
          ))}
        </div>
      </section>

      <section className="why">
        <h2>為什麼選擇寔黈？</h2>
        <p>
          寔黈站穩氣動閥業近四十年，高品質的產品值得您信賴，完善的服務做您堅強的後盾。現在就讓我們不只是合作，更成為戮力同心的夥伴！
        </p>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <div className="kicker">產品實拍</div>
            <h2>常見產品</h2>
          </div>
          <a className="btn btn-line" href={COMPANY.facebook} rel="noopener">
            瞭解更多產品與實際應用
            <ArrowUpRight />
          </a>
        </div>
        <div className="grid c4">
          {showcase.map((item) => (
            <Link key={item.image} className="tile" href={`/products/${item.category}`}>
              <div className="thumb fit">
                <img src={item.image} alt={item.name} loading="lazy" />
              </div>
              <div className="meta">
                <h3>{item.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ContactBand />
    </>
  );
}
