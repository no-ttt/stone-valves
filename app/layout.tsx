import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Poppins } from "next/font/google";
import { getContent } from "@/lib/data";
import { imageUrl } from "@/lib/images";
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
      images: [imageUrl(c["seo.defaultImage"])],
    },
    robots: IS_STAGING ? { index: false, follow: false } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#1E3932",
};

/** 前台在 app/(site)，後台在 app/admin，各自有自己的版面與樣式 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className={`${poppins.variable} ${notoSansTC.variable}`}>
      <body>{children}</body>
    </html>
  );
}
