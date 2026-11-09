// 密碼雜湊：PBKDF2-SHA256 + 隨機 salt。只用 Web Crypto，Workers 與 Node（建立帳號的腳本）都能執行。
// Cloudflare Workers 的 PBKDF2 最多只允許 100,000 次迭代。

const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;

const enc = new TextEncoder();

export function toBase64Url(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64Url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/** 比較時間固定，不會因為前幾個位元組相同就比較快回傳 */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function derive(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    HASH_BYTES * 8,
  );
  return new Uint8Array(bits);
}

/** 回傳 pbkdf2$<iterations>$<salt>$<hash> */
export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(hash)}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, iter, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2" || !iter || !salt || !hash) return false;
  const actual = await derive(password, fromBase64Url(salt), Number(iter));
  return timingSafeEqual(actual, fromBase64Url(hash));
}

/** 密碼規則：至少 10 個字元。回傳錯誤訊息，沒問題時回傳 null */
export function passwordProblem(password: string) {
  if (password.length < 10) return "密碼至少要 10 個字元。";
  if (password.length > 200) return "密碼太長了。";
  return null;
}

/** 不存在的帳號也跑一次雜湊，讓「帳號不存在」和「密碼錯誤」花的時間一樣，無法用回應時間猜帳號 */
export async function dummyVerify(password: string) {
  await derive(password, new Uint8Array(SALT_BYTES), ITERATIONS);
}
