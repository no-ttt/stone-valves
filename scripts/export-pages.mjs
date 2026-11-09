// 把前台輸出成靜態 HTML，給 GitHub Pages 預覽用（只有前台，沒有後台）。
//
// 做法：用 PAGES_BASE_PATH 建好的 Worker 在本機跑起來（讀本機 D1），照 sitemap 逐頁抓下 HTML，
// 加上 .open-next/assets 裡的靜態檔，輸出到 out-pages/。
//
//   PAGES_BASE_PATH=/stone-valves SITE_URL=https://no-ttt.github.io/stone-valves SITE_ENV=staging \
//     npx opennextjs-cloudflare build
//   node scripts/export-pages.mjs
//
// GitHub Actions 的 .github/workflows/pages.yml 會自動做這些事。

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.PAGES_BASE_PATH || "/stone-valves";
const SITE_URL = (process.env.SITE_URL || "https://no-ttt.github.io/stone-valves").replace(/\/$/, "");
const PORT = 8799;
const LOCAL = `http://127.0.0.1:${PORT}`;
const OUT = "out-pages";

const server = spawn(
  "npx",
  [
    "wrangler", "dev", "--port", String(PORT), "--ip", "127.0.0.1",
    "--var", `SITE_URL:${SITE_URL}`, "--var", "SITE_ENV:staging", "--var", "IMG_BASE:",
  ],
  { stdio: ["ignore", "inherit", "inherit"], env: { ...process.env, CI: "1" } },
);

try {
  await waitForServer();
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  // 靜態檔（_next/static、public/）
  const assets = path.join(".open-next/assets", BASE);
  await cp(existsSync(assets) ? assets : ".open-next/assets", OUT, { recursive: true });

  const sitemap = await fetchText(`${BASE}/sitemap.xml`);
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || BASE);
  for (const p of pages) await save(p, htmlPath(p));
  await save(`${BASE}/__not_found__`, "404.html", 404);
  await save(`${BASE}/robots.txt`, "robots.txt");
  await save(`${BASE}/sitemap.xml`, "sitemap.xml");

  await rewriteRootPaths(OUT);
  // _next 開頭是底線，沒有 .nojekyll 的話 GitHub Pages 不會提供
  await writeFile(path.join(OUT, ".nojekyll"), "");
  console.log(`\n✓ 輸出 ${pages.length} 頁到 ${OUT}/`);
} finally {
  server.kill("SIGTERM");
}

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(`${LOCAL}${BASE}/robots.txt`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("wrangler dev 沒有啟動");
}

async function fetchText(p, expected = 200) {
  const r = await fetch(LOCAL + p, { redirect: "manual" });
  if (r.status !== expected) throw new Error(`${p} 回傳 ${r.status}`);
  return r.text();
}

async function save(p, file, expected) {
  const body = await fetchText(p, expected);
  const dest = path.join(OUT, file);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, body.replaceAll(LOCAL, SITE_URL));
  console.log(`  ${p} → ${file}`);
}

/** /stone-valves → index.html，/stone-valves/info/abc → info/abc.html（GitHub Pages 會自動補 .html） */
function htmlPath(p) {
  const rel = p.slice(BASE.length).replace(/^\/|\/$/g, "");
  return rel ? `${rel}.html` : "index.html";
}

/**
 * next/link 和 _next 的路徑 Next 會自動加 basePath，但資料庫內容裡的圖片（/images/...）、
 * CSS 的 url(/...) 不會，這裡補上。
 *
 * <script> 裡的 RSC 資料不能改：裡面的長文字（文章內文）前面有位元組長度，改了長度對不上，
 * React 會整頁報錯。只改 HTML 本身就夠了：hydration 不會去改已經存在的屬性值，
 * 而 GitHub Pages 回不了 RSC 資料，站內換頁會自動改成整頁載入。
 */
async function rewriteRootPaths(dir) {
  const base = BASE.slice(1);
  const rewrite = (s) =>
    s
      // 文章內文裡的 <a href="/info/..."> 等站內連結
      .replace(new RegExp(`\\b(href|src|srcset|poster)="/(?!/|${base}(?:/|"))`, "g"), `$1="${BASE}/`)
      // inline style、CSS url() 裡的圖片路徑
      .replace(/(^|[\s"'(=,;])\/(images|uploads|icon\.png|favicon\.ico)\b/g, `$1${BASE}/$2`);

  for (const entry of await readdir(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !/\.(html|css)$/.test(entry.name)) continue;
    const file = path.join(entry.parentPath, entry.name);
    const src = await readFile(file, "utf8");
    const out = entry.name.endsWith(".css")
      ? rewrite(src)
      : src
          .split(/(<script\b[\s\S]*?<\/script>)/)
          .map((part) => (part.startsWith("<script") ? part : rewrite(part)))
          .join("");
    if (out !== src) await writeFile(file, out);
  }
}
