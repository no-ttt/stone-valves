import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactBand } from "@/components/ContactBand";
import { Hero } from "@/components/Hero";
import { requireAdmin } from "@/lib/auth/session";
import { getContent } from "@/lib/data";
import { getDb } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { imageUrl } from "@/lib/images";
import { prepareArticleHtml } from "@/lib/article-html";
import { formatDate, isoDate } from "@/lib/site";

export const metadata: Metadata = { title: "預覽", robots: { index: false, follow: false } };

/** 後台的文章預覽（含草稿）。只有登入的管理員能看，顯示最後一次儲存的內容。 */
export default async function PreviewPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const db = await getDb();
  const [post, content] = await Promise.all([db.select().from(posts).where(eq(posts.id, id)).get(), getContent()]);
  if (!post) notFound();
  const date = post.publishedAt ?? new Date();

  return (
    <>
      <div className="preview-banner" role="status">
        預覽：{post.status === "published" ? "已發布" : "草稿（前台看不到）"}。這裡顯示的是最後一次儲存的內容。
      </div>
      <Hero size="short" image={imageUrl(content["info.hero.image"])} current="/info">
        <Breadcrumbs items={[{ label: "資訊討論", href: "/info" }, { label: post.tag }]} />
        <h1 style={{ fontSize: 40 }}>{post.title}</h1>
      </Hero>
      <article className="article">
        <div className="article-head">
          <div className="meta-row">
            <span className={post.tag === "討論" ? "tag talk" : "tag"}>{post.tag}</span>
            <time dateTime={isoDate(date)}>{formatDate(date)}</time>
          </div>
        </div>
        <div className="article-body" dangerouslySetInnerHTML={{ __html: prepareArticleHtml(post.contentHtml) }} />
      </article>
      <ContactBand />
    </>
  );
}
