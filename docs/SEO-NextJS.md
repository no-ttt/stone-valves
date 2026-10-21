# 寔黈企業 STONE VALVES — Next.js SEO 架構規劃

> 目標：把現有靜態站遷移到 Next.js（App Router），並做出「後台可設定 SEO 欄位」的架構，讓之後新增產品或文章時，不用改程式碼也能管理 SEO。
>
> 技術架構：Next.js + OpenNext 部署到 Cloudflare Workers，資料庫用 D1 + Drizzle，圖片放 R2，後台自己寫精簡版（選擇理由見第 3 節）。主機、資料庫、流量與費用的規劃見 [Cloudflare-Infra.md](./Cloudflare-Infra.md)。

---

## 1. 路由與網址結構

```
app/
├─ layout.tsx                  # 全站預設 metadata、Organization JSON-LD
├─ page.tsx                    # 首頁 /
├─ about/page.tsx              # /about
├─ products/
│  ├─ page.tsx                 # /products            產品總覽
│  └─ [category]/
│     ├─ page.tsx              # /products/ball-valve 分類頁
│     └─ [slug]/page.tsx       # /products/ball-valve/flange-ball-valve 單一產品（之後擴充用）
├─ info/
│  ├─ page.tsx                 # /info                文章列表
│  └─ [slug]/page.tsx          # /info/how-to-choose-pneumatic-valve
├─ admin/                      # 後台（不收錄，見第 3 節）
├─ api/admin/                  # 後台 API
├─ sitemap.ts                  # 自動產生 /sitemap.xml
├─ robots.ts                   # 自動產生 /robots.txt
└─ opengraph-image.tsx         # 預設分享縮圖（可選）
```

**原則**

- 網址全小寫、用 `-` 分隔，**不要帶 `.html`**，也不要用日期或流水號（`post-180508` 改成語意化 slug）。
- 一個頁面只主打一個關鍵字，分類之間不要搶同一個詞。
- 任何頁面從首頁出發，三次點擊內都要能到達。

### 關鍵字分配建議

| 頁面 | 主關鍵字 | 次要關鍵字 |
|---|---|---|
| `/` | 氣動閥、氣動執行器 | 台灣閥門製造商、寔黈 |
| `/products` | 閥門產品 | 工業閥門、氣動閥門 |
| `/products/actuator` | 氣動執行器 | 氣缸、單動／雙動執行器 |
| `/products/ball-valve` | 氣動球閥 | 球塞閥、法蘭球閥、三通球閥 |
| `/products/butterfly-valve` | 氣動蝶閥 | 蝶型閥 |
| `/products/control-valve` | 控制閥 | 比例控制閥 |
| `/products/gate-valve` | 閘閥 | — |
| `/products/globe-valve` | 球型閥 | 截止閥 |
| `/products/relief-safety-valve` | 安全閥 | 減壓閥 |
| `/products/union-plastic-valve` | 塑膠閥 | PVC 閥、由令 |
| `/products/repair-accessories` | 閥門配件安裝 | 閥門維修、三點組合 |
| `/info/*` | 長尾問題詞 | 「什麼是氣缸」「球閥和蝶閥差異」… |

---

## 2. 舊網址 301 轉址（遷移時最重要，千萬不能漏）

舊站已經被 Google 收錄的網址，必須用 301 永久轉址到新網址，否則會流失既有的排名。

```ts
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  async redirects() {
    return [
      { source: '/index.html',   destination: '/',         permanent: true },
      { source: '/about.html',   destination: '/about',    permanent: true },
      { source: '/product.html', destination: '/products', permanent: true },
      { source: '/info.html',    destination: '/info',     permanent: true },
      { source: '/product/:slug.html', destination: '/products/:slug', permanent: true },
      // 文章：舊編號 → 新 slug，逐筆對應
      { source: '/info/post-180508.html', destination: '/info/<新slug>', permanent: true },
      // ...其餘 7 篇
    ]
  },
}
export default config
```

> 舊站的固定網址寫在 `next.config.ts` 就好。之後在後台修改文章 slug 時產生的轉址，存在 D1 的 `redirects` 資料表，由 `proxy.ts`（Next.js 16 的 middleware）讀取（見第 3 節）。

---

## 3. 後台設計（自建精簡版）

### 3.1 後台範圍

後台只負責兩件事：

1. **文章上架**：資訊討論區的文章，可以新增、編輯、存成草稿、發布、下架
2. **修改前台的文字和圖片**：首頁、關於我們、產品分類頁上的文案和圖片，以及每頁的 SEO 設定

