// 讓 @opennextjs/cloudflare 的全域 CloudflareEnv 型別接上 wrangler.jsonc 的 bindings。
// worker-configuration.d.ts 由 `npm run cf:typegen` 產生，wrangler.jsonc 變動後要重新執行。
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CloudflareEnv extends Env {}
