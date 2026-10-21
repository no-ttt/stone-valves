import { Fragment } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

export type Crumb = { label: string; href?: string };

/** 畫面上的麵包屑，同時輸出 BreadcrumbList 結構化資料（兩者內容一致） */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "首頁", href: "/" }, ...items];
  return (
    <>
      <div className="crumbs">
        {all.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <span>/</span>}
            {c.href && i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : c.label}
          </Fragment>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: SITE_URL + c.href } : {}),
          })),
        }}
      />
    </>
  );
}
