/**
 * R2 公開網域，例如 https://img.stonevalves.com.tw（見 docs/Cloudflare-Infra.md 第 4 節）。
 * 本地開發沒有設定時，改用 /uploads/<key> 這個只在開發時使用的路由從本地 R2 讀圖。
 */
const IMG_BASE = (process.env.IMG_BASE || "").replace(/\/$/, "");

/** 網站放在子路徑底下時的前綴（只有 GitHub Pages 預覽是 /stone-valves，正式站是空字串），見 next.config.ts */
const BASE_PATH = process.env.BASE_PATH || "";

/** 資料庫裡的圖片位置 → 前台可用的網址 */
export function imageUrl(value: string | null | undefined): string {
  if (!value) return "";
  if (/^https?:\/\//.test(value)) return value;
  if (value.startsWith("/")) return BASE_PATH + value;
  return IMG_BASE ? `${IMG_BASE}/${value}` : `${BASE_PATH}/uploads/${value}`;
}

/** 給 Open Graph、JSON-LD 用的絕對網址 */
export function absoluteImageUrl(value: string | null | undefined, siteUrl: string): string {
  const url = imageUrl(value);
  // siteUrl 已經包含子路徑，先把 imageUrl 補的前綴拿掉，免得重複
  return url.startsWith("/") ? siteUrl + url.slice(BASE_PATH.length) : url;
}

/** 後台編輯器產生的 HTML（文章內文、分類介紹）裡的站內圖片和連結，補上子路徑前綴 */
export function withBasePath(html: string): string {
  if (!BASE_PATH) return html;
  return html.replace(/\b(src|href)="\/(?!\/)/g, `$1="${BASE_PATH}/`);
}
