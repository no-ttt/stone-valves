import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Poppins } from "next/font/google";
import { getContent } from "@/lib/data";
import { absoluteImageUrl } from "@/lib/images";
import { IS_STAGING, SITE_URL } from "@/lib/site";

// 內容來自 D1，每次請求時產生頁面（後台存檔後前台立即更新）
export const dynamic = "force-dynamic";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-poppins" });
// 中文字型檔很大，不預載，交給瀏覽器依 unicode-range 分批下載
const notoSansTC = Noto_Sans_TC({ weight: ["300", "400", "500", "700"], variable: "--font-noto-tc", preload: false });

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: c["seo.home.title"], template: "%s｜寔黈企業 STONE VALVES" },
    description: c["seo.home.description"],
    openGraph: {
      type: "website",
      locale: "zh_TW",
      siteName: "寔黈企業 STONE VALVES",
      images: [absoluteImageUrl(c["seo.defaultImage"], SITE_URL)],
    },
    robots: IS_STAGING ? { index: false, follow: false } : undefined,
    // iPhone Safari 會自動把電話號碼包成連結，改到頁面讓 React 判定不一致而整頁重畫；關掉自動偵測
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#1E3932",
};

/**
 * 在畫面第一次繪製前就決定要不要播進場動畫（components/Motion.tsx、site.css 的「動態效果」）：
 * - motion：開啟進場動畫。等 React 接手後才加會讓已經顯示的內容瞬間變透明再淡入，看起來像閃一下
 * - settled：這次瀏覽已經看過網站（例如 GitHub Pages 每次點連結都是整頁重新載入），header 不再重播進場
 */
const MOTION_BOOT = `try{var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("motion");if(sessionStorage.getItem("sv-visited"))d.classList.add("settled");sessionStorage.setItem("sv-visited","1")}catch(e){}`;

/** 前台在 app/(site)，後台在 app/admin，各自有自己的版面與樣式 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning：下面的 script 會在 React 接手前就幫 <html> 加上 class
    <html lang="zh-Hant-TW" className={`${poppins.variable} ${notoSansTC.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
