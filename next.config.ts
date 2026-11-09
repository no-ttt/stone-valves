import type { NextConfig } from "next";
import { categories } from "./content/categories";

const nextConfig: NextConfig = {
  // 只有輸出 GitHub Pages 靜態預覽時才設定（網站在 /stone-valves 底下），見 scripts/export-pages.mjs
  basePath: process.env.PAGES_BASE_PATH || undefined,
  // 同一個值也給程式用（伺服器和瀏覽器都看得到）：lib/images.ts 要幫 /images/... 補上前綴，
  // 不然 iPhone 等情況下頁面在瀏覽器重新繪製時，圖片網址會少了 /stone-valves 而變成破圖
  env: { BASE_PATH: process.env.PAGES_BASE_PATH || "" },

  // Workers 上沒有 next/image 的伺服器端最佳化；圖片改在上傳時就壓縮好
  images: { unoptimized: true },

  // 開發時也允許用 http://127.0.0.1 開啟（預設只允許 localhost）
  allowedDevOrigins: ["127.0.0.1"],

  // 後台上傳圖片走 Server Action；圖片在瀏覽器端已壓縮，5MB 是保險上限
  experimental: { serverActions: { bodySizeLimit: "6mb" } },

  // 舊站（靜態 HTML）的網址一律 301 轉到新網址，保住既有的搜尋排名
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/product.html", destination: "/products", permanent: true },
      { source: "/info.html", destination: "/info", permanent: true },
      ...categories.map((c) => ({ source: `/product/${c.slug}.html`, destination: `/products/${c.slug}`, permanent: true })),
      // 舊文章網址（/info/post-xxxxxx.html）放在 D1 的 redirects 資料表（見 scripts/build-seed.ts），
      // 後台修改文章網址時會自動改指到新網址，不會變成連續轉址
    ];
  },

  // staging 站一律回 noindex，避免網址外流後被收錄
  async headers() {
    if (process.env.SITE_ENV !== "staging") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;

// 讓 `next dev` 也能使用 Cloudflare bindings 的本地模擬（之後接 D1、R2 時會用到）
if (process.env.NODE_ENV === "development") {
  void import("@opennextjs/cloudflare")
    .then(({ initOpenNextCloudflareForDev }) => initOpenNextCloudflareForDev())
    .catch((err) => {
      console.error("[next.config.ts] initOpenNextCloudflareForDev() failed:", err);
    });
}
