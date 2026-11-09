/**
 * R2 公開網域，例如 https://img.stonevalves.com.tw（見 docs/Cloudflare-Infra.md 第 4 節）。
 * 本地開發沒有設定時，改用 /uploads/<key> 這個只在開發時使用的路由從本地 R2 讀圖。
 */
const IMG_BASE = (process.env.IMG_BASE || "").replace(/\/$/, "");

/** 資料庫裡的圖片位置 → 前台可用的網址 */
export function imageUrl(value: string | null | undefined): string {
  if (!value) return "";
  if (value.startsWith("/") || /^https?:\/\//.test(value)) return value;
  return IMG_BASE ? `${IMG_BASE}/${value}` : `/uploads/${value}`;
}

/** 給 Open Graph、JSON-LD 用的絕對網址 */
export function absoluteImageUrl(value: string | null | undefined, siteUrl: string): string {
  const url = imageUrl(value);
  return url.startsWith("/") ? siteUrl + url : url;
}
