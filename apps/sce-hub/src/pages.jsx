import { Audit } from "./audit.jsx";
export { Audit } from "./audit.jsx";
import { Markdown } from "./Markdown.jsx";
import React, { useState, useEffect } from "react";
import {
  Stack,
  Grid,
  GridItem,
  Section,
  Card,
  Heading,
  Paragraph,
  Button,
  Link,
  Icon,
  Stat,
  DataTable,
  MessageBadge,
  CheckboxGroup,
} from "@gtivr4/a1-design-system-react";
import {
  useWorkspace,
  api,
  go,
  PageTitle,
  Page,
  Empty,
  Notice,
  Feedback,
  Field,
  Select,
  Status,
  RecordLinks,
  SourceLink,
  ActionDialog,
  Confirm,
  EditRecord,
  date,
} from "./ui.jsx";
import { statuses, kinds, nyDate, safeUrl } from "./model.mjs";

export function Overview() {
  const { records, dataset, canEdit, openImport, setDataset } = useWorkspace(),
    [create, setCreate] = useState(false);
  const guidelines = records.filter((r) => r.kind === "guideline"),
    review = guidelines.filter(
      (r) =>
        !r.status || r.needsReview || r.status === "Needs further discussion",
    ),
    report = records.find((r) => r.kind === "report"),
    initiatives = records.filter((r) => r.kind === "initiative"),
    featured = records.filter(
      (r) => r.featured && (r.kind !== "guideline" || r.status === "Approved"),
    );
  return (
    <Page
      gap="xl"
      title={
        <PageTitle
          title="Work, with a clear thread."
          description="Nathan Dana’s design-system and AI-readiness workspace for SCE."
          actions={
            <Button icon="rule" onClick={() => go("guidelines")}>
              Open review queue
            </Button>
          }
        />
      }
    >
      <Section
        surface="accent"
        padding="md"
        radius="lg"
        borderSize="xs"
        borderVariant="accent"
      >
        <Grid columns={{ xs: 1, lg: 3 }} gap="xl" alignItems="center">
          <GridItem span={{ xs: 1, lg: 2 }}>
            <Stack gap="md">
              <Paragraph size="sm" weight="semibold">
                Design system / AI readiness
              </Paragraph>
              <Heading as="h2" type="display" size={{ xs: "sm", md: "md" }}>
                Make the system
                <br />
                easier to understand.
                <br />
                And easier to build with.
              </Heading>
              <Paragraph>
                Connect the guidance, the implementation and the evidence.
                Review what exists, make decisions visible and turn agreed
                direction into useful work.
              </Paragraph>
              <Stack direction="row" gap="sm" wrap>
                {canEdit && (
                  <Button icon="upload" onClick={openImport}>
                    Import documentation
                  </Button>
                )}
                <Button
                  variant="secondary"
                  icon="account_tree"
                  onClick={() => go("map")}
                >
                  Explore dependencies
                </Button>
              </Stack>
            </Stack>
          </GridItem>
          <Card>
            <Stack gap="md">
              <MessageBadge subtle size="sm" icon="lock">
                Your working space
              </MessageBadge>
              <Heading as="h3" size="sm">
                A clear path from source to decision
              </Heading>
              {[
                "Import source documentation",
                "Review wording and applicability",
                "Explore dependencies",
                "Record a decision and rationale",
                "Curate the weekly summary",
              ].map((s, i) => (
                <Stack key={s} direction="row" gap="sm" align="start">
                  <Paragraph color="muted" size="sm">
                    0{i + 1}
                  </Paragraph>
                  <Paragraph size="sm">{s}</Paragraph>
                </Stack>
              ))}
              <Paragraph size="xs" color="muted">
                Independent project workspace. Not an official SCE product.
              </Paragraph>
            </Stack>
          </Card>
        </Grid>
      </Section>
      <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
        {[
          [
            guidelines.length,
            "Guideline candidates",
            "Source statements, awaiting review",
            "rule",
          ],
          [
            review.length,
            "Need attention",
            "Unreviewed, open or changed",
            "rate_review",
          ],
          [
            guidelines.filter((r) => r.status === "Approved" && !r.needsReview)
              .length,
            "Approved guidance",
            "Recorded decisions, current wording",
            "task_alt",
          ],
          [
            records.filter((r) => r.kind === "finding").length,
            "Audit findings",
            "From the supplied source",
            "fact_check",
          ],
        ].map(([value, title, description, icon]) => (
          <Card key={title}>
            <Stat
              value={value}
              title={title}
              description={description}
              icon={icon}
              size="md"
            />
          </Card>
        ))}
      </Grid>
      <Grid columns={{ xs: 1, lg: 3 }} gap="lg">
        <GridItem span={{ xs: 1, lg: 2 }}>
          <Stack gap="lg">
            <Stack direction="row" justify="between" align="center" wrap>
              <Heading as="h2" size="md">
                Current work
              </Heading>
              {canEdit && (
                <Button
                  size="sm"
                  variant="tertiary"
                  icon="add"
                  onClick={() => setCreate(true)}
                >
                  Add initiative
                </Button>
              )}
            </Stack>
            <Card>
              <Stack gap="md">
                <Stack direction="row" justify="between" wrap>
                  <MessageBadge subtle size="sm" icon="library_books">
                    Source review
                  </MessageBadge>
                  <Paragraph size="xs" color="muted">
                    {dataset === "sce"
                      ? "SCE Design System 1.7"
                      : "Fictional collection"}
                  </Paragraph>
                </Stack>
                <Heading as="h3" size="sm">
                  A shared language for design and implementation
                </Heading>
                <Paragraph color="muted">
                  Review original guidance alongside proposed wording. Agree on
                  intent, assign ownership and identify what an agent or a test
                  could reliably apply.
                </Paragraph>
                <Link
                  href="#guidelines"
                  icon="arrow_forward"
                  iconPosition="end"
                >
                  Review guidelines
                </Link>
              </Stack>
            </Card>
            {report && (
              <Card>
                <Stack gap="md">
                  <MessageBadge subtle size="sm" status="warn">
                    Preliminary source findings
                  </MessageBadge>
                  <Heading as="h3" size="sm">
                    Website audit: evidence before assumptions
                  </Heading>
                  <Paragraph color="muted">
                    The supplied audit covers accessibility, technology,
                    responsive behavior and design-system consistency.
                  </Paragraph>
                  <Paragraph size="sm">{report.body}</Paragraph>
                  <Link
                    href={`#record/${report.id}`}
                    icon="arrow_forward"
                    iconPosition="end"
                  >
                    Read the executive summary
                  </Link>
                </Stack>
              </Card>
            )}
            {initiatives.map((r) => (
              <Card key={r.id}>
                <Stack gap="sm">
                  <Link href={`#record/${r.id}`} weight="semibold">
                    {r.title}
                  </Link>
                  <Markdown>{r.summary}</Markdown>
                  <Paragraph size="xs" color="muted">
                    {r.owner || "Unassigned"} · Review: {date(r.reviewDate)}
                  </Paragraph>
                </Stack>
              </Card>
            ))}
          </Stack>
        </GridItem>
        <Stack gap="lg">
          <Heading as="h2" size="md">
            What needs a decision
          </Heading>
          <Card>
            <Stack gap="md">
              <Heading as="h3" size="sm">
                Start with one guideline
              </Heading>
              <Paragraph size="sm" color="muted">
                Imported source text is never treated as approval. Read the
                context, propose clearer wording and leave a reason for the
                decision.
              </Paragraph>
              {review.slice(0, 3).map((r) => (
                <Stack key={r.id} gap="xs">
                  <Link href={`#record/${r.id}`}>{r.title}</Link>
                  <Status value={r.status} needsReview={r.needsReview} />
                </Stack>
              ))}
              {!review.length && (
                <Paragraph size="sm">
                  No guidelines currently need review.
                </Paragraph>
              )}
            </Stack>
          </Card>
          <Card surface="info">
            <Stack gap="md">
              <Icon name="science" color="info" size="lg" />
              <Heading as="h3" size="sm">
                Try the whole workflow
              </Heading>
              <Paragraph size="sm">
                A separate fictional collection connects a checkbox review, a
                dependency map and a weekly summary.
              </Paragraph>
              <Button
                variant="secondary"
                onClick={() => {
                  setDataset("demo");
                  go("map");
                }}
              >
                Explore the demonstration
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Grid>
      <Stack gap="md">
        <Heading as="h2" size="md">
          Featured work
        </Heading>
        {featured.length ? (
          featured.map((r) => (
            <Card key={r.id}>
              <Stack gap="sm">
                <Link href={`#record/${r.id}`}>{r.title}</Link>
                <Markdown>{r.summary || r.proposed}</Markdown>
                <Status value={r.status} />
              </Stack>
            </Card>
          ))
        ) : (
          <Empty title="A place for the work worth sharing">
            Feature approved guidelines or curated artifacts from their detail
            pages. No accomplishments or measured impact have been assumed.
          </Empty>
        )}
      </Stack>
      {create && (
        <EditRecord kind="initiative" onClose={() => setCreate(false)} />
      )}
    </Page>
  );
}

