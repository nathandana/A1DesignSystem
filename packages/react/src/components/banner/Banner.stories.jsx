import { useState } from "react";
import { Banner } from "./Banner.jsx";
import { Button } from "../button/Button.jsx";
import { Link } from "../link/Link.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const STATUSES = ["neutral", "info", "success", "warn", "error"];

const EXAMPLES = {
  neutral: { title: "Scheduled maintenance",  body: "The platform will be unavailable on Sunday from 2–4 AM UTC." },
  info:    { title: "New feature available",  body: "Dashboard exports are now supported in CSV and PDF formats." },
  success: { title: "Migration complete",     body: "All records have been transferred successfully." },
  warn:    { title: "Action required",        body: "Your billing information is out of date. Update it to avoid service interruption." },
  error:   { title: "Service disruption",     body: "We are experiencing issues with the payment gateway. Our team is investigating." },
};

const meta = {
  title: "Components/Messaging/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    variant: "inline",
    status: "info",
    title: "New feature available",
    children: "Dashboard exports are now supported in CSV and PDF formats.",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["inline", "system"],
    },
    status: {
      control: "inline-radio",
      options: STATUSES,
    },
    title:    { control: "text" },
    children: { control: "text", name: "body" },
    icon:     { control: "text", description: "Override the default status icon (Material Symbols name)" },
  },
};

export default meta;

export const Configurable = {
  parameters: { layout: "padded" },
  render: (args) => {
    const [visible, setVisible] = useState(true);
    if (!visible) return (
      <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>
        Dismissed.{" "}
        <button onClick={() => setVisible(true)} style={{ fontFamily: "inherit", fontSize: "inherit", cursor: "pointer" }}>Show again</button>
      </p>
    );
    return (
      <Banner
        {...args}
        action={args.variant === "system"
          ? <Button variant="tertiary" size="sm">Take action</Button>
          : <Link href="#">Learn more</Link>
        }
        onDismiss={() => setVisible(false)}
      />
    );
  },
};

/* ── Inline: all statuses ─────────────────────────────────────────────────── */

export const InlineStatuses = {
  name: "Inline — all statuses",
  parameters: { layout: "padded", controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
      {STATUSES.map(status => (
        <Banner key={status} variant="inline" status={status} title={EXAMPLES[status].title}>
          {EXAMPLES[status].body}
        </Banner>
      ))}
    </div>
  ),
};

/* ── Inline: with link ────────────────────────────────────────────────────── */

export const InlineWithLink = {
  name: "Inline — with link",
  parameters: { layout: "padded", controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
      {STATUSES.map(status => (
        <Banner
          key={status}
          variant="inline"
          status={status}
          title={EXAMPLES[status].title}
          action={<Link href="#">Learn more</Link>}
        >
          {EXAMPLES[status].body}
        </Banner>
      ))}
    </div>
  ),
};

/* ── Inline: with button ──────────────────────────────────────────────────── */

export const InlineWithButton = {
  name: "Inline — with button",
  parameters: { layout: "padded", controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
      {STATUSES.map(status => (
        <Banner
          key={status}
          variant="inline"
          status={status}
          title={EXAMPLES[status].title}
          action={<Button variant="tertiary" size="sm">Take action</Button>}
        >
          {EXAMPLES[status].body}
        </Banner>
      ))}
    </div>
  ),
};

/* ── Inline: dismissable ──────────────────────────────────────────────────── */

export const InlineDismissable = {
  name: "Inline — dismissable",
  parameters: { layout: "padded", controls: { include: ["status"] } },
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible
      ? <Banner {...args} variant="inline" title={EXAMPLES[args.status ?? "info"].title} action={<Link href="#">Details</Link>} onDismiss={() => setVisible(false)}>{EXAMPLES[args.status ?? "info"].body}</Banner>
      : <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>Dismissed.</p>;
  },
};

/* ── System: all statuses ─────────────────────────────────────────────────── */

export const SystemStatuses = {
  name: "System — all statuses",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {STATUSES.map(status => (
        <Banner key={status} variant="system" status={status} title={EXAMPLES[status].title}>
          {EXAMPLES[status].body}
        </Banner>
      ))}
    </div>
  ),
};

/* ── System: with link ────────────────────────────────────────────────────── */

export const SystemWithLink = {
  name: "System — with link",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {STATUSES.map(status => (
        <Banner
          key={status}
          variant="system"
          status={status}
          title={EXAMPLES[status].title}
          action={<Link href="#">Learn more</Link>}
        >
          {EXAMPLES[status].body}
        </Banner>
      ))}
    </div>
  ),
};

/* ── System: with button ──────────────────────────────────────────────────── */

export const SystemWithButton = {
  name: "System — with button",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {STATUSES.map(status => (
        <Banner
          key={status}
          variant="system"
          status={status}
          title={EXAMPLES[status].title}
          action={<Button variant="tertiary" size="sm">Take action</Button>}
        >
          {EXAMPLES[status].body}
        </Banner>
      ))}
    </div>
  ),
};

/* ── System: dismissable ──────────────────────────────────────────────────── */

export const SystemDismissable = {
  name: "System — dismissable",
  parameters: { controls: { include: ["status"] } },
  render: (args) => {
    const [dismissed, setDismissed] = useState([]);
    const visible = STATUSES.filter(s => !dismissed.includes(s));
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {visible.length === 0 && (
          <div style={{ padding: "var(--base-spacing-24)", fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>
            All dismissed.{" "}
            <button onClick={() => setDismissed([])} style={{ fontFamily: "inherit", fontSize: "inherit", cursor: "pointer" }}>Reset</button>
          </div>
        )}
        {visible.map(status => (
          <Banner
            key={status}
            variant="system"
            status={status}
            title={EXAMPLES[status].title}
            action={<Link href="#">Details</Link>}
            onDismiss={() => setDismissed(d => [...d, status])}
          >
            {EXAMPLES[status].body}
          </Banner>
        ))}
      </div>
    );
  },
};

/* ── System: in context ───────────────────────────────────────────────────── */

export const SystemInContext = {
  name: "System — in context",
  parameters: { controls: { include: ["status"] } },
  render: (args) => {
    const [visible, setVisible] = useState(true);
    const status = args.status ?? "warn";
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "320px" }}>
        {visible && (
          <Banner
            variant="system"
            status={status}
            title={EXAMPLES[status].title}
            action={<Button variant="tertiary" size="sm">Resolve</Button>}
            onDismiss={() => setVisible(false)}
          >
            {EXAMPLES[status].body}
          </Banner>
        )}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "0 var(--base-spacing-24)",
          height: "64px",
          borderBottom: "1px solid var(--semantic-color-border-subtle)",
          background: "var(--semantic-color-surface-page)",
        }}>
          <Heading as="h1" size="sm">My Application</Heading>
        </div>
        <div style={{ padding: "var(--base-spacing-32) var(--base-spacing-24)" }}>
          <Paragraph color="muted">Page content appears here below the header.</Paragraph>
        </div>
      </div>
    );
  },
};
