import { Fragment } from "react";

/** 後台多行文字：保留換行 */
export function Lines({ text }: { text: string }) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

/** 後台多行文字：空一行代表新段落，段落內的換行保留 */
export function Paragraphs({ text }: { text: string }) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => (
      <p key={i}>
        <Lines text={p} />
      </p>
    ));
}

/** 以「、」或「,」分隔的清單 */
export function splitList(text: string) {
  return text
    .split(/[、,，\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
