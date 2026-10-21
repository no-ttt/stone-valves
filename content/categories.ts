// 產品分類。下一階段接上後台後改從 D1 的 product_categories / products 讀取。
export type Product = { name: string; image: string };

export type Category = {
  slug: string;
  /** 頁面 H1，例如「球閥．球塞閥」 */
  name: string;
  /** 首頁與產品總覽卡片上的名稱 */
  tileName: string;
  /** 分類頁上方切換列的短名稱 */
  navName: string;
  /** 頁尾連結的名稱 */
  footerName: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  cardImage: string;
  products: Product[];
  contactEyebrow: string;
  /** 頁尾聯絡區塊的標題，含 <br> */
  contactHeading: string;
};

export const categories: Category[] = [
  {
    slug: "actuator",
    name: "氣缸．執行器",
    tileName: "氣缸 ｜ 執行器",
    navName: "氣缸．執行器",
    footerName: "氣缸．執行器",
    seoTitle: "氣缸．執行器",
    seoDescription: "寔黈企業氣缸．執行器產品：複動式鋁合金氣缸、單動式鋁合金氣缸、白鐵氣缸、鑄鐵氣缸。",
    keywords: ["複動式鋁合金氣缸","單動式鋁合金氣缸","鑄鐵氣缸","白鐵氣缸","雙動式鋁合金氣缸","氣動執行器","氣動頭","氣動驅動器","旋轉氣缸","Pneumatic actuators","雙動式氣壓缸"],
    cardImage: "/images/1637105412_orig.jpg",
    products: [
      { name: "複動式鋁合金氣缸", image: "/images/1637105412_orig.jpg" },
      { name: "單動式鋁合金氣缸", image: "/images/1813122282_orig.jpg" },
      { name: "白鐵氣缸", image: "/images/1265937165_orig.jpg" },
      { name: "鑄鐵氣缸", image: "/images/1047088091.jpg" },
    ],
    contactEyebrow: "需要氣缸的規格或報價？",
    contactHeading: "告訴我們您的使用條件，<br>我們幫您挑選合適的產品。",
  },
  {
    slug: "ball-valve",
    name: "球閥．球塞閥",
    tileName: "球閥 ｜ 球塞閥",
    navName: "球閥．球塞閥",
    footerName: "球閥．球塞閥",
    seoTitle: "球閥．球塞閥",
    seoDescription: "寔黈企業球閥．球塞閥產品：法蘭口球塞閥、三通球塞閥、三片式焊口閥/牙口閥、三片式牙口閥/焊口閥、兩片式焊口閥/牙口閥。",
    keywords: ["氣動球閥","氣動球塞閥","氣動法蘭口球塞閥","法蘭口球閥","球塞閥","球閥","氣動牙口球塞閥","氣動焊口球塞閥","氣動三片式球閥","氣動兩片式球閥","氣動三通球閥","牙口球閥","焊口球閥","平台球閥"],
    cardImage: "/images/590589702_orig.jpg",
    products: [
      { name: "法蘭口球塞閥", image: "/images/590589702_orig.jpg" },
      { name: "三通球塞閥", image: "/images/1054832566_orig.jpg" },
      { name: "三片式焊口閥/牙口閥", image: "/images/1302536973_orig.jpg" },
      { name: "三片式牙口閥/焊口閥", image: "/images/2018445947_orig.jpg" },
      { name: "兩片式焊口閥/牙口閥", image: "/images/84498818_orig.jpg" },
    ],
    contactEyebrow: "需要球閥的規格或報價？",
    contactHeading: "告訴我們您的使用條件，<br>我們幫您挑選合適的產品。",
  },
  {
    slug: "butterfly-valve",
    name: "蝶閥．蝶型閥",
    tileName: "蝶閥 ｜ 蝶型閥",
    navName: "蝶閥．蝶型閥",
    footerName: "蝶閥．蝶型閥",
    seoTitle: "蝶閥．蝶型閥",
    seoDescription: "寔黈企業蝶閥．蝶型閥產品：對夾式蝶閥、多耳式蝶閥、全金屬蝶閥、鑄鐵．不鏽鋼。",
    keywords: ["氣動蝶型閥","氣動蝶閥","蝶型閥","蝶閥","對夾式蝶閥","多耳式蝶閥","全金屬蝶閥","鑄鐵蝶閥","白鐵蝶閥","不鏽鋼蝶閥","FC蝶閥","sus蝶閥","蝶型閥組裝","Lug Type Butterfly Valve","Wafer Type","台灣蝶閥"],
    cardImage: "/images/2128037631_orig.jpg",
    products: [
      { name: "對夾式蝶閥", image: "/images/2128037631_orig.jpg" },
      { name: "多耳式蝶閥", image: "/images/496878065_orig.jpg" },
      { name: "全金屬蝶閥", image: "/images/45347623.jpg" },
      { name: "鑄鐵．不鏽鋼", image: "/images/3_orig.jpg" },
    ],
    contactEyebrow: "需要蝶閥的規格或報價？",
    contactHeading: "告訴我們您的使用條件，<br>我們幫您挑選合適的產品。",
  },
  {
    slug: "gate-valve",
    name: "閘閥．閘板閥",
    tileName: "閘閥 ｜ 閘板閥",
    navName: "閘閥．閘板閥",
    footerName: "閘閥．閘板閥",
    seoTitle: "閘閥．閘板閥",
    seoDescription: "寔黈企業閘閥．閘板閥產品：閘閥。",
    keywords: ["▎閘 閥 ． 閘板閥"],
    cardImage: "/images/1002776453_orig.jpg",
    products: [
      { name: "閘閥", image: "/images/1002776453_orig.jpg" },
    ],
    contactEyebrow: "需要閘閥的規格或報價？",
    contactHeading: "告訴我們您的使用條件，<br>我們幫您挑選合適的產品。",
  },
  {
    slug: "union-plastic-valve",
    name: "由令．塑膠閥",
    tileName: "由令 ｜ 塑膠閥",
    navName: "由令．塑膠閥",
    footerName: "由令．塑膠閥",
    seoTitle: "由令．塑膠閥",
    seoDescription: "寔黈企業由令．塑膠閥產品：塑膠閥。",
    keywords: ["氣動塑膠由令","由令組裝","汙水由令","染整由令","塑膠球閥","塑膠閥組裝","汙水用塑膠閥","氣動式塑膠閥","氣動式PVC閥","耐酸鹼塑膠閥","化學用塑膠閥","高溫用塑膠閥","耐酸鹼PVC閥","化學PVC閥","高溫用PVC閥"],
    cardImage: "/images/687549987_2.jpg",
    products: [
      { name: "塑膠閥", image: "/images/687549987_2.jpg" },
      { name: "塑膠閥", image: "/images/1850995875_orig.png" },
    ],
    contactEyebrow: "需要由令的規格或報價？",
    contactHeading: "告訴我們您的使用條件，<br>我們幫您挑選合適的產品。",
  },
  {
    slug: "relief-safety-valve",
    name: "減壓閥．安全閥",
    tileName: "減壓閥 ｜ 安全閥",
    navName: "減壓閥．安全閥",
    footerName: "減壓閥．安全閥",
    seoTitle: "減壓閥．安全閥",
    seoDescription: "寔黈企業減壓閥．安全閥產品：安全閥、減壓閥。",
    keywords: ["▎減 壓 閥 ． 安 全 閥"],
    cardImage: "/images/1838516367_orig.jpg",
    products: [
      { name: "安全閥", image: "/images/1838516367_orig.jpg" },
      { name: "減壓閥", image: "/images/484241158_orig.jpg" },
    ],
    contactEyebrow: "需要減壓閥的規格或報價？",
    contactHeading: "告訴我們您的使用條件，<br>我們幫您挑選合適的產品。",
  },
  {
    slug: "globe-valve",
    name: "球型閥．截止閥",
    tileName: "球型閥 ｜ 截止閥",
    navName: "球型閥．截止閥",
    footerName: "球型閥．截止閥",
    seoTitle: "球型閥．截止閥",
    seoDescription: "寔黈企業球型閥．截止閥產品：截止閥、球型閥。",
    keywords: ["▎球 型 閥 ． 截 止 閥"],
    cardImage: "/images/1042141561_orig.jpg",
    products: [
      { name: "截止閥", image: "/images/1042141561_orig.jpg" },
      { name: "球型閥", image: "/images/1732402102_orig.jpg" },
    ],
    contactEyebrow: "需要球型閥的規格或報價？",
    contactHeading: "告訴我們您的使用條件，<br>我們幫您挑選合適的產品。",
  },
  {
    slug: "control-valve",
    name: "控制閥．自動控制閥",
    tileName: "自控閥 ｜ 控制閥",
    navName: "自控閥．控制閥",
    footerName: "控制閥．自動控制閥",
    seoTitle: "控制閥．自動控制閥",
    seoDescription: "寔黈企業控制閥．自動控制閥產品：隔膜式、氣缸式。",
    keywords: ["▎控 制 閥 ． 自 動 控 制 閥"],
    cardImage: "/images/937515201_orig.jpg",
    products: [
      { name: "隔膜式", image: "/images/937515201_orig.jpg" },
      { name: "氣缸式", image: "/images/1739411227_orig.jpg" },
    ],
    contactEyebrow: "需要控制閥的規格或報價？",
    contactHeading: "告訴我們您的使用條件，<br>我們幫您挑選合適的產品。",
  },
  {
    slug: "repair-accessories",
    name: "配件安裝．氣動閥維修",
    tileName: "配件安裝 ｜ 維修",
    navName: "配件安裝．維修",
    footerName: "配件安裝．氣動閥維修",
    seoTitle: "配件安裝．氣動閥維修",
    seoDescription: "寔黈企業配件安裝．氣動閥維修產品：配件安裝實例 01、配件安裝實例 02、配件安裝實例 03、配件安裝實例 04。",
    keywords: ["防爆型微動開關","顯示型微動開關","閥門定位器","限位開關","空氣調理組","三點組合","兩點組合","氣動閥門配件","氣動蝶閥配件","氣動執行器配件","氣缸配件","閥架","閥托架","球閥支架","蝶閥支架","閥門連接架"],
    cardImage: "/images/07_orig.jpg",
    products: [
      { name: "配件安裝實例 01", image: "/images/07_orig.jpg" },
      { name: "配件安裝實例 02", image: "/images/10_orig.jpg" },
      { name: "配件安裝實例 03", image: "/images/0666_orig.jpg" },
      { name: "配件安裝實例 04", image: "/images/08_orig.jpg" },
    ],
    contactEyebrow: "需要配件安裝的規格或報價？",
    contactHeading: "告訴我們您的使用條件，<br>我們幫您挑選合適的產品。",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

/** 產品總覽頁的「常見產品」實拍 */
export const showcase: (Product & { category: string })[] = [
  { name: "三通法蘭口球塞閥", image: "/images/0007.jpg", category: "ball-valve" },
  { name: "兩片式牙口閥", image: "/images/0004.jpg", category: "ball-valve" },
  { name: "三片式牙口閥", image: "/images/0002.jpg", category: "ball-valve" },
  { name: "對夾式蝶閥", image: "/images/0008.jpg", category: "butterfly-valve" },
  { name: "兩片式牙口閥", image: "/images/0005.jpg", category: "ball-valve" },
  { name: "多耳式蝶閥", image: "/images/0014.jpg", category: "butterfly-valve" },
  { name: "三通法蘭口球塞閥", image: "/images/0015.jpg", category: "ball-valve" },
  { name: "三片式焊口球塞閥", image: "/images/0003.jpg", category: "ball-valve" },
  { name: "不鏽鋼蝶閥", image: "/images/0013.jpg", category: "butterfly-valve" },
  { name: "手動式三通法蘭口", image: "/images/0006.jpg", category: "ball-valve" },
  { name: "安全閥", image: "/images/0012.jpg", category: "relief-safety-valve" },
  { name: "減壓閥", image: "/images/0011.jpg", category: "relief-safety-valve" },
  { name: "隔膜式控制閥", image: "/images/0010.jpg", category: "control-valve" },
  { name: "氣缸式控制閥", image: "/images/0009.jpg", category: "control-valve" },
  { name: "手動三通牙口閥", image: "/images/0016.jpg", category: "ball-valve" },
  { name: "手動三片式牙口閥", image: "/images/0017.jpg", category: "ball-valve" },
];
