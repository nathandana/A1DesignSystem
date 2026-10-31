import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdirSync, chmodSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
export function openStore(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(resolve(directory, "workspace.sqlite"));
  chmodSync(resolve(directory, "workspace.sqlite"), 0o600);
  db.exec(
    readFileSync(
      new URL("./migrations/001-workspace.sql", import.meta.url),
      "utf8",
    ),
  );
  db.exec("PRAGMA busy_timeout = 5000");
  const get = (id) => {
    const row = db
      .prepare("SELECT payload FROM records WHERE id=? AND deleted=0")
      .get(id);
    return row ? JSON.parse(row.payload) : null;
  };
  const all = () =>
    db
      .prepare(
        "SELECT payload FROM records WHERE deleted=0 ORDER BY updated_at DESC, id",
      )
      .all()
      .map((r) => JSON.parse(r.payload));
  function transaction(fn) {
    db.exec("BEGIN IMMEDIATE");
    try {
      const result = fn();
      db.exec("COMMIT");
      return result;
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
  async function transactionAsync(fn) {
    db.exec("BEGIN IMMEDIATE");
    try {
      const result = await fn();
      db.exec("COMMIT");
      return result;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
  function save(
    input,
    actor,
    reason,
    _action = "edited", // Retained positional argument for existing callers; no activity log.
    expectedRevision,
    nested = false,
  ) {
    const work = () => {
      const id = input.id || randomUUID(),
        before = get(id);
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
      const json = JSON.stringify(after);
      db.prepare(
        "INSERT INTO records VALUES (?,?,?,?,?,?,0) ON CONFLICT(id) DO UPDATE SET revision=excluded.revision,payload=excluded.payload,updated_at=excluded.updated_at,deleted=0",
      ).run(id, after.kind, after.dataset, after.revision, json, now);
      db.prepare("INSERT INTO revisions VALUES (?,?,?,?,?,?)").run(
        id,
        after.revision,
        json,
        actor,
        reason,
        now,
      );
      return after;
    };
    return nested ? work() : transaction(work);
  }
  function remove(id, actor, reason, revision) {
    return transaction(() => {
      const current = get(id);
      if (!current)
        throw Object.assign(new Error("Record not found."), { status: 404 });
      const saved = save(
        { ...current, deleted: true },
        actor,
        reason,
        "deleted",
        revision,
        true,
      );
      db.prepare("UPDATE records SET deleted=1 WHERE id=?").run(id);
      if (current.kind === "node")
        for (const edge of all().filter(
          (r) => r.kind === "edge" && (r.from === id || r.to === id),
        )) {
          save(
            { ...edge, deleted: true },
            actor,
            "Removed with its node.",
            "deleted",
            undefined,
            true,
          );
          db.prepare("UPDATE records SET deleted=1 WHERE id=?").run(edge.id);
        }
      return saved;
    });
  }
  return { db, get, all, transaction, transactionAsync, save, remove };
}
