// 全站共用的公司資訊與網址設定。

/**
 * 正式網域。部署時用環境變數 SITE_URL 設定（例如 https://www.stonevalves.com.tw），
 * canonical、sitemap、Open Graph、JSON-LD 都會用到。
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://www.example.com.tw").replace(/\/$/, "");

/** staging 建置時帶 SITE_ENV=staging：所有頁面 noindex，robots.txt 全擋 */
export const IS_STAGING = process.env.SITE_ENV === "staging";

export const COMPANY = {
  name: "寔黈企業股份有限公司",
  shortName: "寔黈企業",
  brand: "STONE VALVES",
  englishName: "Stone Enterprise Co., Ltd.",
  address: {
    region: "新北市",
    locality: "泰山區",
    street: "中港西路136巷95-12號",
  },
  phone: "(02) 2296-8958",
  phoneHref: "tel:0222968958",
  fax: "(02) 2296-8056",
  email: "shihtaoo@seed.net.tw",
  facebook: "https://www.facebook.com/STONE.VALVES/",
  certification: "ISO9001：2000．CE 品質管理體系認證",
};

export const ADDRESS_TEXT = `${COMPANY.address.locality}${COMPANY.address.street}`;
export const FULL_ADDRESS = `${COMPANY.address.region}${COMPANY.address.locality}${COMPANY.address.street}`;

export const NAV = [
  { href: "/", label: "寔黈首頁" },
  { href: "/products", label: "產品資訊" },
  { href: "/about", label: "關於寔黈" },
  { href: "/info", label: "資訊討論" },
] as const;

export type NavHref = (typeof NAV)[number]["href"];

/** 文章日期 2018-06-08 → 2018.06.08 */
export function formatDate(iso: string) {
  return iso.replaceAll("-", ".");
}
