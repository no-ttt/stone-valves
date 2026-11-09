"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Editor } from "@tiptap/react";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { Dialog } from "@/components/admin/Dialog";
import { ImageField } from "@/components/admin/ImageField";
import { ItemList, type ListItem } from "@/components/admin/ItemList";
import { SeoPanel } from "@/components/admin/SeoPanel";
import { deleteCategory, saveCategory } from "@/lib/admin/category-actions";

type Values = {
  slug: string;
  name: string;
  tileName: string;
  navName: string;
  footerName: string;
  cardImage: string | null;
  introHtml: string;
  keywords: string;
  contactEyebrow: string;
  contactHeading: string;
  showOnHome: boolean;
  seoTitle: string;
  seoDescription: string;
  noindex: boolean;
  products: ListItem[];
};

export function CategoryForm({ initial }: { initial: Values }) {
  const router = useRouter();
  const editorRef = useRef<Editor | null>(null);
  const [v, setV] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = (patch: Partial<Values>) => {
    setV((old) => ({ ...old, ...patch }));
    setDirty(true);
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    const editor = editorRef.current;
    if (!editor) return;
    setSaving(true);
    setError("");
    const r = await saveCategory({
      ...v,
      intro: JSON.stringify(editor.getJSON()),
      products: v.products.map((p) => ({ name: p.name, image: p.image, imageAlt: p.extra ?? "" })),
    });
    setSaving(false);
    if (!r.ok) return setError(r.error);
    setDirty(false);
    setSaved(true);
    router.refresh();
  }

  const missingAlt = v.products.filter((p) => p.name && !(p.extra ?? "").trim()).length;

  return (
    <main className="work">
      <div className="savebar">
        <Link className="crumb" href="/admin/categories">
          ← 產品分類
        </Link>
        <span className="state" role="status">
          {saving ? "儲存中…" : dirty ? "有尚未儲存的變更" : saved ? "已儲存" : ""}
        </span>
        <span className="spacer" />
        <a className="btn" href={`/products/${v.slug}`} target="_blank" rel="noopener">
          查看頁面
        </a>
        <button className="btn btn-primary" type="button" disabled={saving} onClick={save}>
          儲存
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="edit-layout">
        <div className="stack">
          <section className="card">
            <h2>名稱</h2>
            <div className="grid-2">
              <label className="field">
                <span>分類名稱（頁面標題 H1）</span>
                <input type="text" value={v.name} maxLength={40} onChange={(e) => set({ name: e.target.value })} />
              </label>
              <label className="field">
                <span>卡片上的名稱</span>
                <input type="text" value={v.tileName} maxLength={40} placeholder={v.name} onChange={(e) => set({ tileName: e.target.value })} />
                <small>首頁和產品資訊頁的分類卡片</small>
              </label>
              <label className="field">
                <span>切換列的短名稱</span>
                <input type="text" value={v.navName} maxLength={30} placeholder={v.name} onChange={(e) => set({ navName: e.target.value })} />
                <small>分類頁上方的分類按鈕</small>
              </label>
              <label className="field">
                <span>頁尾連結名稱</span>
                <input type="text" value={v.footerName} maxLength={40} placeholder={v.name} onChange={(e) => set({ footerName: e.target.value })} />
              </label>
            </div>
            <label className="check">
              <input type="checkbox" checked={v.showOnHome} onChange={(e) => set({ showOnHome: e.target.checked })} />
              <span>顯示在首頁的「產品類別」</span>
            </label>
          </section>

          <section className="card">
            <h2>產品（{v.products.length} 項）</h2>
            <p className="muted">點圖片可以更換。第二個欄位是圖片的替代文字，沒填會用產品名稱。</p>
            <ItemList
              items={v.products}
              onChange={(products) => set({ products })}
              nameLabel="產品名稱"
              extra={{ label: "替代文字", placeholder: "替代文字（例如：不鏽鋼法蘭口球塞閥）" }}
              addLabel="新增產品"
            />
          </section>

          <section className="card editor-card">
            <h2 style={{ margin: "22px 24px 0" }}>分類介紹</h2>
            <p className="muted" style={{ margin: "0 24px" }}>
              顯示在產品列表上方。寫適用產業、材質、口徑、壓力範圍等，對搜尋排名幫助很大。
            </p>
            <ArticleEditor initialHtml={initial.introHtml} editorRef={editorRef} onChange={() => setDirty(true)} />
          </section>

          <section className="card">
            <h2>頁尾聯絡區塊</h2>
            <label className="field">
              <span>小標</span>
              <input type="text" value={v.contactEyebrow} maxLength={60} onChange={(e) => set({ contactEyebrow: e.target.value })} />
            </label>
            <label className="field">
              <span>標題</span>
              <textarea rows={2} value={v.contactHeading} maxLength={120} onChange={(e) => set({ contactHeading: e.target.value })} />
              <small>換行會照樣顯示</small>
            </label>
          </section>
        </div>

        <aside className="side-stack">
          <section className="card">
            <h2>卡片圖片</h2>
            <ImageField label="分類卡片圖片" value={v.cardImage} onChange={(cardImage) => set({ cardImage })} hint="也是分享到社群時的預設圖片" />
          </section>

          <section className="card">
            <h2>網址與搜尋</h2>
            <p className="muted">/products/{v.slug}</p>
            <SeoPanel
              path={`/products/${v.slug}`}
              fallbackTitle={v.name}
              fallbackDescription=""
              seoTitle={v.seoTitle}
              seoDescription={v.seoDescription}
              noindex={v.noindex}
              titleSuffix="｜產品資訊｜寔黈企業 STONE VALVES"
              onChange={(patch) => set(patch)}
            />
            <label className="field">
              <span>關鍵字</span>
              <textarea rows={3} value={v.keywords} onChange={(e) => set({ keywords: e.target.value })} />
              <small>用「、」分隔。顯示在分類頁底部</small>
            </label>
          </section>

          <section className="card">
            <h2>檢查</h2>
            <ul className="checks">
              <li>
                <span>SEO 說明</span>
                <span className="check-v">
                  <span className={v.seoDescription.trim() ? "pill ok" : "pill warn"}>{v.seoDescription.trim() ? "良好" : "待改善"}</span>
                </span>
                <small>產品分類頁要自己寫說明</small>
              </li>
              <li>
                <span>產品圖片 alt</span>
                <span className="check-v">
                  <span className={missingAlt ? "pill warn" : "pill ok"}>{missingAlt ? "待改善" : "良好"}</span>
                  {missingAlt} 項未填
                </span>
                <small>沒填會用產品名稱</small>
              </li>
            </ul>
          </section>

          <section className="card">
            <button className="btn btn-danger" type="button" onClick={() => setConfirmDelete(true)}>
              刪除分類
            </button>
          </section>
        </aside>
      </div>

      <Dialog
        open={confirmDelete}
        title="刪除這個分類？"
        submitLabel="刪除"
        danger
        onClose={() => setConfirmDelete(false)}
        onSubmit={async () => {
          await deleteCategory(v.slug);
          setDirty(false);
          router.replace("/admin/categories");
        }}
      >
        <p className="muted">
          「{v.name}」和裡面的 {v.products.length} 項產品會被永久刪除，無法復原。網址 /products/{v.slug} 會自動轉到產品資訊頁。
        </p>
      </Dialog>
    </main>
  );
}
