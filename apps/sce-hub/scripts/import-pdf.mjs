import { readFile, access } from "node:fs/promises";
import { resolve, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { openStore } from "../server/store.mjs";
const input = process.argv[2];
if (!input)
  throw new Error(
    "Supply the path to the original PDF. Optional second argument: report ID (default sce-audit).",
  );
const bytes = await readFile(resolve(input));
if (
  bytes.length > 20 * 1024 * 1024 ||
  bytes.subarray(0, 5).toString() !== "%PDF-"
)
  throw new Error("Choose a PDF of up to 20 MB.");
const bundledPython = new URL("../data/pdf-tools/bin/python", import.meta.url)
  .pathname;
const python =
  process.env.SCE_PDF_PYTHON ||
  (await access(bundledPython)
    .then(() => bundledPython)
    .catch(() => "python3"));
const pages = JSON.parse(
  execFileSync(
    python,
    [
      new URL("./extract-pdf.py", import.meta.url).pathname,
      "--json",
      resolve(input),
    ],
    { timeout: 30000, maxBuffer: 6 * 1024 * 1024 },
  ).toString(),
);
const store = openStore(
  resolve(
    process.env.SCE_DATA_DIR || new URL("../data", import.meta.url).pathname,
  ),
);
const reportId = process.argv[3] || "sce-audit",
  report = store.get(reportId);
if (!report || report.kind !== "report")
  throw new Error("Create or import the report record first.");
const digest = createHash("sha256").update(bytes).digest("hex");
if (report.pdfSourceHash === digest) {
  console.log("This exact PDF is already imported.");
  store.db.close();
  process.exit(0);
}
const id = randomUUID(),
  now = new Date().toISOString(),
  text = pages.map((p) => `Page ${p.number}\n${p.text}`).join("\n\n");
const populated = pages.filter((p) => p.text.trim());
const summary =
  pages[0]?.text
    .split("Executive summary\n")[1]
    ?.split(/\nArea\s+Assessment/)[0]
    ?.trim() || report.summary;
store.transaction(() => {
  store.db
    .prepare("INSERT INTO attachments VALUES (?,?,?,?,?,?,?,?)")
    .run(
      id,
      reportId,
      basename(input).replace(/[^a-zA-Z0-9 ._-]/g, "_"),
      "application/pdf",
      bytes,
      text,
      populated.length
        ? `Indexed — ${populated.length} of ${pages.length} pages contain text`
        : "Not indexed — OCR may be required",
      now,
    );
  store.save(
    {
      ...report,
      attachmentIds: [...(report.attachmentIds || []), id],
      pdfSourceHash: digest,
      summary,
      pages: populated,
      indexedPages: populated.map((p) => p.number),
      totalPages: pages.length,
      sourceVersion: `${report.sourceDate || "Undated report"} · original PDF`,
      body: `Original PDF imported. Text extracted from ${populated.length} of ${pages.length} pages. The earlier saved-HTML import remains in revision history. Findings reflect the supplied audit, not a new evaluation.`,
    },
    "Local PDF import",
    "Imported the supplied original PDF as a protected report version; earlier history retained.",
    "report uploaded",
    report.revision,
    true,
  );
});
console.log(
  JSON.stringify(
    {
      reportId,
      attachmentId: id,
      pages: pages.length,
      indexedPages: populated.length,
      protected: true,
    },
    null,
    2,
  ),
);
store.db.close();
