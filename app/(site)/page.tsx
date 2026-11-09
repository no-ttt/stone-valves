/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand } from "@/components/ContactBand";
import { Hero } from "@/components/Hero";
import { ArrowRight, HeroLines } from "@/components/icons";
import { Lines } from "@/components/Text";
import { CategoryTile, PostTile } from "@/components/Tiles";
import { getCategories, getContent, getPublishedPosts } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { companyInfo } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  // 首頁用完整標題，不套用 layout 的 template
  return { title: { absolute: c["seo.home.title"] }, description: c["seo.home.description"], alternates: { canonical: "/" } };
}

const VALUE_ICONS = [
  <svg key="1" width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
    <circle cx="13" cy="13" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M13 7v6l4 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>,
  <svg key="2" width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
    <path d="M13 3 21 6v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="m9 13 3 3 5-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>,
  <svg key="3" width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
    <path
      d="M16.5 4.5a5 5 0 0 0-6 6.4L4 17.4 8.6 22l6.5-6.5a5 5 0 0 0 6.4-6l-3 3-3.5-1-1-3.5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>,
];

export default async function HomePage() {
  const [c, categories, posts] = await Promise.all([getContent(), getCategories(), getPublishedPosts(4)]);
  const company = companyInfo(c);
  const values = [
    { title: c["home.value1.title"], body: c["home.value1.body"] },
    { title: c["home.value2.title"], body: c["home.value2.body"] },
    { title: c["home.value3.title"], body: c["home.value3.body"] },
  ];

  return (
    <>
      <Hero size="tall" image={imageUrl(c["home.hero.image"])} current="/">
        <div className="eyebrow">{c["home.hero.eyebrow"]}</div>
        <h1>
          <Lines text={c["home.hero.title"]} />
        </h1>
        <p className="lead">
          <Lines text={c["home.hero.lead"]} />
        </p>
        <div className="actions">
          <Link className="btn btn-light" href="/products">
            查看產品
            <ArrowRight />
          </Link>
          <Link className="btn btn-glass glass" href="/about#contact">
            立即與我們聯繫
          </Link>
        </div>
      </Hero>

      <section className="split">
        <div className="intro-copy">
          <div className="kicker">關於寔黈</div>
          <h2>{c["home.intro.title"]}</h2>
          <p>
            <Lines text={c["home.intro.body"]} />
          </p>
          <div style={{ marginTop: 28 }}>
            <Link className="btn btn-line" href="/about">
              認識寔黈
              <ArrowRight />
            </Link>
          </div>
        </div>
        <div className="intro-media">
          <div className="panel">
            <img src={imageUrl(c["home.intro.image1"])} alt="寔黈氣動執行器" />
          </div>
          <div className="panel">
            <img src={imageUrl(c["home.intro.image2"])} alt="寔黈氣動執行器側面" />
          </div>
        </div>
      </section>

      <section className="values">
        {values.map((v, i) => (
          <div key={i} className="value">
            <span className="icon">{VALUE_ICONS[i]}</span>
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <h3>{v.title}</h3>
            <p>{v.body}</p>
          </div>
        ))}
      </section>

      <section className="quality">
        <HeroLines />
        <div>
          <div className="cert">{company.certification}</div>
          <h2>{c["home.quality.title"]}</h2>
          <p>
            <Lines text={c["home.quality.body"]} />
          </p>
        </div>
        <div>
          <Link className="btn btn-light" href="/info/how-pneumatic-valves-work">
            瞭解氣動閥與氣動執行器的工作原理
            <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <div className="kicker">產品資訊</div>
            <h2>產品類別</h2>
          </div>
          <Link className="btn btn-line" href="/products">
            全部產品
            <ArrowRight />
          </Link>
        </div>
        <div className="grid">
          {categories
            .filter((cat) => cat.showOnHome)
            .map((cat) => (
              <CategoryTile key={cat.slug} category={cat} />
            ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <div className="kicker">資訊討論</div>
            <h2>最新文章</h2>
          </div>
          <Link className="btn btn-line" href="/info">
            所有文章
            <ArrowRight />
          </Link>
        </div>
        <div className="grid">
          {posts.map((p) => (
            <PostTile key={p.slug} post={p} />
          ))}
        </div>
      </section>

      <ContactBand eyebrow={c["home.contact.eyebrow"]} />
    </>
  );
}
