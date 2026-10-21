import type { MetadataRoute } from "next";
import { IS_STAGING, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // staging 整站不讓搜尋引擎爬
  if (IS_STAGING) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