### 3.2 為什麼自己寫，而不用 CMS

| | 自建（採用） | Payload CMS | Keystatic（內容存在 Git） |
|---|---|---|---|
| 適合 | 需求單純，想完全掌控 | 多人權限、版本紀錄、複雜內容結構 | 很少更新，只有懂 GitHub 的人編輯 |
| 開發時間 | 約 1–2 週 | 約 3–5 天 | 約 2–3 天 |
| Cloudflare 費用 | 大概率免費方案就夠 | 官方建議 Workers Paid（每月 5 美元） | 免費（純靜態輸出） |
| 文章編輯器 | 自己整合 Tiptap | 內建 | 內建 |
| 存檔後前台更新 | 立即 | 立即 | 要重新建置，約 1–2 分鐘 |
| 業主使用門檻 | 帳號登入 | 帳號登入 | 需要 GitHub 帳號 |

採用自建的理由：

- 功能只有文章和前台內容兩種，導入整套 CMS 的負擔大於好處
- 精簡的後台每個請求只用幾毫秒 CPU，大概率在 Workers 免費方案內就能跑
- SEO 欄位、轉址、草稿規則可以完全依照寔黈的需求設計

> **什麼時候改用 Payload**：之後如果需要多人分權限、審稿流程、修改紀錄，或產品要做成多層規格資料，就換成 Payload，省下自己做這些功能的時間。

### 3.3 後台頁面與登入

```
/admin
├─ /admin/posts              文章列表（篩選草稿／已發布）
│  ├─ /admin/posts/new       新增文章
│  └─ /admin/posts/[id]      編輯文章（內容、封面、相關產品分類、SEO）
├─ /admin/categories         產品分類列表（拖曳排序）
│  └─ /admin/categories/[slug]  編輯分類介紹、圖片、底下的產品項目、SEO
├─ /admin/content            前台文字與圖片（依頁面分頁籤，見 3.5）
└─ /admin/seo                固定頁面的 SEO 設定、預設分享圖
```

**登入**：後台自己做帳號密碼登入（`/admin/login`），必須做到：

| 項目 | 做法 |
|---|---|
| 密碼雜湊 | Web Crypto 的 PBKDF2（SHA-256、隨機 salt，Workers 上最多 10 萬次迭代），不存明碼 |
| Session | 登入後產生隨機 session id 存進 D1 的 `sessions` 表；cookie 設 `HttpOnly`、`Secure`、`SameSite=Lax`，7 天到期 |
| 防暴力破解 | 同一帳號或 IP 連續失敗 5 次，鎖 15 分鐘（失敗次數記在 D1）；也可加一條 Cloudflare Rate Limiting 規則擋 `/api/admin/login` |
| 權限檢查 | `/admin` 頁面**和** `/api/admin/*` 每一支 API 都在伺服器端驗證 session，不能只擋頁面 |
| 防 CSRF | `SameSite` cookie，加上檢查寫入請求的 `Origin` header 必須是自己的網域 |
| 建立帳號 | 不做公開註冊頁；第一個管理員用 `wrangler d1 execute` 或 seed 建立 |
| 忘記密碼 | 由工程師用指令重設；之後需要再加寄信重設 |
| 登出、改密碼 | 登出刪除 session；改密碼時刪除該帳號其他所有 session |

> 免費方案每個請求只有約 10 毫秒 CPU，PBKDF2 跑 10 萬次可能超過，造成登入不穩定。正式上線使用 Workers Paid 即可避免（見 [Cloudflare-Infra.md](./Cloudflare-Infra.md)）。

### 3.4 資料表

