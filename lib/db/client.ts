import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

/**
 * D1 的 binding 只能在請求的執行環境中取得，不能在模組頂層建立單例。
 * 用 async 模式，Server Component（包含 layout）都可以直接呼叫。
 * `next dev` 透過 next.config.ts 的 initOpenNextCloudflareForDev() 接上本地的 D1 模擬。
 */
export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}

export type Db = Awaited<ReturnType<typeof getDb>>;
