import { TextareaField } from "./TextareaField.jsx";

const meta = {
  title: "Components/Forms/Textarea",
  component: TextareaField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Message",
    size: "default",
    labelPosition: "above",
    rows: "md",
    required: false,
    disabled: false,
    readOnly: false,
    showCount: false,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["comfortable", "default", "compact"],
    },
    labelPosition: {
      control: "inline-radio",
      options: ["above", "side"],
    },
    rows: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "xl"],
    },
    maxLength: { control: "number" },
    showCount: { control: "boolean" },
    error: { control: "text" },
    hint:  { control: "text" },
    label: { control: "text" },
  },
};

export default meta;

const LABEL = {
  fontFamily: "var(--component-paragraph-font-family)",
  fontSize: "var(--semantic-font-size-body-xs)",
  fontWeight: 600,
  color: "var(--semantic-color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "var(--base-spacing-12)",
};

/* ── Configurable ─────────────────────────────────────────────────────────── */

export const Configurable = {
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <TextareaField {...args} />
    </div>
  ),
};

/* ── Row sizes ────────────────────────────────────────────────────────────── */

export const RowSizes = {
  name: "Row sizes",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 560 }}>
      <div>
        <p style={LABEL}>sm — 2 rows</p>
        <TextareaField label="Summary" rows="sm" hint="A brief one-line description." />
      </div>
      <div>
        <p style={LABEL}>md — 4 rows (default)</p>
        <TextareaField label="Description" rows="md" />
      </div>
      <div>
        <p style={LABEL}>lg — 8 rows</p>
        <TextareaField label="Notes" rows="lg" hint="Add any additional notes here." />
      </div>
      <div>
        <p style={LABEL}>xl — 12 rows</p>
        <TextareaField label="Cover letter" rows="xl" />
      </div>
    </div>
  ),
};

/* ── Character count ──────────────────────────────────────────────────────── */

export const CharacterCount = {
  name: "Character count",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 560 }}>
      <div>
        <p style={LABEL}>Count only — no limit</p>
        <TextareaField label="Bio" rows="sm" showCount hint="Tell us a little about yourself." />
      </div>
      <div>
        <p style={LABEL}>With limit</p>
        <TextareaField label="Message" rows="md" maxLength={200} hint="Keep it brief." />
      </div>
      <div>
        <p style={LABEL}>Approaching limit (≥ 80%)</p>
        <TextareaField
          label="Message"
          rows="sm"
          maxLength={50}
          defaultValue="This message is getting close to the limit"
        />
      </div>
      <div>
        <p style={LABEL}>At limit</p>
        <TextareaField
          label="Message"
          rows="sm"
          maxLength={40}
          defaultValue="This message has hit the character limit!!"
        />
      </div>
    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-20)", maxWidth: 560 }}>
      <TextareaField {...args} label="Default"   rows="sm" hint="Hint text provides additional context." />
      <TextareaField {...args} label="Required"  rows="sm" required hint="This field must be completed." />
      <TextareaField {...args} label="Error"     rows="sm" defaultValue="Bad input" error="Your message must be at least 20 characters." />
      <TextareaField {...args} label="Read-only" rows="sm" value="This content cannot be edited." readOnly onChange={() => {}} />
      <TextareaField {...args} label="Disabled"  rows="sm" disabled hint="Not available right now." />
    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => {
    const fields = [
      { label: "Default",   hint: "Hint text provides additional context." },
      { label: "Required",  required: true, hint: "This field must be completed." },
      { label: "Error",     defaultValue: "Some input", error: "Your message must be at least 20 characters." },
      { label: "Disabled",  disabled: true },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-48)", maxWidth: 560 }}>
        {["comfortable", "default", "compact"].map(sz => (
          <div key={sz}>
            <p style={LABEL}>{sz}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
              {fields.map(f => (
                <TextareaField key={f.label} size={sz} rows="sm" {...f} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/* ── Label position ───────────────────────────────────────────────────────── */

export const LabelPosition = {
  name: "Label position",
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 640 }}>
      <div>
        <p style={LABEL}>Above</p>
        <TextareaField {...args} labelPosition="above" label="Message" rows="sm" hint="We'll respond within 2 business days." />
      </div>
      <div>
        <p style={LABEL}>Side</p>
        <TextareaField {...args} labelPosition="side" label="Message" rows="sm" hint="We'll respond within 2 business days." />
      </div>
    </div>
  ),
};
