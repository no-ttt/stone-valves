import Link from "next/link";
import { getCategories, getContent } from "@/lib/data";
import { NAV, companyInfo } from "@/lib/site";

export async function SiteFooter() {
  const [content, categories] = await Promise.all([getContent(), getCategories()]);
  const company = companyInfo(content);
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
          <p>專業氣動執行器與閥門製造，{company.certification}。</p>
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
          <span>{company.address}</span>
          <a href={company.phoneHref}>電話 {company.phone}</a>
          <span>傳真 {company.fax}</span>
          <a href={`mailto:${company.email}`}>{company.email}</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>
          © {new Date().getFullYear()} {company.name} {company.englishName}
        </span>
        <a href={company.facebook} rel="noopener">
          Facebook
        </a>
      </div>
    </footer>
  );
}
