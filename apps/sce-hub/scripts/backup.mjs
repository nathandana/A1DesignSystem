import { DatabaseSync } from "node:sqlite";
import { resolve, dirname } from "node:path";
import { mkdirSync, chmodSync } from "node:fs";
const source = resolve(
  process.env.SCE_DATA_DIR || new URL("../data", import.meta.url).pathname,
  "workspace.sqlite",
);
const target = resolve(
  process.argv[2] ||
    new URL(
      `../data/backups/workspace-${new Date().toISOString().replaceAll(":", "-")}.sqlite`,
      import.meta.url,
    ).pathname,
);
mkdirSync(dirname(target), { recursive: true, mode: 0o700 });
const db = new DatabaseSync(source);
db.exec(`VACUUM INTO '${target.replaceAll("'", "''")}'`);
db.close();
chmodSync(target, 0o600);
console.log(
  `Consistent database backup saved to ${target}. Treat it as confidential; it includes accounts and report files.`,
);
