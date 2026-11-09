"use client";

import { uploadImage, type UploadResult } from "@/lib/admin/upload-action";

/**
 * 上傳前在瀏覽器裡把圖片縮到最長邊 1600px 並轉成 WebP（Workers 上沒有自動壓縮）。
 * GIF 保留原檔，避免動畫被轉成靜態圖。
 */
export async function compressImage(file: File, maxSide = 1600): Promise<File> {
  if (file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
  // 少數瀏覽器不支援輸出 WebP，改用 JPEG
  const out = blob?.type === "image/webp" ? blob : await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
  if (!out) throw new Error("圖片處理失敗");
  const ext = out.type === "image/webp" ? "webp" : "jpg";
  return new File([out], file.name.replace(/\.[^.]+$/, "") + "." + ext, { type: out.type });
}

export function formatBytes(n: number) {
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

/** 壓縮後上傳，回傳結果與壓縮前後大小 */
export async function compressAndUpload(file: File): Promise<UploadResult & { before: number; after: number }> {
  let small: File;
  try {
    small = await compressImage(file);
  } catch {
    return { ok: false, error: "這個檔案無法讀取，請換一張 JPG、PNG 或 WebP 圖片。", before: file.size, after: 0 };
  }
  const form = new FormData();
  form.append("file", small);
  const result = await uploadImage(form);
  return { ...result, before: file.size, after: small.size };
}
