import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { openStore } from "../server/store.mjs";
const input = process.argv[2];
if (!input) throw new Error("Supply the path to the imported audit PDF.");
const python =
  process.env.SCE_PDF_PYTHON ||
  new URL("../data/pdf-tools/bin/python", import.meta.url).pathname;
const document = JSON.parse(
  execFileSync(
    python,
    [new URL("./format-audit.py", import.meta.url).pathname, resolve(input)],
    { timeout: 30000, maxBuffer: 6 * 1024 * 1024 },
  ),
);
const sourceHash = createHash("sha256")
  .update(await readFile(input))
  .digest("hex");
const store = openStore(
  resolve(
    process.env.SCE_DATA_DIR || new URL("../data", import.meta.url).pathname,
  ),
);
try {
  const report = store.get(process.argv[3] || "sce-audit");
  if (!report || report.pdfSourceHash !== sourceHash)
    throw new Error("The PDF must match the imported report version.");
  const readingDocument = {
    intro: document.intro,
    sections: document.sections,
    sourceHash,
    version: document.version,
    attachmentId: store.db
      .prepare("SELECT id,bytes FROM attachments WHERE report_id=?")
      .all(report.id)
      .find(
        (file) =>
          createHash("sha256").update(file.bytes).digest("hex") === sourceHash,
      )?.id,
  };
  if (!readingDocument.attachmentId)
    throw new Error("The report's original PDF attachment was not found.");
  if (
    JSON.stringify(report.readingDocument) !== JSON.stringify(readingDocument)
  )
    store.save(
      { ...report, readingDocument },
      "Local source formatting",
      "Restored document headings, paragraphs, tables and links from the supplied PDF. Original source and findings unchanged.",
      "report formatted",
      report.revision,
    );
  console.log(
    JSON.stringify(
      {
        sections: document.sections.map((s) => ({
          title: s.title,
          pages: s.pages,
        })),
        tables: document.tables,
      },
      null,
      2,
    ),
  );
} finally {
  store.db.close();
}
