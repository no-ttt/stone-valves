import type { Metadata } from "next";
import { ContactBand } from "@/components/ContactBand";
import { Hero } from "@/components/Hero";
import { PostFilter } from "@/components/PostFilter";
import { Lines } from "@/components/Text";
import { getContent, getPublishedPosts } from "@/lib/data";
import { imageUrl } from "@/lib/images";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return { title: c["seo.info.title"], description: c["seo.info.description"], alternates: { canonical: "/info" } };
}

export default async function InfoPage() {
  const [c, posts] = await Promise.all([getContent(), getPublishedPosts()]);
  return (
    <>
      <Hero size="tall" image={imageUrl(c["info.hero.image"])} current="/info">
        <div className="eyebrow">資訊討論</div>
        <h1>
          <Lines text={c["info.hero.title"]} />
        </h1>
        <p className="lead">
          <Lines text={c["info.hero.lead"]} />
        </p>
      </Hero>

      <main className="wrap section" style={{ paddingTop: 32 }} aria-label="文章">
        <PostFilter posts={posts} />
      </main>

      <ContactBand />
    </>
  );
}
