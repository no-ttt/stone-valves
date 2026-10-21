import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand } from "@/components/ContactBand";
import { Hero } from "@/components/Hero";
import { ArrowRight, HeroLines } from "@/components/icons";
import { CategoryTile, PostTile } from "@/components/Tiles";
import { categories } from "@/content/categories";
import { posts } from "@/content/posts";
import { COMPANY } from "@/lib/site";

export const metadata: Metadata = {
  // 首頁用完整標題，不套用 layout 的 template
  title: { absolute: "寔黈企業 STONE VALVES｜台灣氣動閥、氣動執行器製造商" },
  alternates: { canonical: "/" },
};

// 首頁不放「配件安裝．維修」，維持舊站的 8 個類別
const HOME_CATEGORIES = categories.filter((c) => c.slug !== "repair-accessories");

export default function HomePage() {
  return (
    <>
      <Hero size="tall" image="/images/2013240233.jpg" current="/">
        <div className="eyebrow">台灣優良老品牌</div>
        <h1>
          深耕台灣閥門領域
          <br />
          近四十年。
        </h1>
        <p className="lead">穩定的品質與不斷的創新求變，使我們能夠立足台灣、放眼世界。</p>
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
          <h2>台灣優良老品牌</h2>
          <p>
            深耕台灣閥門領域近四十年，經歷風風雨雨、面臨各種挑戰，我們屹立不搖且始終如一。穩定的品質與不斷的創新求變，使我們能夠立足台灣、放眼世界。
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/45584-1_1.png" alt="寔黈氣動執行器" />
          </div>
          <div className="panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/45698png.png" alt="寔黈氣動執行器側面" />
          </div>
        </div>
      </section>

      <section className="values">
        <div className="value">
          <span className="icon">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <circle cx="13" cy="13" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13 7v6l4 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="num">01</span>
          <h3>經驗</h3>
          <p>近四十年的專業與經驗，做您堅強的後盾。</p>
        </div>
        <div className="value">
          <span className="icon">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <path d="M13 3 21 6v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="m9 13 3 3 5-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="num">02</span>
          <h3>品質</h3>
          <p>高品質的產品，才是維持競爭力的核心。</p>
        </div>
        <div className="value">
          <span className="icon">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <path
                d="M16.5 4.5a5 5 0 0 0-6 6.4L4 17.4 8.6 22l6.5-6.5a5 5 0 0 0 6.4-6l-3 3-3.5-1-1-3.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="num">03</span>
          <h3>服務</h3>
          <p>快速且完善的服務，值得您信賴。</p>
        </div>
      </section>

      <section className="quality">
        <HeroLines />
        <div>
          <div className="cert">{COMPANY.certification}</div>
          <h2>品質值得信賴</h2>
          <p>零組件皆達到標準化，提供高品質、高競爭力的產品，給您向前邁進的力量。</p>
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
          {HOME_CATEGORIES.map((c) => (
            <CategoryTile key={c.slug} category={c} />
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
          {posts.slice(0, 4).map((p) => (
            <PostTile key={p.slug} post={p} />
          ))}
        </div>
      </section>

      <ContactBand
        eyebrow="深耕台灣閥門領域近四十年"
        headingHtml="選型、維修、報價，<br>直接問我們的技術人員。"
      />
    </>
  );
}
