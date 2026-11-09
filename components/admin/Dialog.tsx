"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  submitLabel?: string;
  /** 回傳錯誤訊息就不關閉 */
  onSubmit: () => string | void | Promise<string | void>;
  onClose: () => void;
  error?: string;
  busy?: boolean;
  children: React.ReactNode;
  danger?: boolean;
};

/** 後台共用的對話框（瀏覽器原生 <dialog>） */
export function Dialog({ open, title, submitLabel = "確定", onSubmit, onClose, error, busy, children, danger }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className="dlg" onClose={onClose} aria-labelledby="dlg-title">
      {open && (
        <form
          className="dlg-form"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit();
          }}
        >
          <h2 id="dlg-title">{title}</h2>
          {children}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="dlg-foot">
            <button className="btn" type="button" onClick={onClose}>
              取消
            </button>
            <button className={danger ? "btn btn-danger" : "btn btn-primary"} type="submit" disabled={busy}>
              {busy ? "處理中…" : submitLabel}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
