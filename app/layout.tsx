import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Poppins } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { Motion } from "@/components/Motion";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY, IS_STAGING, SITE_URL } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-poppins" });
// 中文字型檔很大，不預載，交給瀏覽器依 unicode-range 分批下載
const notoSansTC = Noto_Sans_TC({ weight: ["300", "400", "500", "700"], variable: "--font-noto-tc", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "寔黈企業 STONE VALVES｜台灣氣動閥、氣動執行器製造商",
    template: "%s｜寔黈企業 STONE VALVES",
  },
  description:
    "寔黈企業深耕台灣閥門領域近四十年，生產氣動執行器、球閥、蝶閥、控制閥等，通過 ISO9001：2000．CE 品質管理體系認證。",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "寔黈企業 STONE VALVES",
    images: ["/images/2013240233.jpg"],
  },
  robots: IS_STAGING ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#163D32",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.name,
  alternateName: [COMPANY.shortName, COMPANY.brand, COMPANY.englishName],
  url: SITE_URL,
  logo: `${SITE_URL}/images/st-png_3.png`,
  telephone: "+886-2-2296-8958",
  faxNumber: "+886-2-2296-8056",
  email: COMPANY.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.locality,
    addressRegion: COMPANY.address.region,
    addressCountry: "TW",
  },
  sameAs: [COMPANY.facebook],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className={`${poppins.variable} ${notoSansTC.variable}`}>
      <body>
        <div className="page">
          {children}
          <SiteFooter />
        </div>
        <Motion />
        <JsonLd data={organization} />
      </body>
    </html>
  );
}
