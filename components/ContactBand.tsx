import { Lines } from "@/components/Text";
import { getContent } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import { companyInfo } from "@/lib/site";

type Props = {
  /** 沒給就用後台「聯絡區塊」的設定 */
  eyebrow?: string;
  /** 多行文字，換行會保留 */
  heading?: string;
};

/** 頁面底部的聯絡區塊 */
export async function ContactBand({ eyebrow, heading }: Props) {
  const content = await getContent();
  const company = companyInfo(content);
  return (
    <section
      className="contact"
      style={{
        backgroundImage: `linear-gradient(90deg,rgba(22,42,36,.95) 0%,rgba(22,42,36,.82) 50%,rgba(22,42,36,.45) 100%),url('${imageUrl(content["contact.image"])}')`,
      }}
    >
      <div className="contact-inner">
        <div className="contact-copy">
          <div className="eyebrow">{eyebrow || content["contact.eyebrow"]}</div>
          <h2>
            <Lines text={heading || content["contact.heading"]} />
          </h2>
        </div>
        <div className="actions">
          <a className="btn btn-light" href={company.phoneHref}>
            來電 {company.phone}
          </a>
          <a className="btn btn-glass glass" href={`mailto:${company.email}`}>
            {company.email}
          </a>
        </div>
      </div>
    </section>
  );
}
