"use client";

import { useState } from "react";
import { PostTile } from "@/components/Tiles";
import type { PostSummary } from "@/lib/data";
import { isoDate } from "@/lib/site";

type Cat = "all" | PostSummary["tag"];

/**
 * 文章列表的分類與月份篩選。
 * 所有文章都會輸出在 HTML 裡（篩選只是隱藏），搜尋引擎看得到完整列表。
 */
export function PostFilter({ posts }: { posts: PostSummary[] }) {
  const [cat, setCat] = useState<Cat>("all");
  const [month, setMonth] = useState("");

  const monthOf = (p: PostSummary) => (p.publishedAt ? isoDate(p.publishedAt).slice(0, 7) : "");
  const months = [...new Set(posts.map(monthOf).filter(Boolean))];
  const matches = (p: PostSummary) => (cat === "all" || p.tag === cat) && (!month || monthOf(p) === month);
  const shown = posts.filter(matches).length;
  // 使用者動過篩選後才播放切換動畫
  const [changed, setChanged] = useState(false);
  let visibleIndex = 0;
  const pickCat = (c: Cat) => {
    setChanged(true);
    setCat(c);
  };
  const pickMonth = (m: string) => {
    setChanged(true);
    setMonth(m);
  };

  const tabs: { cat: Cat; label: string; count: number }[] = [
    { cat: "all", label: "全部", count: posts.length },
    { cat: "資訊", label: "資訊", count: posts.filter((p) => p.tag === "資訊").length },
    { cat: "討論", label: "討論", count: posts.filter((p) => p.tag === "討論").length },
  ];

  return (
    <>
      <div className="toolbar">
        <div className="tabs" role="group" aria-label="文章分類">
          {tabs.map((t) => (
            <button key={t.cat} className="tab" type="button" aria-pressed={cat === t.cat} onClick={() => pickCat(t.cat)}>
              {t.label}
              <span className="count">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="month">
          <label htmlFor="month">月份</label>
          <span className="select-wrap">
            <select id="month" value={month} onChange={(e) => pickMonth(e.target.value)}>
              <option value="">全部月份</option>
              {months.map((m) => {
                const [y, mo] = m.split("-");
                return (
                  <option key={m} value={m}>
                    {y} 年 {Number(mo)} 月
                  </option>
                );
              })}
            </select>
          </span>
        </div>
      </div>
      {/* 換分類或月份時用新的 key 重建列表，讓卡片依序淡入（第一次載入不播，交給捲動淡入） */}
      <div className={changed ? "grid filtering" : "grid"} key={changed ? `${cat}|${month}` : "initial"}>
        {posts.map((p) => {
          const show = matches(p);
          return <PostTile key={p.slug} post={p} hidden={!show} order={show ? visibleIndex++ : 0} />;
        })}
      </div>
      <div className="empty" hidden={shown !== 0}>
        此條件下沒有文章。
        <button
          className="btn btn-dark"
          type="button"
          style={{ marginLeft: 12 }}
          onClick={() => {
            pickCat("all");
            pickMonth("");
          }}
        >
          清除篩選
        </button>
      </div>
    </>
  );
}
