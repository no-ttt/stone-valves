/**
 * 文章編輯器的格式定義（Tiptap）。瀏覽器端的編輯器與伺服器端存檔時重新產生 HTML 都用這一份，
 * 所以前台只會出現這裡定義的標籤與屬性。
 *
 * 輸出的 HTML 沿用舊站的文章樣式（app/(site)/site.css 的 .article-body）：
 *   圖片    <figure><img></figure>
 *   兩欄    <div class="cols"><div>…</div><div>…</div></div>
 *   提示框  <div class="callout" data-tone="info|warn">…</div>
 *   參考    <p class="ref">…</p>
 *   按鈕    <div class="cta"><a class="cta-btn">…</a></div>
 */
import { Extension, Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";

/** 允許的連結：http(s)、mailto、tel、站內路徑、錨點 */
export const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;
/** 允許的圖片：http(s) 或站內路徑 */
export const SAFE_SRC = /^(https?:\/\/|\/(?!\/))/i;

const TEXT_BLOCKS = "paragraph|heading|bulletList|orderedList";

/** 圖片：輸出成 <figure><img></figure>，舊文章的 figure 也能讀進來 */
export const Figure = Image.extend({
  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (el) => {
          const img = (el as HTMLElement).querySelector("img");
          return img ? { src: img.getAttribute("src"), alt: img.getAttribute("alt") ?? "" } : false;
        },
      },
      { tag: "img[src]" },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["figure", ["img", mergeAttributes(HTMLAttributes, { loading: "lazy" })]];
  },
}).configure({ inline: false, allowBase64: false });

/** 段落樣式：目前只有「參考連結」（灰框），用來保留舊文章的 p.ref */
export const ParagraphVariant = Extension.create({
  name: "paragraphVariant",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          variant: {
            default: null,
            parseHTML: (el) => ((el as HTMLElement).classList.contains("ref") ? "ref" : null),
            renderHTML: (attrs) => (attrs.variant === "ref" ? { class: "ref" } : {}),
          },
        },
      },
    ];
  },
});

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: `(${TEXT_BLOCKS})+`,
  defining: true,
  addAttributes() {
    return {
      tone: {
        default: "info",
        parseHTML: (el) => ((el as HTMLElement).getAttribute("data-tone") === "warn" ? "warn" : "info"),
        renderHTML: (attrs) => ({ "data-tone": attrs.tone === "warn" ? "warn" : "info" }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div.callout" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ class: "callout" }, HTMLAttributes), 0];
  },
});

/** 兩欄：每一欄可以放文字或圖片。手機上自動變成上下排列 */
export const Columns = Node.create({
  name: "columns",
  group: "block",
  content: "column column",
  isolating: true,
  defining: true,
  parseHTML() {
    return [{ tag: "div.cols" }];
  },
  renderHTML() {
    return ["div", { class: "cols" }, 0];
  },
});

export const Column = Node.create({
  name: "column",
  content: `(${TEXT_BLOCKS}|image|callout)+`,
  isolating: true,
  parseHTML() {
    return [{ tag: "div", context: "columns/" }];
  },
  renderHTML() {
    return ["div", 0];
  },
});

/** 置中的按鈕，連到詢價或產品頁 */
export const Cta = Node.create({
  name: "cta",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      text: {
        default: "立即詢價",
        parseHTML: (el) => (el as HTMLElement).querySelector("a")?.textContent || "立即詢價",
        renderHTML: () => ({}),
      },
      href: {
        default: "/about#contact",
        parseHTML: (el) => (el as HTMLElement).querySelector("a")?.getAttribute("href") || "/about#contact",
        renderHTML: () => ({}),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div.cta" }];
  },
  renderHTML({ node }) {
    return ["div", { class: "cta" }, ["a", { class: "cta-btn", href: node.attrs.href }, node.attrs.text]];
  },
});

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      isAllowedUri: (url) => SAFE_HREF.test(url),
      HTMLAttributes: { rel: null, target: null },
    },
  }),
  Figure,
  ParagraphVariant,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TableKit.configure({ table: { resizable: false } }),
  Callout,
  Columns,
  Column,
  Cta,
];
