/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Hero } from "@/components/Hero";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { Lines, Paragraphs, splitList } from "@/components/Text";
import { CategoryTile } from "@/components/Tiles";
import { getCategories, getContent } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { companyInfo } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return { title: c["seo.about.title"], description: c["seo.about.description"], alternates: { canonical: "/about" } };
}

const FEATURED = ["actuator", "ball-valve", "butterfly-valve", "control-valve"];

export default async function AboutPage() {
  const [c, categories] = await Promise.all([getContent(), getCategories()]);
  const company = companyInfo(c);
  const mapQuery = encodeURIComponent(company.fullAddress);

  return (
    <>
      <Hero size="mid" image={imageUrl(c["about.hero.image"])} current="/about">
        <Breadcrumbs items={[{ label: "關於寔黈" }]} />
        <div className="eyebrow">About Us</div>
        <h1>關於寔黈</h1>
        <p className="lead">
          <Lines text={c["about.hero.lead"]} />
        </p>
      </Hero>

      <section className="split about-intro">
        <div className="intro-copy">
          <div className="kicker">公司簡介</div>
          <h2>{c["about.intro.title"]}</h2>
          <div className="prose">
            <Paragraphs text={c["about.intro.body"]} />
          </div>
        </div>
        <figure className="about-img">
          <img src={imageUrl(c["about.intro.image"])} alt={c["about.intro.imageAlt"]} loading="lazy" />
          <figcaption>{c["about.intro.caption"]}</figcaption>
        </figure>
      </section>

      <section className="stats">
        <div className="stat">
          <b>
            30<sup>+</sup>
          </b>
          <span>年氣動閥生產經驗</span>
        </div>
        <div className="stat">
          <b>ISO</b>
          <span>
            9001：2000．CE
            <br />
            品質管理體系認證
          </span>
        </div>
        <div className="stat">
          <b>{categories.length}</b>
          <span>大類產品系列</span>
        </div>
        <div className="stat">
          <b>4</b>
          <span>
            種標準生產
            <br />
            國家、美國、德國、日本
          </span>
        </div>
      </section>

      <section
        className="motto-band"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(19,38,31,.95) 0%,rgba(19,38,31,.85) 55%,rgba(19,38,31,.55) 100%),url('${imageUrl(c["about.motto.image"])}')`,
        }}
      >
        <div className="motto-inner">
          <div className="eyebrow">經營理念</div>
          <blockquote>
            {/* 經營理念固定排成一行，後台填的換行忽略 */}
            {c["about.motto.quote"].replace(/\s*\n\s*/g, "")}
          </blockquote>
          <p>
            {c["about.motto.body"].replace(/\s*\n\s*/g, "")}
          </p>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <div className="kicker">主要產品</div>
            <h2>從氣缸到各式閥門</h2>
            <p>
              <Lines text={c["about.products.body"]} />
            </p>
          </div>
          <Link className="btn btn-line" href="/products">
            全部產品
            <ArrowRight />
          </Link>
        </div>
        <div className="grid c4">
          {categories
            .filter((cat) => FEATURED.includes(cat.slug))
            .map((cat) => (
              <CategoryTile key={cat.slug} category={cat} />
            ))}
        </div>
      </section>

      <section className="split mat-ind">
        <div>
          <div className="kicker">材質</div>
          <h2 className="h2">多種閥體材質</h2>
          <div className="mat-grid">
            {splitList(c["about.materials"]).map((m) => (
              <span key={m} className="mat">
                {m}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="kicker">應用產業</div>
          <h2 className="h2">廣泛應用於各行業</h2>
          <ol className="ind-list">
            {splitList(c["about.industries"]).map((name, i) => (
              <li key={name}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {name}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="en-panel" lang="en">
        <div className="kicker">{company.englishName}</div>
        <div className="en-cols prose en">
          <Paragraphs text={c["about.english"]} />
        </div>
      </section>

      <section className="wrap section" id="contact">
        <div className="section-head">
          <div>
            <div className="kicker">聯絡資訊</div>
            <h2>聯絡我們</h2>
          </div>
          <a className="btn btn-line" href={company.facebook} rel="noopener">
            Facebook 最新消息
            <ArrowUpRight />
          </a>
        </div>
        <div className="split contact-split">
          <ul className="contact-list">
            <li>
              <span className="label">地址</span>
              <span className="value-text">{company.address}</span>
            </li>
            <li>
              <span className="label">客服專線</span>
              <a className="value-text" href={company.phoneHref}>
                {company.phone}
              </a>
            </li>
            <li>
              <span className="label">傳真</span>
              <span className="value-text">{company.fax}</span>
            </li>
            <li>
              <span className="label">E-mail</span>
              <a className="value-text" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </li>
            <li>
              <a
                className="btn btn-dark"
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener"
              >
                在 Google 地圖開啟
                <ArrowUpRight />
              </a>
            </li>
          </ul>
          <div className="map">
            <iframe
              title="寔黈企業位置地圖"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </>
  );
}
