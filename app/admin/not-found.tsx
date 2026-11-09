import Link from "next/link";

export default function AdminNotFound() {
  return (
    <main className="login">
      <div className="login-card">
        <h1 style={{ margin: 0, fontSize: 20 }}>找不到這個項目</h1>
        <p className="muted">可能已經被刪除，或是網址打錯了。</p>
        <Link className="btn btn-primary" href="/admin/posts">
          回到文章列表
        </Link>
      </div>
    </main>
  );
}