export function Notes() {
  const { records, canEdit, dataset, run } = useWorkspace();
  const [week, setWeek] = useState(nyDate()),
    [generate, setGenerate] = useState(false);
  const notes = records.filter((r) => r.kind === "weekly");
  return (
    <Page
      gap="lg"
      title={
        <PageTitle
          title="Weekly summaries"
          description="Tell the story of the week, with links back to the work. Drafts use America/New_York week boundaries."
          actions={
            canEdit && (
              <Button icon="add" onClick={() => setGenerate(true)}>
                Draft this week
              </Button>
            )
          }
        />
      }
    >
      {notes.length ? (
        <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
          {notes.map((r) => (
            <Card key={r.id}>
              <Stack gap="md">
                <Status value={r.status} />
                <Link href={`#record/${r.id}`} weight="semibold">
                  {r.title}
                </Link>
                <Markdown>{r.summary}</Markdown>
                <Paragraph size="sm" color="muted">
                  {r.version || r.week || "Draft"} · {r.owner || "Unassigned"} ·{" "}
                  {date(r.updatedAt)}
                </Paragraph>
              </Stack>
            </Card>
          ))}
        </Grid>
      ) : (
        <Empty title="Your first weekly summary starts with the work">
          Create an editable draft, link its evidence and review the wording
          before publishing.
        </Empty>
      )}
      {generate && (
        <ActionDialog
          title="Generate a weekly draft"
          label="Generate draft"
          onClose={() => setGenerate(false)}
          onSubmit={async () => {
            const r = await api("/weekly", { date: week, dataset });
            await run(
              async () => r,
              "Weekly draft created. Review the claims before publishing.",
            );
            go(`record/${r.id}`);
          }}
        >
          <Field
            label="Choose a date in the week"
            type="date"
            value={week}
            onChange={setWeek}
            required
          />
          <Paragraph>
            Monday through Sunday in America/New_York, including daylight-saving
            changes. Drafts link current records last updated in that week, not
            a complete history of changes. Nothing is sent or published
            automatically.
          </Paragraph>
        </ActionDialog>
      )}
    </Page>
  );
}

