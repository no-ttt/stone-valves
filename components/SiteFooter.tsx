import Link from "next/link";
import { categories } from "@/content/categories";
import { ADDRESS_TEXT, COMPANY, NAV } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="foot-inner">
        <div className="foot-brand">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/st-png_3.png" alt="寔黈企業標誌" />
            <span className="brand-name">
              <b>寔黈企業</b>
              <small>STONE VALVES</small>
            </span>
          </Link>
          <p>專業氣動執行器與閥門製造，{COMPANY.certification}。</p>
        </div>
        <div className="foot-col">
          <b>網站</b>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="foot-col wide">
          <b>產品類別</b>
          <div className="foot-cats">
            {categories.map((c) => (
              <Link key={c.slug} href={`/products/${c.slug}`}>
                {c.footerName}
              </Link>
            ))}
          </div>
        </div>
        <div className="foot-col">
          <b>聯絡資訊</b>
          <span>{ADDRESS_TEXT}</span>
          <a href={COMPANY.phoneHref}>電話 {COMPANY.phone}</a>
          <span>傳真 {COMPANY.fax}</span>
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>
          © {new Date().getFullYear()} {COMPANY.name} {COMPANY.englishName}
        </span>
        <a href={COMPANY.facebook} rel="noopener">
          Facebook
        </a>
      </div>
    </footer>
  );
}
