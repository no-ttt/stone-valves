import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactBand } from "@/components/ContactBand";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { findRedirect, getContent, getPublishedPost } from "@/lib/data";
import { absoluteImageUrl, imageUrl } from "@/lib/images";
import { SITE_URL, companyInfo, formatDate, isoDate } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await getPublishedPost((await params).slug);
  if (!found) return {};
  const { post } = found;
  const url = `/info/${post.slug}`;
  const description = post.seoDescription || post.excerpt;
  const image = post.ogImage || post.coverImage;
  return {
    title: `${post.seoTitle || post.title}｜資訊討論`,
    description,
    alternates: { canonical: url },
    robots: post.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      url,
      title: post.seoTitle || post.title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: image ? [imageUrl(image)] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const slug = (await params).slug;
  const [found, content] = await Promise.all([getPublishedPost(slug), getContent()]);
  if (!found) {
    const to = await findRedirect(`/info/${slug}`);
    if (to) permanentRedirect(to);
    notFound();
  }
  const { post, newer, older } = found;
  const company = companyInfo(content);
  const published = post.publishedAt!;

  return (
    <>
      <Hero size="short" image={imageUrl(content["info.hero.image"])} current="/info">
        <Breadcrumbs items={[{ label: "資訊討論", href: "/info" }, { label: post.tag }]} />
        <h1 style={{ fontSize: 40 }}>{post.title}</h1>
      </Hero>

      <article className="article">
        <div className="article-head">
          <div className="meta-row">
            <span className={post.tag === "討論" ? "tag talk" : "tag"}>{post.tag}</span>
            <time dateTime={isoDate(published)}>{formatDate(published)}</time>
          </div>
        </div>
        {/* 內文由後台編輯器產生，存檔時已經過濾（見 lib/sanitize.ts） */}
        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        {/* 上一篇＝較舊的文章（左），下一篇＝較新的文章（右） */}
        <nav className="article-nav" aria-label="其他文章">
          <div className="an-side">
            {older && (
              <Link className="an-link" href={`/info/${older.slug}`}>
                <span className="an-circle" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 16 16">
                    <path d="M13 8H3M7 4 3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="an-text">
                  <span className="an-label">上一篇</span>
                  <span className="an-title">{older.title}</span>
                </span>
              </Link>
            )}
          </div>
          <div className="an-side next">
            {newer && (
              <Link className="an-link" href={`/info/${newer.slug}`}>
                <span className="an-text">
                  <span className="an-label">下一篇</span>
                  <span className="an-title">{newer.title}</span>
                </span>
                <span className="an-circle" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 16 16">
                    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            )}
          </div>
        </nav>
      </article>

      <ContactBand />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.seoDescription || post.excerpt,
          datePublished: published.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          ...(post.coverImage ? { image: [absoluteImageUrl(post.coverImage, SITE_URL)] } : {}),
          mainEntityOfPage: `${SITE_URL}/info/${post.slug}`,
          author: { "@type": "Organization", name: company.name, url: SITE_URL },
          publisher: {
            "@type": "Organization",
            name: company.name,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/images/st-png_3.png` },
          },
        }}
      />
    </>
  );
}
