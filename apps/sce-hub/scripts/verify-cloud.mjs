import assert from "node:assert/strict";
import { randomBytes, createHash, randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { createApp } from "../server/app.mjs";
import { cloudServices } from "../server/cloud.mjs";
const services = cloudServices(),
  { store } = services;
const app = createApp({
  ...services,
  origin: "http://localhost",
  production: false,
});
await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
const base =
  process.env.SCE_VERIFY_URL || `http://127.0.0.1:${app.server.address().port}`;
const token = randomBytes(32).toString("hex"),
  hash = createHash("sha256").update(token).digest("hex");
const created = [],
  rollbackId = `verify-${randomUUID()}`;
async function request(
  path,
  data,
  method = data ? "POST" : "GET",
  authenticated = true,
) {
  const r = await fetch(`${base}/api${path}`, {
    method,
    headers: {
      Origin: process.env.SCE_VERIFY_URL
        ? "https://sce.a1design.app"
        : "http://localhost",
      ...(authenticated ? { Cookie: `sce_session=${token}` } : {}),
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return {
    status: r.status,
    body: r.headers.get("content-type")?.includes("json")
      ? await r.json()
      : Buffer.from(await r.arrayBuffer()),
  };
}
try {
  await store.db
    .prepare("INSERT INTO sessions VALUES (?,?,?)")
    .run(hash, process.env.SCE_SUPABASE_OWNER_ID, Date.now() + 300000);
  assert.equal(
    (await request("/workspace", undefined, "GET", false)).status,
    401,
  );
  const workspace = await request("/workspace");
  assert.equal(workspace.status, 200);
  assert.ok(workspace.body.records.length > 800);
  assert.equal(workspace.body.activity, undefined);
  assert.equal((await request("/session")).body.user.role, "owner");
  const a = workspace.body.attachments[0];
  const pdf = await request(`/attachments/${a.id}`);
  assert.equal(pdf.status, 200);
  const local = new DatabaseSync(
    new URL("../data/workspace.sqlite", import.meta.url).pathname,
    { readOnly: true },
  );
  const original = local
    .prepare("SELECT bytes FROM attachments WHERE id=?")
    .get(a.id);
  local.close();
  assert.deepEqual(pdf.body, Buffer.from(original.bytes));
  const search = await request("/search?q=accessibility");
  assert.equal(search.status, 200);
  assert.ok(search.body.results.length);
  const record = await request("/records", {
    kind: "guideline",
    dataset: "demo",
    title: `Deployment check ${randomUUID()}`,
    original: "Temporary deployment verification.",
    tags: [],
  });
  assert.equal(record.status, 201);
  created.push(record.body.id);
  const revisions = await Promise.all(
    ["Approved", "Rejected"].map((status) =>
      request(`/records/${record.body.id}/review`, {
        revision: record.body.revision,
        status,
      }),
    ),
  );
  assert.deepEqual(revisions.map((r) => r.status).sort(), [200, 409]);
  assert.equal(
    (await request(`/records/${record.body.id}/history`)).body.length,
    2,
  );
  await assert.rejects(
    store.transactionAsync(async () => {
      await store.save(
        {
          id: rollbackId,
          kind: "initiative",
          dataset: "demo",
          title: "Rolled back",
        },
        "Verification",
        "Rollback test",
      );
      throw new Error("Rollback");
    }),
    /Rollback/,
  );
  assert.equal(await store.get(rollbackId), null);
  const exported = await request("/export");
  assert.equal(exported.status, 200);
  assert.ok(exported.body.revisions.length);
  assert.equal(exported.body.users, undefined);
  console.log(
    JSON.stringify({
      target: process.env.SCE_VERIFY_URL || "Supabase-backed local API",
      records: workspace.body.records.length,
      pdfBytes: pdf.body.length,
      checks: [
        "private access",
        "session",
        "workspace",
        "search",
        "byte-identical PDF",
        "concurrent stale write",
        "revision history",
        "transaction rollback",
        "export",
      ],
    }),
  );
} finally {
  for (const id of [...created, rollbackId]) {
    await store.db.prepare("DELETE FROM revisions WHERE record_id=?").run(id);
    await store.db.prepare("DELETE FROM records WHERE id=?").run(id);
  }
  await store.db.prepare("DELETE FROM sessions WHERE token_hash=?").run(hash);
  await new Promise((r) => app.server.close(r));
  await store.db.close();
}
