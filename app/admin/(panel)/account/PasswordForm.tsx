"use client";

import { useActionState } from "react";
import { changePassword, type PasswordState } from "./actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, {});
  return (
    <form action={action} className="stack" key={state.ok ? "done" : "form"}>
      <label className="field">
        <span>目前的密碼</span>
        <input name="current" type="password" autoComplete="current-password" required />
      </label>
      <label className="field">
        <span>新密碼</span>
        <input name="next" type="password" autoComplete="new-password" minLength={10} required />
        <small>至少 10 個字元</small>
      </label>
      <label className="field">
        <span>再輸入一次新密碼</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="form-ok" role="status">
          密碼已更新。
        </p>
      )}
      <div>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "更新中…" : "更新密碼"}
        </button>
      </div>
    </form>
  );
}
