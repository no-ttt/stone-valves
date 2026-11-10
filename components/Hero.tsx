import Link from "next/link";
import { ArrowUpRight, HeroLines } from "@/components/icons";
import { imageUrl } from "@/lib/images";
import { NAV, type NavHref } from "@/lib/site";

type Props = {
  size: "tall" | "mid" | "short";
  image: string;
  /** 目前所在的主選單項目 */
  current: NavHref;
  children: React.ReactNode;
};

/** 每頁頂部的大圖區塊，包含 logo、主選單與頁面標題。手機版的選單按鈕在版面最外層（SiteMenu） */
export function Hero({ size, image, current, children }: Props) {
  const logo = imageUrl("/images/st-png_3.png");
  return (
    <section className={`hero ${size}`}>
      {/* 背景圖獨立一層：換頁時背景直接淡換成下一頁的圖，header 才不會因為底色消失而看不見 */}
      <div className="hero-bg" aria-hidden="true" style={{ backgroundImage: `var(--shade),url('${image}')` }} />
      <HeroLines />
      <header className="topbar">
        <Link className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="寔黈企業標誌" />
          <span className="brand-name">
            <b>寔黈企業</b>
            <small>STONE VALVES</small>
          </span>
        </Link>
        <nav className="nav glass" aria-label="主選單">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={item.href === current ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-light" href="/about#contact">
          聯繫我們
          <ArrowUpRight />
        </Link>
      </header>
      <div className="hero-copy">{children}</div>
    </section>
  );
}
