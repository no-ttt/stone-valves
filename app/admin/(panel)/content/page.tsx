import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { CONTENT_GROUPS, type ContentField, type ContentGroupId } from "@/lib/content-fields";
import { getContent } from "@/lib/data";
import { ContentForm } from "./ContentForm";

export const metadata: Metadata = { title: "前台內容" };

/** 每個分頁對應前台的哪一頁，給「查看頁面」用 */
const PREVIEW: Record<ContentGroupId, string> = {
  company: "/about#contact",
  home: "/",
  about: "/about",
  products: "/products",
  info: "/info",
  contact: "/",
  seo: "/",
};

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ group?: string }> }) {
  await requireAdmin();
  const requested = (await searchParams).group;
  const group = (requested && requested in CONTENT_GROUPS ? requested : "home") as ContentGroupId;
  const def = CONTENT_GROUPS[group];
  const content = await getContent();
  const fields = Object.entries(def.fields as Record<string, ContentField>).map(([key, f]) => ({
    key,
    ...f,
    value: content[key as keyof typeof content],
  }));

  return (
    <main className="work">
      <header className="work-head">
        <h1>前台內容</h1>
      </header>
      <nav className="content-tabs" aria-label="頁面">
        {(Object.keys(CONTENT_GROUPS) as ContentGroupId[]).map((id) => (
          <Link key={id} href={`/admin/content?group=${id}`} aria-current={id === group ? "page" : undefined}>
            {CONTENT_GROUPS[id].label}
          </Link>
        ))}
      </nav>
      <ContentForm key={group} group={group} description={def.description} fields={fields} previewHref={PREVIEW[group]} />
    </main>
  );
}
