import { withBasePath } from "@/lib/images";

/**
 * 「參考連結」段落（<p class="ref">）統一成同一種格式。
 * 後台輸入時有的整段加粗、有的只有連結加粗、有的前面打「參考連結 -」，這裡全部整理成：
 *   <p class="ref"><span class="ref-label">參考連結</span><a …>標題</a></p>
 * 段落裡沒有連結的話維持原樣。
 */
function normalizeRefs(html: string): string {
  return html.replace(/<p class="ref">([\s\S]*?)<\/p>/g, (whole, inner: string) => {
    const links = inner.match(/<a\b[^>]*>[\s\S]*?<\/a>/g);
    if (!links) return whole;
    const cleaned = links.map((a) => a.replace(/<\/?(strong|b|em)>/g, "")).join("");
    return `<p class="ref"><span class="ref-label">參考連結</span>${cleaned}</p>`;
  });
}

/** 文章內文、分類介紹送到前台前的整理：參考連結格式、子路徑前綴 */
export function prepareArticleHtml(html: string): string {
  return withBasePath(normalizeRefs(html));
}
