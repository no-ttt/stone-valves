/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { imageUrl } from "@/lib/images";
import { formatDate } from "@/lib/site";

export const metadata: Metadata = { title: "文章" };

type Props = { searchParams: Promise<{ status?: string }> };

export default async function PostsPage({ searchParams }: Props) {
  await requireAdmin();
  const status = (await searchParams).status;
  const filter = status === "draft" || status === "published" ? status : null;
  const db = await getDb();
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      tag: posts.tag,
      status: posts.status,
      coverImage: posts.coverImage,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(filter ? eq(posts.status, filter) : undefined)
    .orderBy(desc(posts.publishedAt), desc(posts.id))
    .all();

  const tabs = [
    { href: "/admin/posts", label: "全部", on: !filter },
    { href: "/admin/posts?status=published", label: "已發布", on: filter === "published" },
    { href: "/admin/posts?status=draft", label: "草稿", on: filter === "draft" },
  ];

  return (
    <main className="work">
      <header className="work-head">
        <h1>文章</h1>
        <span className="spacer" />
        <Link className="btn btn-primary" href="/admin/posts/new">
          ＋ 新增文章
        </Link>
      </header>
      <nav className="filters" aria-label="篩選">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} aria-current={t.on ? "page" : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>
      {rows.length === 0 ? (
        <div className="card empty-state">
          {filter === "draft" ? "沒有草稿。" : "還沒有文章。"}
          <div>
            <Link href="/admin/posts/new">寫第一篇文章</Link>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th aria-label="封面" />
                <th>標題</th>
                <th>分類</th>
                <th>狀態</th>
                <th>發布日期</th>
                <th>最後修改</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.coverImage ? <img className="thumb-sm" src={imageUrl(p.coverImage)} alt="" /> : <span className="thumb-sm" />}</td>
                  <td className="title-cell">
                    <Link href={`/admin/posts/${p.id}`}>{p.title || "（未命名）"}</Link>
                    <small>/info/{p.slug}</small>
                  </td>
                  <td>{p.tag}</td>
                  <td>
                    <span className={p.status === "published" ? "pill ok" : "pill"}>{p.status === "published" ? "已發布" : "草稿"}</span>
                  </td>
                  <td className="num">{p.publishedAt ? formatDate(p.publishedAt) : "—"}</td>
                  <td className="num">{formatDate(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
