"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/admin/Dialog";
import { createCategory, reorderCategories } from "@/lib/admin/category-actions";
import { imageUrl } from "@/lib/images";

type Row = { slug: string; name: string; cardImage: string | null; showOnHome: boolean; productCount: number; hasIntro: boolean };

export function CategoryList({ categories }: { categories: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(categories);
  const [orderDirty, setOrderDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const move = (i: number, d: -1 | 1) => {
    const next = [...rows];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setRows(next);
    setOrderDirty(true);
  };

  return (
    <section className="card">
      <div className="row">
        <h2 style={{ margin: 0 }}>分類</h2>
        <span style={{ flex: 1 }} />
        {orderDirty && (
          <button
            className="btn btn-primary btn-small"
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              await reorderCategories(rows.map((r) => r.slug));
              setSaving(false);
              setOrderDirty(false);
              router.refresh();
            }}
          >
            {saving ? "儲存中…" : "儲存排序"}
          </button>
        )}
        <button className="btn btn-small" type="button" onClick={() => setCreating(true)}>
          ＋ 新增分類
        </button>
      </div>
      <p className="muted">排序會套用到首頁、產品資訊頁、分類切換列與頁尾。</p>
      <ul className="sort-list">
        {rows.map((c, i) => (
          <li key={c.slug} className="sort-item">
            <div className="sort-handle">
              <button type="button" aria-label="往上移" disabled={i === 0} onClick={() => move(i, -1)}>
                ▲
              </button>
              <button type="button" aria-label="往下移" disabled={i === rows.length - 1} onClick={() => move(i, 1)}>
                ▼
              </button>
            </div>
            {c.cardImage ? <img src={imageUrl(c.cardImage)} alt="" /> : <span className="thumb-sm" />}
            <div className="title-cell">
              <Link href={`/admin/categories/${c.slug}`}>
                <b>{c.name}</b>
              </Link>
              <small className="muted">
                /products/{c.slug}・{c.productCount} 項產品{c.showOnHome ? "・首頁顯示" : ""}
                {!c.hasIntro && "・尚未填寫分類介紹"}
              </small>
            </div>
            <Link className="btn btn-small" href={`/admin/categories/${c.slug}`}>
              編輯
            </Link>
          </li>
        ))}
      </ul>

      <Dialog
        open={creating}
        title="新增分類"
        submitLabel="建立"
        error={error}
        onClose={() => {
          setCreating(false);
          setError("");
        }}
        onSubmit={async () => {
          const r = await createCategory(slug, name);
          if (!r.ok) return setError(r.error);
          router.push(`/admin/categories/${r.slug}`);
        }}
      >
        <label className="field">
          <span>分類名稱</span>
          <input type="text" value={name} maxLength={40} placeholder="例如：止回閥．逆止閥" onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          <span>網址</span>
          <input type="text" value={slug} maxLength={60} placeholder="check-valve" onChange={(e) => setSlug(e.target.value.toLowerCase())} />
          <small>/products/{slug || "…"}，英文小寫、數字和「-」。建立後不能修改。</small>
        </label>
      </Dialog>
    </section>
  );
}
