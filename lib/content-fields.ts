/**
 * 前台可以在後台修改的文字與圖片。
 * - 後台的「前台內容」頁依照這份清單自動產生表單
 * - 前台用同一個 key 讀取，資料庫沒有值時用 default
 * 想開放新的欄位給後台修改：在這裡加一行，再到頁面裡改成讀 content["新的 key"]。
 */

export type FieldType =
  /** 單行文字 */
  | "text"
  /** 多行文字：換行會保留；空一行代表新段落 */
  | "textarea"
  /** 圖片位置（/images/... 或 R2 key） */
  | "image"
  /** 以頓號「、」分隔的清單 */
  | "list";

export type ContentField = {
  label: string;
  type: FieldType;
  default: string;
  hint?: string;
  maxLength?: number;
};

const f = (label: string, type: FieldType, value: string, extra: Partial<ContentField> = {}): ContentField => ({
  label,
  type,
  default: value,
  ...extra,
});

const SEO_TITLE_HINT = "搜尋結果的標題，建議 30 字內。後面會自動加上「｜寔黈企業 STONE VALVES」";
const SEO_DESC_HINT = "搜尋結果標題下方的說明，建議 70–160 字";

export const CONTENT_GROUPS = {
  company: {
    label: "公司資訊",
    description: "頁尾、聯絡區塊、關於頁與搜尋引擎的公司資料都會使用這裡的內容。",
    fields: {
      "company.name": f("公司全名", "text", "寔黈企業股份有限公司"),
      "company.englishName": f("英文名稱", "text", "Stone Enterprise Co., Ltd."),
      "company.region": f("縣市", "text", "新北市"),
      "company.locality": f("鄉鎮區", "text", "泰山區"),
      "company.street": f("路段門牌", "text", "中港西路136巷95-12號"),
      "company.phone": f("電話", "text", "(02) 2296-8958", { hint: "格式：(02) 2296-8958" }),
      "company.fax": f("傳真", "text", "(02) 2296-8056"),
      "company.email": f("E-mail", "text", "shihtaoo@seed.net.tw"),
      "company.facebook": f("Facebook 網址", "text", "https://www.facebook.com/STONE.VALVES/"),
      "company.certification": f("認證", "text", "ISO9001：2000．CE 品質管理體系認證"),
    },
  },
  home: {
    label: "首頁",
    description: "",
    fields: {
      "home.hero.image": f("主視覺圖片", "image", "/images/2013240233.jpg"),
      "home.hero.eyebrow": f("主視覺小標", "text", "台灣優良老品牌"),
      "home.hero.title": f("主視覺標題", "textarea", "深耕台灣閥門領域\n近四十年。", { hint: "這是首頁的 H1。換行會照樣顯示" }),
      "home.hero.lead": f("主視覺說明", "textarea", "穩定的品質與不斷的創新求變，使我們能夠立足台灣、放眼世界。"),
      "home.intro.title": f("公司介紹標題", "text", "台灣優良老品牌"),
      "home.intro.body": f(
        "公司介紹內文",
        "textarea",
        "深耕台灣閥門領域近四十年，經歷風風雨雨、面臨各種挑戰，我們屹立不搖且始終如一。穩定的品質與不斷的創新求變，使我們能夠立足台灣、放眼世界。",
      ),
      "home.intro.image1": f("公司介紹圖片 1", "image", "/images/45584-1_1.png"),
      "home.intro.image2": f("公司介紹圖片 2", "image", "/images/45698png.png"),
      "home.value1.title": f("特色 1 標題", "text", "經驗"),
      "home.value1.body": f("特色 1 說明", "text", "近四十年的專業與經驗，做您堅強的後盾。"),
      "home.value2.title": f("特色 2 標題", "text", "品質"),
      "home.value2.body": f("特色 2 說明", "text", "高品質的產品，才是維持競爭力的核心。"),
      "home.value3.title": f("特色 3 標題", "text", "服務"),
      "home.value3.body": f("特色 3 說明", "text", "快速且完善的服務，值得您信賴。"),
      "home.quality.title": f("品質區塊標題", "text", "品質值得信賴"),
      "home.quality.body": f("品質區塊說明", "textarea", "零組件皆達到標準化，提供高品質、高競爭力的產品，給您向前邁進的力量。"),
      "home.contact.eyebrow": f("聯絡區塊小標", "text", "深耕台灣閥門領域近四十年"),
    },
  },
  about: {
    label: "關於寔黈",
    description: "",
    fields: {
      "about.hero.image": f("主視覺圖片", "image", "/images/472157156.jpg"),
      "about.hero.lead": f("主視覺說明", "textarea", "專門從事氣動執行器、氣動閥門生產三十餘年的台灣企業。"),
      "about.intro.title": f("公司簡介標題", "text", "三十餘年的氣動閥專業"),
      "about.intro.body": f(
        "公司簡介內文",
        "textarea",
        "寔黈實業有限公司是一家專門從事氣動執行器、氣動閥門生產三十餘年的台灣企業。產品按國家標準及美國、德國、日本標準生產，以 CNC 電腦速控加工機械生產，品質保證精密。\n\n產品已通過 ISO9001：2000 CE 品質管理體系認證，所生產的閥門系列產品廣泛應用於工業自動化、石化工業、染整機械廠、廢水處理廠等行業。",
        { hint: "空一行代表新段落" },
      ),
      "about.intro.image": f("公司簡介圖片", "image", "/images/1615538772.jpg"),
      "about.intro.imageAlt": f("公司簡介圖片的替代文字", "text", "CNC 加工機械"),
      "about.intro.caption": f("公司簡介圖片說明", "text", "CNC 電腦速控加工，品質保證精密"),
      "about.motto.image": f("經營理念背景圖", "image", "/images/1283431442.jpg"),
      "about.motto.quote": f("經營理念", "textarea", "「品質求生存，\n信譽求發展」"),
      "about.motto.body": f("經營理念說明", "textarea", "誠納四海商客，願與各位朋友長期共事，攜手共進，共創未來。"),
      "about.products.body": f(
        "主要產品說明",
        "textarea",
        "鋁合金氣缸、鑄鐵氣缸、法蘭口球閥、三片式牙口（焊口）球閥、三通球閥、二片式球閥、氣動控制閥、閘閥、止回閥、Y型牙口閥、減壓閥等。",
      ),
      "about.materials": f("閥體材質", "list", "ASTM/CF8M、CF8、WCB、LCC、JIS/316、304、316L", { hint: "用「、」分隔" }),
      "about.industries": f("應用產業", "list", "工業自動化、石化工業、染整機械廠、廢水處理廠、工業用管道、自動化機械工業", {
        hint: "用「、」分隔",
      }),
      "about.english": f(
        "英文介紹",
        "textarea",
        "STONE Enterprise Co., Ltd. professionally manufactures actuators and various valves over 30 years. The products are based on the standards of GB, JB, API, JIS etc. We use speed controlled machining mechanism to assure the precision of our products.\n\nThe main products of our manufacture include aluminum alloyed actuator, cast-iron actuator, flange ended ball valve, three-piece cylinder actuated ball valve, soldered-connection ball valve, three-way valve, two-piece ball valve, air-operated control valve, gate valve, cut-off valve, thread Y stop valve, pressure reduce valve etc.",
        { hint: "空一行代表新段落" },
      ),
    },
  },
  products: {
    label: "產品資訊",
    description: "產品總覽頁。各分類的內容請到「產品分類」修改。",
    fields: {
      "products.hero.image": f("主視覺圖片", "image", "/images/1476105101.jpg"),
      "products.hero.lead": f("主視覺說明", "textarea", "從氣動執行器到各式閥門與配件安裝，九大類產品一次看齊。"),
      "products.why.title": f("「為什麼選擇」標題", "text", "為什麼選擇寔黈？"),
      "products.why.body": f(
        "「為什麼選擇」內文",
        "textarea",
        "寔黈站穩氣動閥業近四十年，高品質的產品值得您信賴，完善的服務做您堅強的後盾。現在就讓我們不只是合作，更成為戮力同心的夥伴！",
      ),
    },
  },
  info: {
    label: "資訊討論",
    description: "文章列表頁。文章內容請到「文章」修改。",
    fields: {
      "info.hero.image": f("主視覺圖片", "image", "/images/2013240233.jpg"),
      "info.hero.title": f("主視覺標題", "textarea", "閥門的知識，\n從這裡開始。"),
      "info.hero.lead": f("主視覺說明", "textarea", "執行器原理、閥門選型、材質挑選與保養，寔黈把三十餘年的現場經驗寫成文章。"),
    },
  },
  contact: {
    label: "聯絡區塊",
    description: "各頁底部「選型、維修、報價」的綠色區塊。產品分類頁的版本在各分類裡設定。",
    fields: {
      "contact.image": f("背景圖片", "image", "/images/281183300.jpg"),
      "contact.eyebrow": f("小標", "text", "寔黈在氣動閥業立足三十餘年"),
      "contact.heading": f("標題", "textarea", "選型、維修、報價，\n直接問我們的技術人員。"),
    },
  },
  seo: {
    label: "SEO",
    description: "固定頁面在搜尋結果顯示的標題與說明。文章和產品分類的 SEO 在各自的編輯頁設定。",
    fields: {
      "seo.home.title": f("首頁標題", "text", "寔黈企業 STONE VALVES｜台灣氣動閥、氣動執行器製造商", {
        hint: "首頁標題不會自動加上品牌名稱，請完整填寫",
        maxLength: 60,
      }),
      "seo.home.description": f(
        "首頁說明",
        "textarea",
        "寔黈企業深耕台灣閥門領域近四十年，生產氣動執行器、球閥、蝶閥、控制閥等，通過 ISO9001：2000．CE 品質管理體系認證。",
        { hint: SEO_DESC_HINT, maxLength: 160 },
      ),
      "seo.about.title": f("關於寔黈標題", "text", "關於寔黈", { hint: SEO_TITLE_HINT, maxLength: 30 }),
      "seo.about.description": f(
        "關於寔黈說明",
        "textarea",
        "寔黈企業專門從事氣動執行器、氣動閥門生產三十餘年，產品通過 ISO9001：2000 CE 品質管理體系認證。",
        { hint: SEO_DESC_HINT, maxLength: 160 },
      ),
      "seo.products.title": f("產品資訊標題", "text", "產品資訊", { hint: SEO_TITLE_HINT, maxLength: 30 }),
      "seo.products.description": f(
        "產品資訊說明",
        "textarea",
        "寔黈企業產品：氣缸．執行器、球閥．球塞閥、蝶閥．蝶型閥、閘閥．閘板閥、由令．塑膠閥、減壓閥．安全閥、球型閥．截止閥、控制閥．自動控制閥、配件安裝．氣動閥維修。",
        { hint: SEO_DESC_HINT, maxLength: 160 },
      ),
      "seo.info.title": f("資訊討論標題", "text", "資訊討論", { hint: SEO_TITLE_HINT, maxLength: 30 }),
      "seo.info.description": f(
        "資訊討論說明",
        "textarea",
        "寔黈企業三十餘年氣動閥專業：執行器原理、閥門選型、材質挑選與保養的技術文章。",
        { hint: SEO_DESC_HINT, maxLength: 160 },
      ),
      "seo.defaultImage": f("預設分享圖片", "image", "/images/2013240233.jpg", {
        hint: "分享到 LINE、Facebook 時，沒有指定圖片的頁面會用這張。建議 1200×630",
      }),
    },
  },
} as const satisfies Record<string, { label: string; description: string; fields: Record<string, ContentField> }>;

type Groups = typeof CONTENT_GROUPS;
export type ContentGroupId = keyof Groups;
export type ContentKey = { [G in ContentGroupId]: keyof Groups[G]["fields"] }[ContentGroupId] & string;
export type Content = Record<ContentKey, string>;

export const CONTENT_FIELDS = Object.fromEntries(
  Object.values(CONTENT_GROUPS).flatMap((g) => Object.entries(g.fields)),
) as Record<ContentKey, ContentField>;

export const CONTENT_DEFAULTS = Object.fromEntries(
  Object.entries(CONTENT_FIELDS).map(([k, v]) => [k, v.default]),
) as Content;

export function isContentKey(key: string): key is ContentKey {
  return key in CONTENT_FIELDS;
}