export function RecordDetail({ id }) {
  const { records, canEdit, user, run, refresh, announce, dataset } =
    useWorkspace();
  const record = records.find((r) => r.id === id);
  const [edit, setEdit] = useState(false),
    [history, setHistory] = useState(null),
    [confirm, setConfirm] = useState(""),
    [restore, setRestore] = useState(null);
  if (!record)
    return (
      <Page gap="lg" title={<PageTitle title="Record unavailable" />}>
        <Empty>
          This record is not in the current collection or has been deleted.
          Select the correct collection from the navigation.
        </Empty>
        <Link href="#overview">Return to overview</Link>
      </Page>
    );
  const publishable = record.kind === "weekly";
  return (
    <Page
      gap="lg"
      title={
        <PageTitle
          eyebrow={record.kind}
          meta={{ label: `Revision ${record.revision}`, icon: "history" }}
          title={record.title}
          actions={
            canEdit &&
            record.kind !== "guideline" && (
              <Button icon="edit" onClick={() => setEdit(true)}>
                Edit
              </Button>
            )
          }
        />
      }
    >
      {record.kind === "report" ? (
        <Audit recordId={record.id} />
      ) : (
        <Card>
          <Stack gap="lg">
            {record.status && <Status value={record.status} />}
            <Markdown>{record.summary}</Markdown>
            {record.original && (
              <>
                <Heading as="h2" size="sm">
                  Original source
                </Heading>
                <Markdown
                  sourcePath={record.localPath}
                  records={records}
                  headingLevel={3}
                >
                  {record.original}
                </Markdown>
              </>
            )}
            {record.body && <Markdown>{record.body}</Markdown>}
            {record.kind === "finding" && (
              <>
                <Paragraph>
                  Source severity: {record.severity || "Not specified"} ·
                  Confidence: {record.confidence || "Not specified"}
                </Paragraph>
                <Heading as="h2" size="sm">
                  Recommended correction
                </Heading>
                <Markdown>
                  {record.recommendation || "No recommendation supplied."}
                </Markdown>
                <Paragraph size="sm" color="muted">
                  {record.sourceVersion}{" "}
                  {record.sourcePage &&
                    `· Source table page ${record.sourcePage}`}
                </Paragraph>
              </>
            )}
            {record.sourceUrl && <SourceLink url={record.sourceUrl} />}
            <Heading as="h2" size="sm">
              Linked records and evidence
            </Heading>
            <RecordLinks ids={record.links} />
            <Paragraph size="sm" color="muted">
              {record.owner || "Unassigned"} · Updated {date(record.updatedAt)}
            </Paragraph>
          </Stack>
        </Card>
      )}
      <Card>
        <Stack gap="md">
          <Heading as="h2" size="sm">
            Record actions
          </Heading>
          <Stack direction="row" gap="sm" wrap>
            {publishable && canEdit && (
              <Button
                disabled={record.status === "Published"}
                onClick={() => setConfirm("publish")}
              >
                Publish summary
              </Button>
            )}
            {canEdit && (
              <Button
                variant="secondary"
                onClick={() =>
                  run(
                    () =>
                      api(
                        `/records/${id}`,
                        {
                          revision: record.revision,
                          reason: record.featured
                            ? "Removed from overview."
                            : "Curated for overview.",
                          featured: !record.featured,
                        },
                        "PATCH",
                      ),
                    "Overview curation updated.",
                  )
                }
              >
                {record.featured
                  ? "Remove from overview"
                  : "Feature on overview"}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() =>
                run(async () => {
                  setHistory(await api(`/records/${id}/history`));
                })
              }
            >
              View revision history
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                run(async () => {
                  await navigator.clipboard.writeText(
                    `${record.title}\n\n${record.proposed || record.summary || record.original || ""}\n\n${record.body || ""}\n\nStatus: ${record.status || "Unreviewed"}\nRecord: ${location.href}`,
                  );
                }, "Record copied with its current status.")
              }
            >
              Copy record
            </Button>
            {user.role === "owner" &&
              dataset === "demo" &&
              !["source", "report", "finding", "view"].includes(
                record.kind,
              ) && (
                <Button variant="secondary" onClick={() => setConfirm("share")}>
                  {record.shareApproved
                    ? "Remove public clearance"
                    : "Clear for public demo"}
                </Button>
              )}
            {canEdit && (
              <Button variant="tertiary" onClick={() => setConfirm("delete")}>
                Delete record
              </Button>
            )}
          </Stack>
          <Paragraph size="sm" color="muted">
            Publication stays inside the private workspace. Public
            demonstrations require separate owner clearance and an explicitly
            enabled deployment setting.
          </Paragraph>
        </Stack>
      </Card>
      {history && (
        <Card>
          <Stack gap="md">
            <Heading as="h2" size="sm">
              Revision history
            </Heading>
            {history.map((h) => (
              <details key={h.revision}>
                <summary className="a1-sce-detail-summary">
                  Revision {h.revision} · {date(h.created_at)} · {h.actor}
                </summary>
                <Stack gap="sm">
                  <Paragraph>{h.reason}</Paragraph>
                  <Paragraph as="pre" size="xs" className="a1-sce-prose">
                    {JSON.stringify(h.payload, null, 2)}
                  </Paragraph>
                  {canEdit && h.revision !== record.revision && (
                    <Button
                      variant="secondary"
                      onClick={() => setRestore(h.revision)}
                    >
                      Restore wording and details from revision {h.revision}
                    </Button>
                  )}
                </Stack>
              </details>
            ))}
          </Stack>
        </Card>
      )}
      {edit && <EditRecord record={record} onClose={() => setEdit(false)} />}
      {confirm && (
        <Confirm
          title={
            confirm === "delete"
              ? "Delete this record?"
              : confirm === "share"
                ? "Change public demonstration clearance?"
                : "Publish these notes?"
          }
          label={
            confirm === "delete"
              ? "Delete record"
              : confirm === "share"
                ? "Save clearance"
                : "Publish notes"
          }
          onClose={() => setConfirm("")}
          onSubmit={async (reason) => {
            if (confirm === "delete") {
              await api(
                `/records/${id}`,
                { revision: record.revision, reason },
                "DELETE",
              );
              await refresh();
              go("overview");
            } else {
              await api(`/records/${id}/${confirm}`, {
                revision: record.revision,
                reason,
                approved: !record.shareApproved,
              });
              await refresh();
              announce("Saved. Current visibility remains unchanged.");
            }
          }}
        >
          <Paragraph>
            {confirm === "delete"
              ? "This record will disappear from search and active views. Its historical revisions remain in the protected audit log. Deleting a node also removes its connections."
              : confirm === "share"
                ? "Only explicitly cleared fictional records can appear in the public demonstration. Approved guidelines and published notes qualify; linked private records and discussion are excluded. Edits remove clearance."
                : "This creates a published workspace artifact. No email is sent and no site visibility changes."}
          </Paragraph>
        </Confirm>
      )}
      {restore && (
        <Confirm
          title={`Restore revision ${restore} as a new revision?`}
          onClose={() => setRestore(null)}
          label="Restore as new revision"
          onSubmit={async (reason) => {
            await api(`/records/${id}/restore`, {
              revision: record.revision,
              restoreRevision: restore,
              reason,
            });
            await refresh();
            setHistory(await api(`/records/${id}/history`));
            announce("New revision saved; prior decisions retained.");
          }}
        >
          <Paragraph>
            Wording and editable details are restored. Decisions and discussion
            remain intact. Guidelines are flagged for re-review when their
            wording changes.
          </Paragraph>
        </Confirm>
      )}
    </Page>
  );
}

