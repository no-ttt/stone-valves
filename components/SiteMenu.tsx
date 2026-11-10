import { MobileMenu } from "@/components/MobileMenu";
import { getContent } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { NAV, companyInfo } from "@/lib/site";

/** 手機版選單（固定在右上角的按鈕＋全螢幕選單），放在版面最外層 */
export async function SiteMenu() {
  const company = companyInfo(await getContent());
  return (
    <MobileMenu
      nav={NAV}
      logo={imageUrl("/images/st-png_3.png")}
      phone={company.phone}
      phoneHref={company.phoneHref}
      email={company.email}
    />
  );
}
