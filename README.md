# 寔黈閥門 STONE VALVES 網站

純靜態網站，不需要資料庫或後端程式。所有圖片、字型、CSS 都在本機，不依賴 Weebly 的伺服器。

## 資料夾結構

```
index.html          首頁
product.html        產品資訊
about.html          關於寔黈
info.html           資訊討論（部落格）
product/            9 個產品分類頁
assets/
  weebly.css        Weebly 共用樣式（只保留網站用到的規則）
  theme.css         佈景主題樣式
  site.css          補充樣式：桌面版下拉選單
  site.js           互動功能：捲動時選單收合、手機版選單、子選單、部落格分類篩選
  vendor/           CSS 用到的字型與按鈕圖片
uploads/            網站圖片與字型
```

## 預覽網站

**方法 A：直接打開**
在 Finder 裡對 `index.html` 按兩下即可。所有路徑都是相對路徑，圖片、選單、連結都能用。

**方法 B：本機伺服器（建議）**
這樣最接近網站放上主機後的實際效果：

```bash
cd "/Users/no/Desktop/Case/Stone Valves"
python3 -m http.server 8765
```

然後用瀏覽器打開 <http://127.0.0.1:8765/index.html>。要停止的話，在終端機按 `Ctrl + C`。

## 修改內容

直接用文字編輯器（例如 VS Code）修改檔案，存檔後重新整理瀏覽器就能看到結果。

| 想改的東西 | 改哪裡 |
|---|---|
| 頁面文字、圖片 | 該頁的 `.html` 檔 |
| 新增圖片 | 放進 `uploads/`，再在 HTML 裡用相對路徑引用 |
| 顏色、字型、間距等樣式 | `assets/site.css`（建議把自訂樣式都寫在這裡） |
| 互動功能 | `assets/site.js` |

**選單在每一頁都有一份。** 選單沒有共用檔案，每個 `.html` 裡都各有一份桌面版選單、手機版選單和頁尾選單。要改選單文字或新增項目，記得 13 個頁面都要改。

**目前頁面的標示。** 選單項目的 `<li>` 加上 `id="active"` 就會變灰色，表示目前所在位置。產品分類頁上，「產品資訊」和該分類兩個項目都有標示。

**路徑注意。** `product/` 裡的頁面在子資料夾中，引用其他檔案要加 `../`，例如 `../index.html`、`../uploads/...`、`../assets/site.css`。

### 新增頁面

1. 複製一個最接近的現有頁面，例如新的產品分類頁可以複製 `product/gate-valve.html`。
2. 修改 `<title>` 和頁面內容。
3. 在所有頁面的選單裡加上新頁面的連結。
4. 把新頁面選單裡對應項目的 `<li>` 設成 `id="active"`，並移除原本那一項的 `id="active"`。

## 頁面對照

| 選單 | 檔案 |
|---|---|
| 寔黈首頁 | `index.html` |
| 產品資訊 | `product.html` |
| 氣缸．執行器 | `product/actuator.html` |
| 球閥．球塞閥 | `product/ball-valve.html` |
| 蝶閥．蝶型閥 | `product/butterfly-valve.html` |
| 閘閥．閘板閥 | `product/gate-valve.html` |
| 由令．塑膠閥 | `product/union-plastic-valve.html` |
| 減壓閥．安全閥 | `product/relief-safety-valve.html` |
| 球型閥．截止閥 | `product/globe-valve.html` |
| 控制閥．自動控制閥 | `product/control-valve.html` |
| 配件安裝．氣動閥維修 | `product/repair-accessories.html` |
| 關於寔黈 | `about.html` |
| 資訊討論 | `info.html` |

「立即聯絡」按鈕原本連到一個沒有存下來的聯絡頁，目前改成寄信到 `shihtaoo@seed.net.tw`。

資訊討論頁的分類篩選是用網址參數：`info.html?cat=3534235542` 只顯示「討論」，`info.html?cat=3603935338` 只顯示「資訊」。

## 上傳到主機

把整個資料夾上傳即可（`README.md` 可以不傳）：

```
index.html  product.html  about.html  info.html
product/  assets/  uploads/
```
