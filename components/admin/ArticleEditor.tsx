"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import { NodeSelection } from "@tiptap/pm/state";
import type { JSONContent } from "@tiptap/core";
import { Dialog } from "@/components/admin/Dialog";
import { compressAndUpload, formatBytes } from "@/components/admin/image-tools";
import { SAFE_HREF, editorExtensions } from "@/lib/editor/extensions";

/** 從 Word 等地方貼上時：H1 改成大標，H4 以下改成小標（內文只開放 H2、H3） */
function cleanPasted(html: string) {
  return html
    .replace(/<o:p>[\s\S]*?<\/o:p>/gi, "")
    .replace(/<(\/?)h1\b/gi, "<$1h2")
    .replace(/<(\/?)h[4-6]\b/gi, "<$1h3");
}

type Props = {
  initialHtml: string;
  editorRef: React.RefObject<Editor | null>;
  onChange: () => void;
  /** 編輯器建立完成時呼叫一次（用來計算初始的 SEO 檢查） */
  onReady?: (editor: Editor) => void;
};

type DialogState =
  | { kind: "image"; purpose: "insert" | "mediaText" }
  | { kind: "alt"; pos: number; alt: string }
  | { kind: "link" }
  | { kind: "cta"; pos: number | null; text: string; href: string }
  | null;

export function ArticleEditor({ initialHtml, editorRef, onChange, onReady }: Props) {
  const editor = useEditor({
    extensions: [...editorExtensions, Placeholder.configure({ placeholder: "從這裡開始寫內文…" })],
    content: initialHtml,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "article-editor", spellcheck: "false", "aria-label": "文章內文" },
      transformPastedHTML: cleanPasted,
      handleDOMEvents: {
        click: (_view, e) => {
          if ((e.target as HTMLElement).closest("a")) e.preventDefault();
          return false;
        },
      },
    },
    onCreate: ({ editor: e }) => onReady?.(e),
    onUpdate: () => onChange(),
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor, editorRef]);

  const [dialog, setDialog] = useState<DialogState>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!editor) return <div className="editor-shell editor-loading">編輯器載入中…</div>;

  return (
    <div className="editor-shell">
      <Toolbar editor={editor} openDialog={setDialog} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <EditorContent editor={editor} className="editor-area" />
      <EditorDialogs editor={editor} dialog={dialog} close={() => setDialog(null)} />
    </div>
  );
}

// ---------- 工具列 ----------

