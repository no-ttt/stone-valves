import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "帳號設定" };

export default async function AccountPage() {
  const admin = await requireAdmin();
  return (
    <main className="work">
      <header className="work-head">
        <h1>帳號設定</h1>
      </header>
      <section className="card narrow">
        <h2>登入帳號</h2>
        <p className="muted">{admin.email}</p>
      </section>
      <section className="card narrow">
        <h2>修改密碼</h2>
        <p className="muted">修改後，其他裝置上的登入會被登出。</p>
        <PasswordForm />
      </section>
    </main>
  );
}
