import type { MetadataRoute } from "next";
import { categories } from "@/content/categories";
import { posts } from "@/content/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = posts[0]?.date;
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "monthly", priority: 0.9 },
    ...categories.map((c) => ({ url: `${SITE_URL}/products/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/info`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({ url: `${SITE_URL}/info/${p.slug}`, lastModified: p.date, priority: 0.6 })),
  ];
}