function Toolbar({
  editor,
  openDialog,
  menuOpen,
  setMenuOpen,
}: {
  editor: Editor;
  openDialog: (d: DialogState) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      block: e.isActive("heading", { level: 2 })
        ? "h2"
        : e.isActive("heading", { level: 3 })
          ? "h3"
          : e.isActive("paragraph", { variant: "ref" })
            ? "ref"
            : "p",
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      left: e.isActive({ textAlign: "left" }),
      center: e.isActive({ textAlign: "center" }),
      right: e.isActive({ textAlign: "right" }),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const run = (fn: (c: ReturnType<Editor["chain"]>) => ReturnType<Editor["chain"]>) => fn(editor.chain().focus()).run();
  const btn = (label: string, active: boolean, onClick: () => void, title = label) => (
    <button
      type="button"
      className="tb-btn"
      aria-pressed={active}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="toolbar-sticky">
      <div className="toolbar" role="toolbar" aria-label="文字格式">
        <label className="sr-only" htmlFor="block-type">
          段落樣式
        </label>
        <select
          id="block-type"
          className="tb-select"
          value={s.block}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "h2") run((c) => c.setHeading({ level: 2 }));
            else if (v === "h3") run((c) => c.setHeading({ level: 3 }));
            else run((c) => c.setParagraph().updateAttributes("paragraph", { variant: v === "ref" ? "ref" : null }));
          }}
        >
          <option value="p">內文</option>
          <option value="h2">大標（H2）</option>
          <option value="h3">小標（H3）</option>
          <option value="ref">參考連結（灰框）</option>
        </select>
        {btn("B", s.bold, () => run((c) => c.toggleBold()), "粗體（⌘/Ctrl+B）")}
        {btn("I", s.italic, () => run((c) => c.toggleItalic()), "斜體（⌘/Ctrl+I）")}
        {btn("U", s.underline, () => run((c) => c.toggleUnderline()), "底線（⌘/Ctrl+U）")}
        <span className="tb-sep" />
        {btn("• 清單", s.bullet, () => run((c) => c.toggleBulletList()))}
        {btn("1. 編號", s.ordered, () => run((c) => c.toggleOrderedList()))}
        {btn("引言", s.quote, () => run((c) => c.toggleBlockquote()))}
        <span className="tb-sep" />
        {btn("靠左", s.left, () => run((c) => c.setTextAlign("left")))}
        {btn("置中", s.center, () => run((c) => c.setTextAlign("center")))}
        {btn("靠右", s.right, () => run((c) => c.setTextAlign("right")))}
        <span className="tb-sep" />
        {btn("連結", s.link, () => openDialog({ kind: "link" }))}
        {btn("圖片", false, () => openDialog({ kind: "image", purpose: "insert" }))}
        {btn("表格", false, () => run((c) => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true })))}
        <span className="tb-sep" />
        <InsertMenu editor={editor} open={menuOpen} setOpen={setMenuOpen} openDialog={openDialog} />
        <span className="tb-sep" />
        <button
          type="button"
          className="tb-btn"
          disabled={!s.canUndo}
          title="復原（⌘/Ctrl+Z）"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run((c) => c.undo())}
        >
          復原
        </button>
        <button
          type="button"
          className="tb-btn"
          disabled={!s.canRedo}
          title="重做"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run((c) => c.redo())}
        >
          重做
        </button>
      </div>
      <ContextBar editor={editor} openDialog={openDialog} />
    </div>
  );
}

/** 游標在表格、兩欄、提示框裡時，新的區塊放到那個區塊後面 */
function insertBlock(editor: Editor, content: JSONContent) {
  const { $from } = editor.state.selection;
  for (let d = 1; d <= $from.depth; d++) {
    if (["table", "columns", "callout"].includes($from.node(d).type.name)) {
      editor.chain().focus().insertContentAt($from.after(d), content).run();
      return;
    }
  }
  editor.chain().focus().insertContent(content).run();
}

const P = (text: string): JSONContent => ({ type: "paragraph", content: [{ type: "text", text }] });
const H3 = (text: string): JSONContent => ({ type: "heading", attrs: { level: 3 }, content: [{ type: "text", text }] });
const UL = (...items: string[]): JSONContent => ({ type: "bulletList", content: items.map((t) => ({ type: "listItem", content: [P(t)] })) });

const BLOCKS = [
  { id: "mediaText", name: "圖文並排", desc: "左邊圖片、右邊文字，可以左右對調。手機上會改成上下排列。" },
  { id: "twoCols", name: "兩欄", desc: "兩欄文字或圖片，例如兩張圖並排。點進欄位後可以用「圖片」插入圖片。" },
  { id: "proscons", name: "優缺點", desc: "左右兩欄的「優點／缺點」清單。" },
  { id: "callout", name: "提示框", desc: "「提示」或「注意」兩種樣式，用來標出重點。" },
  { id: "cta", name: "詢價按鈕", desc: "置中的按鈕，連到聯絡我們或產品頁。" },
] as const;

