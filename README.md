# 寔黈企業 STONE VALVES 官網

Next.js 16（App Router）+ OpenNext，部署到 Cloudflare Workers。資料庫用 D1（Drizzle），圖片放 R2，後台自己寫。
**前台預覽**：https://no-ttt.github.io/stone-valves/ （GitHub Pages 靜態版，只有前台、內容來自種子資料；推到 `main` 由 [`.github/workflows/pages.yml`](.github/workflows/pages.yml) 自動更新，輸出腳本見 [`scripts/export-pages.mjs`](scripts/export-pages.mjs)）。

規劃文件在 [`docs/`](docs/)：[SEO 架構](docs/SEO-NextJS.md)、[Cloudflare 架構與流量](docs/Cloudflare-Infra.md)、[SEO 入門](docs/SEO-Basics.md)。

## 功能

**前台**：首頁、關於、產品資訊（分類與產品）、資訊討論（文章），內容都從 D1 讀取，後台存檔後立即更新。
每頁有 title／description／canonical、Open Graph、sitemap.xml、robots.txt、JSON-LD（Organization、BreadcrumbList、Article）。

**後台**（`/admin`）：

| 頁面 | 可以做什麼 |
|---|---|
| 文章 | 新增、編輯、草稿／發布、預覽、刪除。Tiptap 編輯器（大標、小標、清單、表格、圖片、連結、圖文並排、兩欄、優缺點、提示框、詢價按鈕）、SEO 設定與檢查 |
| 產品分類 | 排序、新增、刪除；編輯名稱、卡片圖片、分類介紹、產品清單、關鍵字、SEO；產品資訊頁的「常見產品」 |
| 前台內容 | 首頁、關於、產品資訊、資訊討論、聯絡區塊的文字與圖片；公司資訊；固定頁面的 SEO |
| 帳號設定 | 修改密碼 |

**轉址**：舊站的 `.html` 網址 301 到新網址；已發布的文章改網址、刪除文章或分類時，自動新增轉址（D1 的 `redirects` 資料表）。

## 本地開發

```bash
npm install
npm run db:migrate:local      # 建立本地 D1 的資料表
npm run db:seed:build         # 從 content/ 產生初始資料 drizzle/seed.sql
npm run db:seed:local         # 匯入初始資料
npm run admin:create -- 你的email --name 你的名字   # 建立後台帳號（會要求輸入密碼）
npm run dev                   # http://localhost:3000，後台 http://localhost:3000/admin
```

- 本地的 D1 和 R2 都存在 `.wrangler/state`，不會碰到正式環境
- `npm run db:reset:local`：清空本地資料庫，重新建立並匯入初始資料（後台帳號也會清掉）
- `npm run cf:preview`：用 Cloudflare Workers 的執行環境在本地跑（最接近正式環境）

## 修改資料表

1. 修改 `lib/db/schema.ts`
2. `npm run db:generate` 產生 migration（`drizzle/migrations/`）
3. `npm run db:migrate:local` 套用到本地；部署時再套用到 staging／production

## 第一次部署到 Cloudflare

```bash
npx wrangler login

# 1. 建立資料庫與圖片空間，把拿到的 database_id 填進 wrangler.jsonc（正式和 staging 各一個）
npx wrangler d1 create stone-valves-db
npx wrangler d1 create stone-valves-db-staging
npx wrangler r2 bucket create stone-valves-images
npx wrangler r2 bucket create stone-valves-images-staging

# 2. 建立資料表、匯入初始資料、建立後台帳號
npm run db:migrate:production
npx wrangler d1 execute DB --remote --env="" --file=drizzle/seed.sql
npm run admin:create -- 你的email --env production

# 3. 部署
npm run cf:deploy:production
```

部署前在 `wrangler.jsonc` 的 `vars` 填好：

| 變數 | 說明 |
|---|---|
| `SITE_URL` | 正式網域，例如 `https://www.stonevalves.com.tw` |
| `IMG_BASE` | R2 公開網域，例如 `https://img.stonevalves.com.tw`（R2 → bucket → Settings → Custom Domains）。沒填的話圖片會經過 Worker，佔用請求額度 |

staging 用 `--env staging` 與對應的 `db:migrate:staging`、`cf:deploy:staging`，整站自動 noindex。

## 資料夾

```
app/
  (site)/                 前台頁面與樣式（site.css）
  admin/                  後台：login、(panel)/posts、categories、content、account
  uploads/[...key]/       沒有設定 IMG_BASE 時，從 R2 讀圖片
  sitemap.ts、robots.ts
components/               前台元件；components/admin/ 是後台元件（編輯器、圖片欄位、清單…）
content/                  舊站搬過來的初始資料，只給 seed 與舊網址轉址使用
drizzle/                  migrations 與 seed.sql
lib/
  db/                     D1 連線與資料表定義
  auth/                   密碼雜湊、session、防暴力破解
  admin/                  後台的 Server Actions（文章、分類、前台內容、上傳）
  editor/                 文章編輯器的格式定義，以及存檔時在伺服器重新產生 HTML
  content-fields.ts       「前台內容」可修改的欄位與預設值
  data.ts                 前台讀取資料的函式
scripts/                  build-seed.ts、create-admin.ts
proxy.ts                  沒有登入 cookie 時把 /admin 導到登入頁
```

## 安全性

- 後台每個頁面與每個寫入資料的 Server Action 都會先用 `requireAdmin()` 查資料庫確認登入
- 密碼用 PBKDF2-SHA256（10 萬次）雜湊；session cookie 為 HttpOnly、SameSite=Lax，資料庫只存 token 的雜湊
- 同一帳號連續輸錯 5 次鎖 15 分鐘；同一 IP 15 分鐘內錯 10 次暫停登入
- 文章內文存檔時由伺服器依照編輯器的格式定義重新產生 HTML，只會留下允許的標籤、屬性與連結
- 圖片只接受 JPG、PNG、WebP、GIF，上限 5 MB
