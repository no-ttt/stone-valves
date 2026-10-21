import type { NextConfig } from "next";
import { categories } from "./content/categories";
import { posts } from "./content/posts";

const nextConfig: NextConfig = {
  // Workers 上沒有 next/image 的伺服器端最佳化；圖片改在上傳時就壓縮好
  images: { unoptimized: true },

  // 舊站（靜態 HTML）的網址一律 301 轉到新網址，保住既有的搜尋排名
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/product.html", destination: "/products", permanent: true },
      { source: "/info.html", destination: "/info", permanent: true },
      ...categories.map((c) => ({ source: `/product/${c.slug}.html`, destination: `/products/${c.slug}`, permanent: true })),
      ...posts.map((p) => ({ source: `/info/post-${p.legacyId}.html`, destination: `/info/${p.slug}`, permanent: true })),
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