export function Search() {
  const { dataset, records } = useWorkspace();
  const [q, setQ] = useState(""),
    [kind, setKind] = useState(""),
    [status, setStatus] = useState(""),
    [owner, setOwner] = useState(""),
    [tag, setTag] = useState(""),
    [since, setSince] = useState(""),
    [result, setResult] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const abort = new AbortController();
    const timer = setTimeout(async () => {
      setBusy(true);
      setError("");
      try {
        const response = await fetch(
          `/api/search?${new URLSearchParams({ dataset, q, kind, status, owner, tag, since })}`,
          { signal: abort.signal },
        );
        const r = await response.json();
        if (response.status === 401)
          window.dispatchEvent(new Event("sce-session-expired"));
        if (!response.ok) throw new Error(r.error);
        setResult(r);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        if (!abort.signal.aborted) setBusy(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      abort.abort();
    };
  }, [dataset, q, kind, status, owner, tag, since]);
  return (
    <Page
      gap="lg"
      title={
        <PageTitle
          title="Search the workspace"
          description="Find guidance, decisions, discussion, dependencies, reports and notes. No AI account required."
        />
      }
    >
      <Card>
        <Stack gap="md">
          <Field
            label="Search all content in this collection"
            value={q}
            onChange={setQ}
            autoFocus
          />
          <Grid columns={{ xs: 1, md: 3 }} gap="md">
            <Select
              label="Content type"
              value={kind}
              onChange={setKind}
              options={[{ value: "", label: "All types" }, ...kinds]}
            />
            <Select
              label="Decision or publication status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "", label: "All statuses" },
                "Unreviewed",
                ...statuses,
                "Draft",
                "Published",
              ]}
            />
            <Field label="Owner" value={owner} onChange={setOwner} />
            <Select
              label="Tag"
              value={tag}
              onChange={setTag}
              options={[
                { value: "", label: "All tags" },
                ...[...new Set(records.flatMap((r) => r.tags || []))].sort(),
              ]}
            />
            <Field
              label="Updated on or after (New York)"
              type="date"
              value={since}
              onChange={setSince}
            />
          </Grid>
        </Stack>
      </Card>
      {busy && <Paragraph role="status">Searching…</Paragraph>}
      <Feedback message={error} onClose={() => setError("")} persistent />
      {result && (
        <>
          <Paragraph role="status" size="sm" color="muted">
            {result.results.length} results shown, up to 100.{" "}
            {result.coverage.records} records searchable.{" "}
            {result.coverage.pdfs
              .map((p) => `${p.count} PDF(s): ${p.indexing_status}`)
              .join(" · ") || "No PDFs uploaded."}
          </Paragraph>
          {result.results.length ? (
            result.results.map((r) => (
              <Card key={r.id}>
                <Stack gap="sm">
                  <Paragraph size="xs" color="muted">
                    {r.kind}
                  </Paragraph>
                  <Link href={`#record/${r.id}`} weight="semibold">
                    {r.title}
                  </Link>
                  <Paragraph size="sm" className="a1-sce-prose">
                    {r.snippet}
                  </Paragraph>
                  {r.status && <Status value={r.status} />}
                </Stack>
              </Card>
            ))
          ) : (
            <Empty title="No matching content">
              Try fewer filters or a broader search term. Missing PDF text is
              not included.
            </Empty>
          )}
        </>
      )}
    </Page>
  );
}

