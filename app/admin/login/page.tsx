import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "登入後台" };

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");
  return (
    <main className="login">
      <div className="login-card">
        <div className="login-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/st-png_3.png" alt="" width={36} height={36} />
          <div>
            <b>寔黈企業</b>
            <small>網站後台</small>
          </div>
        </div>
        <LoginForm />
        <p className="login-help">忘記密碼請聯絡網站管理員重設。</p>
      </div>
    </main>
  );
}
