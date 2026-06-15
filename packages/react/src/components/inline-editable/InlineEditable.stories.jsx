import { useState } from "react";
import { InlineEditable } from "./InlineEditable.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";

const meta = {
  title: "Components/Forms/Inline Editable",
  component: InlineEditable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    value: "Project Falcon",
    placeholder: "Add a title",
    multiline: false,
    disabled: false,
    seamless: false,
    "aria-label": "Edit title",
  },
  argTypes: {
    value: { control: "text" },
    placeholder: { control: "text" },
    multiline: { control: "boolean" },
    disabled: { control: "boolean" },
    seamless: { control: "boolean" },
    "aria-label": { control: "text" },
    onChange: { table: { disable: true } },
    children: { table: { disable: true } },
  },
};

export default meta;

const LABEL = {
  fontFamily: "var(--component-paragraph-font-family)",
  fontSize: "var(--semantic-font-size-body-xs)",
  fontWeight: 600,
  color: "var(--semantic-color-text-muted)",
  marginBottom: "var(--base-spacing-8)",
};

/* A small controlled wrapper — InlineEditable is a controlled component. */
function Controlled({ value: initial, children, ...props }) {
  const [value, setValue] = useState(initial);
  return (
    <InlineEditable value={value} onChange={setValue} {...props}>
      {children ?? value ?? undefined}
    </InlineEditable>
  );
}

/* ── Configurable ─────────────────────────────────────────────────────────── */

export const Configurable = {
  render: ({ value, ...args }) => <Controlled value={value} {...args} />,
};

/* ── Single line ──────────────────────────────────────────────────────────── */

export const SingleLine = {
  name: "Single line",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <p style={LABEL}>Click the text to edit, Enter or Escape to commit</p>
      <Controlled value="Quarterly planning doc" aria-label="Edit document name" />
    </div>
  ),
};

/* ── Multiline ────────────────────────────────────────────────────────────── */

export const Multiline = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <p style={LABEL}>Multiline — edits in a textarea</p>
      <Controlled
        value="A longer description that wraps across multiple lines while you edit it inline."
        multiline
        aria-label="Edit description"
      />
    </div>
  ),
};

/* ── Placeholder (empty value) ────────────────────────────────────────────── */

export const Placeholder = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <p style={LABEL}>Empty value shows the placeholder</p>
      <Controlled value="" placeholder="Add a title" aria-label="Add a title" />
    </div>
  ),
};

/* ── Seamless ─────────────────────────────────────────────────────────────── */

export const Seamless = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 480 }}>
      <p style={LABEL}>Seamless edits the text in place, inheriting all styling from the component it lives in</p>
      <Heading as="h3" size="lg">
        <Controlled value="Editable heading" seamless aria-label="Edit heading" />
      </Heading>
      <Paragraph>
        <Controlled value="An editable paragraph — click and type. The field inherits the paragraph’s size, colour, and wrapping, so nothing resizes." seamless multiline aria-label="Edit paragraph" />
      </Paragraph>
      <span className="a1-button a1-button--primary">
        <Controlled value="Editable button" seamless aria-label="Edit button label" />
      </span>
    </div>
  ),
};

/* ── Disabled ─────────────────────────────────────────────────────────────── */

export const Disabled = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <p style={LABEL}>Disabled — not editable</p>
      <Controlled value="Read-only value" disabled />
    </div>
  ),
};
