import { createServer } from "node:http";
import { gzipSync } from "node:zlib";
import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { readFile, stat, mkdtemp, writeFile, rm } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { seedDemo } from "./demo.mjs";
import {
  statuses,
  readiness,
  nodeTypes,
  relationships,
  kinds,
  groups,
  parseImport,
  textOf,
  nyDate,
  weekDates,
  safeUrl,
} from "../src/model.mjs";
const execute = promisify(execFile);
const hash = (s) => createHash("sha256").update(s).digest("hex");
const fail = (status, message) => {
  throw Object.assign(new Error(message), {
    status,
  });
};
function passwordHash(password, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
function passwordMatches(password, stored) {
  const [salt] = stored.split(":");
  return timingSafeEqual(
    Buffer.from(passwordHash(password, salt)),
    Buffer.from(stored),
  );
}
function cleanUser(u) {
  return (
    u && {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    }
  );
}
function requireRole(user, allowed) {
  if (!allowed.includes(user?.role))
    fail(403, "Your role does not allow this action.");
}
function validateRecord(r) {
  if (!kinds.includes(r.kind) || !["sce", "demo"].includes(r.dataset))
    fail(400, "Invalid record type or collection.");
  if (typeof r.title !== "string" || !r.title.trim() || r.title.length > 500)
    fail(400, "A title of 1–500 characters is required.");
  for (const key of [
    "original",
    "proposed",
    "rationale",
    "body",
    "summary",
    "owner",
    "sourceUrl",
    "sourceVersion",
    "nodeRef",
    "enforcement",
    "recommendation",
    "severity",
    "confidence",
    "version",
    "reviewDate",
  ])
    if (
      r[key] !== undefined &&
      (typeof r[key] !== "string" ||
        r[key].length >
          (key === "original" && r.kind === "source" ? 1000000 : 200000))
    )
      fail(400, `Invalid ${key}.`);
  if (r.sourceUrl && !safeUrl(r.sourceUrl))
    fail(400, "Source links must use HTTP or HTTPS.");
  for (const key of ["tags", "links", "readiness"])
    if (
      r[key] !== undefined &&
      (!Array.isArray(r[key]) ||
        r[key].length > 100 ||
        r[key].some((x) => typeof x !== "string" || x.length > 500))
    )
      fail(400, `Invalid ${key}.`);
  if (r.tags?.some((t) => !groups.some((g) => t.startsWith(`${g}:`))))
    fail(400, "Every tag needs a supported group.");
  if (
    r.kind === "guideline" &&
    (typeof r.original !== "string" ||
      !r.original.trim() ||
      (r.status !== null && !statuses.includes(r.status)) ||
      r.readiness?.some((x) => !readiness.includes(x)))
  )
    fail(400, "Invalid guideline text, status or AI-readiness classification.");
  if (
    r.kind === "node" &&
    (!nodeTypes.includes(r.type) ||
      !Number.isFinite(r.x) ||
      !Number.isFinite(r.y) ||
      Math.abs(r.x) > 100000 ||
      Math.abs(r.y) > 100000)
  )
    fail(400, "Choose a node type and valid positions.");
  if (
    r.kind === "edge" &&
    (!relationships.includes(r.relation) ||
      !["Confirmed", "Proposed", "Uncertain"].includes(r.confidence) ||
      r.from === r.to)
  )
    fail(400, "Choose two different nodes, a relationship and confidence.");
  if (r.kind === "weekly" && !["Draft", "Published"].includes(r.status))
    fail(400, "Notes must be Draft or Published.");
  return r;
}
const editable = [
  "title",
  "original",
  "proposed",
  "rationale",
  "summary",
  "body",
  "owner",
  "tags",
  "links",
  "readiness",
  "enforcement",
  "sourceUrl",
  "sourceVersion",
  "nodeRef",
  "type",
  "x",
  "y",
  "from",
  "to",
  "relation",
  "confidence",
  "severity",
  "recommendation",
  "version",
  "reviewDate",
  "featured",
  "filters",
];
function pick(input, keys) {
  return Object.fromEntries(
    keys.filter((k) => input[k] !== undefined).map((k) => [k, input[k]]),
  );
}
function publicRecords(records) {
  const visible = records.filter(
    (r) =>
      r.kind !== "release" &&
      r.dataset === "demo" &&
      r.shareApproved === true &&
      !r.needsReview &&
      (r.kind !== "guideline" || r.status === "Approved") &&
      (r.kind !== "weekly" || r.status === "Published") &&
      !["source", "report", "finding", "view"].includes(r.kind),
  );
  const ids = new Set(visible.map((r) => r.id));
  return visible
    .filter((r) => r.kind !== "edge" || (ids.has(r.from) && ids.has(r.to)))
    .map((r) => ({
      ...pick(r, [
        "id",
        "kind",
        "dataset",
        "title",
        "original",
        "proposed",
        "summary",
        "body",
        "status",
        "tags",
        "readiness",
        "type",
        "x",
        "y",
        "from",
        "to",
        "relation",
        "confidence",
        "version",
        "updatedAt",
      ]),
      links: (r.links || []).filter((id) => ids.has(id)),
    }));
}
export function createApp({
  directory,
  openStore,
  store: providedStore,
  externalAuth,
  maxUploadBytes = 20 * 1024 * 1024,
  origin = "http://127.0.0.1:5190",
  production = false,
  dist,
  publicDemo = false,
  localAccess = false,
  pdfCommand = "pdftotext",
}) {
  if (
    localAccess &&
    (production ||
      !["127.0.0.1", "localhost", "[::1]"].includes(new URL(origin).hostname))
  )
    throw new Error(
      "Password-free local access requires a loopback origin and nonproduction mode.",
    );
  if (production && !origin.startsWith("https://"))
    throw new Error("Production requires an exact HTTPS SCE_ORIGIN.");
  const store = providedStore || openStore(directory),
    { db } = store;
  if (!providedStore) seedDemo(store);
  const attempts = new Map();
  function rateLimit(key) {
    const now = Date.now();
    for (const [k, v] of attempts) if (v.reset < now) attempts.delete(k);
    const a = attempts.get(key) || {
      count: 0,
      reset: now + 15 * 60 * 1000,
    };
    a.count++;
    attempts.set(key, a);
    if (a.count > 15) fail(429, "Too many attempts. Try again in 15 minutes.");
  }
  async function getUser(req) {
    if (
      localAccess &&
      ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(
        req.socket.remoteAddress,
      ) &&
      req.headers.host === new URL(origin).host
    )
      return {
        id: "local-owner",
        name: "Nathan Dana (local)",
        email: "",
        role: "owner",
      };
    const token = req.headers.cookie
      ?.split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("sce_session="))
      ?.slice(12);
    if (!token) return null;
    return await db
      .prepare(
        "SELECT users.* FROM sessions JOIN users ON users.id=sessions.user_id WHERE token_hash=? AND expires>?",
      )
      .get(hash(token), Date.now());
  }
  async function session(res, user) {
    const token = randomBytes(32).toString("hex");
    await db.prepare("DELETE FROM sessions WHERE expires<?").run(Date.now());
    await db
      .prepare("INSERT INTO sessions VALUES (?,?,?)")
      .run(hash(token), user.id, Date.now() + 8 * 60 * 60 * 1000);
    res.setHeader(
      "Set-Cookie",
      `sce_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${production ? "; Secure" : ""}`,
    );
  }
  async function body(req, max = 3 * 1024 * 1024) {
    const chunks = [];
    let length = 0;
    for await (const chunk of req) {
      length += chunk.length;
      if (length > max) fail(413, "This upload is too large.");
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  async function relatedValid(r) {
    for (const id of [
      ...(r.links || []),
      ...(r.kind === "edge" ? [r.from, r.to] : []),
    ]) {
      const target = await store.get(id);
      if (
        !target ||
        target.dataset !== r.dataset ||
        (r.kind === "edge" &&
          target.kind !== "node" &&
          [r.from, r.to].includes(id))
      )
        fail(400, "Linked records must exist in the same collection.");
    }
  }
  const handle = async (req, res) => {
    res.setHeader("Cache-Control", "no-store, private");
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
    );
    const json = (status, data) => {
      const raw = Buffer.from(JSON.stringify(data));
      const compressed = raw.length > 256 * 1024;
      const bytes = compressed ? gzipSync(raw) : raw;
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": bytes.length,
        ...(compressed ? { "Content-Encoding": "gzip" } : {}),
      });
      res.end(bytes);
    };
    try {
      const url = new URL(req.url, origin),
        path = url.pathname,
        method = req.method;
      const mutation = !["GET", "HEAD"].includes(method);
      if (mutation && req.headers.origin !== origin)
        fail(
          403,
          "Request origin was not accepted. Reload the workspace at its configured address.",
        );
      const user = await getUser(req);
      if (path === "/api/session" && method === "GET")
        return json(200, {
          user: cleanUser(user),
          localAccess: localAccess && user?.id === "local-owner",
          authProvider: externalAuth ? "supabase" : "local",
          managedAuth: user?.password_hash === "supabase",
          maxUploadBytes,
          setupRequired:
            !externalAuth &&
            !localAccess &&
            !(await db.prepare("SELECT 1 FROM users LIMIT 1").get()),
          setupAllowed: !production,
          visibility: localAccess
            ? "Local workspace · no sign-in"
            : "Private workspace",
          publicDemo,
          ai: "Unavailable — no external provider configured",
        });
      if (["/api/setup", "/api/login"].includes(path) && method === "POST") {
        rateLimit(req.socket.remoteAddress);
        const input = JSON.parse((await body(req, 10000)).toString());
        if (
          typeof input.email !== "string" ||
          typeof input.password !== "string" ||
          input.password.length > 256
        )
          fail(400, "Enter an email and password.");
        const email = input.email.trim().toLowerCase();
        let account;
        if (path === "/api/setup") {
          if (
            production ||
            !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(
              req.socket.remoteAddress,
            ) ||
            (await db.prepare("SELECT 1 FROM users LIMIT 1").get())
          )
            fail(
              403,
              "Initial setup is available only on this computer before an owner exists.",
            );
          account = await createUser({
            ...input,
            email,
            role: "owner",
          });
        } else {
          account = await db
            .prepare("SELECT * FROM users WHERE email=?")
            .get(email);
          const verified =
            account?.password_hash === "supabase"
              ? externalAuth &&
                (await externalAuth(email, input.password))?.id === account.id
              : account &&
                passwordMatches(input.password, account.password_hash);
          if (!verified) fail(401, "The email or password was not recognized.");
        }
        await session(res, account);
        return json(200, {
          user: cleanUser(account),
        });
      }
      if (path === "/api/logout" && method === "POST") {
        const token = req.headers.cookie?.match(/sce_session=([^;]+)/)?.[1];
        if (token)
          await db
            .prepare("DELETE FROM sessions WHERE token_hash=?")
            .run(hash(token));
        res.setHeader(
          "Set-Cookie",
          `sce_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${production ? "; Secure" : ""}`,
        );
        return json(200, {
          ok: true,
        });
      }
      if (path === "/api/public" && method === "GET") {
        if (!publicDemo) fail(404, "No public demonstration has been enabled.");
        return json(200, {
          records: publicRecords(await store.all()),
        });
      }
      if (path.startsWith("/api/")) {
        if (!user) fail(401, "Sign in to access this private workspace.");
        const actor = user.name;
        const dataset =
          url.searchParams.get("dataset") === "demo" ? "demo" : "sce";
        if (path === "/api/workspace" && method === "GET") {
          const all = await store.all();
          const recordById = new Map(all.map((r) => [r.id, r]));
          return json(200, {
            records: all
              .filter((r) => r.dataset === dataset && r.kind !== "release")
              .map((r) => ({
                ...r,
                links: (r.links || []).filter(
                  (id) => recordById.get(id)?.kind !== "release",
                ),
              })),
            attachments: await db
              .prepare(
                "SELECT a.id,a.report_id,a.name,a.mime,length(a.bytes) AS size,a.indexing_status,a.created_at FROM attachments a JOIN records r ON r.id=a.report_id WHERE r.dataset=? AND r.deleted=0",
              )
              .all(dataset),
          });
        }
        if (path === "/api/visitor" && method === "GET") {
          requireRole(user, ["owner"]);
          return json(200, {
            enabled: publicDemo,
            records: publicRecords(await store.all()),
          });
        }
        if (path === "/api/users" && method === "GET") {
          requireRole(user, ["owner"]);
          return json(
            200,
            await db
              .prepare("SELECT id,name,email,role FROM users ORDER BY name")
              .all(),
          );
        }
        if (path === "/api/users" && method === "POST") {
          requireRole(user, ["owner"]);
          const input = JSON.parse((await body(req, 10000)).toString());
          if (!["editor", "reviewer", "viewer"].includes(input.role))
            fail(400, "Choose editor, reviewer or viewer.");
          return json(201, cleanUser(await createUser(input)));
        }
        if (path === "/api/users" && method === "DELETE") {
          requireRole(user, ["owner"]);
          const input = JSON.parse((await body(req)).toString());
          const target = await db
            .prepare("SELECT role FROM users WHERE id=?")
            .get(input.id);
          if (!target || target.role === "owner")
            fail(400, "Only collaborator accounts can be removed.");
          await db.prepare("DELETE FROM users WHERE id=?").run(input.id);
          return json(200, {
            ok: true,
          });
        }
        if (path === "/api/password" && method === "POST") {
          if (user.password_hash === "supabase")
            fail(400, "Manage this password in your A1 account.");
          const input = JSON.parse((await body(req, 10000)).toString());
          if (
            typeof input.current !== "string" ||
            !passwordMatches(input.current, user.password_hash)
          )
            fail(403, "Current password was not recognized.");
          checkPassword(input.password);
          await db
            .prepare("UPDATE users SET password_hash=? WHERE id=?")
            .run(passwordHash(input.password), user.id);
          await db.prepare("DELETE FROM sessions WHERE user_id=?").run(user.id);
          await session(res, user);
          return json(200, {
            ok: true,
          });
        }
        if (path === "/api/search" && method === "GET") {
          const q = (url.searchParams.get("q") || "").trim().toLowerCase();
          let records = (await store.all()).filter(
            (r) => r.dataset === dataset && r.kind !== "release",
          );
          const ids = new Set(records.map((r) => r.id)),
            attachments = (
              await db
                .prepare("SELECT report_id,extracted_text FROM attachments")
                .all()
            ).filter((a) => ids.has(a.report_id));
          const results = records
            .map((r) => {
              const linked =
                r.kind === "edge"
                  ? `${records.find((n) => n.id === r.from)?.title || ""} ${records.find((n) => n.id === r.to)?.title || ""}`
                  : "";
              return {
                r,
                text: `${textOf(r)}\n${linked}\n${attachments
                  .filter((a) => a.report_id === r.id)
                  .map((a) => a.extracted_text)
                  .join("\n")}`,
              };
            })
            .filter(
              ({ r, text }) =>
                (!q || text.toLowerCase().includes(q)) &&
                (!url.searchParams.get("kind") ||
                  r.kind === url.searchParams.get("kind")) &&
                (!url.searchParams.get("status") ||
                  (r.status || "Unreviewed") ===
                    url.searchParams.get("status")) &&
                (!url.searchParams.get("owner") ||
                  (r.owner || "")
                    .toLowerCase()
                    .includes(url.searchParams.get("owner").toLowerCase())) &&
                (!url.searchParams.get("tag") ||
                  r.tags?.includes(url.searchParams.get("tag"))) &&
                (!url.searchParams.get("since") ||
                  nyDate(new Date(r.updatedAt)) >=
                    url.searchParams.get("since")),
            )
            .slice(0, 100)
            .map(({ r, text }) => {
              const start = Math.max(0, text.toLowerCase().indexOf(q) - 60);
              return {
                id: r.id,
                kind: r.kind,
                title: r.title,
                status: r.status,
                snippet: text.slice(start, start + 260),
              };
            });
          return json(200, {
            results,
            coverage: {
              records: records.length,
              pdfs: await db
                .prepare(
                  "SELECT indexing_status, count(*) AS count FROM attachments a JOIN records r ON r.id=a.report_id WHERE r.dataset=? AND r.deleted=0 GROUP BY indexing_status",
                )
                .all(dataset),
            },
          });
        }
        if (path === "/api/ask")
          return json(503, {
            error:
              "No AI provider is configured. Search remains available. No source content has been sent to an external AI provider.",
          });
        if (path === "/api/export-approved" && method === "POST") {
          const input = JSON.parse((await body(req)).toString());
          if (
            !Array.isArray(input.ids) ||
            !input.ids.length ||
            input.ids.length > 500
          )
            fail(400, "Select 1–500 approved guidelines.");
          const records = await Promise.all(
            input.ids.map(async (id) => await store.get(id)),
          );
          if (
            records.some(
              (r) =>
                !r ||
                r.kind !== "guideline" ||
                r.status !== "Approved" ||
                r.needsReview,
            )
          )
            fail(
              409,
              "Every selected guideline must have a current approval. Refresh the selection.",
            );
          return json(200, {
            exportedAt: new Date().toISOString(),
            records: records.map((r) =>
              pick(r, [
                "id",
                "title",
                "original",
                "proposed",
                "rationale",
                "status",
                "revision",
                "tags",
                "readiness",
                "enforcement",
                "sourceUrl",
                "nodeRef",
                "sourceVersion",
              ]),
            ),
          });
        }
        if (path === "/api/export" && method === "GET") {
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="sce-workspace.json"',
          );
          return json(200, {
            schemaVersion: 1,
            exportedAt: new Date().toISOString(),
            dataset,
            records: (await store.all()).filter((r) => r.dataset === dataset),
            revisions: (
              await db
                .prepare(
                  "SELECT v.* FROM revisions v JOIN records r ON r.id=v.record_id WHERE r.dataset=?",
                )
                .all(dataset)
            ).map((v) => ({
              ...v,
              payload: JSON.parse(v.payload),
            })),
            note: "Attachments are downloaded separately from their protected report. Passwords and sessions are excluded.",
          });
        }
        if (path === "/api/import" && method === "POST") {
          requireRole(user, ["owner", "editor"]);
          const input = JSON.parse((await body(req)).toString()),
            rows = parseImport(input.text, input.format),
            target = input.dataset === "demo" ? "demo" : "sce";
          const existing = (await store.all()).filter(
            (r) => r.kind === "guideline" && r.dataset === target,
          );
          const seen = new Set();
          const preview = rows.map((r) => {
            const fingerprint =
              r.externalId || `${r.sourceUrl}|${r.title}|${r.original}`;
            const duplicate = existing.find((e) =>
              r.externalId
                ? e.externalId === r.externalId
                : e.original === r.original &&
                  e.title === r.title &&
                  e.sourceUrl === r.sourceUrl,
            );
            const repeated = seen.has(fingerprint);
            seen.add(fingerprint);
            return {
              ...r,
              duplicateId: duplicate?.id,
              repeated,
              changed: duplicate && duplicate.original !== r.original,
            };
          });
          if (!input.commit)
            return json(200, {
              rows: preview,
            });
          if (!["skip", "update"].includes(input.duplicates))
            fail(400, "Choose skip duplicates or revise matching sources.");
          const saved = await store.transactionAsync(async () => {
            const result = [];
            for (const r of preview.filter((r) => !r.repeated)) {
              const { duplicateId, changed, repeated, ...record } = r;
              if (duplicateId) {
                if (input.duplicates === "skip" || !changed) continue;
                const old = await store.get(duplicateId);
                result.push(
                  await store.save(
                    {
                      ...old,
                      original: record.original,
                      sourceVersion: record.sourceVersion,
                      importedAt: new Date().toISOString(),
                      needsReview: true,
                      shareApproved: false,
                    },
                    actor,
                    "Source revised by import; prior decisions retained.",
                    "source imported",
                    old.revision,
                    true,
                  ),
                );
              } else {
                result.push(
                  await store.save(
                    {
                      ...record,
                      dataset: target,
                      importedAt: new Date().toISOString(),
                    },
                    actor,
                    "Imported for review; not approved.",
                    "imported",
                    undefined,
                    true,
                  ),
                );
              }
            }
            return result;
          });
          return json(200, {
            count: saved.length,
            skipped: rows.length - saved.length,
          });
        }
        if (path === "/api/weekly" && method === "POST") {
          requireRole(user, ["owner", "editor"]);
          const input = JSON.parse((await body(req)).toString()),
            target = input.dataset === "demo" ? "demo" : "sce",
            week = weekDates(input.date);
          const updatedRecords = (await store.all()).filter((record) => {
            const date = nyDate(new Date(record.updatedAt));
            return (
              record.dataset === target &&
              !["weekly", "release", "view"].includes(record.kind) &&
              date >= week.start &&
              date < week.end
            );
          });
          const links = updatedRecords.slice(0, 100).map((record) => record.id);
          const bodyText = `## Records updated (${week.start} through ${new Date(new Date(week.end).getTime() - 86400000).toISOString().slice(0, 10)}, America/New_York)
${
  updatedRecords
    .slice(0, 100)
    .map((record) => `- ${record.title} [${record.id}]`)
    .join("\n") || "No current records were last updated in this week."
}

## Evidence
Linked records reflect their current state and latest update date, not a complete history of work during this week. Records updated again later will no longer appear in a newly generated draft for this week. Up to 100 records are linked.

## Blockers and next steps
Add your assessment before publishing.

## Demonstrated outcomes
No measured business outcomes are inferred from record counts.`;
          return json(
            201,
            await store.save(
              {
                kind: "weekly",
                dataset: target,
                title: `Week of ${week.start}`,
                summary: `${updatedRecords.length} current records last updated this week. Editable draft; review before sharing.`,
                body: bodyText,
                status: "Draft",
                owner: actor,
                week: week.start,
                links,
              },
              actor,
              "Generated on demand from current records last updated in the selected week.",
              "weekly drafted",
            ),
          );
        }
        if (path === "/api/bulk" && method === "POST") {
          const input = JSON.parse((await body(req)).toString());
          requireRole(
            user,
            input.status
              ? ["owner", "editor", "reviewer"]
              : ["owner", "editor"],
          );
          if (
            !Array.isArray(input.items) ||
            !input.items.length ||
            input.items.length > 500 ||
            !input.reason?.trim()
          )
            fail(400, "Select up to 500 guidelines and provide a reason.");
          if (input.status && !statuses.includes(input.status))
            fail(400, "Choose an allowed decision status.");
          const records = await Promise.all(
            input.items.map(async (item) => {
              const r = await store.get(item.id);
              if (!r || r.kind !== "guideline" || r.revision !== item.revision)
                fail(
                  409,
                  "A selected guideline changed. Reload before continuing.",
                );
              return r;
            }),
          );
          const saved = await store.transactionAsync(async () => {
            const result = [];
            for (const r of records) {
              const next = input.status
                ? decision(r, input.status, input.reason, actor)
                : {
                    ...r,
                    tags: [
                      ...new Set([...(r.tags || []), ...(input.tags || [])]),
                    ],
                  };
              validateRecord(next);
              result.push(
                await store.save(
                  next,
                  actor,
                  input.reason,
                  input.status ? "decision" : "bulk tagged",
                  r.revision,
                  true,
                ),
              );
            }
            return result;
          });
          return json(200, {
            count: saved.length,
          });
        }
        if (path === "/api/records" && method === "POST") {
          requireRole(user, ["owner", "editor"]);
          const input = JSON.parse((await body(req)).toString());
          const r = {
            ...pick(input, editable),
            kind: input.kind,
            dataset: input.dataset,
            status:
              input.kind === "guideline"
                ? null
                : input.kind === "weekly"
                  ? "Draft"
                  : undefined,
            comments: [],
            decisions: [],
          };
          validateRecord(r);
          await relatedValid(r);
          return json(
            201,
            await store.save(r, actor, "Created in the workspace.", "created"),
          );
        }
        const match = path.match(
          /^\/api\/records\/([\w-]+)(?:\/(history|decision|review|comment|restore|publish|share))?$/,
        );
        if (match) {
          const [, id, action] = match,
            record = await store.get(id);
          if (!record || record.kind === "release")
            fail(404, "This record is unavailable or has been deleted.");
          if (method === "GET")
            return json(
              200,
              action === "history"
                ? (
                    await db
                      .prepare(
                        "SELECT revision,payload,actor,reason,created_at FROM revisions WHERE record_id=? ORDER BY revision DESC",
                      )
                      .all(id)
                  ).map((v) => ({
                    ...v,
                    payload: JSON.parse(v.payload),
                  }))
                : record,
            );
          const input = JSON.parse((await body(req)).toString());
          if (action === "review") input.reason = "Guideline reviewed.";
          if (!input.reason?.trim())
            fail(400, "Describe why you are making this change.");
          if (input.revision !== record.revision)
            fail(409, "This record changed. Reload it before saving.");
          if (method === "DELETE") {
            requireRole(user, ["owner", "editor"]);
            return json(
              200,
              await store.remove(id, actor, input.reason, input.revision),
            );
          }
          let next = {
              ...record,
            },
            verb = action || "wording edited";
          if (action === "review") {
            requireRole(user, ["owner", "editor", "reviewer"]);
            if (record.kind !== "guideline" || !statuses.includes(input.status))
              fail(400, "Choose an allowed decision.");
            if (input.metadata !== undefined) {
              requireRole(user, ["owner", "editor"]);
              if (
                !input.metadata ||
                typeof input.metadata !== "object" ||
                Array.isArray(input.metadata)
              )
                fail(400, "Choose valid guideline metadata.");
              next = {
                ...record,
                ...pick(input.metadata, ["owner", "tags", "readiness"]),
              };
              next.tags = [...new Set(next.tags || [])];
            }
            next = decision(next, input.status, "", actor);
          } else if (action === "decision") {
            requireRole(user, ["owner", "editor", "reviewer"]);
            if (record.kind !== "guideline" || !statuses.includes(input.status))
              fail(400, "Choose an allowed decision.");
            next = decision(record, input.status, input.reason, actor);
          } else if (action === "comment") {
            requireRole(user, ["owner", "editor", "reviewer"]);
            if (
              typeof input.text !== "string" ||
              !input.text.trim() ||
              input.text.length > 10000
            )
              fail(400, "Enter a comment of up to 10,000 characters.");
            next.comments = [
              ...(record.comments || []),
              {
                id: randomUUID(),
                text: input.text,
                actor,
                at: new Date().toISOString(),
              },
            ];
          } else if (action === "publish") {
            requireRole(user, ["owner", "editor"]);
            if (record.kind !== "weekly")
              fail(400, "Only weekly summaries can be published.");
            next.status = "Published";
            next.publishedAt = new Date().toISOString();
            next.shareApproved = false;
          } else if (action === "share") {
            requireRole(user, ["owner"]);
            if (
              record.dataset !== "demo" ||
              ["source", "report", "finding", "view"].includes(record.kind)
            )
              fail(
                400,
                "Real source material cannot be exposed through the public demo.",
              );
            next.shareApproved = input.approved === true;
            verb = "sharing selection changed";
          } else {
            requireRole(user, ["owner", "editor"]);
            if (action === "restore") {
              const previous = await db
                .prepare(
                  "SELECT payload FROM revisions WHERE record_id=? AND revision=?",
                )
                .get(id, input.restoreRevision);
              if (!previous) fail(404, "Revision not found.");
              next = {
                ...record,
                ...pick(JSON.parse(previous.payload), editable),
              };
              verb = "restored as new revision";
            } else
              next = {
                ...record,
                ...pick(input, editable),
              };
            next.shareApproved = false;
            if (
              record.kind === "guideline" &&
              (next.original !== record.original ||
                next.proposed !== record.proposed)
            )
              next.needsReview = true;
            if (record.kind === "weekly" && record.status === "Published")
              next.status = "Draft";
          }
          validateRecord(next);
          await relatedValid(next);
          return json(
            200,
            await store.save(next, actor, input.reason, verb, input.revision),
          );
        }
        if (path === "/api/attachments" && method === "POST") {
          requireRole(user, ["owner", "editor"]);
          const reportId = url.searchParams.get("report"),
            report = await store.get(reportId);
          if (!report || report.kind !== "report")
            fail(400, "Choose an existing report.");
          const bytes = await body(req, maxUploadBytes);
          if (
            req.headers["content-type"] !== "application/pdf" ||
            bytes.subarray(0, 5).toString() !== "%PDF-" ||
            !bytes.subarray(-2048).toString().includes("%%EOF")
          )
            fail(400, "Choose a valid PDF of up to 20 MB.");
          const name = (url.searchParams.get("name") || "report.pdf")
            .replace(/[^a-zA-Z0-9 ._-]/g, "_")
            .slice(0, 180);
          let extracted = "",
            indexing = "Not indexed — extraction unavailable";
          const dir = await mkdtemp(resolve(tmpdir(), "sce-pdf-"));
          try {
            await writeFile(resolve(dir, "input.pdf"), bytes, {
              mode: 0o600,
            });
            const result = await execute(
              pdfCommand,
              ["-layout", resolve(dir, "input.pdf"), "-"],
              {
                timeout: 15000,
                maxBuffer: 5 * 1024 * 1024,
              },
            );
            extracted = result.stdout.trim();
            indexing = extracted
              ? "Indexed"
              : "Not indexed — OCR may be required";
          } catch (error) {
            indexing =
              error.code === "ENOENT"
                ? "Not indexed — extraction unavailable"
                : "Not indexed — extraction failed or PDF is encrypted";
          } finally {
            await rm(dir, {
              recursive: true,
              force: true,
            });
          }
          const id = randomUUID();
          await store.transactionAsync(async () => {
            await db
              .prepare("INSERT INTO attachments VALUES (?,?,?,?,?,?,?,?)")
              .run(
                id,
                reportId,
                name,
                "application/pdf",
                bytes,
                extracted,
                indexing,
                new Date().toISOString(),
              );
            await store.save(
              {
                ...(await store.get(reportId)),
                attachmentIds: [
                  ...((await store.get(reportId)).attachmentIds || []),
                  id,
                ],
              },
              actor,
              `Added ${name}; earlier versions preserved.`,
              "report uploaded",
              undefined,
              true,
            );
          });
          return json(201, {
            id,
            indexing,
          });
        }
        const fileMatch = path.match(/^\/api\/attachments\/([\w-]+)$/);
        if (fileMatch && method === "GET") {
          const a = await db
            .prepare("SELECT * FROM attachments WHERE id=?")
            .get(fileMatch[1]);
          if (!a || !(await store.get(a.report_id)))
            fail(404, "Attachment unavailable.");
          res.setHeader(
            "Content-Security-Policy",
            "sandbox; frame-ancestors 'self'",
          );
          res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `${url.searchParams.has("download") ? "attachment" : "inline"}; filename="${a.name}"`,
          });
          return res.end(a.bytes || (await store.readAttachment(a)));
        }
        fail(404, "This action is not available.");
      }
      if (!["GET", "HEAD"].includes(method)) fail(405, "Method not allowed.");
      // The static application shell contains no imported records or credentials.
      const relative = path === "/" ? "/index.html" : decodeURIComponent(path);
      const file = resolve(dist, `.${relative}`);
      if (!file.startsWith(`${dist}${sep}`)) fail(404, "Not found.");
      let content;
      try {
        if (!(await stat(file)).isFile()) fail(404, "Not found.");
        content = await readFile(file);
      } catch {
        fail(404, "Build the app before starting the production server.");
      }
      const mime =
        {
          ".html": "text/html",
          ".js": "text/javascript",
          ".css": "text/css",
          ".woff2": "font/woff2",
          ".svg": "image/svg+xml",
        }[extname(file)] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": mime,
      });
      res.end(method === "HEAD" ? undefined : content);
    } catch (error) {
      if (!res.headersSent)
        json(error.status || (error instanceof SyntaxError ? 400 : 500), {
          error:
            error.status || error instanceof SyntaxError
              ? error.message
              : "The request could not be completed. Your prior saved work is unchanged.",
        });
      else res.end();
    }
  };
  // Serialize requests only for the local SQLite connection while an async transaction is open.
  let pending = Promise.resolve();
  const server = createServer((req, res) => {
    if (providedStore) return handle(req, res);
    pending = pending.then(() => handle(req, res));
  });
  function checkPassword(password) {
    if (
      typeof password !== "string" ||
      password.length < 14 ||
      password.length > 256
    )
      fail(400, "Use a password of 14–256 characters.");
  }
  async function createUser(input) {
    checkPassword(input.password);
    if (
      typeof input.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
      typeof input.name !== "string" ||
      !input.name.trim() ||
      input.name.length > 100
    )
      fail(400, "Enter a name and valid email.");
    const email = input.email.trim().toLowerCase();
    if (await db.prepare("SELECT 1 FROM users WHERE email=?").get(email))
      fail(409, "That email already has access.");
    const u = {
      id: randomUUID(),
      name: input.name.trim(),
      email,
      role: input.role,
      password_hash: passwordHash(input.password),
    };
    await db
      .prepare("INSERT INTO users VALUES (?,?,?,?,?)")
      .run(u.id, u.email, u.name, u.role, u.password_hash);
    return u;
  }
  return {
    server,
    store,
  };
}
function decision(record, status, reason, actor) {
  return {
    ...record,
    status,
    needsReview: false,
    shareApproved: false,
    decisions: [
      ...(record.decisions || []),
      {
        status,
        reason,
        actor,
        at: new Date().toISOString(),
        revision: record.revision,
      },
    ],
  };
}
