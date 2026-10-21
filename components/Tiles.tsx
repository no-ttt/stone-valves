/* eslint-disable @next/next/no-img-element -- 圖片已在上傳時處理好尺寸，Workers 上也沒有 next/image 的最佳化 */
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import type { Category } from "@/content/categories";
import type { Post } from "@/content/posts";
import { formatDate } from "@/lib/site";

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link className="tile" href={`/products/${category.slug}`}>
      <div className="thumb fit">
        <img src={category.cardImage} alt={category.name} loading="lazy" />
        <span className="go" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </div>
      <div className="meta">
        <h3>{category.tileName}</h3>
        <span className="sub">{category.products.length} 項產品</span>
      </div>
    </Link>
  );
}

export function PostTile({ post, hidden }: { post: Post; hidden?: boolean }) {
  return (
    <Link className="tile" href={`/info/${post.slug}`} hidden={hidden}>
      <div className={post.coverFit ? "thumb fit" : "thumb"}>
        <img src={post.cover} alt="" loading="lazy" />
        <span className="go" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </div>
      <div className="meta">
        <div className="meta-row">
          <span className={post.tag === "討論" ? "tag talk" : "tag"}>{post.tag}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h3 className="clamp">{post.title}</h3>
      </div>
    </Link>
  );
}