```ts
// lib/db/schema.ts（Drizzle + D1）
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// 每個可被搜尋的頁面共用的 SEO 欄位
const seoColumns = {
  seoTitle: text('seo_title'),               // 空白時用頁面名稱 + 品牌後綴
  seoDescription: text('seo_description'),   // 建議 70–160 字
  ogImageKey: text('og_image_key'),          // R2 key，1200×630，空白時用預設圖
  noindex: integer('noindex', { mode: 'boolean' }).notNull().default(false),
}

// 文章（資訊討論區）
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),     // how-to-choose-pneumatic-valve
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),        // 列表摘要，也是 description 的預設值
  contentHtml: text('content_html').notNull(),
  coverKey: text('cover_key'),
  coverAlt: text('cover_alt'),
  relatedCategories: text('related_categories'), // JSON 陣列，例如 ["ball-valve"]，做內部連結用
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ...seoColumns,
})

// 產品分類（9 大類）
export const productCategories = sqliteTable('product_categories', {
  slug: text('slug').primaryKey(),           // ball-valve
  name: text('name').notNull(),              // 球閥．球塞閥
  introHtml: text('intro_html').notNull(),   // 分類介紹文字，別只放圖
  imageKey: text('image_key'),
  imageAlt: text('image_alt'),
  sortOrder: integer('sort_order').notNull().default(0),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ...seoColumns,
})

// 分類底下的產品項目（例如球閥分類下的「法蘭口球塞閥」）
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  categorySlug: text('category_slug').notNull().references(() => productCategories.slug),
  name: text('name').notNull(),
  description: text('description'),
  imageKey: text('image_key'),
  imageAlt: text('image_alt'),
  sortOrder: integer('sort_order').notNull().default(0),
})

// 前台固定區塊的文字與圖片，以 key/value 存放
export const pageContent = sqliteTable('page_content', {
  key: text('key').primaryKey(),             // 例如 home.hero.title、about.body、seo.home.title
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// 後台管理員與登入 session
export const admins = sqliteTable('admins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),   // pbkdf2$<iterations>$<salt>$<hash>
  failedAttempts: integer('failed_attempts').notNull().default(0),
  lockedUntil: integer('locked_until', { mode: 'timestamp' }),
})
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),                     // 隨機 32 bytes，存雜湊值更安全
  adminId: integer('admin_id').notNull().references(() => admins.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
})

// 改 slug 時自動產生的 301 轉址
export const redirects = sqliteTable('redirects', {
  fromPath: text('from_path').primaryKey(),  // /info/old-slug
  toPath: text('to_path').notNull(),         // /info/new-slug
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
```

### 3.5 「修改前台文字和圖片」怎麼做

在程式碼裡定義一份**可編輯欄位清單**，後台表單依照這份清單自動產生，存進 `page_content`。前台用同樣的 key 讀取，沒填的欄位就用預設值：

```ts
// lib/content-fields.ts
export const CONTENT_FIELDS = [
  { page: '首頁', key: 'home.hero.title',    type: 'text',     default: '深耕台灣閥門領域近四十年。' },
  { page: '首頁', key: 'home.hero.lead',     type: 'textarea', default: '穩定的品質與不斷的創新求變…' },
  { page: '首頁', key: 'home.hero.image',    type: 'image' },   // 存 R2 key，另有 .alt 欄位
  { page: '關於', key: 'about.body',         type: 'richtext' },
  { page: 'SEO',  key: 'seo.home.title',     type: 'text', maxLength: 30 },
  { page: 'SEO',  key: 'seo.home.description', type: 'textarea', maxLength: 160 },
  // ...
] as const
```

這樣做的好處：

- 想開放某段文字給後台修改，只要在清單加一行
- 業主只能改清單上的內容，不會不小心破壞版面
- 首頁、關於、產品總覽、文章列表這類固定頁面的 SEO 設定也一起放在這裡（`seo.<頁面>.title` 等）

### 3.6 文章編輯器

文章需要插圖、表格和連結，建議用 **Tiptap**：

- 只在後台的瀏覽器端執行，**不會增加 Workers 的 CPU 負擔**
- 存成 HTML 放在 `content_html`，前台直接輸出
- 編輯器裡插入的圖片，也走同一套 R2 上傳流程，插入時要求填 alt
- 限制只能用 H2、H3，不要開放 H1（每頁只能有一個 H1，由文章標題負責）

如果想更簡單，也可以改用 Markdown 搭配 `marked` 轉成 HTML，但對非工程師來說比較不好用。

### 3.7 圖片處理

Cloudflare Workers 上的 `next/image` 不會自動最佳化圖片（除非另外開通 Cloudflare Images），所以 `next.config.ts` 設定 `images: { unoptimized: true }`，改成在上傳時就處理好：

- 圖片存在 R2，透過 **R2 公開網域**（例如 `https://img.example.com.tw/<key>`）直接由 Cloudflare CDN 提供，不經過 Worker，不佔 Workers 的請求額度（詳見 [Cloudflare-Infra.md](./Cloudflare-Infra.md)）
- 上傳時用不重複的檔名（例如加上雜湊），就能設定一年的長效快取
- 在後台上傳前，用瀏覽器的 canvas **先縮圖並轉成 WebP**（例如最長邊 1600px），再上傳到 R2
- 上傳表單把 alt 設為必填
- 前台的 `<img>` 要加上 `width`、`height`，避免版面跳動（CLS）

