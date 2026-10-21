# 寔黈企業 STONE VALVES — Cloudflare 架構、流量與費用規劃

> 回答三個問題：資料庫用 D1 夠不夠？很多人看網站會不會掛掉？圖片要怎麼提供？
> SEO 與後台的設計請看 [SEO-NextJS.md](./SEO-NextJS.md)。
>
> 文中的額度與價格是 2026 年 10 月查到的，Cloudflare 會調整，正式上線前請再到官方頁面確認（連結在文末）。

---

## 1. 整體架構

```
訪客
 │
 ├─ 網頁（HTML）──→ Cloudflare Workers（Next.js + OpenNext）──→ D1（文章、產品、設定）
 │
 ├─ JS／CSS ─────→ Workers 靜態資源（不計請求次數）
 │
 └─ 圖片 ────────→ R2 公開網域 img.example.com.tw（Cloudflare CDN 快取，不經過 Worker）

管理員
 └─ /admin ──────→ Workers（帳號密碼登入，session 存在 D1）──→ D1、R2
```

| 元件 | 服務 | 用途 |
|---|---|---|
| 網站主機 | Cloudflare Workers | 執行 Next.js，產生網頁 |
| 資料庫 | Cloudflare D1（SQLite） | 文章、產品分類、前台文字、SEO 設定、轉址 |
| 檔案儲存 | Cloudflare R2 | 圖片 |
| 後台登入 | 自己做（D1 存帳號與 session） | 帳號密碼登入 `/admin` |
| 網域、DNS、HTTPS | Cloudflare | 全部在同一個帳號管理 |

---

## 2. 資料庫：D1 就夠，不需要 PostgreSQL

### 2.1 寔黈的需求和 D1 的額度

| | 寔黈的需求 | D1 免費方案 |
|---|---|---|
| 資料量 | 文章、產品、設定；上千篇文章的文字也只有幾十 MB | 所有資料庫合計 5 GB |
| 寫入 | 只有管理員發文、修改，一天幾十筆 | 每天 10 萬筆 |
| 讀取 | 每次瀏覽一頁約 10～50 筆 | 每天 500 萬筆（約可支撐 10 萬次以上的瀏覽） |
| 查詢 | 依網址查文章、列出分類，很單純 | SQLite 足以處理 |

> 圖片不存在資料庫裡，資料庫只記錄圖片在 R2 的檔名，所以圖片再多也不會佔用 D1 的空間。

### 2.2 什麼時候才需要 PostgreSQL

- 大量使用者同時寫入，例如電商下單、會員系統、論壇留言
- 複雜的報表、統計查詢
- 需要進階的全文搜尋或地理資料功能

寔黈的官網沒有這些需求。改用 PostgreSQL 反而要多接一個外部服務（例如 Neon），再透過 Hyperdrive 連線，架構變得更複雜。

### 2.3 D1 的備份

| 方式 | 說明 |
|---|---|
| Time Travel（自動） | 可以還原到保留期限內的任一時間點，免費方案 7 天、付費方案 30 天 |
| 定期匯出 | `wrangler d1 export` 匯出成 `.sql` 檔，存一份在公司電腦或雲端硬碟 |

---

## 3. 很多人看會不會掛掉？

### 3.1 不會因為「人多」而變慢

Cloudflare Workers 會在全球的節點自動擴展，不像傳統主機有固定的 CPU 和記憶體。流量突然變大時，網站不會因為主機負載過高而變慢或當機。

### 3.2 真正的風險：免費方案的額度

| 限制 | 免費方案額度 | 超過時會怎樣 |
|---|---|---|
| Workers 請求次數 | 每天 10 萬次 | 顯示 **Error 1027**，網站打不開，直到 UTC 午夜（台灣早上 8 點）才恢復 |
| Workers CPU 時間 | 每個請求約 10 毫秒 | 該次請求失敗，顯示 Error 1102 |
| D1 讀取 | 每天 500 萬筆 | 2026 年 9 月起，查詢直接失敗，頁面出錯 |
| D1 寫入 | 每天 10 萬筆 | 後台無法存檔 |

**重點**：免費方案超過額度不是「變慢」，而是「當天整個網站打不開」。

### 3.3 Workers Paid 方案（每月 5 美元）

| 項目 | 內含額度 | 超過後 |
|---|---|---|
| Workers 請求 | 每月 1,000 萬次 | 按用量計費，**網站不會被擋** |
| CPU 時間 | 每個請求預設上限 30 秒 | — |
| D1 | 讀寫額度大幅提高 | 按用量計費 |

### 3.4 流量估算

做好第 4 節的圖片分流後，每次瀏覽大約只用到 1 次 Worker 請求：

| 每天瀏覽量 | 免費方案 | Workers Paid |
|---|---|---|
| 1,000 次（一般 B2B 官網的常見規模） | 綽綽有餘 | — |
| 3 萬次 | 夠用 | — |
| 10 萬次以上（上新聞、被大量轉傳、遭到惡意爬取） | **當天會被擋** | 照常運作，超過內含額度才另外計費 |

### 3.5 建議

- **開發和 staging 階段**：用免費方案。
- **正式上線**：升級 **Workers Paid（每月 5 美元）**。平常大概用不完內含額度，但它保證流量突增時網站不會停擺，同時也避開免費方案的 CPU 時間限制。公司官網一天打不開的損失遠大於這筆費用。

---

## 4. 圖片：使用 R2 公開網域

### 4.1 兩種提供圖片的方式

**方式 A：透過 Worker 讀取（私有 bucket）**

