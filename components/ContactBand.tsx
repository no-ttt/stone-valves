import { COMPANY } from "@/lib/site";

type Props = {
  eyebrow?: string;
  /** 可含 <br>，來自內容資料檔 */
  headingHtml?: string;
  image?: string;
};

/** 頁面底部的聯絡區塊 */
export function ContactBand({
  eyebrow = "寔黈在氣動閥業立足三十餘年",
  headingHtml = "選型、維修、報價，<br>直接問我們的技術人員。",
  image = "/images/281183300.jpg",
}: Props) {
  return (
    <section
      className="contact"
      style={{
        backgroundImage: `linear-gradient(90deg,rgba(18,46,38,.95) 0%,rgba(18,46,38,.82) 50%,rgba(18,46,38,.45) 100%),url('${image}')`,
      }}
    >
      <div className="contact-inner">
        <div className="contact-copy">
          <div className="eyebrow">{eyebrow}</div>
          <h2 dangerouslySetInnerHTML={{ __html: headingHtml }} />
        </div>
        <div className="actions">
          <a className="btn btn-light" href={COMPANY.phoneHref}>
            來電 {COMPANY.phone}
          </a>
          <a className="btn btn-glass glass" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
        </div>
      </div>
    </section>
  );
}
