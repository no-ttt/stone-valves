import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "網站後台", template: "%s｜寔黈後台" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
