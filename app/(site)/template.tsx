import { ViewTransition } from "react";

/**
 * 前台換頁過場。template 每次換頁都會重新掛載，
 * 舊頁面播 page-out、新頁面播 page-in（樣式在 site.css 的「換頁過場」）。
 * 頁尾放在 layout，換頁時不動。
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
