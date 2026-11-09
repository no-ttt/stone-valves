// 全站共用的網址設定與小工具。公司資訊改由後台管理，見 lib/content-fields.ts 的 company.*。
import type { Content } from "@/lib/content-fields";

/**
 * 正式網域。在 wrangler.jsonc 的 vars.SITE_URL 設定（例如 https://www.stonevalves.com.tw），
 * canonical、sitemap、Open Graph、JSON-LD 都會用到。
 */
export const SITE_URL = (process.env.SITE_URL || "https://www.example.com.tw").replace(/\/$/, "");

/** staging 建置時帶 SITE_ENV=staging：所有頁面 noindex，robots.txt 全擋 */
export const IS_STAGING = process.env.SITE_ENV === "staging";

export const NAV = [
  { href: "/", label: "寔黈首頁" },
  { href: "/products", label: "產品資訊" },
  { href: "/about", label: "關於寔黈" },
  { href: "/info", label: "資訊討論" },
] as const;

export type NavHref = (typeof NAV)[number]["href"];

/** 從前台內容整理出公司資訊 */
export function companyInfo(c: Content) {
  const phoneDigits = c["company.phone"].replace(/[^\d+]/g, "");
  return {
    name: c["company.name"],
    englishName: c["company.englishName"],
    region: c["company.region"],
    locality: c["company.locality"],
    street: c["company.street"],
    /** 頁面上顯示的地址（不含縣市，沿用舊站） */
    address: `${c["company.locality"]}${c["company.street"]}`,
    fullAddress: `${c["company.region"]}${c["company.locality"]}${c["company.street"]}`,
    phone: c["company.phone"],
    phoneHref: `tel:${phoneDigits}`,
    /** 國際格式，給結構化資料用：(02) 2296-8958 → +886-2-2296-8958 */
    phoneIntl: toIntl(c["company.phone"]),
    fax: c["company.fax"],
    faxIntl: toIntl(c["company.fax"]),
    email: c["company.email"],
    facebook: c["company.facebook"],
    certification: c["company.certification"],
  };
}

export type CompanyInfo = ReturnType<typeof companyInfo>;

function toIntl(local: string) {
  const m = local.match(/^\(?0(\d{1,2})\)?\s*([\d-]+)$/);
  return m ? `+886-${m[1]}-${m[2]}` : local;
}

/** 日期 → 2018.06.08（台灣時間） */
export function formatDate(d: Date) {
  return isoDate(d).replaceAll("-", ".");
}

/** 日期 → 2018-06-08（台灣時間） */
export function isoDate(d: Date) {
  return new Date(d.getTime() + 8 * 3600_000).toISOString().slice(0, 10);
}