```
訪客 → https://www.example.com.tw/uploads/ball-valve.webp
     → Worker 執行 route.ts → 從 R2 讀出檔案 → 回傳給訪客
```

**方式 B：R2 公開網域（採用）**

```
訪客 → https://img.example.com.tw/ball-valve.webp
     → Cloudflare CDN（有快取就直接回傳）→ 沒有快取才去 R2 拿
```

「R2 公開網域」是在 R2 bucket 的設定裡綁定一個自訂網域（例如 `img.example.com.tw`）。綁定後，bucket 裡的檔案可以直接用網址打開，並且由 Cloudflare 的 CDN 快取和提供，完全不需要經過 Worker。

### 4.2 比較

| | 方式 A：透過 Worker | 方式 B：R2 公開網域 |
|---|---|---|
| Worker 請求次數 | **每張圖都算一次**，一頁 8 張圖就是 9 次請求 | 不計算 |
| 速度 | 每次都要執行 Worker、讀 R2 | 由離訪客最近的 CDN 節點直接提供 |
| 快取 | 要自己處理 | Cloudflare CDN 自動快取 |
| 存取控制 | 可以在程式裡檢查權限 | 知道網址的人都能看 |
| 適合 | 不能公開的檔案（例如付款 QR Code、內部文件） | 網站上本來就公開的圖片 |

以免費方案每天 10 萬次請求計算，方式 A 大約只能支撐 1 萬次瀏覽，方式 B 可以支撐約 10 萬次。

### 4.3 設定步驟

1. 網域的 DNS 要在 Cloudflare 管理
2. Cloudflare 後台 → **R2** → 選擇 bucket → **Settings** → **Custom Domains** → 新增 `img.example.com.tw`
3. **不要**用 R2 預設提供的 `r2.dev` 網址當正式網址。它有速率限制，只適合開發測試
4. 上傳時檔名加上雜湊或時間戳記（例如 `ball-valve-a1b2c3.webp`），更換圖片時就是新網址，因此可以放心設定一年的長效快取（`Cache-Control: public, max-age=31536000, immutable`）
5. 程式裡用環境變數 `IMG_BASE=https://img.example.com.tw` 組出圖片網址

### 4.4 注意事項

- **公開的 bucket 只放公開的圖片**。如果之後有不能公開的檔案（例如報價單、內部文件），另外開一個私有 bucket，用方式 A 讀取。
- 圖片在後台上傳前就先壓縮成 WebP（見 SEO-NextJS.md 第 3.7 節），因為 Workers 上的 Next.js 不會自動壓縮圖片。
- R2 讀取不收流量費，免費方案有 10 GB 儲存空間，官網圖片綽綽有餘。

---

## 5. 流量變大時可以再做的優化

目前的設計已經足夠應付一般官網的流量，以下是之後需要時再加的：

| 優化 | 效果 | 什麼時候做 |
|---|---|---|
| OpenNext 的 R2 incremental cache | 頁面產生一次後快取起來，減少 D1 讀取和 CPU 用量 | 每天瀏覽量達到數萬次 |
| Cloudflare WAF、Bot 防護規則 | 擋掉惡意爬蟲，避免浪費請求額度 | 在 Metrics 看到異常流量時 |
| D1 讀取副本（Read Replication） | 讓海外訪客讀資料更快 | 海外流量占比很高時 |

---

## 6. 監控

| 看什麼 | 在哪裡看 | 注意什麼 |
|---|---|---|
| Worker 請求數、錯誤數、CPU 時間 | Workers & Pages → 選擇 Worker → **Metrics** | 是否出現 1027、1102 錯誤；CPU 時間是否接近上限 |
| D1 讀寫量 | **D1** → 選擇資料庫 → Metrics | 每天的讀取量是否異常增加 |
| R2 用量 | **R2** → Overview | 儲存空間、讀寫次數 |
| 費用 | **Billing** | 可設定用量通知，超過一定金額時寄信提醒 |

上線第一個月每週看一次，穩定之後每月看一次即可。

---

## 7. 費用總整理

| 項目 | 開發／staging | 正式上線 |
|---|---|---|
| Workers | 免費 | **Paid：每月 5 美元**（含 D1 的付費額度） |
| D1 | 免費 | 包含在 Workers Paid 內，一般官網用不到額外費用 |
| R2 | 免費（10 GB） | 免費額度內 |
| 網域 | — | 依網域商，`.com.tw` 一年約新台幣 800 元 |
| **合計** | **0 元** | **每月約 5 美元＋網域費** |

---

## 8. 上線前檢查清單

- [ ] Workers 升級為 Paid 方案
- [ ] R2 bucket 綁定 `img.` 自訂網域，程式的 `IMG_BASE` 指向它
- [ ] 確認沒有任何圖片還在透過 Worker 讀取（瀏覽器開發者工具的 Network 分頁檢查）
- [ ] 未登入時，`/admin` 頁面和每一支 `/api/admin/*` API 都會被擋（直接用網址和 curl 各測一次）
- [ ] 連續輸錯密碼會被鎖定
- [ ] staging 環境回傳 `X-Robots-Tag: noindex`
- [ ] 確認 D1 Time Travel 可以使用，並做一次手動匯出備份
- [ ] Billing 設定用量通知

---

## 參考資料

- [Cloudflare D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [D1 免費方案額度強制執行公告（2026-09-01）](https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare R2：Public buckets 與自訂網域](https://developers.cloudflare.com/r2/buckets/public-buckets/)
