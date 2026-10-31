import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Stack,
  Grid,
  GridItem,
  Section,
  Heading,
  Paragraph,
  Button,
  Link,
  Card,
  PageNav,
  Divider,
} from "@gtivr4/a1-design-system-react";
import {
  useWorkspace,
  api,
  PageTitle,
  Page,
  Empty,
  EditRecord,
  Select,
  Notice,
  Feedback,
  date,
} from "./ui.jsx";
import { Markdown } from "./Markdown.jsx";

export function Audit({ recordId }) {
  const { records, canEdit } = useWorkspace();
  const [create, setCreate] = useState(false),
    [selected, setSelected] = useState("");
  const reports = records.filter((r) => r.kind === "report");
  const report =
    reports.find((r) => r.id === (recordId || selected || "sce-audit")) ||
    reports[0];
  return (
    <>
      {!report ? (
        <Page
          gap="lg"
          title={
            <PageTitle
              title="Website audit"
              description="Read the audit and its supporting evidence."
              actions={
                canEdit && (
                  <Button icon="add" onClick={() => setCreate(true)}>
                    Add report
                  </Button>
                )
              }
            />
          }
        >
          <Empty title="Awaiting source">
            Add the supplied audit summary and PDF to begin.
          </Empty>
        </Page>
      ) : (
        <AuditDocument
          key={report.id}
          record={report}
          reportSelector={
            reports.length > 1 && (
              <Select
                label="Report"
                value={report.id}
                onChange={setSelected}
                options={reports.map((r) => ({ value: r.id, label: r.title }))}
              />
            )
          }
        />
      )}
      {create && <EditRecord kind="report" onClose={() => setCreate(false)} />}
    </>
  );
}

