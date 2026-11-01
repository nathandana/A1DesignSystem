import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { openStore } from "../server/store.mjs";
import { seedDemo } from "../server/demo.mjs";
const root = resolve(process.argv[2] || join(homedir(), "SCE"));
const docs = join(root, "Figma Test/sce-design-system-docs");
const store = openStore(
  resolve(
    process.env.SCE_DATA_DIR || new URL("../data", import.meta.url).pathname,
  ),
);
const manifest = JSON.parse(
  await readFile(join(docs, "manifest.json"), "utf8"),
);
const hash = (text) =>
  createHash("sha256").update(text).digest("hex").slice(0, 24);
const figmaUrl = (node) =>
  `https://www.figma.com/design/${manifest.fileKey}/SCE---Design-System-1.7?node-id=${encodeURIComponent(node)}`;
const actor = "Local source import";
let added = 0,
  revised = 0,
  unchanged = 0;
function save(r) {
  const old = store.get(r.id);
  if (old?.sourceHash === r.sourceHash) {
    unchanged++;
    return;
  }
  if (old) {
    store.save(
      {
        ...old,
        ...r,
        proposed: old.proposed,
        status: old.status,
        decisions: old.decisions,
        comments: old.comments,
        needsReview: r.kind === "guideline" ? true : old.needsReview,
        shareApproved: false,
      },
      actor,
      "Local source changed; previous versions and decisions retained.",
      "source imported",
    );
    revised++;
  } else {
    store.save(
      r,
      actor,
      "Imported from supplied local files. Source statements are unreviewed.",
      "source imported",
    );
    added++;
  }
}
for (const page of manifest.pages.filter((p) => p.file)) {
  if (
    !/^\d+:\d+$/.test(page.id) ||
    !resolve(docs, page.file).startsWith(`${docs}/`) ||
    !page.file.endsWith(".md")
  )
    throw new Error("The source manifest contains an invalid page reference.");
  const original = await readFile(join(docs, page.file), "utf8");
  const sourceId = `sce-source-${hash(page.id)}`;
  const title = original.match(/^# (.+)/m)?.[1] || page.name.trim();
  save({
    id: sourceId,
    kind: "source",
    dataset: "sce",
    title: `${title} · source transcription`,
    original,
    sourceUrl: page.source,
    sourceVersion: `SCE 1.7 · extracted ${manifest.extractedOn}`,
    nodeRef: page.id,
    localPath: page.file,
    sourceHash: hash(original),
    summary:
      "Original export includes guidance, specimens and example copy. It is not an approved rule set.",
    links: [],
  });
  const data = JSON.parse(
    await readFile(
      join(docs, `source/pages/${page.id.replaceAll(":", "-")}.json`),
      "utf8",
    ),
  );
  const candidates = data.records.filter(
    (r) =>
      !r.hidden &&
      ((r.kind === "component" && r.description?.trim()) ||
        (r.kind === "text" &&
          /paragraph|description/i.test(r.name) &&
          r.text?.trim() &&
          r.path?.some((n) => /documentation/i.test(n.name)))),
  );
  const seen = new Map();
  for (const r of candidates) {
    const text = r.kind === "component" ? r.description : r.text;
    const section = r.path?.[0]?.id || page.id;
    const key = `${section}|${text}`;
    if (seen.has(key)) {
      seen.get(key).sourceOccurrences.push(r.id);
      continue;
    }
    const instance = r.path?.find((n) => n.type === "INSTANCE")?.id;
    const heading =
      instance &&
      data.records.find(
        (n) =>
          n.kind === "text" &&
          n.name === "Title" &&
          n.path?.some((p) => p.id === instance),
      )?.text;
    const label =
      r.kind === "component"
        ? `${r.name} · component description`
        : `${title} · ${heading || "Documentation text"}`;
    const tags = [`Components:${title}`];
    if (page.category === "navigation") tags.push("Patterns/tasks:Navigation");
    if (/forms|checkbox|radio|button|date picker/i.test(title))
      tags.push("Patterns/tasks:Forms");
    // Topic/context tags are proposals from literal source terms and remain editable.
    if (/accessib|WCAG/i.test(text)) tags.push("Topics:Accessibility");
    if (/mobile/i.test(text)) tags.push("Platforms/contexts:Mobile");
    seen.set(key, {
      id: `sce-guideline-${hash(`${page.id}|${r.id}`)}`,
      externalId: `${manifest.fileKey}:${r.id}`,
      kind: "guideline",
      dataset: "sce",
      title: label,
      original: text,
      proposed: "",
      rationale: "",
      status: null,
      owner: "",
      tags,
      readiness: [],
      comments: [],
      decisions: [],
      links: [sourceId],
      sourceUrl: figmaUrl(r.id),
      nodeRef: r.id,
      sourceOccurrences: [r.id],
      sourceVersion: `SCE 1.7 · extracted ${manifest.extractedOn}`,
      importedAt: new Date().toISOString(),
      sourceHash: hash(text),
      candidate: true,
      summary:
        "Review candidate extracted from a component description or documentation paragraph. Confirm whether it is guidance; it may contain examples or stale copy.",
    });
  }
  for (const r of seen.values()) save(r);
}
for (const file of (await readdir(docs)).filter((file) =>
  file.endsWith(".md"),
)) {
  const original = await readFile(join(docs, file), "utf8");
  save({
    id: `sce-catalog-${hash(file)}`,
    kind: "source",
    dataset: "sce",
    title: original.match(/^# (.+)/m)?.[1] || file,
    original,
    sourceUrl: `https://www.figma.com/design/${manifest.fileKey}`,
    sourceVersion: `SCE 1.7 · extracted ${manifest.extractedOn}`,
    localPath: file,
    sourceHash: hash(original),
    links: [],
    summary:
      "Supplied documentation catalog or extraction reference. Metadata is not an approved rule set.",
  });
}
const sourceUrl = `https://www.figma.com/design/${manifest.fileKey}`;
const sourceNodes = [
  {
    id: "sce-figma-library",
    kind: "node",
    title: "SCE Design System 1.7",
    type: "Figma library",
    x: 160,
    y: 180,
    summary: "The Figma source library identified in the supplied export.",
    sourceUrl,
    links: [],
  },
  {
    id: "sce-documentation-export",
    kind: "node",
    title: "Documentation export",
    type: "Documentation",
    x: 440,
    y: 180,
    summary:
      "The supplied local transcription and metadata catalog. Coverage and limitations are recorded in its index.",
    sourceUrl,
    links: [`sce-catalog-${hash("README.md")}`],
  },
  {
    id: "sce-export-documents-library",
    kind: "edge",
    title: "Export documents Figma library",
    from: "sce-documentation-export",
    to: "sce-figma-library",
    relation: "documents",
    confidence: "Confirmed",
    sourceUrl,
    links: [`sce-catalog-${hash("README.md")}`],
  },
];
for (const r of sourceNodes) {
  // Seed only known source relationships. Never reset a user's edits or deletions.
  if (!store.db.prepare("SELECT 1 FROM records WHERE id=?").get(r.id))
    save({
      ...r,
      dataset: "sce",
      owner: "",
      sourceHash: hash(JSON.stringify(r)),
    });
}
const auditDir = join(root, "SEC.com Audit");
const html = (
  await readdir(auditDir).catch((error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  })
).find((f) => f.endsWith(".html"));
if (html) {
  const path = join(auditDir, html),
    content = await readFile(path, "utf8");
  const { pages, findings } = JSON.parse(
    execFileSync(
      "python3",
      [new URL("./read-audit.py", import.meta.url).pathname, path],
      { maxBuffer: 10 * 1024 * 1024 },
    ).toString(),
  );
  const populated = pages.filter((p) => p.text.trim());
  const first = pages.find((p) => p.number === 1)?.text || "";
  const summary =
    first.split("Executive summary\n")[1]?.split("\nArea\n")[0] || first;
  save({
    id: "sce-audit",
    kind: "report",
    dataset: "sce",
    title: "SCE website audit",
    summary,
    pages: populated,
    body: `Supplied saved HTML contains text for ${populated.length} of ${pages.length} report pages. The original PDF has not been supplied. Findings reflect the supplied audit, not a new evaluation.`,
    sourceVersion: "Oct. 30, 2026 · saved HTML",
    sourceDate: "2026-10-30",
    sourceHash: hash(content),
    localPath: html,
    sourceUrl: "https://www.sce.com",
    owner: "Nathan Dana",
    attachmentIds: [],
    links: [],
    indexedPages: populated.map((p) => p.number),
    totalPages: pages.length,
  });
  for (const { id, severity, title, recommendation, sourcePage } of findings) {
    save({
      id: `sce-finding-${id}`,
      kind: "finding",
      dataset: "sce",
      title: `${id} · ${title}`,
      original: title,
      summary:
        "Observed finding recorded in the supplied audit. Confidence was not separately scored in the source.",
      severity,
      confidence: "Not separately specified",
      recommendation,
      tags: ["Topics:Accessibility"],
      links: ["sce-audit"],
      reportId: "sce-audit",
      sourcePage,
      sourceVersion: "Oct. 30, 2026 · priority table",
      sourceHash: hash(`${title}|${recommendation}`),
      owner: "",
    });
  }
}
seedDemo(store);
console.log(
  JSON.stringify(
    {
      added,
      revised,
      unchanged,
      guidelines: store
        .all()
        .filter((r) => r.dataset === "sce" && r.kind === "guideline").length,
      reports: store
        .all()
        .filter((r) => r.kind === "report")
        .map((r) => ({
          title: r.title,
          indexedPages: r.indexedPages,
          totalPages: r.totalPages,
        })),
      database:
        "Ignored private data/workspace.sqlite; no source content added to Git.",
    },
    null,
    2,
  ),
);
store.db.close();
