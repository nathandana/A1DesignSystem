import pg from "pg";
import ca from "./supabase-ca.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

// SQL stays server-owned. Values use PostgreSQL parameters; the app role only owns sce.
export function openPostgresStore({
  connectionString,
  storage,
  schema = "sce",
  pool: suppliedPool,
}) {
  if (!/^[a-z][a-z0-9_]*$/.test(schema))
    throw new Error("Invalid database schema.");
  const pool =
    suppliedPool ||
    new pg.Pool({
      connectionString,
      max: 1,
      ssl: { ca, rejectUnauthorized: true },
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 20000,
    });
  const scope = new AsyncLocalStorage();
  function sql(text) {
    let index = 0;
    return text
      .replace(/\?/g, () => `$${++index}`)
      .replace(/length\(a\.bytes\)/g, "a.size")
      .replace(
        /\b(?:users|sessions|records|revisions|attachments)\b/g,
        (name, offset, source) =>
          source[offset - 1] === "." ? name : `${schema}.${name}`,
      );
  }
  async function query(text, values = []) {
    return (scope.getStore() || pool).query(sql(text), values);
  }
  const db = {
    prepare(text) {
      return {
        async all(...values) {
          return (await query(text, values)).rows;
        },
        async get(...values) {
          return (await query(text, values)).rows[0];
        },
        async run(...values) {
          if (text === "INSERT INTO attachments VALUES (?,?,?,?,?,?,?,?)") {
            const [
              id,
              reportId,
              name,
              mime,
              bytes,
              extracted,
              indexing,
              created,
            ] = values;
            const key = `${reportId}/${id}.pdf`;
            await storage.put(key, bytes);
            try {
              return await query(
                "INSERT INTO attachments (id,report_id,name,mime,storage_key,size,extracted_text,indexing_status,created_at) VALUES (?,?,?,?,?,?,?,?,?)",
                [
                  id,
                  reportId,
                  name,
                  mime,
                  key,
                  bytes.length,
                  extracted,
                  indexing,
                  created,
                ],
              );
            } catch (error) {
              await storage.remove(key).catch(() => {});
              throw error;
            }
          }
          return query(text, values);
        },
      };
    },
    close: () => pool.end(),
  };
  async function transactionAsync(fn) {
    if (scope.getStore()) return fn();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await scope.run(client, fn);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  async function get(id) {
    const row = await db
      .prepare("SELECT payload FROM records WHERE id=? AND deleted=0")
      .get(id);
    return row ? JSON.parse(row.payload) : null;
  }
  async function all() {
    return (
      await db
        .prepare(
          "SELECT payload FROM records WHERE deleted=0 ORDER BY updated_at DESC,id",
        )
        .all()
    ).map((r) => JSON.parse(r.payload));
  }
  async function save(input, actor, reason, _action, expectedRevision) {
    return transactionAsync(async () => {
      const id = input.id || randomUUID();
      // Also lock absent IDs so parallel creates cannot overwrite each other.
      await query("SELECT pg_advisory_xact_lock(hashtextextended(?,0))", [
        `${schema}:${id}`,
      ]);
      const before = await get(id);
      if (
        expectedRevision !== undefined &&
        before?.revision !== expectedRevision
      )
        throw Object.assign(
          new Error("This record changed. Reload it before saving."),
          { status: 409 },
        );
      const now = new Date().toISOString();
      const after = {
        ...input,
        id,
        revision: (before?.revision || 0) + 1,
        createdAt: before?.createdAt || now,
        updatedAt: now,
      };
      const payload = JSON.stringify(after);
      await query(
        "INSERT INTO records VALUES (?,?,?,?,?,?,0) ON CONFLICT(id) DO UPDATE SET revision=excluded.revision,payload=excluded.payload,updated_at=excluded.updated_at,deleted=0",
        [id, after.kind, after.dataset, after.revision, payload, now],
      );
      await query("INSERT INTO revisions VALUES (?,?,?,?,?,?)", [
        id,
        after.revision,
        payload,
        actor,
        reason,
        now,
      ]);
      return after;
    });
  }
  async function remove(id, actor, reason, revision) {
    return transactionAsync(async () => {
      const current = await get(id);
      if (!current)
        throw Object.assign(new Error("Record not found."), { status: 404 });
      const saved = await save(
        { ...current, deleted: true },
        actor,
        reason,
        "deleted",
        revision,
      );
      await query("UPDATE records SET deleted=1 WHERE id=?", [id]);
      if (current.kind === "node")
        for (const edge of (await all()).filter(
          (r) => r.kind === "edge" && (r.from === id || r.to === id),
        )) {
          await save(
            { ...edge, deleted: true },
            actor,
            "Removed with its node.",
            "deleted",
            edge.revision,
          );
          await query("UPDATE records SET deleted=1 WHERE id=?", [edge.id]);
        }
      return saved;
    });
  }
  return {
    db,
    get,
    all,
    save,
    remove,
    transactionAsync,
    readAttachment: (a) => storage.get(a.storage_key),
  };
}
