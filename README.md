# 寔黈企業 STONE VALVES 官網（Next.js）

Next.js 16（App Router）+ OpenNext，部署到 Cloudflare Workers。
規劃文件在 [`docs/`](docs/)：[SEO 架構](docs/SEO-NextJS.md)、[Cloudflare 架構與流量](docs/Cloudflare-Infra.md)、[SEO 入門](docs/SEO-Basics.md)。

## 目前階段

- ✅ 前台頁面從舊的靜態 HTML 搬過來，外觀沿用舊站的 `sv.css`（舊站原始檔保留在 commit `53ee88a`）
- ✅ SEO：每頁 title／description／canonical、Open Graph、sitemap.xml、robots.txt、JSON-LD（Organization、BreadcrumbList、Article）
- ✅ 舊網址（`*.html`）永久轉址到新網址
- ⬜ 後台、D1、R2：下一階段。目前內容放在 `content/`，圖片放在 `public/images/`

## 指令

```bash
npm install
npm run dev                    # 開發模式 http://localhost:3000
npm run build && npm start     # 正式版建置後在本機執行
npm run cf:preview             # 用 Cloudflare Workers 的執行環境在本機預覽
npm run cf:deploy:staging      # 部署到 staging（整站 noindex）
npm run cf:deploy:production   # 部署到正式環境
```

部署前要先設定正式網域，canonical、sitemap 和結構化資料都會用到：

```bash
SITE_URL=https://www.你的網域 npm run cf:deploy:production
```

## 資料夾

```
app/
  layout.tsx                全站 metadata、字型、Organization JSON-LD、頁尾
  page.tsx                  首頁 /
  about/                    /about
  products/                 /products、/products/[category]
  info/                     /info、/info/[slug]
  sitemap.ts、robots.ts     自動產生 /sitemap.xml、/robots.txt
  globals.css               舊站的 sv.css
components/                 Hero、麵包屑、頁尾、聯絡區塊、卡片、文章篩選、動態效果
content/
  categories.ts             9 個產品分類與產品
  posts.ts                  8 篇文章（內文是 HTML）
lib/site.ts                 公司資訊、主選單、網域設定
public/images/              圖片
```

## 網址對照

| 舊網址 | 新網址 |
|---|---|
| `/index.html` | `/` |
| `/product.html` | `/products` |
| `/product/<分類>.html` | `/products/<分類>` |
| `/about.html` | `/about` |
| `/info.html` | `/info` |
| `/info/post-<編號>.html` | `/info/<英文 slug>`（對照見 `content/posts.ts` 的 `legacyId`） |

轉址設定在 `next.config.ts`，由資料檔自動產生。

## 新增或修改內容（接上後台之前）

- 文章：在 `content/posts.ts` 的陣列最前面新增一筆，`slug` 用英文小寫加 `-`
- 產品：修改 `content/categories.ts`
- 圖片：放進 `public/images/`，路徑寫 `/images/檔名`
