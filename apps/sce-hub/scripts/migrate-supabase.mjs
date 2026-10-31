import { DatabaseSync } from "node:sqlite";
import { resolve } from "node:path";
import { cloudServices } from "../server/cloud.mjs";
const local = new DatabaseSync(
  resolve(
    process.argv[2] ||
      new URL("../data/workspace.sqlite", import.meta.url).pathname,
  ),
  { readOnly: true },
);
const { store } = cloudServices();
try {
  const count = await store.db
    .prepare("SELECT count(*) AS count FROM records")
    .get();
  if (Number(count.count) !== 0)
    throw new Error(
      "Cloud records already exist. Refusing to overwrite live data.",
    );
  const records = local.prepare("SELECT * FROM records").all(),
    revisions = local.prepare("SELECT * FROM revisions").all(),
    attachments = local.prepare("SELECT * FROM attachments").all(),
    users = local.prepare("SELECT * FROM users").all();
  await store.transactionAsync(async () => {
    for (const [table, rows] of [
      ["users", users],
      ["records", records],
      ["revisions", revisions],
    ]) {
      if (rows.length)
        await store.db
          .prepare(
            `INSERT INTO ${table} SELECT * FROM json_populate_recordset(NULL::sce.${table},?::json)`,
          )
          .run(JSON.stringify(rows));
    }
    for (const a of attachments)
      await store.db
        .prepare("INSERT INTO attachments VALUES (?,?,?,?,?,?,?,?)")
        .run(
          a.id,
          a.report_id,
          a.name,
          a.mime,
          Buffer.from(a.bytes),
          a.extracted_text,
          a.indexing_status,
          a.created_at,
        );
    await store.db
      .prepare(
        "INSERT INTO users VALUES (?,?,?,?,?) ON CONFLICT(id) DO NOTHING",
      )
      .run(
        process.env.SCE_SUPABASE_OWNER_ID,
        "nathan.dana@gmail.com",
        "Nathan Dana",
        "owner",
        "supabase",
      );
  });
  console.log(
    JSON.stringify({
      records: records.length,
      revisions: revisions.length,
      attachments: attachments.length,
      owner: "Existing A1 Supabase account",
      activity: "Not migrated; local archives preserved",
    }),
  );
} finally {
  local.close();
  await store.db.close();
}
