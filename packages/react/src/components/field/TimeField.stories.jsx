import { TimeField } from "./TimeField.jsx";

const LABEL_STYLE = {
  fontFamily: "var(--component-paragraph-font-family)",
  fontSize: "var(--semantic-font-size-body-xs)",
  fontWeight: 600,
  color: "var(--semantic-color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "var(--base-spacing-12)",
};

const meta = {
  title: "Components/Forms/Time Field",
  component: TimeField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Time",
    size: "default",
    required: false,
    disabled: false,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["comfortable", "default", "compact"],
    },
    min:   { control: "text" },
    max:   { control: "text" },
    error: { control: "text" },
    hint:  { control: "text" },
    label: { control: "text" },
  },
};

export default meta;

export const Configurable = {
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <TimeField {...args} defaultValue="09:00" />
    </div>
  ),
};

/* ── Basic ────────────────────────────────────────────────────────────────── */

export const Basic = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", gap: "var(--base-spacing-16)", flexWrap: "wrap" }}>
      <TimeField label="Start time" hint="HH:MM" defaultValue="09:00" />
      <TimeField label="End time"   hint="HH:MM" defaultValue="17:00" />
    </div>
  ),
};

/* ── Range constraint ─────────────────────────────────────────────────────── */

export const RangeConstraint = {
  name: "With range constraint",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <TimeField label="Appointment time" hint="Available 8 am – 6 pm." min="08:00" max="18:00" />
    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--base-spacing-16)", flexWrap: "wrap", alignItems: "flex-start" }}>
      <TimeField {...args} label="Default"  hint="Select a time." />
      <TimeField {...args} label="Required" required />
      <TimeField {...args} label="Error"    error="Select a valid time." />
      <TimeField {...args} label="Disabled" defaultValue="09:00" disabled />
    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>
      <div>
        <p style={LABEL_STYLE}>Comfortable</p>
        <TimeField size="comfortable" label="Start time" defaultValue="09:00" />
      </div>
      <div>
        <p style={LABEL_STYLE}>Default</p>
        <TimeField size="default" label="Start time" defaultValue="09:00" />
      </div>
      <div>
        <p style={LABEL_STYLE}>Compact</p>
        <TimeField size="compact" label="Start time" defaultValue="09:00" />
      </div>
    </div>
  ),
};