### 3.8 後台表單建議加的提示

- Title 字數計數器（中文約 30 字內）
- Description 字數計數器（約 70–160 字）
- Google 搜尋結果預覽（SERP preview）
- 圖片 alt 設為必填
- slug 自動從標題產生（中文標題建議手動填英文 slug），可以手動修改；**已發布的文章改 slug 時，自動在 `redirects` 新增一筆 301 轉址**
- 草稿可以預覽，但前台和 sitemap 都不會出現

---

## 4. Metadata 實作

### 4.1 全站預設（`app/layout.tsx`）

```tsx
import type { Metadata } from 'next'

export const SITE_URL = 'https://www.example.com.tw' // ← 換成正式網域

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '寔黈企業 STONE VALVES｜台灣氣動閥、氣動執行器製造商',
    template: '%s｜寔黈企業 STONE VALVES',
  },
  description: '寔黈企業深耕台灣閥門領域近四十年，生產氣動執行器、球閥、蝶閥、控制閥等，通過 ISO9001 及 CE 認證。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '寔黈企業 STONE VALVES',
    images: ['/og-default.jpg'],
  },
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <body>{children}</body>
    </html>
  )
}
```

### 4.2 動態頁面（從後台讀 SEO 欄位）

> 下面的範例用 `getCategory()` 這類函式代表「從 D1 讀資料」，集中寫在 `lib/data.ts`。

```tsx
// app/products/[category]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategory } from '@/lib/data'

type Props = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const c = await getCategory(category)
  if (!c) return {}

  const url = `/products/${c.slug}`
  const image = c.ogImageKey ?? c.imageKey
  return {
    title: c.seoTitle || c.name,                  // 套用 layout 的 template
    description: c.seoDescription || stripHtml(c.introHtml).slice(0, 150),
    alternates: { canonical: url },
    robots: c.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      url,
      title: c.seoTitle || c.name,
      images: image ? [`${IMG_BASE}/${image}`] : undefined, // IMG_BASE = R2 公開網域；沒填就沿用 layout 的預設圖
    },
  }
}

export default async function Page({ params }: Props) {
  const { category } = await params
  const c = await getCategory(category)
  if (!c) notFound()
  // ...
}
```

> **後台存檔後立即生效**：頁面在每次請求時從 D1 讀資料（動態渲染），後台一存檔前台就更新，不需要 revalidate 或 webhook。這類頁面每次只是讀 D1、組 HTML，CPU 用量很低，SEO 也沒有問題，因為 Google 拿到的一樣是完整的 HTML。
>
> 如果之後流量變大，想減少 D1 讀取次數，可以再加上 OpenNext 的 R2 incremental cache，並在後台存檔時呼叫 `revalidatePath()`。

---

