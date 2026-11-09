/* eslint-disable @next/next/no-img-element -- 圖片在上傳時就處理好尺寸，Workers 上也沒有 next/image 的最佳化 */
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import type { CategoryRow, PostSummary } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { formatDate, isoDate } from "@/lib/site";

export function CategoryTile({ category }: { category: CategoryRow & { productCount: number } }) {
  return (
    <Link className="tile" href={`/products/${category.slug}`}>
      <div className="thumb fit">
        <img src={imageUrl(category.cardImage)} alt={category.name} loading="lazy" />
        <span className="go" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </div>
      <div className="meta">
        <h3>{category.tileName}</h3>
        <span className="sub">{category.productCount} 項產品</span>
      </div>
    </Link>
  );
}

export function PostTile({ post, hidden }: { post: PostSummary; hidden?: boolean }) {
  return (
    <Link className="tile" href={`/info/${post.slug}`} hidden={hidden}>
      <div className={post.coverFit ? "thumb fit" : "thumb"}>
        <img src={imageUrl(post.coverImage)} alt={post.coverAlt} loading="lazy" />
        <span className="go" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </div>
      <div className="meta">
        <div className="meta-row">
          <span className={post.tag === "討論" ? "tag talk" : "tag"}>{post.tag}</span>
          {post.publishedAt && <time dateTime={isoDate(post.publishedAt)}>{formatDate(post.publishedAt)}</time>}
        </div>
        <h3 className="clamp">{post.title}</h3>
      </div>
    </Link>
  );
}
