import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "sv_admin";

/**
 * 後台的第一道關卡：沒有登入 cookie 就直接導到登入頁，不必進到頁面才發現。
 * 這裡只看 cookie 在不在；cookie 是否有效（session 存在、沒過期）由後台版面與每個 Server Action 的
 * requireAdmin() 查資料庫確認，所以單靠偽造 cookie 進不來。
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
