import { Markdown } from "./Markdown.jsx";
import React, { useState, useEffect } from "react";
import {
  Stack,
  Grid,
  Paragraph,
  Button,
  DataTable,
  Link,
  CheckboxGroup,
  Dialog,
  Breadcrumb,
} from "@gtivr4/a1-design-system-react";
import {
  useWorkspace,
  api,
  PageTitle,
  Page,
  Field,
  Select,
  Status,
  Tags,
  SourceLink,
  ActionDialog,
  Notice,
  Feedback,
} from "./ui.jsx";
import { statuses, readiness, groups, textOf } from "./model.mjs";

export function ImportDialog({ onClose }) {
  const { dataset, refresh, announce } = useWorkspace();
  const [text, setText] = useState(""),
    [format, setFormat] = useState("json"),
    [preview, setPreview] = useState(null),
    [duplicates, setDuplicates] = useState("skip"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <ActionDialog
      title="Import guidelines"
      label={preview ? `Import ${preview.rows.length} rows` : "Preview import"}
      onClose={onClose}
      onSubmit={async () => {
        if (!preview) {
          const result = await api("/import", { text, format, dataset });
          setPreview(result);
          return false;
        }
        const result = await api("/import", {
          text,
          format,
          dataset,
          duplicates,
          commit: true,
        });
        await refresh();
        announce(
          `${result.count} records imported. ${result.skipped} duplicates skipped.`,
        );
      }}
    >
      <Paragraph>
        New records start unreviewed. Original text and source references are
        retained. No live Figma connection is configured; you can import a
        structured export here.
      </Paragraph>
      <Select
        label="Format"
        value={format}
        onChange={(v) => {
          setFormat(v);
          setPreview(null);
        }}
        options={[
          { value: "json", label: "Structured JSON" },
          { value: "csv", label: "CSV" },
          { value: "text", label: "Pasted text" },
        ]}
      />
      <label>
        Choose a text, CSV or JSON file{" "}
        <input
          className="a1-sce-file"
          type="file"
          accept=".json,.csv,.txt,.md"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
              setError("Choose a file smaller than 2 MB.");
              return;
            }
            setText(await file.text());
            setFormat(
              file.name.endsWith(".csv")
                ? "csv"
                : file.name.endsWith(".json")
                  ? "json"
                  : "text",
            );
            setPreview(null);
            setError("");
          }}
        />
      </label>
      <Field
        label="Source content"
        value={text}
        onChange={(v) => {
          setText(v);
          setPreview(null);
        }}
        multiline
        rows="lg"
        required
        hint={
          'JSON: [{"id":"rule-1","title":"Clear labels","original":"Source wording","sourceUrl":"https://example.com","tags":["Components:Checkbox"]}]. CSV uses the same columns; separate tags with |.'
        }
      />
      <Feedback message={error} onClose={() => setError("")} persistent />
      {preview && (
        <>
          <Notice>
            {preview.rows.length} rows validated.{" "}
            {preview.rows.filter((r) => r.duplicateId || r.repeated).length}{" "}
            duplicate matches. Preview shows the first 20.
          </Notice>
          <Select
            label="Duplicate handling"
            value={duplicates}
            onChange={setDuplicates}
            options={[
              { value: "skip", label: "Skip matching records" },
              {
                value: "update",
                label: "Revise matching source text and flag for re-review",
              },
            ]}
          />
          <DataTable
            caption="Import preview"
            rows={preview.rows.slice(0, 20).map((r, i) => ({
              ...r,
              id: i,
              match: r.repeated
                ? "Repeated in file — skipped"
                : r.duplicateId
                  ? r.changed
                    ? "Source changed"
                    : "Already imported"
                  : "New · unreviewed",
            }))}
            columns={[
              { key: "title", label: "Guideline" },
              {
                key: "original",
                label: "Original text",
                renderCell: ({ value }) => String(value).slice(0, 200),
              },
              { key: "match", label: "Result" },
            ]}
          />
        </>
      )}
    </ActionDialog>
  );
}
export function Guidelines() {
  const { records, canEdit, openImport, openGuideline } = useWorkspace();
  const guidelines = records.filter((r) => r.kind === "guideline");
  const rows = guidelines.map((r) => ({
    ...r,
    decision: r.status || "Unreviewed",
    ownerLabel: r.owner || "Unassigned",
    ...Object.fromEntries(
      groups.map((group) => [
        group,
        (r.tags || []).filter((tag) => tag.startsWith(`${group}:`)),
      ]),
    ),
  }));
  const filters = [
    {
      key: "decision",
      label: "Decision",
      type: "multi",
      options: ["Unreviewed", ...statuses].map((value) => ({
        value,
        label: value === "Needs further discussion" ? "Discuss" : value,
      })),
    },
    ...groups.map((group) => ({
      key: group,
      label: group,
      type: "multi",
      options: [...new Set(rows.flatMap((r) => r[group]))]
        .sort()
        .map((value) => ({ value, label: value.slice(group.length + 1) })),
    })),
    {
      key: "ownerLabel",
      label: "Owner",
      type: "multi",
      options: [...new Set(rows.map((r) => r.ownerLabel))]
        .sort()
        .map((value) => ({ value, label: value })),
    },
  ];
  return (
    <Page
      gap="lg"
      title={
        <PageTitle
          title="Guidelines"
          description="Browse the guidance, add context and choose a decision."
          actions={
            canEdit && (
              <Button icon="upload" onClick={openImport}>
                Import guidelines
              </Button>
            )
          }
        />
      }
    >
      <DataTable
        caption="All guidelines"
        rows={rows}
        filters={filters}
        searchableColumns={[
          {
            key: "title",
            label: "Guidelines",
            searchMatcher: (row, query) =>
              textOf(row).toLowerCase().replace(/\s+/g, "_").includes(query),
          },
        ]}
        defaultPageSize={20}
        pageSizeOptions={[20, 50, 100]}
        defaultSort={{ key: "title", direction: "asc" }}
        columns={[
          {
            key: "title",
            label: "Guideline",
            sortable: true,
            renderCell: ({ row }) => (
              <Stack gap="xs">
                <Link
                  href={`#record/${row.id}`}
                  weight="semibold"
                  onClick={(event) => {
                    event.preventDefault();
                    openGuideline(row.id);
                  }}
                >
                  {row.title}
                </Link>
                <Paragraph size="xs" color="muted">
                  {row.sourceVersion || "Workspace import"}
                </Paragraph>
              </Stack>
            ),
          },
          {
            key: "decision",
            label: "Decision",
            sortable: true,
            renderCell: ({ row }) => (
              <Status value={row.status} needsReview={row.needsReview} />
            ),
          },
          {
            key: "tags",
            label: "Applies to",
            renderCell: ({ row }) => <Tags tags={row.tags} />,
          },
          { key: "ownerLabel", label: "Owner", sortable: true },
        ]}
        emptyTitle="No matching guidelines"
        emptyDescription="Adjust the filters or import guidelines."
      />
    </Page>
  );
}

