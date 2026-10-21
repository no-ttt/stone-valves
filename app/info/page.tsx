import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ContactBand } from "@/components/ContactBand";
import { PostFilter } from "@/components/PostFilter";
import { posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "資訊討論",
  description: "寔黈企業三十餘年氣動閥專業：執行器原理、閥門選型、材質挑選與保養的技術文章。",
  alternates: { canonical: "/info" },
};

export default function InfoPage() {
  return (
    <>
      <Hero size="tall" image="/images/2013240233.jpg" current="/info">
        <div className="eyebrow">資訊討論</div>
        <h1>
          閥門的知識，
          <br />
          從這裡開始。
        </h1>
        <p className="lead">執行器原理、閥門選型、材質挑選與保養，寔黈把三十餘年的現場經驗寫成文章。</p>
      </Hero>

      <main className="wrap section" style={{ paddingTop: 32 }} aria-label="文章">
        <PostFilter posts={posts} />
      </main>

      <ContactBand />
    </>
  );
}
