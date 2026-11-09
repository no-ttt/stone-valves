"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin/posts", label: "文章" },
  { href: "/admin/categories", label: "產品分類" },
  { href: "/admin/content", label: "前台內容" },
  { href: "/admin/account", label: "帳號設定" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="side-nav" aria-label="後台選單">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href || pathname.startsWith(item.href + "/") ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
