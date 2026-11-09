/**
 * 建立後台帳號，或重設既有帳號的密碼。後台沒有公開的註冊頁，帳號一律用這支指令建立。
 *
 *   npm run admin:create -- <email> [--name 名稱] [--env local|staging|production]
 *
 * 執行後會要求輸入密碼（不會顯示在畫面上，也不會留在指令歷史裡）。
 * --env 預設 local（本地開發用的 D1）。
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { hashPassword, passwordProblem } from "../lib/auth/password";

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const out = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
    out._writeToOutput = (s: string) => {
      if (s.includes(question)) out.output.write(s);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const name = arg("name") ?? "";
  const env = arg("env") ?? "local";
  if (!email || email.startsWith("--") || !email.includes("@")) {
    console.error("用法：npm run admin:create -- <email> [--name 名稱] [--env local|staging|production]");
    process.exit(1);
  }
  if (!["local", "staging", "production"].includes(env)) {
    console.error("--env 只能是 local、staging 或 production");
    process.exit(1);
  }

  const password = process.env.ADMIN_PASSWORD ?? (await askHidden("密碼（至少 10 個字元）："));
  const problem = passwordProblem(password);
  if (problem) {
    console.error(problem);
    process.exit(1);
  }
  if (!process.env.ADMIN_PASSWORD && (await askHidden("再輸入一次：")) !== password) {
    console.error("兩次輸入的密碼不一樣。");
    process.exit(1);
  }

  const hash = await hashPassword(password);
  const now = Math.floor(Date.now() / 1000);
  const q = (s: string) => `'${s.replaceAll("'", "''")}'`;
  const sql =
    `INSERT INTO admins (email, name, password_hash, failed_attempts, locked_until, created_at, updated_at) ` +
    `VALUES (${q(email)}, ${q(name)}, ${q(hash)}, 0, NULL, ${now}, ${now}) ` +
    `ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, failed_attempts = 0, locked_until = NULL, updated_at = excluded.updated_at` +
    (name ? `, name = excluded.name` : "") +
    `;\nDELETE FROM sessions WHERE admin_id = (SELECT id FROM admins WHERE email = ${q(email)});\n`;

  // 密碼雜湊寫進暫存檔再交給 wrangler 執行，執行完立即刪除
  const dir = mkdtempSync(join(tmpdir(), "sv-admin-"));
  const file = join(dir, "admin.sql");
  writeFileSync(file, sql);
  const target = env === "local" ? ["--local"] : env === "staging" ? ["--remote", "--env", "staging"] : ["--remote", "--env="];
  try {
    execFileSync("npx", ["wrangler", "d1", "execute", "DB", ...target, `--file=${file}`], { stdio: ["ignore", "ignore", "inherit"] });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(`已建立／更新帳號 ${email}（${env}）。這個帳號原本的登入都已登出。`);
}

main();
