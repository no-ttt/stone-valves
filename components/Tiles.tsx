/* eslint-disable @next/next/no-img-element -- 圖片在上傳時就處理好尺寸，Workers 上也沒有 next/image 的最佳化 */
import { Fragment } from "react";
import Link from "next/link";
import type { CategoryRow, PostSummary } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { formatDate, isoDate } from "@/lib/site";

/** 卡片右下角的前往按鈕：平常只有箭頭，滑過展開成「文字＋箭頭」 */
function GoButton({ label }: { label: string }) {
  return (
    <span className="pcard-go" aria-hidden="true">
      <span className="pcard-go-label">{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** 「減壓閥 ｜ 安全閥」：把全形直線換成細的分隔線 */
function SplitTitle({ text }: { text: string }) {
  const parts = text.split(/\s*[｜|]\s*/);
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="pcard-divider" aria-hidden="true" />}
          {p}
        </Fragment>
      ))}
    </>
  );
}

export function CategoryTile({ category }: { category: CategoryRow & { productCount: number } }) {
  return (
    <Link className="pcard" href={`/products/${category.slug}`}>
      <div className="pcard-media">
        <img src={imageUrl(category.cardImage)} alt={category.name} loading="lazy" />
        <GoButton label="查看產品" />
      </div>
      <div className="pcard-info">
        <h3 className="pcard-title">
          <SplitTitle text={category.tileName} />
        </h3>
        <span className="pcard-count">{category.productCount} 項產品</span>
      </div>
    </Link>
  );
}

/** 單一產品／常見產品卡：有 href 就是可點的連結卡（含前往按鈕），沒有就是純展示 */
export function ProductTile({ image, alt, name, href, goLabel = "查看分類" }: { image: string | null; alt: string; name: string; href?: string; goLabel?: string }) {
  const body = (
    <>
      <div className="pcard-media">
        <img src={imageUrl(image)} alt={alt} loading="lazy" />
        {href && <GoButton label={goLabel} />}
      </div>
      <div className="pcard-info">
        <h3 className="pcard-title">
          <SplitTitle text={name} />
        </h3>
      </div>
    </>
  );
  return href ? (
    <Link className="pcard" href={href}>
      {body}
    </Link>
  ) : (
    <div className="pcard is-static">{body}</div>
  );
}

export function PostTile({ post, hidden, order }: { post: PostSummary; hidden?: boolean; /** 篩選後的順序，用來錯開淡入時間 */ order?: number }) {
  return (
    <Link
      className="pcard pcard-post"
      href={`/info/${post.slug}`}
      hidden={hidden}
      style={order !== undefined ? ({ "--i": order } as React.CSSProperties) : undefined}
    >
      <div className={post.coverFit ? "pcard-media" : "pcard-media photo"}>
        <img src={imageUrl(post.coverImage)} alt={post.coverAlt} loading="lazy" />
        <GoButton label="閱讀文章" />
      </div>
      <div className="pcard-info stack">
        <div className="meta-row">
          <span className={post.tag === "討論" ? "tag talk" : "tag"}>{post.tag}</span>
          {post.publishedAt && <time dateTime={isoDate(post.publishedAt)}>{formatDate(post.publishedAt)}</time>}
        </div>
        <h3 className="pcard-title clamp">{post.title}</h3>
      </div>
    </Link>
  );
}
