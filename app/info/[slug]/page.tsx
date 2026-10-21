import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactBand } from "@/components/ContactBand";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { getPost, posts } from "@/content/posts";
import { COMPANY, SITE_URL, formatDate } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  const url = `/info/${p.slug}`;
  return {
    title: `${p.title}｜資訊討論`,
    description: p.description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: p.title, description: p.description, publishedTime: p.date, images: [p.cover] },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const i = posts.indexOf(post);
  const newer = posts[i - 1];
  const older = posts[i + 1];

  return (
    <>
      <Hero size="short" image="/images/2013240233.jpg" current="/info">
        <Breadcrumbs items={[{ label: "資訊討論", href: "/info" }, { label: post.tag }]} />
        <h1 style={{ fontSize: 40 }}>{post.title}</h1>
      </Hero>

      <article className="article">
        <div className="article-head">
          <div className="meta-row">
            <span className={post.tag === "討論" ? "tag talk" : "tag"}>{post.tag}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </div>
        {/* 內文來自內容資料檔（之後是後台），由管理員撰寫 */}
        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
        <nav className="article-nav" aria-label="其他文章">
          {newer && (
            <Link href={`/info/${newer.slug}`}>
              <small>← 較新的文章</small>
              {newer.title}
            </Link>
          )}
          <Link href="/info">
            <small>返回</small>所有文章
          </Link>
          {older && (
            <Link className="next" href={`/info/${older.slug}`}>
              <small>較舊的文章 →</small>
              {older.title}
            </Link>
          )}
        </nav>
      </article>

      <ContactBand />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          image: [SITE_URL + post.cover],
          mainEntityOfPage: `${SITE_URL}/info/${post.slug}`,
          author: { "@type": "Organization", name: COMPANY.name, url: SITE_URL },
          publisher: { "@type": "Organization", name: COMPANY.name, logo: { "@type": "ImageObject", url: `${SITE_URL}/images/st-png_3.png` } },
        }}
      />
    </>
  );
}
