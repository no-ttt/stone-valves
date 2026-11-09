import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { isoDate } from "@/lib/site";
import { PostForm } from "../PostForm";

export const metadata: Metadata = { title: "新增文章" };

export default async function NewPostPage() {
  await requireAdmin();
  const today = isoDate(new Date());
  return (
    <PostForm
      initial={{
        id: null,
        title: "",
        slug: "",
        excerpt: "",
        tag: "資訊",
        coverImage: null,
        coverAlt: "",
        coverFit: false,
        status: "draft",
        publishedDate: today,
        seoTitle: "",
        seoDescription: "",
        noindex: false,
        contentHtml: "",
      }}
    />
  );
}