## 5. sitemap 與 robots

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { SITE_URL } from './layout'
import { getAllCategories, getAllPosts } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cats, posts] = await Promise.all([getAllCategories(), getAllPosts()])
  const staticPages = ['', '/about', '/products', '/info'].map(p => ({
    url: SITE_URL + p,
    lastModified: new Date(),
  }))
  return [
    ...staticPages,
    ...cats.filter(c => !c.noindex).map(c => ({
      url: `${SITE_URL}/products/${c.slug}`,
      lastModified: c.updatedAt,
    })),
    // getAllPosts() 只回傳 status = 'published' 的文章
    ...posts.filter(p => !p.noindex).map(p => ({
      url: `${SITE_URL}/info/${p.slug}`,
      lastModified: p.updatedAt,
    })),
  ]
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'
import { SITE_URL } from './layout'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }, // 圖片在 R2 公開網域，不受這份 robots.txt 影響
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```


---

## 6. 結構化資料（JSON-LD）

用一個共用元件輸出：

```tsx
// components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
```

| 頁面 | Schema 類型 | 重點欄位 |
|---|---|---|
| 全站（layout） | `Organization` | name、logo、url、address、telephone、sameAs（FB、LINE 等） |
| 首頁／關於 | `LocalBusiness`（可選） | 地址、營業時間、geo，需和 Google 商家檔案一致 |
| 分類頁 | `CollectionPage` + `BreadcrumbList` | 首頁 › 產品資訊 › 球閥 |
| 產品頁 | `Product` + `BreadcrumbList` | name、image、description、brand、material |
| 文章頁 | `Article` + `BreadcrumbList` | headline、datePublished、dateModified、author、image |

上線後用 [Rich Results Test](https://search.google.com/test/rich-results) 驗證。

---

## 7. 內容與內部連結

- **產品分類頁一定要有文字**：介紹、適用產業、材質、口徑範圍、規格表（用 HTML `<table>`，不要做成圖片）。
- **麵包屑**：畫面上顯示的麵包屑要和 `BreadcrumbList` JSON-LD 一致。
- **文章 → 產品**：利用 `relatedCategories` 自動在文章底部顯示「相關產品」。
- **產品 → 文章**：分類頁底部顯示「相關技術文章」。
- 連結文字寫關鍵字，例如「氣動球閥規格」，不要寫「點此」。
- 每頁只有一個 `<h1>`，之後依序使用 `<h2>`、`<h3>`。

---

## 8. 效能（Core Web Vitals）

- 圖片在後台上傳時就先壓縮成 WebP（Workers 上沒有自動圖片最佳化，見 3.7），前台加上 `alt`、`width`、`height`；首屏主圖加 `fetchPriority="high"`，其餘加 `loading="lazy"`。
- 字型使用 `next/font`（例如 Noto Sans TC），避免版面跳動（CLS）。
- 主要內容一律在伺服器端產生（Server Component 讀 D1），不要用 client-side fetch 產生，爬蟲才看得到完整 HTML。
- 第三方 script（GA、客服聊天）用 `next/script` 並設定 `strategy="lazyOnload"`。

---

## 9. 部署與上線檢查清單

**部署**：用 `opennextjs-cloudflare build` + `wrangler deploy` 部署到 Cloudflare Workers，分成 staging 和 production 兩個 Worker，各自有獨立的 D1、R2 和 secrets。staging 建置時統一回傳 `X-Robots-Tag: noindex, nofollow` header，避免測試站被收錄。

- 先用免費方案。到 Cloudflare 後台的 **Workers & Pages → Metrics** 觀察 CPU time 和錯誤數，如果出現 Error 1102（超過資源限制），再升級 Workers Paid（每月 5 美元）
- 網域的 DNS 放在 Cloudflare，在 Worker 設定 Custom Domain
- 不要部署到 GitHub Pages：只能輸出純靜態檔案，就沒辦法有後台，也做不了真正的 301 轉址

**上線前**

- [ ] 綁定正式網域，`metadataBase` 改成正式網址
- [ ] 統一 www 或非 www、強制 https（擇一，另一個 301 轉過去）
- [ ] 所有舊 `.html` 網址都能 301 到新網址（逐一測試）
- [ ] 每頁的 title／description 都不重複
- [ ] 所有圖片都有 alt
- [ ] `/sitemap.xml`、`/robots.txt` 可以正常開啟
- [ ] JSON-LD 通過 Rich Results Test
- [ ] Lighthouse 的 SEO 與 Performance 分數 ≥ 90
- [ ] 測試環境（preview）設成 noindex，避免被收錄

**上線後**

- [ ] Google Search Console：驗證網域並提交 sitemap
- [ ] 用「網址審查」對首頁和主要分類頁要求建立索引
- [ ] Google 商家檔案：地址、電話和網站一致
- [ ] 安裝 GA4，追蹤詢價表單和電話點擊
- [ ] 2–4 週後檢查 Search Console 的「網頁索引」與「成效」報表，處理 404 和未索引的頁面

---

## 10. 執行順序建議

1. 建立 Next.js + OpenNext 專案，設定 Cloudflare Workers、D1、R2，以及 staging 和 production 兩個環境
2. 建立第 3.4 節的資料表與 migration，把現有頁面搬成 Next.js 路由
3. 做後台：帳號密碼登入、文章管理（含 Tiptap 編輯器）、產品分類管理、前台文字與圖片設定（3.5 的欄位清單）
4. 實作 `generateMetadata`、`sitemap.ts`、`robots.ts`、JSON-LD
5. 設定舊網址的 301 轉址，並讓 `proxy.ts` 讀取 `redirects` 資料表
6. 把現有內容匯入 D1（寫成 seed），補齊文字介紹與圖片 alt
7. 部署到 staging（自動 noindex），跑完檢查清單
8. 部署 production、切換正式網域，提交 Search Console
9. 持續經營：每月 1–2 篇資訊討論文章，主打長尾問題詞
