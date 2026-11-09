import type { MetadataRoute } from "next";
import { getCategories, getPublishedPosts } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, posts] = await Promise.all([getCategories(), getPublishedPosts()]);
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "monthly", priority: 0.9 },
    ...categories
      .filter((c) => !c.noindex)
      .map((c) => ({ url: `${SITE_URL}/products/${c.slug}`, lastModified: c.updatedAt, priority: 0.8 })),
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/info`, lastModified: posts[0]?.publishedAt ?? undefined, changeFrequency: "weekly", priority: 0.7 },
    ...posts
      .filter((p) => !p.noindex)
      .map((p) => ({ url: `${SITE_URL}/info/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
