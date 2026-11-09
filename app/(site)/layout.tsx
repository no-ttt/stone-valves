import { JsonLd } from "@/components/JsonLd";
import { Motion } from "@/components/Motion";
import { SiteFooter } from "@/components/SiteFooter";
import { getContent } from "@/lib/data";
import { SITE_URL, companyInfo } from "@/lib/site";
import "./site.css";

/** 前台版面：頁面內容、頁尾、動態效果、公司的結構化資料 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const company = companyInfo(await getContent());
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    alternateName: ["寔黈企業", "STONE VALVES", company.englishName],
    url: SITE_URL,
    logo: `${SITE_URL}/images/st-png_3.png`,
    telephone: company.phoneIntl,
    faxNumber: company.faxIntl,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.street,
      addressLocality: company.locality,
      addressRegion: company.region,
      addressCountry: "TW",
    },
    sameAs: [company.facebook],
  };

  return (
    <>
      <div className="page">
        {children}
        <SiteFooter />
      </div>
      <Motion />
      <JsonLd data={organization} />
    </>
  );
}
