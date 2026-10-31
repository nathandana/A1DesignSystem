import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../server/local-app.mjs";
const directory = await mkdtemp(join(tmpdir(), "sce-browser-test-"));
const { server, store } = createApp({
  directory,
  origin: "http://127.0.0.1:5192",
  pdfCommand: "sce-no-pdf-extractor",
});
store.save(
  {
    id: "test-readable-audit",
    kind: "report",
    dataset: "demo",
    title: "Fictional audit navigation fixture",
    summary: "Test-only source material.",
    readingDocument: {
      intro: "Fictional audit for browser navigation tests.",
      sections: [
        {
          id: "summary",
          title: "Executive summary",
          pages: [1],
          markdown:
            Array(12)
              .fill(
                "This fictional paragraph supplies enough reading content to test scrolling and navigation without using client evidence.",
              )
              .join("\n\n") +
            "\n\n| Area | Observation |\n| --- | --- |\n| Navigation | Test fixture |",
        },
        {
          id: "findings",
          title: "Detailed findings",
          pages: [2],
          markdown:
            "### Keyboard navigation\n\n" +
            Array(12)
              .fill(
                "This is a fictional observation for testing the document layout.",
              )
              .join("\n\n"),
        },
      ],
    },
  },
  "Test fixture",
  "Fictional browser-test document.",
);
server.listen(5192, "127.0.0.1");
process.on("SIGTERM", () =>
  server.close(async () => {
    store.db.close();
    await rm(directory, { recursive: true, force: true });
    process.exit(0);
  }),
);
