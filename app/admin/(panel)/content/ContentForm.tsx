"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageField } from "@/components/admin/ImageField";
import { saveContentGroup } from "@/lib/admin/content-actions";
import type { ContentField, ContentGroupId } from "@/lib/content-fields";

type Field = ContentField & { key: string; value: string };

export function ContentForm({
  group,
  description,
  fields,
  previewHref,
}: {
  group: ContentGroupId;
  description: string;
  fields: Field[];
  previewHref: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.key, f.value])));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const set = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setDirty(true);
    setSaved(false);
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setSaving(true);
    setError("");
    const r = await saveContentGroup(group, values);
    setSaving(false);
    if (!r.ok) return setError(r.error);
    setDirty(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <>
      <div className="savebar">
        <span className="state" role="status">
          {saving ? "儲存中…" : dirty ? "有尚未儲存的變更" : saved ? "已儲存，前台已更新" : ""}
        </span>
        <span className="spacer" />
        <a className="btn" href={previewHref} target="_blank" rel="noopener">
          查看頁面
        </a>
        <button className="btn btn-primary" type="button" disabled={saving || !dirty} onClick={save}>
          儲存
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <section className="card content-card">
        {description && <p className="muted">{description}</p>}
        <div className="content-fields">
          {fields.map((f) => {
            const v = values[f.key] ?? "";
            const changed = v.trim() !== f.default;
            const reset = changed ? (
              <button className="link-btn" type="button" onClick={() => set(f.key, f.default)}>
                恢復預設
              </button>
            ) : null;
            if (f.type === "image") {
              return (
                <div key={f.key} className="content-field image">
                  <ImageField label={f.label} value={v} allowClear={false} onChange={(nv) => set(f.key, nv ?? "")} hint={f.hint} />
                  {reset}
                </div>
              );
            }
            const count = [...v].length;
            const over = f.maxLength != null && count > f.maxLength;
            return (
              <label key={f.key} className="field content-field">
                <span>
                  {f.label}
                  {f.maxLength != null && <span className={over ? "count over" : "count"}>{count} / {f.maxLength}</span>}
                </span>
                {f.type === "text" ? (
                  <input type="text" value={v} onChange={(e) => set(f.key, e.target.value)} />
                ) : (
                  <textarea rows={f.type === "list" ? 2 : Math.min(8, Math.max(2, v.split("\n").length + 1))} value={v} onChange={(e) => set(f.key, e.target.value)} />
                )}
                {(f.hint || reset) && (
                  <small>
                    {f.hint} {reset}
                  </small>
                )}
              </label>
            );
          })}
        </div>
      </section>
    </>
  );
}
