import { MessageBadge } from "./Message.jsx";

const STATUSES = ["neutral", "info", "success", "warn", "error"];

const meta = {
  title: "Components/Messaging/Badge",
  component: MessageBadge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    status: "success",
    subtle: false,
    children: "Saved",
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: STATUSES,
    },
    size: {
      control: "inline-radio",
      options: ["md", "lg"],
      description: "Badge size",
    },
    subtle: { control: "boolean" },
    children: { control: "text", name: "label" },
    icon: { control: "text", description: "Override the default status icon" },
  },
};

export default meta;

export const Configurable = {};

export const Statuses = {
  name: "Bold — all statuses",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)", flexWrap: "wrap" }}>
      <MessageBadge status="neutral">Default</MessageBadge>
      <MessageBadge status="info">In progress</MessageBadge>
      <MessageBadge status="success">Complete</MessageBadge>
      <MessageBadge status="warn">Pending review</MessageBadge>
      <MessageBadge status="error">Failed</MessageBadge>
    </div>
  ),
};

export const Subtle = {
  name: "Subtle — all statuses",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)", flexWrap: "wrap" }}>
      <MessageBadge status="neutral" subtle>Default</MessageBadge>
      <MessageBadge status="info" subtle>In progress</MessageBadge>
      <MessageBadge status="success" subtle>Complete</MessageBadge>
      <MessageBadge status="warn" subtle>Pending review</MessageBadge>
      <MessageBadge status="error" subtle>Failed</MessageBadge>
    </div>
  ),
};

export const Sizes = {
  name: "Sizes",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-16)", flexWrap: "wrap" }}>
      <MessageBadge status="success" size="md">Medium</MessageBadge>
      <MessageBadge status="success" size="lg">Large</MessageBadge>
      <MessageBadge status="success" subtle size="md">Medium subtle</MessageBadge>
      <MessageBadge status="success" subtle size="lg">Large subtle</MessageBadge>
    </div>
  ),
};

export const InlineUsage = {
  name: "Inline in text",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
      {[
        { label: "Build passed", status: "success" },
        { label: "Review needed", status: "warn" },
        { label: "Deploy failed", status: "error" },
        { label: "Syncing", status: "info" },
        { label: "Draft", status: "neutral" },
      ].map(({ label, status }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-12)", fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-default)" }}>
          <span style={{ color: "var(--semantic-color-text-muted)", minWidth: "120px" }}>Pipeline status</span>
          <MessageBadge status={status}>{label}</MessageBadge>
        </div>
      ))}
    </div>
  ),
};
