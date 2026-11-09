import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * 從 R2 讀出後台上傳的圖片。
 * 只在還沒設定 R2 公開網域（IMG_BASE）時使用，例如本地開發。正式環境的圖片應該走公開網域，
 * 不經過 Worker（見 docs/Cloudflare-Infra.md 第 4 節）。
 */
export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  if (!/^\d{4}\/\d{2}\/[a-f0-9]+\.(webp|jpg|png|gif)$/.test(key)) return new Response("Not found", { status: 404 });

  const { env } = await getCloudflareContext({ async: true });
  const obj = await env.UPLOADS.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("x-content-type-options", "nosniff");
  return new Response(obj.body, { headers });
}
