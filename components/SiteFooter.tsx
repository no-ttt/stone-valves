import Link from "next/link";
import { getContent } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { NAV, companyInfo } from "@/lib/site";

/** 頁尾（置中）：logo → 細線 → 頁面連結 → 聯絡資訊＋Facebook → 版權 */
export async function SiteFooter() {
  const company = companyInfo(await getContent());
  return (
    <footer className="site-foot">
      <div className="foot-inner">
        <Link className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl("/images/st-png_3.png")} alt="寔黈企業標誌" />
          <span className="brand-name">
            <b>寔黈企業</b>
            <small>STONE VALVES</small>
          </span>
        </Link>

        <nav className="foot-nav" aria-label="網站">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="foot-contact">
          <address>
            <span>{company.address}</span>
            <a href={company.phoneHref}>{company.phone}</a>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </address>
          <a className="foot-social" href={company.facebook} rel="noopener" target="_blank" aria-label="寔黈企業 Facebook 粉絲專頁">
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 8.5V6.8c0-.8.5-1.3 1.3-1.3H17V2.3h-2.6C11.6 2.3 10.5 4 10.5 6.6v1.9H8v3.2h2.5v10h3.5v-10h2.6l.4-3.2z" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>

      <div className="foot-bottom">
        © {new Date().getFullYear()} {company.name} {company.englishName}
      </div>
    </footer>
  );
}
