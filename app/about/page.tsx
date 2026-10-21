/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Hero } from "@/components/Hero";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { CategoryTile } from "@/components/Tiles";
import { categories } from "@/content/categories";
import { COMPANY, FULL_ADDRESS, ADDRESS_TEXT } from "@/lib/site";

export const metadata: Metadata = {
  title: "關於寔黈",
  description: "寔黈企業專門從事氣動執行器、氣動閥門生產三十餘年，產品通過 ISO9001：2000 CE 品質管理體系認證。",
  alternates: { canonical: "/about" },
};

const FEATURED = ["actuator", "ball-valve", "butterfly-valve", "control-valve"];
const MATERIALS = ["ASTM/CF8M", "CF8", "WCB", "LCC", "JIS/316", "304", "316L"];
const INDUSTRIES = ["工業自動化", "石化工業", "染整機械廠", "廢水處理廠", "工業用管道", "自動化機械工業"];
const MAP_QUERY = encodeURIComponent(FULL_ADDRESS);

export default function AboutPage() {
  return (
    <>
      <Hero size="mid" image="/images/472157156.jpg" current="/about">
        <Breadcrumbs items={[{ label: "關於寔黈" }]} />
        <div className="eyebrow">About Us</div>
        <h1>關於寔黈</h1>
        <p className="lead">專門從事氣動執行器、氣動閥門生產三十餘年的台灣企業。</p>
      </Hero>

      <section className="split about-intro">
        <div className="intro-copy">
          <div className="kicker">公司簡介</div>
          <h2>三十餘年的氣動閥專業</h2>
          <div className="prose">
            <p>
              寔黈實業有限公司是一家專門從事氣動執行器、氣動閥門生產三十餘年的台灣企業。產品按國家標準及美國、德國、日本標準生產，以
              CNC 電腦速控加工機械生產，品質保證精密。
            </p>
            <p>
              產品已通過 ISO9001：2000 CE
              品質管理體系認證，所生產的閥門系列產品廣泛應用於工業自動化、石化工業、染整機械廠、廢水處理廠等行業。
            </p>
          </div>
        </div>
        <figure className="about-img">
          <img src="/images/1615538772.jpg" alt="CNC 加工機械" loading="lazy" />
          <figcaption>CNC 電腦速控加工，品質保證精密</figcaption>
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
          backgroundImage:
            "linear-gradient(90deg,rgba(15,44,36,.95) 0%,rgba(15,44,36,.85) 55%,rgba(15,44,36,.55) 100%),url('/images/1283431442.jpg')",
        }}
      >
        <div className="motto-inner">
          <div className="eyebrow">經營理念</div>
          <blockquote>
            「品質求生存，
            <br />
            信譽求發展」
          </blockquote>
          <p>誠納四海商客，願與各位朋友長期共事，攜手共進，共創未來。</p>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <div className="kicker">主要產品</div>
            <h2>從氣缸到各式閥門</h2>
            <p>
              鋁合金氣缸、鑄鐵氣缸、法蘭口球閥、三片式牙口（焊口）球閥、三通球閥、二片式球閥、氣動控制閥、閘閥、止回閥、Y型牙口閥、減壓閥等。
            </p>
          </div>
          <Link className="btn btn-line" href="/products">
            全部產品
            <ArrowRight />
          </Link>
        </div>
        <div className="grid c4">
          {categories
            .filter((c) => FEATURED.includes(c.slug))
            .map((c) => (
              <CategoryTile key={c.slug} category={c} />
            ))}
        </div>
      </section>

      <section className="split mat-ind">
        <div>
          <div className="kicker">材質</div>
          <h2 className="h2">多種閥體材質</h2>
          <div className="mat-grid">
            {MATERIALS.map((m) => (
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
            {INDUSTRIES.map((name, i) => (
              <li key={name}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {name}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="en-panel" lang="en">
        <div className="kicker">STONE Enterprise Co., Ltd.</div>
        <div className="en-cols prose en">
          <p>
            STONE Enterprise Co., Ltd. professionally manufactures actuators and various valves over 30 years. The products
            are based on the standards of GB, JB, API, JIS etc. We use speed controlled machining mechanism to assure the
            precision of our products.
          </p>
          <p>
            The main products of our manufacture include aluminum alloyed actuator, cast-iron actuator, flange ended ball
            valve, three-piece cylinder actuated ball valve, soldered-connection ball valve, three-way valve, two-piece ball
            valve, air-operated control valve, gate valve, cut-off valve, thread Y stop valve, pressure reduce valve etc.
          </p>
        </div>
      </section>

      <section className="wrap section" id="contact">
        <div className="section-head">
          <div>
            <div className="kicker">聯絡資訊</div>
            <h2>聯絡我們</h2>
          </div>
          <a className="btn btn-line" href={COMPANY.facebook} rel="noopener">
            Facebook 最新消息
            <ArrowUpRight />
          </a>
        </div>
        <div className="split contact-split">
          <ul className="contact-list">
            <li>
              <span className="label">地址</span>
              <span className="value-text">{ADDRESS_TEXT}</span>
            </li>
            <li>
              <span className="label">客服專線</span>
              <a className="value-text" href={COMPANY.phoneHref}>
                {COMPANY.phone}
              </a>
            </li>
            <li>
              <span className="label">傳真</span>
              <span className="value-text">{COMPANY.fax}</span>
            </li>
            <li>
              <span className="label">E-mail</span>
              <a className="value-text" href={`mailto:${COMPANY.email}`}>
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a
                className="btn btn-dark"
                href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
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
              src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
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
