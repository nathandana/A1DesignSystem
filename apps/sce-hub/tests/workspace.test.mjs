import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../server/local-app.mjs";
import { parseImport, reachable, weekDates, nyDate } from "../src/model.mjs";

async function fixture(t, options = {}) {
  const directory = await mkdtemp(join(tmpdir(), "sce-hub-test-"));
  const app = createApp({
    directory,
    origin: "http://localhost",
    pdfCommand: "sce-no-pdf-extractor",
    ...options,
  });
  await new Promise((r) => app.server.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${app.server.address().port}`;
  let cookie = "";
  async function request(
    path,
    data,
    method = data === undefined ? "GET" : "POST",
    extra = {},
  ) {
    const response = await fetch(`${url}/api${path}`, {
      method,
      headers: {
        Origin: "http://localhost",
        Cookie: cookie,
        ...(data === undefined ? {} : { "Content-Type": "application/json" }),
        ...extra,
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
    const body = await response.json();
    return { status: response.status, body, headers: response.headers };
  }
  const setup = await request("/setup", {
    email: "owner@example.test",
    name: "Test owner",
    password: "test-only-password-12345",
  });
  assert.equal(setup.status, 200);
  cookie = setup.headers.get("set-cookie").split(";")[0];
  t.after(async () => {
    await new Promise((r) => app.server.close(r));
    app.store.db.close();
    await rm(directory, { recursive: true, force: true });
  });
  return {
    ...app,
    url,
    request,
    get cookie() {
      return cookie;
    },
    setCookie(v) {
      cookie = v;
    },
  };
}
const row = {
  id: "test-source-rule",
  title: "Checkbox label",
  original: "Give each checkbox a visible label.",
  sourceUrl: "https://example.test/design",
  tags: [
    "Components:Checkbox",
    "Patterns/tasks:Forms",
    "Topics:Accessibility",
    "Platforms/contexts:Mobile",
  ],
};

test("structured imports validate CSV quotes, unsafe URLs, malformed rows and grouped tags", () => {
  assert.equal(
    parseImport(
      'title,original,tags\n"Label, name","Line one\nLine two","Components:Checkbox|Topics:Accessibility"',
      "csv",
    )[0].original,
    "Line one\nLine two",
  );
  assert.throws(() => parseImport('title,original\n"unclosed,x', "csv"));
  assert.throws(() =>
    parseImport(JSON.stringify([{ ...row, sourceUrl: "javascript:alert(1)" }])),
  );
  assert.throws(() =>
    parseImport(JSON.stringify([{ ...row, tags: ["Checkbox"] }])),
  );
  assert.throws(() => parseImport(JSON.stringify([{ title: "No text" }])));
  assert.equal(
    parseImport("Pasted guidance\nKeep the source.", "text")[0].status,
    null,
  );
});

test("imports preserve provenance, skip duplicates and retain decisions when source changes", async (t) => {
  const { request, store } = await fixture(t);
  const payload = {
    text: JSON.stringify([row, row]),
    format: "json",
    dataset: "sce",
  };
  assert.equal((await request("/import", payload)).body.rows[1].repeated, true);
  assert.equal(store.all().filter((r) => r.dataset === "sce").length, 0);
  assert.equal(
    (await request("/import", { ...payload, commit: true, duplicates: "skip" }))
      .body.count,
    1,
  );
  let r = store.all().find((r) => r.dataset === "sce");
  assert.equal(r.status, null);
  assert.equal(r.original, row.original);
  let d = await request(`/records/${r.id}/decision`, {
    revision: r.revision,
    status: "Approved",
    reason: "Reviewed label association.",
  });
  assert.equal(d.status, 200);
  assert.equal(d.body.decisions.length, 1);
  assert.equal(
    (
      await request(
        `/records/${r.id}`,
        { revision: 1, proposed: "Stale edit", reason: "Stale" },
        "PATCH",
      )
    ).status,
    409,
  );
  const changed = {
    ...row,
    original: "Associate the visible label with its checkbox.",
    sourceVersion: "v2",
  };
  assert.equal(
    (
      await request("/import", {
        ...payload,
        text: JSON.stringify([changed]),
        commit: true,
        duplicates: "update",
      })
    ).body.count,
    1,
  );
  r = store.get(r.id);
  assert.equal(r.status, "Approved");
  assert.equal(r.needsReview, true);
  assert.equal(r.decisions.length, 1);
  const history = await request(`/records/${r.id}/history`);
  assert.equal(history.body.length, 3);
  assert.equal(history.body.at(-1).payload.original, row.original);
  assert.equal(
    (
      await request(`/records/${r.id}/restore`, {
        revision: r.revision,
        restoreRevision: 1,
        reason: "Restore wording.",
      })
    ).status,
    200,
  );
  assert.equal(store.get(r.id).status, "Approved");
  assert.equal(store.get(r.id).needsReview, true);
  assert.equal(
    (
      await request("/bulk", {
        items: [{ id: r.id, revision: store.get(r.id).revision }],
        status: "Not allowed",
        reason: "Invalid",
      })
    ).status,
    400,
  );
});

test("sign-in, CSRF, roles, password storage and revocation protect data and mutations", async (t) => {
  const app = await fixture(t),
    { request, store } = app;
  for (const path of [
    "/workspace",
    "/search?q=checkbox",
    "/export",
    "/attachments/nope",
    "/records/demo-guideline/history",
  ])
    assert.equal(
      (await request(path, undefined, "GET", { Cookie: "" })).status,
      401,
    );
  assert.equal(
    (
      await request(
        "/records",
        { kind: "initiative", dataset: "sce", title: "Bad origin" },
        "POST",
        { Origin: "https://attacker.test" },
      )
    ).status,
    403,
  );
  assert.equal((await request("/ask")).status, 503);
  assert.equal((await request("/public")).status, 404);
  assert.equal(
    (
      await request("/setup", {
        name: "Another",
        email: "another@example.test",
        password: "test-only-password-12345",
      })
    ).status,
    403,
  );
  const ownerCookie = app.cookie;
  for (const role of ["viewer", "reviewer", "editor"]) {
    const account = await request("/users", {
      name: role,
      email: `${role}@example.test`,
      role,
      password: "test-collaborator-password",
    });
    assert.equal(account.status, 201);
    assert.equal(JSON.stringify(account.body).includes("password"), false);
    const login = await request("/login", {
      email: `${role}@example.test`,
      password: "test-collaborator-password",
    });
    app.setCookie(login.headers.get("set-cookie").split(";")[0]);
    assert.equal((await request("/workspace")).status, 200);
    assert.equal((await request("/users")).status, 403);
    assert.equal(
      (
        await request("/records", {
          kind: "initiative",
          dataset: "sce",
          title: `Initiative ${role}`,
        })
      ).status,
      role === "editor" ? 201 : 403,
    );
    const g = store.get("demo-guideline");
    assert.equal(
      (
        await request("/records/demo-guideline/decision", {
          revision: g.revision,
          status: "Approved",
          reason: "Reviewed.",
        })
      ).status,
      role === "viewer" ? 403 : 200,
    );
    app.setCookie(ownerCookie);
    assert.equal(
      (await request("/users", { id: account.body.id }, "DELETE")).status,
      200,
    );
  }
  assert.ok(
    !JSON.stringify(store.db.prepare("SELECT * FROM revisions").all()).includes(
      "test-collaborator-password",
    ),
  );
  assert.notEqual(
    store.db.prepare("SELECT password_hash FROM users LIMIT 1").get()
      .password_hash,
    "test-only-password-12345",
  );
  const headers = (await request("/workspace")).headers;
  assert.match(headers.get("cache-control"), /no-store/);
  assert.match(headers.get("x-robots-tag"), /noindex/);
  assert.equal(
    (
      await request("/password", {
        current: "wrong",
        password: "replacement-password-123",
      })
    ).status,
    403,
  );
  assert.equal((await request("/logout", {})).status, 200);
  assert.equal((await request("/workspace")).status, 401);
});

test("public demonstration allowlist excludes real records, discussions, drafts, deleted and revised content", async (t) => {
  const { request, store } = await fixture(t, { publicDemo: true });
  const real = (
    await request("/records", {
      kind: "guideline",
      dataset: "sce",
      title: "Protected SCE text",
      original: "Private project evidence",
      tags: [],
    })
  ).body;
  assert.equal(
    (
      await request(`/records/${real.id}/share`, {
        revision: real.revision,
        approved: true,
        reason: "Try to expose real data",
      })
    ).status,
    400,
  );
  let demo = store.get("demo-guideline");
  demo = (
    await request("/records/demo-guideline/decision", {
      revision: demo.revision,
      status: "Approved",
      reason: "Ready for fictional demo.",
    })
  ).body;
  demo = (
    await request("/records/demo-guideline/comment", {
      revision: demo.revision,
      text: "Private reviewer discussion",
      reason: "Discussion",
    })
  ).body;
  await request("/records/demo-guideline/share", {
    revision: demo.revision,
    approved: true,
    reason: "Explicitly cleared fictional example.",
  });
  let result = await request("/public", undefined, "GET", { Cookie: "" });
  assert.equal(result.status, 200);
  assert.equal(result.body.records.length, 1);
  assert.equal(result.body.records[0].comments, undefined);
  assert.deepEqual(result.body.records[0].links, []);
  assert.ok(!JSON.stringify(result.body).includes("Private"));
  demo = store.get("demo-guideline");
  await request(
    "/records/demo-guideline",
    {
      revision: demo.revision,
      proposed: "Changed wording.",
      reason: "Revise wording.",
    },
    "PATCH",
  );
  assert.equal((await request("/public")).body.records.length, 0);
  demo = store.get("demo-guideline");
  await request(
    "/records/demo-guideline",
    { revision: demo.revision, reason: "Delete example." },
    "DELETE",
  );
  assert.equal(
    (await request("/search?dataset=demo&q=clear%20label")).body.results.length,
    0,
  );
  assert.equal((await request("/records/demo-guideline")).status, 404);
});

test("map persists positions, rejects invalid connections, traces cycles and removes dangling edges", async (t) => {
  const { request, store } = await fixture(t);
  const node = store.get("demo-tokens");
  assert.equal(
    (
      await request(
        `/records/${node.id}`,
        { revision: node.revision, x: 450, y: 320, reason: "Move node." },
        "PATCH",
      )
    ).body.x,
    450,
  );
  assert.equal(
    (
      await request("/records", {
        kind: "edge",
        dataset: "demo",
        title: "Bad edge",
        from: "absent",
        to: "demo-react",
        relation: "feeds",
        confidence: "Proposed",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await request("/records", {
        kind: "edge",
        dataset: "sce",
        title: "Wrong collection",
        from: "demo-tokens",
        to: "demo-react",
        relation: "feeds",
        confidence: "Proposed",
      })
    ).status,
    400,
  );
  assert.deepEqual(
    reachable("a", [
      { from: "a", to: "b" },
      { from: "b", to: "c" },
      { from: "c", to: "a" },
    ]),
    ["b", "c"],
  );
  await request(
    "/records/demo-tokens",
    { revision: store.get("demo-tokens").revision, reason: "Remove node." },
    "DELETE",
  );
  assert.equal(
    store
      .all()
      .filter(
        (r) =>
          r.kind === "edge" &&
          (r.from === "demo-tokens" || r.to === "demo-tokens"),
      ).length,
    0,
  );
  const view = await request("/records", {
    kind: "view",
    dataset: "demo",
    title: "React assets",
    filters: { page: "map", type: "React library" },
  });
  assert.equal(store.get(view.body.id).filters.type, "React library");
});

test("PDF revisions remain protected and communicate extraction failures; report deletion removes search and file access", async (t) => {
  const { request, url, cookie, store } = await fixture(t);
  const report = (
    await request("/records", {
      kind: "report",
      dataset: "sce",
      title: "Audit report",
      summary: "Actual supplied summary.",
    })
  ).body;
  const bytes = Buffer.from(
    "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF",
  );
  const upload = () =>
    fetch(`${url}/api/attachments?report=${report.id}&name=audit.pdf`, {
      method: "POST",
      headers: {
        Origin: "http://localhost",
        Cookie: cookie,
        "Content-Type": "application/pdf",
      },
      body: bytes,
    });
  const first = await (await upload()).json();
  assert.match(first.indexing, /Not indexed/);
  const second = await (await upload()).json();
  assert.notEqual(first.id, second.id);
  let response = await fetch(`${url}/api/attachments/${first.id}`, {
    headers: { Cookie: cookie },
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-security-policy"), /sandbox/);
  assert.equal((await fetch(`${url}/api/attachments/${first.id}`)).status, 401);
  assert.equal(
    (
      await fetch(`${url}/api/attachments?report=${report.id}`, {
        method: "POST",
        headers: {
          Origin: "http://localhost",
          Cookie: cookie,
          "Content-Type": "application/pdf",
        },
        body: "<script>alert(1)</script>",
      })
    ).status,
    400,
  );
  assert.equal((await request("/search?q=supplied")).body.results.length, 1);
  assert.equal(
    (await request("/search?q=supplied")).body.coverage.pdfs[0].count,
    2,
  );
  await request(
    `/records/${report.id}`,
    { revision: store.get(report.id).revision, reason: "Remove report." },
    "DELETE",
  );
  assert.equal((await request("/search?q=supplied")).body.results.length, 0);
  assert.equal(
    (
      await fetch(`${url}/api/attachments/${first.id}`, {
        headers: { Cookie: cookie },
      })
    ).status,
    404,
  );
});

test("weekly boundaries handle New York DST and publication remains explicit", async (t) => {
  assert.deepEqual(weekDates("2026-11-01"), {
    start: "2026-10-26",
    end: "2026-11-02",
  });
  assert.equal(nyDate(new Date("2026-11-02T04:59:59Z")), "2026-11-01");
  assert.equal(nyDate(new Date("2026-11-02T05:00:00Z")), "2026-11-02");
  assert.throws(() => weekDates("2026-02-31"));
  const { request, store } = await fixture(t);
  const row = (
    await request("/records", {
      kind: "initiative",
      dataset: "sce",
      title: "Source review",
      summary: "Recorded source work.",
    })
  ).body;
  store.db
    .prepare("UPDATE records SET updated_at=?, payload=? WHERE id=?")
    .run(
      "2026-11-02T04:59:59Z",
      JSON.stringify({ ...row, updatedAt: "2026-11-02T04:59:59Z" }),
      row.id,
    );
  const weekly = (
    await request("/weekly", { date: "2026-11-01", dataset: "sce" })
  ).body;
  assert.equal(weekly.status, "Draft");
  assert.ok(weekly.links.includes(row.id));
  assert.match(weekly.body, /No measured business outcomes/);
  assert.equal(
    (
      await request("/records/" + weekly.id + "/publish", {
        revision: weekly.revision,
        reason: "Reviewed the weekly notes.",
      })
    ).body.status,
    "Published",
  );
  const published = store.get(weekly.id);
  assert.equal(
    (
      await request(
        "/records/" + weekly.id,
        {
          revision: published.revision,
          summary: "Revised summary",
          reason: "New wording.",
        },
        "PATCH",
      )
    ).body.status,
    "Draft",
  );
  const exported = await request("/export");
  assert.equal(exported.body.schemaVersion, 1);
  assert.ok(exported.body.revisions.length);
  assert.equal(exported.body.users, undefined);
});

test("SQLite records survive reopening and migrations are idempotent", async (t) => {
  const { store } = await fixture(t);
  assert.equal(
    store.db.prepare("SELECT count(*) AS count FROM schema_migrations").get()
      .count,
    1,
  );
  const { openStore } = await import("../server/store.mjs");
  const path = store.db.prepare("PRAGMA database_list").all()[0].file;
  const reopened = openStore(join(path, ".."));
  assert.equal(
    reopened.get("demo-guideline").status,
    "Needs further discussion",
  );
  reopened.db.close();
});

test("impact follows typed consumers and ownership; approved exports reject changed guidance", async (t) => {
  const edges = [
    { from: "tokens", to: "library", relation: "feeds" },
    { from: "product", to: "library", relation: "consumes" },
    { from: "team", to: "library", relation: "owns" },
    { from: "docs", to: "library", relation: "documents" },
  ];
  assert.deepEqual(reachable("tokens", edges), [
    "library",
    "product",
    "team",
    "docs",
  ]);
  assert.deepEqual(reachable("product", edges, "upstream"), [
    "library",
    "tokens",
  ]);
  const { request, store } = await fixture(t);
  let g = store.get("demo-guideline");
  assert.equal(
    (await request("/export-approved", { ids: [g.id] })).status,
    409,
  );
  g = (
    await request(`/records/${g.id}/decision`, {
      revision: g.revision,
      status: "Approved",
      reason: "Reviewed fictional guidance.",
    })
  ).body;
  const exported = await request("/export-approved", { ids: [g.id] });
  assert.equal(exported.status, 200);
  assert.equal(exported.body.records[0].comments, undefined);
  await request(
    `/records/${g.id}`,
    {
      revision: g.revision,
      proposed: "New proposed wording",
      reason: "Revised wording.",
    },
    "PATCH",
  );
  assert.equal(
    (await request("/export-approved", { ids: [g.id] })).status,
    409,
  );
});

test("bulk decisions are atomic when a selected revision is stale", async (t) => {
  const { request, store } = await fixture(t);
  const rows = [
    row,
    { ...row, id: "second-guideline", title: "Second label guideline" },
  ];
  await request("/import", {
    text: JSON.stringify(rows),
    format: "json",
    dataset: "sce",
    commit: true,
    duplicates: "skip",
  });
  const saved = store.all().filter((r) => r.dataset === "sce");
  const items = saved.map((r) => ({ id: r.id, revision: r.revision }));
  items[1].revision = 0;
  assert.equal(
    (
      await request("/bulk", {
        items,
        status: "Approved",
        reason: "Bulk review.",
      })
    ).status,
    409,
  );
  assert.ok(saved.every((r) => store.get(r.id).status === null));
  items[1].revision = saved[1].revision;
  assert.equal(
    (
      await request("/bulk", {
        items,
        status: "Approved",
        reason: "Bulk review.",
      })
    ).body.count,
    2,
  );
  assert.ok(saved.every((r) => store.get(r.id).decisions.length === 1));
});

test("optional local access grants owner access only for loopback host and never in production", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "sce-local-access-"));
  const origin = "http://127.0.0.1:5191";
  assert.throws(
    () =>
      createApp({
        directory,
        origin: "https://example.test",
        production: true,
        localAccess: true,
      }),
    /loopback/,
  );
  assert.throws(
    () =>
      createApp({
        directory,
        origin: "http://example.test",
        localAccess: true,
      }),
    /loopback/,
  );
  const app = createApp({ directory, origin, localAccess: true });
  await new Promise((r) => app.server.listen(0, "127.0.0.1", r));
  t.after(async () => {
    await new Promise((r) => app.server.close(r));
    app.store.db.close();
    await rm(directory, { recursive: true, force: true });
  });
  const url = `http://127.0.0.1:${app.server.address().port}`;
  const { request } = await import("node:http");
  const fetchLocal = (address, options) =>
    new Promise((resolve, reject) => {
      const req = request(address, options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () =>
          resolve({ status: res.statusCode, json: () => JSON.parse(body) }),
        );
      });
      req.on("error", reject);
      req.end();
    });
  const headers = { Host: "127.0.0.1:5191" };
  const session = await (
    await fetchLocal(`${url}/api/session`, { headers })
  ).json();
  assert.equal(session.localAccess, true);
  assert.equal(session.user.role, "owner");
  assert.equal(session.setupRequired, false);
  assert.equal(
    app.store.db.prepare("SELECT COUNT(*) AS count FROM users").get().count,
    0,
  );
  assert.equal(
    (await fetchLocal(`${url}/api/workspace`, { headers })).status,
    200,
  );
  assert.equal(
    (
      await fetchLocal(`${url}/api/workspace`, {
        headers: { Host: "untrusted.test" },
      })
    ).status,
    401,
  );
  assert.equal(
    (await fetchLocal(`${url}/api/logout`, { method: "POST", headers })).status,
    403,
  );
});

