import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

// 前台資料快取（lib/data.ts 的 unstable_cache）存放的位置：
// - incrementalCache：快取內容放 R2（binding NEXT_INC_CACHE_R2_BUCKET），
//   外面再包一層 Cloudflare 各機房的區域快取，同一區的訪客不用每次都去 R2 拿。
// - tagCache：記錄「哪個標籤在什麼時候被清掉」，放在 D1（binding NEXT_TAG_CACHE_D1，
//   跟網站同一個資料庫，資料表 revalidations 由 `opennextjs-cloudflare deploy` 自動建立）。
// 後台存檔時 updateTag() 會寫入 tagCache，比那個時間舊的快取就失效。
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  tagCache: d1NextTagCache,
});