export function GuidelineDialog({ record, onClose }) {
  const { canEdit, canReview, refresh, announce } = useWorkspace();
  const [owner, setOwner] = useState(record.owner || "");
  const [tags, setTags] = useState(
    Object.fromEntries(
      groups.map((group) => [
        group,
        (record.tags || [])
          .filter((tag) => tag.startsWith(`${group}:`))
          .map((tag) => tag.slice(group.length + 1))
          .join(", "),
      ]),
    ),
  );
  const [classification, setClassification] = useState(record.readiness || []);
  const [open, setOpen] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  // Close natively first so A1 restores focus to the table link.
  useEffect(() => {
    if (!open) onClose();
  }, [open, onClose]);
  async function review(status) {
    setBusy(true);
    setError("");
    try {
      await api(`/records/${record.id}/review`, {
        revision: record.revision,
        status,
        ...(canEdit
          ? {
              metadata: {
                owner,
                readiness: classification,
                tags: groups.flatMap((group) =>
                  tags[group]
                    .split(",")
                    .map((value) => value.trim())
                    .filter(Boolean)
                    .map((value) => `${group}:${value}`),
                ),
              },
            }
          : {}),
      });
      await refresh();
      announce(
        status === "Needs further discussion"
          ? "Guideline marked for discussion."
          : `Guideline ${status.toLowerCase()}.`,
      );
      setOpen(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open={open}
      title={record.title}
      aria-label={record.title}
      size="lg"
      onClose={busy ? undefined : () => setOpen(false)}
      footer={
        <>
          <Button
            disabled={!canReview || busy}
            onClick={() => review("Approved")}
          >
            Approve
          </Button>
          <Button
            variant="secondary"
            disabled={!canReview || busy}
            onClick={() => review("Rejected")}
          >
            Reject
          </Button>
          <Button
            variant="secondary"
            disabled={!canReview || busy}
            onClick={() => review("Needs further discussion")}
          >
            Discuss
          </Button>
          <Button
            variant="tertiary"
            disabled={busy}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </>
      }
    >
      <Stack gap="md">
        <Breadcrumb
          backLabel="Back to guidelines"
          items={[
            {
              label: "Guidelines",
              href: "#guidelines",
              onClick: (event) => {
                event.preventDefault();
                if (!busy) setOpen(false);
              },
            },
            { label: record.title },
          ]}
        />
        <Status value={record.status} needsReview={record.needsReview} />
        <Markdown>{record.proposed || record.original}</Markdown>
        <Stack direction="row" gap="sm" wrap align="center">
          {record.sourceUrl && (
            <SourceLink url={record.sourceUrl}>Source</SourceLink>
          )}
          <Paragraph size="xs" color="muted">
            {record.sourceVersion || "Workspace import"}
            {record.nodeRef ? ` · ${record.nodeRef}` : ""}
          </Paragraph>
        </Stack>
        {canEdit ? (
          <>
            <Field
              label="Owner"
              size="compact"
              value={owner}
              onChange={setOwner}
            />
            <Grid columns={{ xs: 1, sm: 2 }} gap="sm">
              {groups.map((group) => (
                <Field
                  key={group}
                  label={group}
                  size="compact"
                  value={tags[group]}
                  onChange={(value) =>
                    setTags((previous) => ({ ...previous, [group]: value }))
                  }
                />
              ))}
            </Grid>
            <Paragraph size="xs" color="muted">
              Separate tags with commas. Metadata saves with your decision;
              Cancel discards changes.
            </Paragraph>
            <details>
              <summary className="a1-sce-detail-summary">AI readiness</summary>
              <CheckboxGroup
                label="Classification"
                options={readiness.map((value) => ({ value, label: value }))}
                value={classification}
                onChange={setClassification}
              />
            </details>
          </>
        ) : (
          <>
            <Paragraph size="sm">
              Owner: {record.owner || "Unassigned"}
            </Paragraph>
            <Tags tags={record.tags} />
            {record.readiness?.length > 0 && (
              <Paragraph size="sm">{record.readiness.join(" · ")}</Paragraph>
            )}
          </>
        )}
        <Feedback message={error} onClose={() => setError("")} persistent />
      </Stack>
    </Dialog>
  );
}
