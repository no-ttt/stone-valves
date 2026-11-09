import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// 圖片欄位（*_image）存的是「圖片位置」：
// - 以 / 開頭：public/ 底下的靜態檔（從舊站搬過來的圖片）
// - 其他：R2 的 key，前台用 IMG_BASE 組成完整網址（見 lib/images.ts）

/** 每個可被搜尋的頁面共用的 SEO 欄位 */
const seoColumns = {
  /** 空白時用頁面名稱 */
  seoTitle: text("seo_title"),
  /** 建議 70–160 字；空白時用摘要或介紹 */
  seoDescription: text("seo_description"),
  /** 分享縮圖，1200×630；空白時用封面或預設圖 */
  ogImage: text("og_image"),
  noindex: integer("noindex", { mode: "boolean" }).notNull().default(false),
};

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
};

// ---------- 文章 ----------

export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    /** 網址代稱，例如 five-common-valve-types */
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    /** 列表摘要，也是 description 的預設值 */
    excerpt: text("excerpt").notNull().default(""),
    tag: text("tag", { enum: ["資訊", "討論"] }).notNull().default("資訊"),
    contentHtml: text("content_html").notNull().default(""),
    coverImage: text("cover_image"),
    coverAlt: text("cover_alt").notNull().default(""),
    /** 封面是產品圖（完整顯示）而不是照片（裁切填滿） */
    coverFit: integer("cover_fit", { mode: "boolean" }).notNull().default(false),
    status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
    /** 顯示在文章上的日期，也用來排序 */
    publishedAt: integer("published_at", { mode: "timestamp" }),
    ...seoColumns,
    ...timestamps,
  },
  (t) => [index("posts_status_published_idx").on(t.status, t.publishedAt)],
);

// ---------- 產品 ----------

export const productCategories = sqliteTable("product_categories", {
  slug: text("slug").primaryKey(),
  /** 頁面 H1，例如「球閥．球塞閥」 */
  name: text("name").notNull(),
  /** 首頁與產品總覽卡片上的名稱 */
  tileName: text("tile_name").notNull(),
  /** 分類頁上方切換列的短名稱 */
  navName: text("nav_name").notNull(),
  /** 頁尾連結的名稱 */
  footerName: text("footer_name").notNull(),
  /** 分類介紹（HTML），對 SEO 很重要 */
  introHtml: text("intro_html").notNull().default(""),
  cardImage: text("card_image"),
  /** 搜尋關鍵字，以「,」分隔，顯示在分類頁底部 */
  keywords: text("keywords").notNull().default(""),
  contactEyebrow: text("contact_eyebrow").notNull().default(""),
  /** 頁尾聯絡區塊的標題，換行會保留 */
  contactHeading: text("contact_heading").notNull().default(""),
  /** 首頁的「產品類別」是否顯示 */
  showOnHome: integer("show_on_home", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...seoColumns,
  ...timestamps,
});

export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    categorySlug: text("category_slug")
      .notNull()
      .references(() => productCategories.slug, { onDelete: "cascade", onUpdate: "cascade" }),
    name: text("name").notNull(),
    image: text("image"),
    imageAlt: text("image_alt").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("products_category_idx").on(t.categorySlug, t.sortOrder)],
);

/** 產品總覽頁的「常見產品」實拍 */
export const showcaseItems = sqliteTable("showcase_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  image: text("image").notNull(),
  categorySlug: text("category_slug")
    .notNull()
    .references(() => productCategories.slug, { onDelete: "cascade", onUpdate: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------- 前台文字與圖片 ----------

/** 可在後台修改的前台文字與圖片，key 定義在 lib/content-fields.ts */
export const pageContent = sqliteTable("page_content", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// ---------- 轉址 ----------

/** 修改已發布頁面的網址時自動新增，舊網址 301 到新網址 */
export const redirects = sqliteTable("redirects", {
  fromPath: text("from_path").primaryKey(),
  toPath: text("to_path").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// ---------- 後台帳號 ----------

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  /** pbkdf2$<iterations>$<salt>$<hash> */
  passwordHash: text("password_hash").notNull(),
  failedAttempts: integer("failed_attempts").notNull().default(0),
  lockedUntil: integer("locked_until", { mode: "timestamp" }),
  ...timestamps,
});

export const sessions = sqliteTable(
  "sessions",
  {
    /** session token 的 SHA-256 雜湊；cookie 裡才是原始 token，資料庫外洩也無法冒用 */
    id: text("id").primaryKey(),
    adminId: integer("admin_id")
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [index("sessions_admin_idx").on(t.adminId)],
);

/** 登入失敗紀錄（依 IP），用來擋暴力破解 */
export const loginAttempts = sqliteTable("login_attempts", {
  ip: text("ip").primaryKey(),
  failures: integer("failures").notNull().default(0),
  windowStart: integer("window_start", { mode: "timestamp" }).notNull(),
});
