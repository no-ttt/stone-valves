"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="login-form">
      <label className="field">
        <span>E-mail</span>
        <input name="email" type="email" autoComplete="username" required defaultValue={state.email} autoFocus />
      </label>
      <label className="field">
        <span>密碼</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
        {pending ? "登入中…" : "登入"}
      </button>
    </form>
  );
}
