import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Stack,
  Section,
  Heading,
  Paragraph,
  Button,
  Dialog,
  TextField,
  TextareaField,
  SelectField,
  MessageBadge,
  Card,
  Link,
  CheckboxGroup,
  Snackbar,
  PageTitle as A1PageTitle,
} from "@gtivr4/a1-design-system-react";
import { safeUrl, groups } from "./model.mjs";
export const Workspace = createContext(null);
export const useWorkspace = () => useContext(Workspace);
export const go = (route) => {
  location.hash = route;
};
export async function api(
  path,
  data,
  method = data === undefined ? "GET" : "POST",
) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: data === undefined ? {} : { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const result = await res.json();
  if (res.status === 401 && path !== "/login")
    window.dispatchEvent(new Event("sce-session-expired"));
  if (!res.ok) throw new Error(result.error || "The request failed.");
  return result;
}
export const date = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeZone: "America/New_York",
      }).format(new Date(value.length === 10 ? `${value}T12:00:00Z` : value))
    : "Not set";
export function Status({ value, needsReview }) {
  return (
    <Stack direction="row" gap="xs" wrap>
      <MessageBadge
        size="sm"
        subtle
        status={
          value === "Approved" || value === "Published"
            ? "success"
            : value === "Rejected"
              ? "error"
              : value === "Needs further discussion"
                ? "warn"
                : "neutral"
        }
        icon={null}
      >
        {value || "Unreviewed"}
      </MessageBadge>
      {needsReview && (
        <MessageBadge size="sm" subtle status="warn">
          Re-review needed
        </MessageBadge>
      )}
    </Stack>
  );
}
// Keep routing and focus integration local; A1 owns the page-title presentation.
export function PageTitle({ titleId = "page-title", ...props }) {
  const workspace = useWorkspace();
  useEffect(() => {
    document.getElementById(titleId)?.setAttribute("tabindex", "-1");
  }, [titleId, props.title]);
  return (
    <A1PageTitle
      titleId={titleId}
      contentWidth="2xl"
      breadcrumb={workspace?.breadcrumb}
      {...props}
    />
  );
}
// The title is flush with the page; only the following content section is padded.
export function Page({
  title,
  children,
  gap = "lg",
  contentWidth = "2xl",
  ...props
}) {
  const workspace = useWorkspace();
  return (
    <Stack gap="none" {...props}>
      {title}
      <Section
        as="div"
        contentWidth={contentWidth}
        padding={{ xs: "sm", md: "md", xl: "lg" }}
      >
        <Stack gap={gap}>
          {workspace?.dataset === "demo" && (
            <Notice>
              Fictional demonstration collection. These examples do not
              represent SCE decisions, architecture or completed work.
            </Notice>
          )}
          {children}
        </Stack>
      </Section>
    </Stack>
  );
}
export function Empty({ title = "Nothing here yet", children, action }) {
  return (
    <Card>
      <Stack gap="md">
        <Heading as="h2" size="sm">
          {title}
        </Heading>
        <Paragraph color="muted">{children}</Paragraph>
        {action}
      </Stack>
    </Card>
  );
}
export function Notice({ children, error = false }) {
  return (
    <div role={error ? "alert" : "status"}>
      <Card surface={error ? "error" : "info"}>
        <Paragraph size="sm">{children}</Paragraph>
      </Card>
    </div>
  );
}
export function Feedback({ message, onClose, persistent = false, ...props }) {
  if (!message) return null;
  return (
    <Snackbar
      open
      position="bottom"
      autoHideDuration={persistent ? 0 : 6000}
      onClose={onClose}
      {...props}
    >
      {message}
    </Snackbar>
  );
}
export function Field({ label, value = "", onChange, multiline, ...props }) {
  const Component = multiline ? TextareaField : TextField;
  return (
    <Component
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  );
}
export function Select({ label, value, onChange, options, ...props }) {
  return (
    <SelectField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      {options.map((o) => (
        <option
          key={typeof o === "string" ? o : o.value}
          value={typeof o === "string" ? o : o.value}
        >
          {typeof o === "string" ? o : o.label}
        </option>
      ))}
    </SelectField>
  );
}
export function SourceLink({ url, children = "Open original source" }) {
  const valid = safeUrl(url);
  return valid ? (
    <Link href={valid} target="_blank" rel="noreferrer" icon="open_in_new">
      {children}
    </Link>
  ) : (
    <Paragraph size="sm" color="muted">
      No source link supplied
    </Paragraph>
  );
}
export function RecordLinks({ ids = [] }) {
  const { records } = useWorkspace();
  return (
    <Stack gap="sm">
      {ids.length ? (
        ids.map((id) => {
          const r = records.find((x) => x.id === id);
          return r ? (
            <Link key={id} href={`#record/${id}`}>
              {r.title}
            </Link>
          ) : (
            <Paragraph key={id} size="sm" color="muted">
              Linked record unavailable
            </Paragraph>
          );
        })
      ) : (
        <Paragraph size="sm" color="muted">
          No linked records yet
        </Paragraph>
      )}
    </Stack>
  );
}
export function LinkedPicker({ value = [], onChange, exclude }) {
  const { records } = useWorkspace();
  const [q, setQ] = useState("");
  const shown = records
    .filter(
      (r) =>
        r.id !== exclude &&
        (value.includes(r.id) ||
          (q && r.title.toLowerCase().includes(q.toLowerCase()))),
    )
    .slice(0, 30);
  return (
    <Stack gap="sm">
      <Field
        label="Find records to link"
        hint="Search by title; select records below. Links stay in this collection."
        value={q}
        onChange={setQ}
      />
      {shown.length > 0 && (
        <CheckboxGroup
          label="Linked records"
          options={shown.map((r) => ({
            value: r.id,
            label: `${r.title} (${r.kind})`,
          }))}
          value={value}
          onChange={(selection) =>
            onChange([
              ...value.filter((id) => !shown.some((r) => r.id === id)),
              ...selection,
            ])
          }
        />
      )}
    </Stack>
  );
}
export function Tags({ tags = [] }) {
  return (
    <Stack direction="row" gap="xs" wrap>
      {tags.map((tag) => (
        <MessageBadge key={tag} size="sm" subtle icon={null}>
          {tag.split(":").slice(1).join(":")}
        </MessageBadge>
      ))}
    </Stack>
  );
}
export function TagEditor({ value = [], onChange }) {
  const [group, setGroup] = useState(groups[0]),
    [label, setLabel] = useState("");
  return (
    <Stack gap="sm">
      <Stack direction={{ xs: "column", md: "row" }} gap="sm" align="end">
        <Select
          label="Tag group"
          value={group}
          onChange={setGroup}
          options={groups}
        />
        <Field label="Tag name" value={label} onChange={setLabel} />
        <Button
          variant="secondary"
          disabled={!label.trim()}
          onClick={() => {
            onChange([...new Set([...value, `${group}:${label.trim()}`])]);
            setLabel("");
          }}
        >
          Add tag
        </Button>
      </Stack>
      {value.length > 0 && (
        <CheckboxGroup
          label="Current tags (uncheck to remove)"
          options={value.map((v) => ({ value: v, label: v }))}
          value={value}
          onChange={onChange}
        />
      )}
    </Stack>
  );
}
export function ActionDialog({
  title,
  children,
  onClose,
  onSubmit,
  label = "Save changes",
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [open, setOpen] = useState(true);
  // Let A1 close the native dialog and restore its trigger before unmounting it.
  useEffect(() => {
    if (!open) onClose();
  }, [open, onClose]);
  return (
    <Dialog
      open={open}
      title={title}
      aria-label={title}
      size="lg"
      onClose={busy ? undefined : () => setOpen(false)}
    >
      <Stack
        as="form"
        gap="lg"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            const result = await onSubmit();
            if (result !== false) setOpen(false);
          } catch (e) {
            setError(e.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {children}
        <Feedback message={error} onClose={() => setError("")} persistent />
        <Stack direction="row" justify="end" gap="sm">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button type="submit" loading={busy}>
            {label}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
export function Confirm({ title, children, onClose, onSubmit, label }) {
  const [reason, setReason] = useState("");
  return (
    <ActionDialog
      title={title}
      onClose={onClose}
      onSubmit={() => onSubmit(reason)}
      label={label}
    >
      {children}
      <Field
        label="Reason"
        multiline
        value={reason}
        onChange={setReason}
        required
      />
    </ActionDialog>
  );
}
export function EditRecord({ record, kind, defaults = {}, onClose }) {
  const { dataset, refresh, announce } = useWorkspace();
  const [draft, setDraft] = useState(
      record || {
        title: "",
        summary: "",
        body: "",
        owner: "",
        links: [],
        ...defaults,
      },
    ),
    [reason, setReason] = useState("");
  const type = record?.kind || kind;
  const set = (key, value) => setDraft((s) => ({ ...s, [key]: value }));
  return (
    <ActionDialog
      title={`${record ? "Edit" : "Add"} ${type === "weekly" ? "weekly summary" : type}`}
      onClose={onClose}
      onSubmit={async () => {
        const result = await api(
          record ? `/records/${record.id}` : "/records",
          { ...draft, kind: type, dataset, reason, revision: record?.revision },
          record ? "PATCH" : "POST",
        );
        await refresh();
        announce("Saved to the workspace.");
        go(`record/${result.id}`);
      }}
    >
      <Field
        label="Title"
        value={draft.title}
        onChange={(v) => set("title", v)}
        required
      />
      <Field
        label="Summary"
        multiline
        value={draft.summary}
        onChange={(v) => set("summary", v)}
      />
      <Field
        label={type === "finding" ? "Evidence and observation" : "Details"}
        multiline
        rows="lg"
        value={draft.body}
        onChange={(v) => set("body", v)}
      />
      <Field
        label="Owner"
        value={draft.owner}
        onChange={(v) => set("owner", v)}
      />
      {type === "initiative" && (
        <Field
          label="Upcoming review"
          type="date"
          value={draft.reviewDate}
          onChange={(v) => set("reviewDate", v)}
        />
      )}
      {["finding", "report"].includes(type) && (
        <>
          <Field
            label="Source version"
            value={draft.sourceVersion}
            onChange={(v) => set("sourceVersion", v)}
          />
          <Field
            label="Source URL"
            value={draft.sourceUrl}
            onChange={(v) => set("sourceUrl", v)}
          />
          {type === "finding" && (
            <>
              <Field
                label="Severity, as stated in source"
                value={draft.severity}
                onChange={(v) => set("severity", v)}
              />
              <Field
                label="Confidence, as stated in source"
                value={draft.confidence}
                onChange={(v) => set("confidence", v)}
              />
              <Field
                label="Recommendation (proposal)"
                multiline
                value={draft.recommendation}
                onChange={(v) => set("recommendation", v)}
              />
            </>
          )}
        </>
      )}
      <LinkedPicker
        value={draft.links}
        onChange={(v) => set("links", v)}
        exclude={draft.id}
      />
      {record && (
        <Field
          label="Reason for change"
          value={reason}
          onChange={setReason}
          required
        />
      )}
    </ActionDialog>
  );
}