function InsertMenu({
  editor,
  open,
  setOpen,
  openDialog,
}: {
  editor: Editor;
  open: boolean;
  setOpen: (v: boolean) => void;
  openDialog: (d: DialogState) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  function pick(id: (typeof BLOCKS)[number]["id"]) {
    setOpen(false);
    if (id === "mediaText") openDialog({ kind: "image", purpose: "mediaText" });
    else if (id === "twoCols") insertBlock(editor, { type: "columns", content: [{ type: "column", content: [P("左欄內容")] }, { type: "column", content: [P("右欄內容")] }] });
    else if (id === "proscons")
      insertBlock(editor, {
        type: "columns",
        content: [
          { type: "column", content: [H3("優點："), UL("第一個優點", "第二個優點")] },
          { type: "column", content: [H3("缺點："), UL("第一個缺點")] },
        ],
      });
    else if (id === "callout") insertBlock(editor, { type: "callout", attrs: { tone: "info" }, content: [P("在這裡輸入提示內容。")] });
    else if (id === "cta") openDialog({ kind: "cta", pos: null, text: "立即詢價", href: "/about#contact" });
  }

  return (
    <div className="insert-wrap" ref={wrap}>
      <button
        type="button"
        className="tb-btn tb-insert"
        aria-haspopup="true"
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen(!open)}
      >
        ＋ 插入區塊
      </button>
      {open && (
        <div className="insert-menu" role="menu">
          {BLOCKS.map((b) => (
            <button key={b.id} type="button" role="menuitem" className="insert-item" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(b.id)}>
              <strong>{b.name}</strong>
              <small>{b.desc}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- 依游標位置出現的區塊工具 ----------

function ContextBar({ editor, openDialog }: { editor: Editor; openDialog: (d: DialogState) => void }) {
  const ctx = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const sel = e.state.selection;
      const node = sel instanceof NodeSelection ? sel.node : null;
      return {
        nodeType: node?.type.name ?? null,
        nodePos: sel.from,
        alt: node?.type.name === "image" ? String(node.attrs.alt ?? "") : "",
        ctaText: node?.type.name === "cta" ? String(node.attrs.text) : "",
        ctaHref: node?.type.name === "cta" ? String(node.attrs.href) : "",
        table: e.isActive("table"),
        columns: e.isActive("columns"),
        callout: e.isActive("callout"),
        tone: e.isActive("callout") ? String(e.getAttributes("callout").tone) : "",
      };
    },
  });

  const chain = () => editor.chain().focus();
  const delAncestor = (name: string) => {
    const { $from } = editor.state.selection;
    for (let d = $from.depth; d > 0; d--) {
      if ($from.node(d).type.name === name) {
        chain().deleteRange({ from: $from.before(d), to: $from.after(d) }).run();
        return;
      }
    }
  };
  const swapColumns = () => {
    const { $from } = editor.state.selection;
    for (let d = $from.depth; d > 0; d--) {
      const node = $from.node(d);
      if (node.type.name === "columns") {
        const start = $from.before(d);
        const swapped = node.type.create(node.attrs, [node.child(1), node.child(0)]);
        chain().command(({ tr }) => {
          tr.replaceWith(start, start + node.nodeSize, swapped);
          return true;
        }).run();
        return;
      }
    }
  };

  let label = "";
  let items: { t: string; run: () => void; on?: boolean; danger?: boolean }[] = [];
  if (ctx.nodeType === "image") {
    label = "圖片";
    items = [
      { t: "編輯替代文字（alt）", run: () => openDialog({ kind: "alt", pos: ctx.nodePos, alt: ctx.alt }) },
      { t: "刪除", danger: true, run: () => chain().deleteSelection().run() },
    ];
  } else if (ctx.nodeType === "cta") {
    label = "詢價按鈕";
    items = [
      { t: "編輯文字與連結", run: () => openDialog({ kind: "cta", pos: ctx.nodePos, text: ctx.ctaText, href: ctx.ctaHref }) },
      { t: "刪除", danger: true, run: () => chain().deleteSelection().run() },
    ];
  } else if (ctx.table) {
    label = "表格";
    items = [
      { t: "上方加一列", run: () => chain().addRowBefore().run() },
      { t: "下方加一列", run: () => chain().addRowAfter().run() },
      { t: "左側加一欄", run: () => chain().addColumnBefore().run() },
      { t: "右側加一欄", run: () => chain().addColumnAfter().run() },
      { t: "刪除這列", run: () => chain().deleteRow().run() },
      { t: "刪除這欄", run: () => chain().deleteColumn().run() },
      { t: "刪除表格", danger: true, run: () => chain().deleteTable().run() },
    ];
  } else if (ctx.columns) {
    label = "兩欄";
    items = [
      { t: "左右對調", run: swapColumns },
      { t: "刪除兩欄區塊", danger: true, run: () => delAncestor("columns") },
    ];
  } else if (ctx.callout) {
    label = "提示框";
    items = [
      { t: "提示", on: ctx.tone === "info", run: () => chain().updateAttributes("callout", { tone: "info" }).run() },
      { t: "注意", on: ctx.tone === "warn", run: () => chain().updateAttributes("callout", { tone: "warn" }).run() },
      { t: "刪除提示框", danger: true, run: () => delAncestor("callout") },
    ];
  }
  if (!label) return null;

  return (
    <div className="ctxbar">
      <span className="ctx-label">{label}</span>
      {items.map((it) => (
        <button
          key={it.t}
          type="button"
          className={it.danger ? "ctx-btn danger" : "ctx-btn"}
          aria-pressed={it.on}
          onMouseDown={(e) => e.preventDefault()}
          onClick={it.run}
        >
          {it.t}
        </button>
      ))}
    </div>
  );
}

// ---------- 對話框 ----------

function EditorDialogs({ editor, dialog, close }: { editor: Editor; dialog: DialogState; close: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [href, setHref] = useState("");
  const [text, setText] = useState("");

  // 每次打開對話框時重設欄位
  const key = dialog ? JSON.stringify(dialog) : "";
  const [lastKey, setLastKey] = useState("");
  if (key !== lastKey) {
    setLastKey(key);
    setError("");
    setBusy(false);
    setFile(null);
    setAlt(dialog?.kind === "alt" ? dialog.alt : "");
    setHref(dialog?.kind === "cta" ? dialog.href : dialog?.kind === "link" ? String(editor.getAttributes("link").href ?? "") : "");
    setText(dialog?.kind === "cta" ? dialog.text : "");
  }

  if (!dialog) return null;
  const finish = () => {
    setError("");
    close();
  };

  if (dialog.kind === "image") {
    return (
      <Dialog
        open
        title={dialog.purpose === "mediaText" ? "圖文並排：選擇圖片" : "插入圖片"}
        submitLabel="上傳並插入"
        error={error}
        busy={busy}
        onClose={finish}
        onSubmit={async () => {
          if (!file) return setError("請選擇一張圖片。");
          if (!alt.trim()) return setError("請填寫替代文字（alt），這會影響圖片的 SEO。");
          setBusy(true);
          const r = await compressAndUpload(file);
          setBusy(false);
          if (!r.ok) return setError(r.error);
          const image: JSONContent = { type: "image", attrs: { src: r.url, alt: alt.trim() } };
          if (dialog.purpose === "mediaText") {
            insertBlock(editor, {
              type: "columns",
              content: [
                { type: "column", content: [image] },
                { type: "column", content: [H3("小標題"), P("在這裡輸入說明文字。")] },
              ],
            });
          } else {
            editor.chain().focus().insertContent(image).run();
          }
          finish();
        }}
      >
        <label className="field">
          <span>圖片檔案</span>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <small>{file ? `${file.name}（${formatBytes(file.size)}），上傳時會自動縮小並轉成 WebP` : "上傳時會自動縮小並轉成 WebP"}</small>
        </label>
        <label className="field">
          <span>
            替代文字（alt）<em>必填</em>
          </span>
          <input type="text" value={alt} maxLength={120} placeholder="例如：不鏽鋼法蘭口氣動球閥" onChange={(e) => setAlt(e.target.value)} />
          <small>描述圖片內容。Google 和使用螢幕閱讀器的人靠它理解這張圖。</small>
        </label>
      </Dialog>
    );
  }

  if (dialog.kind === "alt") {
    return (
      <Dialog
        open
        title="編輯替代文字"
        submitLabel="儲存"
        error={error}
        onClose={finish}
        onSubmit={() => {
          if (!alt.trim()) return setError("請填寫替代文字。");
          const node = editor.state.doc.nodeAt(dialog.pos);
          if (node) {
            editor
              .chain()
              .focus()
              .command(({ tr }) => {
                tr.setNodeMarkup(dialog.pos, undefined, { ...node.attrs, alt: alt.trim() });
                return true;
              })
              .setNodeSelection(dialog.pos)
              .run();
          }
          finish();
        }}
      >
        <label className="field">
          <span>替代文字（alt）</span>
          <input type="text" value={alt} maxLength={120} onChange={(e) => setAlt(e.target.value)} autoFocus />
          <small>描述圖片內容，不要只寫「圖片」或塞關鍵字。</small>
        </label>
      </Dialog>
    );
  }

  if (dialog.kind === "link") {
    const active = editor.isActive("link");
    if (!active && editor.state.selection.empty) {
      return (
        <Dialog open title="加上連結" submitLabel="知道了" onClose={finish} onSubmit={finish}>
          <p className="muted">請先選取要加上連結的文字，再按「連結」。</p>
        </Dialog>
      );
    }
    return (
      <Dialog
        open
        title="加上連結"
        submitLabel="套用"
        error={error}
        onClose={finish}
        onSubmit={() => {
          const v = href.trim();
          if (!v) return setError("請填寫網址。");
          if (!SAFE_HREF.test(v)) return setError("網址請用 https:// 開頭，或站內路徑（例如 /products/ball-valve）。");
          editor.chain().focus().extendMarkRange("link").setLink({ href: v }).run();
          finish();
        }}
      >
        <label className="field">
          <span>網址</span>
          <input type="text" value={href} placeholder="/products/ball-valve 或 https://…" onChange={(e) => setHref(e.target.value)} autoFocus />
          <small>連到站內產品頁時，選取的文字最好就是關鍵字，例如「氣動球閥規格」。</small>
        </label>
        {active && (
          <button
            type="button"
            className="link-btn danger"
            onClick={() => {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              finish();
            }}
          >
            移除連結
          </button>
        )}
      </Dialog>
    );
  }

  // cta
  return (
    <Dialog
      open
      title="詢價按鈕"
      submitLabel="儲存"
      error={error}
      onClose={finish}
      onSubmit={() => {
        const t = text.trim();
        const u = href.trim();
        if (!t) return setError("請填寫按鈕文字。");
        if (!SAFE_HREF.test(u)) return setError("連結請用 https:// 開頭，或站內路徑（例如 /about#contact）。");
        if (dialog.pos == null) insertBlock(editor, { type: "cta", attrs: { text: t, href: u } });
        else {
          const node = editor.state.doc.nodeAt(dialog.pos);
          if (node)
            editor
              .chain()
              .focus()
              .command(({ tr }) => {
                tr.setNodeMarkup(dialog.pos!, undefined, { ...node.attrs, text: t, href: u });
                return true;
              })
              .run();
        }
        finish();
      }}
    >
      <label className="field">
        <span>按鈕文字</span>
        <input type="text" value={text} maxLength={20} onChange={(e) => setText(e.target.value)} autoFocus />
      </label>
      <label className="field">
        <span>連到哪裡</span>
        <input type="text" value={href} onChange={(e) => setHref(e.target.value)} />
        <small>站內頁面寫路徑即可，例如 /about#contact 或 /products/ball-valve</small>
      </label>
    </Dialog>
  );
}
