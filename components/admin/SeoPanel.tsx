"use client";

type Props = {
  /** 例如 /info/five-common-valve-types */
  path: string;
  /** 沒填 SEO 標題時實際使用的標題 */
  fallbackTitle: string;
  fallbackDescription: string;
  seoTitle: string;
  seoDescription: string;
  noindex: boolean;
  onChange: (patch: { seoTitle?: string; seoDescription?: string; noindex?: boolean }) => void;
  /** 標題後面自動加上的文字 */
  titleSuffix: string;
};

const len = (s: string) => [...s].length;

/** SEO 標題、說明、搜尋結果預覽 */
export function SeoPanel({ path, fallbackTitle, fallbackDescription, seoTitle, seoDescription, noindex, onChange, titleSuffix }: Props) {
  const title = (seoTitle.trim() || fallbackTitle || "（未命名）") + titleSuffix;
  const desc = seoDescription.trim() || fallbackDescription;
  const titleLen = len(seoTitle.trim() || fallbackTitle);
  const descLen = len(desc);

  return (
    <div className="stack">
      <label className="field">
        <span>
          SEO 標題
          <span className={titleLen > 30 ? "count over" : "count"}>{titleLen} / 30</span>
        </span>
        <input type="text" value={seoTitle} maxLength={80} placeholder={fallbackTitle} onChange={(e) => onChange({ seoTitle: e.target.value })} />
        <small>沒填就用標題。後面會自動加上「{titleSuffix.replace(/^｜/, "")}」。</small>
      </label>
      <label className="field">
        <span>
          SEO 說明
          <span className={descLen > 160 || (descLen > 0 && descLen < 50) ? "count over" : "count"}>{descLen} / 160</span>
        </span>
        <textarea rows={3} value={seoDescription} maxLength={300} placeholder={fallbackDescription} onChange={(e) => onChange({ seoDescription: e.target.value })} />
        <small>沒填就用摘要。建議 70–160 字，寫清楚這頁能解決什麼問題。</small>
      </label>
      <div className="serp" aria-label="Google 搜尋結果預覽">
        <div className="serp-url">www.你的網域{path}</div>
        <div className="serp-title">{title}</div>
        <div className="serp-desc">{desc || "（沒有說明，Google 會自己從內文擷取）"}</div>
      </div>
      <label className="check">
        <input type="checkbox" checked={noindex} onChange={(e) => onChange({ noindex: e.target.checked })} />
        <span>
          不要出現在搜尋結果（noindex）
          <br />
          <small className="muted">一般文章不要勾選</small>
        </span>
      </label>
    </div>
  );
}
