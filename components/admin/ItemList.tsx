"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { compressAndUpload } from "@/components/admin/image-tools";
import { imageUrl } from "@/lib/images";

export type ListItem = { key: string; name: string; image: string | null; extra?: string };

type Props = {
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  nameLabel: string;
  /** 有給才顯示第二個欄位（例如替代文字或分類） */
  extra?: { label: string; options?: { value: string; label: string }[]; placeholder?: string };
  addLabel: string;
};

let seq = 0;
export const newKey = () => `new-${Date.now()}-${seq++}`;

/** 有圖片的清單：新增、刪除、上下移動、換圖 */
export function ItemList({ items, onChange, nameLabel, extra, addLabel }: Props) {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const update = (key: string, patch: Partial<ListItem>) => onChange(items.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  async function upload(key: string, file: File | undefined) {
    if (!file) return;
    setBusyKey(key);
    setNote("");
    const r = await compressAndUpload(file);
    setBusyKey(null);
    if (!r.ok) setNote(r.error);
    else update(key, { image: r.key });
  }

  return (
    <div className="stack">
      {items.length > 0 && (
        <ul className="sort-list">
          {items.map((it, i) => (
            <li key={it.key} className="sort-item">
              <div className="sort-handle">
                <button type="button" aria-label="往上移" disabled={i === 0} onClick={() => move(i, -1)}>
                  ▲
                </button>
                <button type="button" aria-label="往下移" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                  ▼
                </button>
              </div>
              <label className="thumb-upload" title="點一下換圖片">
                {it.image ? <img src={imageUrl(it.image)} alt="" /> : <span>上傳圖片</span>}
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={busyKey === it.key}
                  onChange={(e) => {
                    void upload(it.key, e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                {busyKey === it.key && <em>上傳中…</em>}
              </label>
              <div className="item-fields">
                <input type="text" aria-label={nameLabel} placeholder={nameLabel} value={it.name} maxLength={60} onChange={(e) => update(it.key, { name: e.target.value })} />
                {extra &&
                  (extra.options ? (
                    <select aria-label={extra.label} value={it.extra ?? ""} onChange={(e) => update(it.key, { extra: e.target.value })}>
                      {extra.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      aria-label={extra.label}
                      placeholder={extra.placeholder ?? extra.label}
                      value={it.extra ?? ""}
                      maxLength={120}
                      onChange={(e) => update(it.key, { extra: e.target.value })}
                    />
                  ))}
              </div>
              <button className="link-btn danger" type="button" onClick={() => onChange(items.filter((x) => x.key !== it.key))}>
                刪除
              </button>
            </li>
          ))}
        </ul>
      )}
      {note && (
        <p className="form-error" role="alert">
          {note}
        </p>
      )}
      <div>
        <button
          className="btn btn-small"
          type="button"
          onClick={() => onChange([...items, { key: newKey(), name: "", image: null, extra: extra?.options?.[0]?.value ?? "" }])}
        >
          ＋ {addLabel}
        </button>
      </div>
    </div>
  );
}
