"use client";

/* eslint-disable @next/next/no-img-element */
import { useId, useState } from "react";
import { compressAndUpload, formatBytes } from "@/components/admin/image-tools";
import { imageUrl } from "@/lib/images";

type Props = {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  /** 有給才顯示替代文字欄位 */
  alt?: string;
  onAltChange?: (alt: string) => void;
  hint?: string;
  allowClear?: boolean;
};

/** 圖片欄位：預覽、上傳（自動壓縮）、替代文字 */
export function ImageField({ label, value, onChange, alt, onAltChange, hint, allowClear = true }: Props) {
  const id = useId();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setNote("上傳中…");
    const r = await compressAndUpload(file);
    setBusy(false);
    if (!r.ok) {
      setNote(r.error);
      return;
    }
    setNote(`已上傳：${formatBytes(r.before)} → ${formatBytes(r.after)}`);
    onChange(r.key);
  }

  return (
    <div className="field image-field">
      <span>{label}</span>
      <div className="image-preview">{value ? <img src={imageUrl(value)} alt="" /> : "尚未選擇圖片"}</div>
      <div className="row">
        <label className="btn btn-small" htmlFor={id} aria-disabled={busy}>
          {value ? "更換圖片" : "上傳圖片"}
        </label>
        <input
          id={id}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={busy}
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {allowClear && value && (
          <button className="link-btn danger" type="button" onClick={() => onChange(null)}>
            移除
          </button>
        )}
        {note && <span className="upload-note">{note}</span>}
      </div>
      {onAltChange && (
        <label className="field">
          <span>替代文字（alt）</span>
          <input type="text" value={alt ?? ""} maxLength={120} onChange={(e) => onAltChange(e.target.value)} />
          <small>描述圖片內容，例如「不鏽鋼法蘭口氣動球閥」。</small>
        </label>
      )}
      {hint && <small>{hint}</small>}
    </div>
  );
}
