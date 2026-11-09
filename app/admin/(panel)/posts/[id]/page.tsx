import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { isoDate } from "@/lib/site";
import { PostForm } from "../PostForm";

export const metadata: Metadata = { title: "編輯文章" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const db = await getDb();
  const p = await db.select().from(posts).where(eq(posts.id, id)).get();
  if (!p) notFound();

  return (
    <PostForm
      // 換文章時重新建立表單與編輯器
      key={p.id}
      initial={{
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        tag: p.tag,
        coverImage: p.coverImage,
        coverAlt: p.coverAlt,
        coverFit: p.coverFit,
        status: p.status,
        publishedDate: isoDate(p.publishedAt ?? new Date()),
        seoTitle: p.seoTitle ?? "",
        seoDescription: p.seoDescription ?? "",
        noindex: p.noindex,
        contentHtml: p.contentHtml,
      }}
    />
  );
}
