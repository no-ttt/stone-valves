/**
 * 前台資料快取的標籤。
 * lib/data.ts 讀資料時把結果存進快取並貼上標籤；
 * 後台存檔（lib/admin/*-actions.ts）時用 updateTag 清掉對應標籤，下一個訪客就會拿到新資料。
 */
export const CACHE_TAGS = {
  /** 前台文字（後台「頁面文字」） */
  content: "content",
  /** 產品分類與分類底下的產品 */
  categories: "categories",
  /** 產品資訊頁的「常見產品」 */
  showcase: "showcase",
  /** 文章 */
  posts: "posts",
} as const;
