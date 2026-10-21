import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "找不到這個頁面",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Hero size="mid" image="/images/1476105101.jpg" current="/">
      <div className="eyebrow">404</div>
      <h1>找不到這個頁面</h1>
      <p className="lead">網址可能打錯了，或是這個頁面已經移除。可以從產品資訊或資訊討論找找看。</p>
      <div className="actions">
        <Link className="btn btn-light" href="/products">
          查看產品
          <ArrowRight />
        </Link>
        <Link className="btn btn-glass glass" href="/">
          回到首頁
        </Link>
      </div>
    </Hero>
  );
}
