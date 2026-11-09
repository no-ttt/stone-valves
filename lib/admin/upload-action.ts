"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireAdmin } from "@/lib/auth/session";
import { imageUrl } from "@/lib/images";

const TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};
const MAX_BYTES = 5 * 1024 * 1024;

export type UploadResult = { ok: true; key: string; url: string } | { ok: false; error: string };

/**
 * 上傳圖片到 R2。瀏覽器端已先縮小並轉成 WebP（見 components/admin/image-tools.ts）。
 * 不接受 SVG：SVG 裡可以夾帶程式碼。
 */
export async function uploadImage(form: FormData): Promise<UploadResult> {
  await requireAdmin();
  const file = form.get("file");
  if (!(file instanceof File)) return { ok: false, error: "沒有收到檔案。" };
  const ext = TYPES[file.type];
  if (!ext) return { ok: false, error: "只能上傳 JPG、PNG、WebP 或 GIF 圖片。" };
  if (file.size > MAX_BYTES) return { ok: false, error: "圖片超過 5 MB，請換一張小一點的圖片。" };

  const now = new Date();
  const id = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => b.toString(16).padStart(2, "0")).join("");
  // 檔名每次都不同，所以可以設定一年的長效快取
  const key = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${id}.${ext}`;

  const { env } = await getCloudflareContext({ async: true });
  await env.UPLOADS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
  });
  return { ok: true, key, url: imageUrl(key) };
}