export function Ask() {
  const { dataset, records, setDataset } = useWorkspace();
  const demo = records.find((r) => r.id === "demo-guideline");
  return (
    <Page
      gap="lg"
      title={
        <PageTitle
          title="Ask the workspace"
          description="An optional, read-only assistant. Ordinary workspace search always works independently."
        />
      }
    >
      <Notice>
        No AI provider is configured. No confidential content is sent to an
        external provider. Live answers are unavailable.
      </Notice>
      <Card>
        <Stack gap="md">
          <Heading as="h2" size="sm">
            What a cited response can look like
          </Heading>
          <MessageBadge subtle status="warn">
            Fictional demonstration · not generated live
          </MessageBadge>
          <Paragraph weight="semibold">
            “Which mobile accessibility guidelines need discussion?”
          </Paragraph>
          {dataset === "demo" && demo ? (
            <>
              <Paragraph>
                Source: the example checkbox guideline includes Mobile and
                Accessibility tags. Its current recorded decision is “
                {demo.status || "Unreviewed"}.”
              </Paragraph>
              <Link href="#record/demo-guideline">
                Source: example checkbox guideline, revision {demo.revision}
              </Link>
              <Paragraph>
                Suggestion: agree on acceptance criteria and connect a
                label-association test before treating the guidance as enforced.
              </Paragraph>
              <Paragraph size="sm" color="muted">
                This fixed demonstration only describes its cited example. It
                does not assess the SCE collection or claim complete coverage.
              </Paragraph>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setDataset("demo")}>
              View the fictional cited example
            </Button>
          )}
          <Button as="a" href="#search" variant="secondary" icon="search">
            Search the workspace
          </Button>
        </Stack>
      </Card>
      <Paragraph color="muted">
        Enabling a live provider requires a separate implementation and owner
        approval of the provider and content sent. The first release has no
        external AI processing, automatic approvals or publishing.
      </Paragraph>
    </Page>
  );
}

