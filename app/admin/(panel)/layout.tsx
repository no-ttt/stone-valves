import { requireAdmin } from "@/lib/auth/session";
import { logout } from "../login/actions";
import { AdminNav } from "./AdminNav";

/** 登入後的後台版面。這裡的 requireAdmin 擋住所有後台頁面；寫入資料的 Server Action 各自也會再檢查一次。 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="panel">
      <aside className="sidebar">
        <div className="sidebar-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/st-png_3.png" alt="" width={30} height={30} />
          <div>
            <b>寔黈企業</b>
            <small>網站後台</small>
          </div>
        </div>
        <AdminNav />
        <div className="sidebar-foot">
          {/* 用一般連結整頁載入前台，避免後台樣式殘留 */}
          <a className="side-link" href="/" target="_blank" rel="noopener">
            查看網站 ↗
          </a>
          <div className="who" title={admin.email}>
            {admin.name || admin.email}
          </div>
          <form action={logout}>
            <button className="side-link" type="submit">
              登出
            </button>
          </form>
        </div>
      </aside>
      <div className="workspace">{children}</div>
    </div>
  );
}