test("compact guideline review saves metadata and decision together without a rationale", async (t) => {
  const app = await fixture(t);
  const { request, store } = app;
  const before = store.get("demo-guideline");
  const saved = await request("/records/demo-guideline/review", {
    revision: before.revision,
    status: "Approved",
    metadata: {
      owner: "Review owner",
      tags: ["Topics:Content", "Topics:Content"],
      readiness: ["Human guidance"],
      original: "Must not overwrite source",
    },
  });
  assert.equal(saved.status, 200);
  assert.equal(saved.body.revision, before.revision + 1);
  assert.equal(saved.body.status, "Approved");
  assert.equal(saved.body.owner, "Review owner");
  assert.deepEqual(saved.body.tags, ["Topics:Content"]);
  assert.equal(saved.body.original, before.original);
  assert.equal(saved.body.decisions.at(-1).reason, "");
  assert.equal(saved.body.shareApproved, false);
  assert.equal(
    (
      await request("/records/demo-guideline/review", {
        revision: before.revision,
        status: "Rejected",
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await request("/records/demo-guideline/review", {
        revision: saved.body.revision,
        status: "Rejected",
        metadata: { tags: ["Invalid tag"] },
      })
    ).status,
    400,
  );
  assert.equal(store.get("demo-guideline").status, "Approved");
  const ownerCookie = app.cookie;
  for (const role of ["reviewer", "viewer"]) {
    app.setCookie(ownerCookie);
    await request("/users", {
      email: `${role}@example.test`,
      name: role,
      password: "test-review-password-123",
      role,
    });
    const login = await request("/login", {
      email: `${role}@example.test`,
      password: "test-review-password-123",
    });
    app.setCookie(login.headers.get("set-cookie").split(";")[0]);
    const revision = store.get("demo-guideline").revision;
    assert.equal(
      (
        await request("/records/demo-guideline/review", {
          revision,
          status: "Rejected",
          metadata: { owner: "Unauthorized" },
        })
      ).status,
      403,
    );
    const decision = await request("/records/demo-guideline/review", {
      revision,
      status: "Needs further discussion",
    });
    assert.equal(decision.status, role === "reviewer" ? 200 : 403);
  }
});

test("removed releases are unavailable to active workflows while archival data is retained", async (t) => {
  const { request, store } = await fixture(t, { publicDemo: true });
  store.save(
    {
      id: "archived-release",
      kind: "release",
      dataset: "demo",
      title: "Historical release",
      status: "Published",
      shareApproved: true,
    },
    "Fixture",
    "Historical record",
  );
  assert.equal(
    (
      await request("/records", {
        kind: "release",
        dataset: "sce",
        title: "New release",
      })
    ).status,
    400,
  );
  assert.equal((await request("/records/archived-release")).status, 404);
  assert.ok(
    !(await request("/workspace?dataset=demo")).body.records.some(
      (r) => r.kind === "release",
    ),
  );
  assert.ok(
    !(await request("/search?dataset=demo&q=Historical")).body.results.some(
      (r) => r.id === "archived-release",
    ),
  );
  assert.ok(
    !(await request("/public")).body.records.some((r) => r.kind === "release"),
  );
  assert.ok(
    (await request("/export?dataset=demo")).body.records.some(
      (r) => r.id === "archived-release",
    ),
  );
  assert.ok(store.get("archived-release"));
});

test("workspace changes retain revisions without writing or exposing activity events", async (t) => {
  const { request, store } = await fixture(t);
  assert.equal(
    store.db.prepare("SELECT count(*) AS count FROM activity").get().count,
    0,
  );
  store.db
    .prepare("INSERT INTO activity VALUES (?,?,?,?,?,?,?,?,?)")
    .run(
      "legacy-event",
      "legacy-record",
      "sce",
      "edited",
      "Test owner",
      "Archived event",
      null,
      null,
      "2026-10-01T00:00:00Z",
    );
  const original = (
    await request("/records", {
      kind: "initiative",
      dataset: "sce",
      title: "Versioned work",
    })
  ).body;
  const edited = await request(
    "/records/" + original.id,
    {
      revision: original.revision,
      title: "Revised work",
      reason: "Edit record",
    },
    "PATCH",
  );
  assert.equal(edited.status, 200);
  assert.equal(edited.body.revision, original.revision + 1);
  assert.equal((await request("/workspace")).body.activity, undefined);
  assert.equal((await request("/export")).body.activity, undefined);
  assert.deepEqual(
    store.db
      .prepare("SELECT id FROM activity")
      .all()
      .map((r) => r.id),
    ["legacy-event"],
  );
  assert.equal(
    store.db
      .prepare("SELECT count(*) AS count FROM revisions WHERE record_id=?")
      .get(original.id).count,
    2,
  );
});