export function Visitor({ publicView = false }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [q, setQ] = useState("");
  useEffect(() => {
    api(publicView ? "/public" : "/visitor")
      .then(setData)
      .catch((e) => setError(e.message));
  }, [publicView]);
  return (
    <Page
      gap="lg"
      contentWidth="lg"
      title={
        <PageTitle
          contentWidth="lg"
          title={
            publicView
              ? "SCE workspace demonstration"
              : "Visitor access preview"
          }
          description="Only individually cleared fictional records can appear here. Real SCE source material is excluded."
        />
      }
    >
      <Feedback message={error} onClose={() => setError("")} persistent />
      {data && (
        <>
          <Notice>
            {data.enabled === false
              ? "Public access is disabled. This owner-only preview shows the allowlisted content that could be exposed if enabled."
              : "Fictional demonstration content only."}
          </Notice>
          <Field
            label="Search visitor-visible content"
            value={q}
            onChange={setQ}
          />
          {data.records
            .filter((r) =>
              JSON.stringify(r).toLowerCase().includes(q.toLowerCase()),
            )
            .map((r) => (
              <Card key={r.id}>
                <Stack gap="sm">
                  <Heading as="h2" size="sm">
                    {r.title}
                  </Heading>
                  <Markdown>{r.proposed || r.summary || r.original}</Markdown>
                  <Markdown>{r.body}</Markdown>
                  {r.status && <Status value={r.status} />}
                </Stack>
              </Card>
            ))}
          {!data.records.length && (
            <Empty title="No records cleared for public sharing">
              The private workspace, source records, discussions and files
              remain protected.
            </Empty>
          )}
        </>
      )}
      {!publicView && <Link href="#settings">Back to settings</Link>}
    </Page>
  );
}

