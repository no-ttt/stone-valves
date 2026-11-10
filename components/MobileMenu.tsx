"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  nav: readonly { href: string; label: string }[];
  logo: string;
  phone: string;
  phoneHref: string;
  email: string;
};

/**
 * 手機版選單（760px 以下才顯示，見 site.css「手機版選單」）。
 * 放在版面最外層（components/SiteMenu.tsx），不放在 header 裡：
 * iPhone Safari 上 position:fixed 的按鈕若在 header 裡，捲動時會跟著跑；放外層才會固定在右上角，換頁時也不會重建。
 * 展開的全螢幕墨綠選單用 portal 放到 <body>。
 */
export function MobileMenu({ nav, logo, phone, phoneHref, email }: Props) {
  // 記住「在哪一頁打開的」：換頁後路徑不同，選單就自動收起
  const pathname = usePathname();
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (v: boolean) => setOpenedAt(v ? pathname : null);
  // 目前所在的主選單項目（首頁只比對 /，其他比對開頭，例如 /products/actuator 算產品資訊）
  const current = nav.find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)))?.href;
  // 伺服器端沒有 document，只在瀏覽器端用 portal 掛到 <body>
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 打開時：背景不能捲動、焦點移到選單、Esc 關閉；關閉時焦點回到按鈕
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenedAt(null);
    };
    window.addEventListener("keydown", onKey);
    const button = buttonRef.current;
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  const panel = (
    <div
      ref={panelRef}
      id="mobile-menu"
      className={open ? "m-menu open" : "m-menu"}
      role="dialog"
      aria-modal="true"
      aria-label="主選單"
      tabIndex={-1}
      inert={!open}
    >
      <div className="m-menu-top">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <img src={logo} alt="寔黈企業標誌" />
          <span className="brand-name">
            <b>寔黈企業</b>
            <small>STONE VALVES</small>
          </span>
        </Link>
        <button className="menu-btn" type="button" aria-label="關閉選單" onClick={() => setOpen(false)}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M4 4l10 10M14 4 4 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <nav className="m-menu-nav" aria-label="主選單">
        {nav.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.href === current ? "page" : undefined}
            style={{ "--i": i } as React.CSSProperties}
            onClick={() => setOpen(false)}
          >
            <span className="m-menu-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="m-menu-contact">
        <span className="m-menu-label">聯絡我們</span>
        <a className="btn btn-light" href={phoneHref}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5.2 2.5 3 2.6c-.6 0-1 .5-1 1.1C2.4 9 7 13.6 12.3 14c.6 0 1.1-.4 1.1-1l.1-2.2-2.9-1.2-1.3 1.4A8 8 0 0 1 5 6.8l1.4-1.3z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          {phone}
        </a>
        <a className="btn btn-glass glass" href={`mailto:${email}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 3.5h12v9H2zM2.5 4l5.5 4.5L13.5 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          {email}
        </a>
      </div>
      <svg className="m-menu-lines" viewBox="0 0 640 640" aria-hidden="true">
        <circle cx="320" cy="320" r="310" fill="none" stroke="#fff" strokeWidth="1" opacity=".14" />
        <line x1="60" y1="640" x2="520" y2="0" stroke="#fff" strokeWidth="1" opacity=".1" />
      </svg>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        className="menu-btn glass"
        type="button"
        aria-label="開啟選單"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M3 6h12M3 12h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
