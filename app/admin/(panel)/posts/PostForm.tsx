"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Editor } from "@tiptap/react";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { Dialog } from "@/components/admin/Dialog";
import { ImageField } from "@/components/admin/ImageField";
import { SeoPanel } from "@/components/admin/SeoPanel";
import { deletePost, savePost, type PostInput } from "@/lib/admin/post-actions";

export type PostFormValues = Omit<PostInput, "content"> & { contentHtml: string };

type Stats = { h2: number; images: number; missingAlt: number; internalLinks: number; chars: number };

function statsOf(editor: Editor | null): Stats {
  const empty = { h2: 0, images: 0, missingAlt: 0, internalLinks: 0, chars: 0 };
  if (!editor) return empty;
  const s = { ...empty, chars: editor.state.doc.textContent.replace(/\s+/g, "").length };
  editor.state.doc.descendants((node) => {
    if (node.type.name === "heading" && node.attrs.level === 2) s.h2++;
    if (node.type.name === "image") {
      s.images++;
      if (!String(node.attrs.alt ?? "").trim()) s.missingAlt++;
    }
    for (const m of node.marks) if (m.type.name === "link" && String(m.attrs.href).startsWith("/")) s.internalLinks++;
  });
  return s;
}

export function PostForm({ initial }: { initial: PostFormValues }) {
  const router = useRouter();
  const editorRef = useRef<Editor | null>(null);
  const [v, setV] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const wasPublished = initial.id != null && initial.status === "published";

  const set = (patch: Partial<PostFormValues>) => {
    setV((old) => ({ ...old, ...patch }));
    setDirty(true);
  };

  // 有未儲存的變更時，離開頁面前提醒
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save(status: "draft" | "published") {
    const editor = editorRef.current;
    if (!editor) return;
    setSaving(true);
    setError("");
    const { contentHtml: _ignored, ...rest } = v;
    void _ignored;
    const r = await savePost({ ...rest, status, content: JSON.stringify(editor.getJSON()) });
    setSaving(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setV((old) => ({ ...old, id: r.id, slug: r.slug, status }));
    setDirty(false);
    setSavedAt(r.savedAt);
    if (!initial.id) router.replace(`/admin/posts/${r.id}`);
    else router.refresh();
  }

  const s = stats ?? statsOf(null);
  const checks = [
    { label: "標題", ok: !!v.title.trim() && [...v.title].length <= 40, text: `${[...v.title].length} 字`, hint: "建議 40 字內" },
    { label: "摘要", ok: [...v.excerpt.trim()].length >= 20, text: `${[...v.excerpt.trim()].length} 字`, hint: "會出現在列表和搜尋結果" },
    { label: "大標（H2）", ok: s.h2 > 0, text: `${s.h2} 個`, hint: "用大標切分段落" },
    { label: "圖片缺少 alt", ok: s.missingAlt === 0, text: `${s.missingAlt} / ${s.images}`, hint: "點圖片 → 編輯替代文字" },
    { label: "站內連結", ok: s.internalLinks > 0, text: `${s.internalLinks} 個`, hint: "連到相關產品頁" },
    { label: "內文字數", ok: s.chars >= 300, text: `${s.chars} 字`, hint: "建議 300 字以上" },
  ];

  const publishLabel = v.status === "published" || wasPublished ? "更新發布" : "發布";

  return (
    <main className="work">
      <div className="savebar">
        <Link className="crumb" href="/admin/posts">
          ← 文章
        </Link>
        <span className={v.status === "published" ? "pill ok" : "pill"}>{v.status === "published" ? "已發布" : "草稿"}</span>
        <span className="state" role="status">
          {saving ? "儲存中…" : dirty ? "有尚未儲存的變更" : savedAt ? "已儲存" : ""}
        </span>
        <span className="spacer" />
        {v.id && (
          <a className="btn" href={`/preview/posts/${v.id}`} target="_blank" rel="noopener">
            預覽
          </a>
        )}
        {v.status === "published" ? (
          <button className="btn" type="button" disabled={saving} onClick={() => save("draft")}>
            改回草稿
          </button>
        ) : (
          <button className="btn" type="button" disabled={saving} onClick={() => save("draft")}>
            儲存草稿
          </button>
        )}
        <button className="btn btn-primary" type="button" disabled={saving} onClick={() => save("published")}>
          {publishLabel}
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="edit-layout">
        <div className="stack">
          <div className="card editor-card">
            <label className="sr-only" htmlFor="post-title">
              文章標題
            </label>
            <input
              id="post-title"
              className="title-input"
              type="text"
              placeholder="文章標題"
              maxLength={120}
              value={v.title}
              onChange={(e) => set({ title: e.target.value })}
            />
            <p className="muted">標題就是頁面的 H1，所以內文只提供「大標」和「小標」兩種標題。</p>
            <ArticleEditor
              initialHtml={initial.contentHtml}
              editorRef={editorRef}
              onReady={(editor) => setStats(statsOf(editor))}
              onChange={() => {
                setDirty(true);
                setStats(statsOf(editorRef.current));
              }}
            />
          </div>
        </div>

        <aside className="side-stack">
          <section className="card">
            <h2>發布設定</h2>
            <label className="field">
              <span>分類</span>
              <select value={v.tag} onChange={(e) => set({ tag: e.target.value as PostInput["tag"] })}>
                <option value="資訊">資訊</option>
                <option value="討論">討論</option>
              </select>
            </label>
            <label className="field">
              <span>發布日期</span>
              <input type="date" value={v.publishedDate} onChange={(e) => set({ publishedDate: e.target.value })} />
              <small>顯示在文章上，也用來排序</small>
            </label>
          </section>

          <section className="card">
            <h2>封面</h2>
            <ImageField
              label="封面圖片"
              value={v.coverImage}
              onChange={(coverImage) => set({ coverImage })}
              alt={v.coverAlt}
              onAltChange={(coverAlt) => set({ coverAlt })}
            />
            <label className="check">
              <input type="checkbox" checked={v.coverFit} onChange={(e) => set({ coverFit: e.target.checked })} />
              <span>完整顯示（產品圖、示意圖適用；照片不用勾）</span>
            </label>
          </section>

          <section className="card">
            <h2>網址與搜尋</h2>
            <label className="field">
              <span>網址</span>
              <input type="text" value={v.slug} placeholder="how-pneumatic-valves-work" onChange={(e) => set({ slug: e.target.value.toLowerCase() })} />
              <small>
                /info/{v.slug || "…"}
                <br />
                英文小寫、數字和「-」。
                {wasPublished && "已發布的文章改網址後，舊網址會自動轉到新網址。"}
              </small>
            </label>
            <label className="field">
              <span>
                摘要
                <span className="count">{[...v.excerpt].length} 字</span>
              </span>
              <textarea rows={3} maxLength={300} value={v.excerpt} onChange={(e) => set({ excerpt: e.target.value })} />
              <small>顯示在文章列表，也是搜尋結果說明的預設值</small>
            </label>
            <SeoPanel
              path={`/info/${v.slug}`}
              fallbackTitle={v.title}
              fallbackDescription={v.excerpt}
              seoTitle={v.seoTitle}
              seoDescription={v.seoDescription}
              noindex={v.noindex}
              titleSuffix="｜資訊討論｜寔黈企業 STONE VALVES"
              onChange={(patch) => set(patch)}
            />
          </section>

          <section className="card">
            <h2>SEO 檢查</h2>
            <ul className="checks">
              {checks.map((c) => (
                <li key={c.label}>
                  <span>{c.label}</span>
                  <span className="check-v">
                    <span className={c.ok ? "pill ok" : "pill warn"}>{c.ok ? "良好" : "待改善"}</span>
                    {c.text}
                  </span>
                  <small>{c.hint}</small>
                </li>
              ))}
            </ul>
          </section>

          {v.id && (
            <section className="card">
              <button className="btn btn-danger" type="button" onClick={() => setConfirmDelete(true)}>
                刪除文章
              </button>
            </section>
          )}
        </aside>
      </div>

      <Dialog
        open={confirmDelete}
        title="刪除這篇文章？"
        submitLabel="刪除"
        danger
        onClose={() => setConfirmDelete(false)}
        onSubmit={async () => {
          if (!v.id) return;
          await deletePost(v.id);
          setDirty(false);
          router.replace("/admin/posts");
        }}
      >
        <p className="muted">
          「{v.title || "未命名文章"}」會被永久刪除，無法復原。
          {wasPublished && "已發布的網址會自動轉到文章列表。"}
        </p>
      </Dialog>
    </main>
  );
}