export function Settings() {
  const { user, dataset, session, openImport, run, records } = useWorkspace();
  const [users, setUsers] = useState([]),
    [add, setAdd] = useState(false),
    [person, setPerson] = useState({
      name: "",
      email: "",
      role: "viewer",
      password: "",
    }),
    [password, setPassword] = useState(""),
    [current, setCurrent] = useState(""),
    [theme, setTheme] = useState("light");
  useEffect(() => {
    if (user.role === "owner" && !session.localAccess)
      api("/users").then(setUsers);
  }, [user.role, session.localAccess]);
  return (
    <Page
      gap="lg"
      title={
        <PageTitle
          title="Settings and access"
          description="Visibility, collaboration, imports and portable records."
        />
      }
    >
      <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
        <Card>
          <Stack gap="md">
            <Heading as="h2" size="sm">
              Workspace visibility
            </Heading>
            <MessageBadge
              subtle
              icon={session.localAccess ? "computer" : "lock"}
            >
              {session.localAccess
                ? "Local workspace · no sign-in"
                : "Private · server-side sign-in"}
            </MessageBadge>
            <Paragraph>
              {session.localAccess
                ? "Sign-in is bypassed on this computer. You have owner access, and changes are saved to the workspace database."
                : "All workspace data, search and uploaded files require a valid session. This collection is stored in the server’s SQLite database, not in browser storage."}
            </Paragraph>
            <Paragraph size="sm" color="muted">
              Public fictional demonstration:{" "}
              {session.publicDemo
                ? "Enabled for individually cleared records"
                : "Disabled"}
              . SCE source content is always private.
            </Paragraph>
            {user.role === "owner" && (
              <Button as="a" href="#visitor" variant="secondary">
                Preview visitor access
              </Button>
            )}
            <Paragraph size="sm">
              Production requires HTTPS and a persistent storage volume. No site
              has been published by this implementation.
            </Paragraph>
          </Stack>
        </Card>
        <Card>
          <Stack gap="md">
            <Heading as="h2" size="sm">
              Import and export
            </Heading>
            <Paragraph>
              Preserve source text, decisions and versions. Export includes
              records and revisions; download PDFs separately from their
              reports.
            </Paragraph>
            {["owner", "editor"].includes(user.role) && (
              <Button variant="secondary" onClick={openImport}>
                Import documentation
              </Button>
            )}
            <Button
              as="a"
              variant="secondary"
              href={`/api/export?dataset=${dataset}`}
            >
              Export current collection
            </Button>
            <Paragraph size="sm" color="muted">
              JSON and CSV guideline imports include validation and a preview.
              Full database backup/restore is an administrator operation; the
              export is an archival format, not a replacement for the database
              backup.
            </Paragraph>
          </Stack>
        </Card>
      </Grid>
      {user.role === "owner" && !session.localAccess && (
        <Card>
          <Stack gap="md">
            <Stack direction="row" justify="between" wrap>
              <Heading as="h2" size="sm">
                People and permissions
              </Heading>
              <Button icon="person_add" onClick={() => setAdd(true)}>
                Add collaborator
              </Button>
            </Stack>
            <Paragraph size="sm" color="muted">
              Editors edit and publish workspace notes. Reviewers record
              decisions and comments. Viewers read and export. All roles can
              read private material in this workspace. Share credentials
              securely; no invitations are sent.
            </Paragraph>
            <DataTable
              caption="Workspace members"
              rows={users}
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "role", label: "Role" },
                {
                  key: "actions",
                  label: "Access",
                  renderCell: ({ row }) =>
                    row.role !== "owner" ? (
                      <Button
                        size="sm"
                        variant="tertiary"
                        onClick={() =>
                          run(async () => {
                            await api("/users", { id: row.id }, "DELETE");
                            setUsers(await api("/users"));
                          }, "Access revoked; existing sessions invalidated.")
                        }
                      >
                        Revoke access
                      </Button>
                    ) : (
                      "Workspace owner"
                    ),
                },
              ]}
            />
          </Stack>
        </Card>
      )}
      <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
        {!session.localAccess && !session.managedAuth && (
          <Card>
            <Stack gap="md">
              <Heading as="h2" size="sm">
                Your password
              </Heading>
              <Field
                label="Current password"
                value={current}
                onChange={setCurrent}
                type="password"
                autoComplete="current-password"
              />
              <Field
                label="New password"
                value={password}
                onChange={setPassword}
                type="password"
                autoComplete="new-password"
                hint="At least 14 characters. Other sessions will be signed out."
              />
              <Button
                variant="secondary"
                disabled={password.length < 14 || !current}
                onClick={async () => {
                  const result = await run(
                    () => api("/password", { current, password }),
                    "Password changed. Other sessions were signed out.",
                  );
                  if (result) {
                    setCurrent("");
                    setPassword("");
                  }
                }}
              >
                Change password
              </Button>
            </Stack>
          </Card>
        )}
        <Card>
          <Stack gap="md">
            <Heading as="h2" size="sm">
              Appearance and coverage
            </Heading>
            <Select
              label="Appearance"
              value={theme}
              onChange={(v) => {
                setTheme(v);
                document.documentElement.className =
                  v === "accessible"
                    ? "a1-theme-light a1-theme-accessible"
                    : v === "heritage"
                      ? "a1-theme-light a1-theme-heritage"
                      : `a1-theme-${v}`;
              }}
              options={["light", "dark", "accessible", "heritage"]}
            />
            <Paragraph>
              {records.length} current records searchable in this collection.
              PDF extraction status appears on each report. Saved HTML may
              contain only part of the original report.
            </Paragraph>
            <Paragraph size="sm" color="muted">
              Live Figma synchronization, scheduled drafts and external AI
              processing are not configured. No source material is sent to
              external services.
            </Paragraph>
          </Stack>
        </Card>
      </Grid>
      {add && (
        <ActionDialog
          title="Add collaborator"
          label="Create account"
          onClose={() => setAdd(false)}
          onSubmit={async () => {
            await api("/users", person);
            setUsers(await api("/users"));
            setPerson({ name: "", email: "", role: "viewer", password: "" });
          }}
        >
          {["name", "email", "password"].map((k) => (
            <Field
              key={k}
              label={
                k === "name"
                  ? "Name"
                  : k === "email"
                    ? "Email"
                    : "Initial password"
              }
              value={person[k]}
              onChange={(v) => setPerson((s) => ({ ...s, [k]: v }))}
              type={
                k === "password" ? "password" : k === "email" ? "email" : "text"
              }
              required
              minLength={k === "password" ? 14 : undefined}
            />
          ))}
          <Select
            label="Role"
            value={person.role}
            onChange={(v) => setPerson((s) => ({ ...s, role: v }))}
            options={["viewer", "reviewer", "editor"]}
          />
          <Paragraph>
            The account is created immediately. No email or external message is
            sent.
          </Paragraph>
        </ActionDialog>
      )}
    </Page>
  );
}
