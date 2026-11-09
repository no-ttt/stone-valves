import "server-only";
import { getSchema, type JSONContent } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string";
import { SAFE_HREF, SAFE_SRC, editorExtensions } from "@/lib/editor/extensions";

const schema = getSchema(editorExtensions);

export class ContentError extends Error {}

/**
 * 存檔時：把編輯器送來的 JSON 依照編輯器的格式定義檢查一次，再由伺服器產生 HTML。
 * 不在格式定義裡的節點會直接被拒絕，屬性只會輸出定義過的那些，
 * 所以即使有人繞過後台介面直接送資料，也無法在前台插入 <script> 或其他標籤。
 */
export function renderArticleHtml(json: unknown): { html: string; text: string } {
  let doc: PMNode;
  try {
    // 用 schema 自己的 nodeFromJSON，避免打包後出現兩份 prosemirror-model 時型別對不上
    doc = schema.nodeFromJSON(json as JSONContent);
    doc.check();
  } catch (e) {
    console.error("[renderArticleHtml] invalid document", e);
    throw new ContentError("內文格式不正確，請重新整理頁面後再試一次。");
  }

  doc.descendants((node) => {
    if (node.type.name === "image" && !SAFE_SRC.test(String(node.attrs.src ?? ""))) {
      throw new ContentError("內文裡有圖片的網址不正確。");
    }
    if (node.type.name === "cta" && !SAFE_HREF.test(String(node.attrs.href ?? ""))) {
      throw new ContentError("詢價按鈕的連結不正確。");
    }
    for (const mark of node.marks) {
      if (mark.type.name === "link" && !SAFE_HREF.test(String(mark.attrs.href ?? ""))) {
        throw new ContentError(`連結「${String(mark.attrs.href)}」不正確，請用 https:// 開頭或站內路徑（/ 開頭）。`);
      }
    }
  });

  const html = renderToHTMLString({ content: doc, extensions: editorExtensions });
  return { html, text: doc.textContent };
}
