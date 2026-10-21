"use client";

import { useState } from "react";
import { PostTile } from "@/components/Tiles";
import type { Post, PostTag } from "@/content/posts";

type Cat = "all" | PostTag;

/**
 * 文章列表的分類與月份篩選。
 * 所有文章都會輸出在 HTML 裡（篩選只是隱藏），搜尋引擎看得到完整列表。
 */
export function PostFilter({ posts }: { posts: Post[] }) {
  const [cat, setCat] = useState<Cat>("all");
  const [month, setMonth] = useState("");

  const monthOf = (p: Post) => p.date.slice(0, 7);
  const months = [...new Set(posts.map(monthOf))];
  const matches = (p: Post) => (cat === "all" || p.tag === cat) && (!month || monthOf(p) === month);
  const shown = posts.filter(matches).length;

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
            <button key={t.cat} className="tab" type="button" aria-pressed={cat === t.cat} onClick={() => setCat(t.cat)}>
              {t.label}
              <span className="count">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="month">
          <label htmlFor="month">月份</label>
          <span className="select-wrap">
            <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
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
      <div className="grid">
        {posts.map((p) => (
          <PostTile key={p.slug} post={p} hidden={!matches(p)} />
        ))}
      </div>
      <div className="empty" hidden={shown !== 0}>
        此條件下沒有文章。
        <button
          className="btn btn-dark"
          type="button"
          style={{ marginLeft: 12 }}
          onClick={() => {
            setCat("all");
            setMonth("");
          }}
        >
          清除篩選
        </button>
      </div>
    </>
  );
}