function AuditDocument({ record, reportSelector }) {
  const { attachments } = useWorkspace();
  const root = useRef(null);
  const files = attachments.filter((a) => a.report_id === record.id);
  const sourceFile =
    files.find((a) => a.id === record.readingDocument?.attachmentId) ||
    files[0];
  const formatted =
    record.readingDocument?.sections?.length > 0 &&
    (!record.pdfSourceHash ||
      record.readingDocument.sourceHash === record.pdfSourceHash);
  const sections = useMemo(
    () =>
      formatted
        ? record.readingDocument.sections
        : [
            {
              id: "summary",
              title: "Executive summary",
              markdown: record.summary || "Awaiting the supplied summary.",
              pages: [],
            },
            ...(record.pages || []).map((p) => ({
              id: `page-${p.number}`,
              title: `Source page ${p.number}`,
              markdown: p.text,
              pages: [p.number],
              plain: true,
            })),
          ],
    [record],
  );
  const navigation = useMemo(
    () =>
      sections.map((s) => ({
        id: `audit-${record.id}-${s.id}`,
        label: s.title,
      })),
    [sections, record.id],
  );
  // Page Nav is fixed on small screens; measure the existing header rather than guessing its height.
  useEffect(() => {
    const header = document.querySelector(".a1-page-layout__header");
    const nav = root.current?.querySelector(".a1-page-nav");
    if (!header || !nav) return;
    const update = () => {
      const fixed = getComputedStyle(nav).position === "fixed";
      root.current.style.setProperty(
        "--a1-page-nav-top",
        fixed
          ? `${header.getBoundingClientRect().bottom}px`
          : "var(--base-spacing-16)",
      );
      root.current.style.setProperty(
        "--a1-sce-audit-scroll-offset",
        fixed
          ? `calc(${nav.getBoundingClientRect().height}px + var(--base-spacing-16))`
          : "var(--base-spacing-16)",
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(header);
    observer.observe(nav);
    update();
    return () => observer.disconnect();
  }, []);
  return (
    <Page
      ref={root}
      gap="xl"
      className="a1-sce-audit"
      title={
        <PageTitle
          title={record.title}
          eyebrow="Website audit"
          meta={[
            {
              label: date(record.sourceDate || record.createdAt),
              icon: "calendar_today",
            },
            {
              label: `${record.totalPages || record.pages?.length || 0} source pages`,
              icon: "description",
            },
          ]}
          actions={
            sourceFile && (
              <Button
                as="a"
                variant="secondary"
                href={`/api/attachments/${sourceFile.id}`}
                target="_blank"
                rel="noreferrer"
                icon="open_in_new"
              >
                Original PDF
              </Button>
            )
          }
        />
      }
    >
      {reportSelector}
      <Grid columns={{ xs: 1, md: 12 }} gap="xl">
        <GridItem span={{ xs: 1, md: 9 }}>
          <Section
            as="article"
            contentWidth="md"
            padding="none"
            aria-label="Website audit document"
          >
            <Stack gap="xxl">
              {formatted && record.readingDocument.intro && (
                <Markdown document>{record.readingDocument.intro}</Markdown>
              )}
              {sections.map((section, index) => (
                <React.Fragment key={section.id}>
                  {(index > 0 ||
                    (formatted && record.readingDocument.intro)) && (
                    <Divider space="none" />
                  )}
                  <Stack
                    as="section"
                    gap="lg"
                    id={`audit-${record.id}-${section.id}`}
                    className="a1-sce-audit-section"
                    aria-labelledby={`audit-heading-${section.id}`}
                  >
                    <Heading
                      as="h2"
                      size="lg"
                      id={`audit-heading-${section.id}`}
                      tabIndex={-1}
                    >
                      {section.title}
                    </Heading>
                    {section.plain ? (
                      <Paragraph className="a1-sce-prose">
                        {section.markdown}
                      </Paragraph>
                    ) : (
                      <Markdown headingLevel={1} document>
                        {section.markdown}
                      </Markdown>
                    )}
                    {sourceFile && section.pages?.length > 0 && (
                      <Paragraph size="xs" color="muted">
                        <Link
                          href={`/api/attachments/${sourceFile.id}#page=${section.pages[0]}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source:{" "}
                          {section.pages.length === 1
                            ? `page ${section.pages[0]}`
                            : `pages ${section.pages[0]}–${section.pages.at(-1)}`}
                        </Link>
                      </Paragraph>
                    )}
                  </Stack>
                </React.Fragment>
              ))}
              <Divider space="none" />
              <details>
                <summary className="a1-sce-detail-summary">
                  Source PDF and versions
                </summary>
                <ReportFiles record={record} />
              </details>
            </Stack>
          </Section>
        </GridItem>
        <GridItem span={{ xs: 1, md: 3 }}>
          <PageNav sections={navigation} label="In this audit" />
        </GridItem>
      </Grid>
    </Page>
  );
}

function ReportFiles({ record }) {
  const { attachments, canEdit, refresh, announce, session } = useWorkspace();
  const maxUploadBytes = session.maxUploadBytes || 20 * 1024 * 1024;
  const files = attachments.filter((a) => a.report_id === record.id);
  const [uploading, setUploading] = useState(false),
    [error, setError] = useState(""),
    [preview, setPreview] = useState("");
  return (
    <Stack gap="md">
      <Card>
        <Stack gap="md">
          <Heading as="h3" size="sm">
            Report files and versions
          </Heading>
          {!files.length && (
            <Notice>
              Awaiting source PDF.{" "}
              {record.pages?.length
                ? "The saved HTML text is searchable below; it is not a substitute for the complete PDF."
                : "Upload the actual report to enable protected preview and download."}
            </Notice>
          )}
          {files.map((a) => (
            <Stack key={a.id} gap="xs">
              <Stack direction="row" gap="sm" wrap>
                <Paragraph>{a.name}</Paragraph>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setPreview(preview === a.id ? "" : a.id)}
                >
                  Preview PDF
                </Button>
                <Link
                  href={`/api/attachments/${a.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open PDF
                </Link>
                <Link href={`/api/attachments/${a.id}?download`}>
                  Download PDF
                </Link>
              </Stack>
              <Paragraph size="xs" color="muted">
                {date(a.created_at)} · {a.indexing_status}
              </Paragraph>
            </Stack>
          ))}
          {preview && (
            <iframe
              className="a1-sce-pdf"
              title="Protected report PDF preview"
              src={`/api/attachments/${preview}`}
            />
          )}
          {canEdit && (
            <label>
              Upload a PDF revision (up to {maxUploadBytes / 1024 / 1024} MB)
              <input
                disabled={uploading}
                className="a1-sce-file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setUploading(true);
                  setError("");
                  try {
                    if (file.size > maxUploadBytes)
                      throw new Error(
                        `Choose a PDF smaller than ${maxUploadBytes / 1024 / 1024} MB.`,
                      );
                    const response = await fetch(
                      `/api/attachments?report=${record.id}&name=${encodeURIComponent(file.name)}`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/pdf" },
                        body: file,
                      },
                    );
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.error);
                    await refresh();
                    announce(
                      `PDF saved as a new attachment. ${result.indexing}.`,
                    );
                  } catch (e) {
                    setError(e.message);
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            </label>
          )}
          {uploading && (
            <Paragraph role="status">
              Saving the PDF and checking text extraction…
            </Paragraph>
          )}
          <Feedback message={error} onClose={() => setError("")} persistent />
        </Stack>
      </Card>
    </Stack>
  );
}
