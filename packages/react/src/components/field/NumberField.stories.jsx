import { NumberField } from "./NumberField.jsx";

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
  title: "Components/Forms/Number Field",
  component: NumberField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Quantity",
    min: 0,
    size: "default",
    required: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["comfortable", "default", "compact"],
    },
    unit: { control: "text" },
    prefix: { control: "text" },
    error: { control: "text" },
    hint: { control: "text" },
    label: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
};

export default meta;

export const Configurable = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <NumberField {...args} defaultValue={1} />
    </div>
  ),
};

/* ── Basic ────────────────────────────────────────────────────────────────── */

export const Basic = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", maxWidth: 320 }}>
      <NumberField label="Quantity" hint="How many units?" min={1} max={99} defaultValue={1} />
      <NumberField label="Price" hint="Enter an amount." min={0} step={0.01} defaultValue={9.99} />
      <NumberField label="Year" hint="Four-digit year." min={1900} max={2100} defaultValue={2024} />
    </div>
  ),
};

/* ── Prefix ───────────────────────────────────────────────────────────────── */

export const WithPrefix = {
  name: "With prefix",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", maxWidth: 320 }}>
      <NumberField label="Price"          prefix="$"  min={0} step={0.01} defaultValue={24.99} />
      <NumberField label="Exchange rate"  prefix="€"  min={0} step={0.001} defaultValue={1.085} />
      <NumberField label="Discount"       prefix="%"  min={0} max={100}   defaultValue={10} />
    </div>
  ),
};

/* ── Unit ─────────────────────────────────────────────────────────────────── */

export const WithUnit = {
  name: "With unit",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", maxWidth: 320 }}>
      <NumberField label="Weight"   unit="lbs"  min={0} step={0.1} defaultValue={185} />
      <NumberField label="Distance" unit="km"   min={0}            defaultValue={10} />
      <NumberField label="Speed"    unit="mph"  min={0} max={200}  defaultValue={65} />
      <NumberField label="Duration" unit="min"  min={0} max={240}  defaultValue={30} />
    </div>
  ),
};

/* ── Unit shifts with value ───────────────────────────────────────────────── */

export const UnitPosition = {
  name: "Unit position",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 320 }}>

      <div>
        <p style={LABEL_STYLE}>Single digit</p>
        <NumberField label="Weight" unit="lbs" min={0} step={1} defaultValue={1} />
      </div>

      <div>
        <p style={LABEL_STYLE}>Two digits</p>
        <NumberField label="Weight" unit="lbs" min={0} step={1} defaultValue={10} />
      </div>

      <div>
        <p style={LABEL_STYLE}>Three digits</p>
        <NumberField label="Weight" unit="lbs" min={0} step={1} defaultValue={185} />
      </div>

      <div>
        <p style={LABEL_STYLE}>Four digits</p>
        <NumberField label="Weight" unit="lbs" min={0} step={1} defaultValue={1000} />
      </div>

    </div>
  ),
};

/* ── Prefix and unit together ─────────────────────────────────────────────── */

export const PrefixAndUnit = {
  name: "Prefix and unit",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", maxWidth: 320 }}>
      <NumberField label="Height (ft)" unit="ft"  min={3} max={8}  defaultValue={5}  size="comfortable" />
      <NumberField label="Height (in)" unit="in"  min={0} max={11} defaultValue={8}  size="comfortable" />
    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 320 }}>

      <div>
        <p style={LABEL_STYLE}>Comfortable</p>
        <NumberField size="comfortable" label="Quantity" min={1} defaultValue={1} unit="lbs" />
      </div>

      <div>
        <p style={LABEL_STYLE}>Default</p>
        <NumberField size="default" label="Quantity" min={1} defaultValue={1} unit="lbs" />
      </div>

      <div>
        <p style={LABEL_STYLE}>Compact</p>
        <NumberField size="compact" label="Quantity" min={1} defaultValue={1} unit="lbs" />
      </div>

    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 400 }}>
      <NumberField {...args} label="Default"   hint="Enter a number." min={0} />
      <NumberField {...args} label="Required"  hint="This field must be completed." min={1} required />
      <NumberField {...args} label="Error"     defaultValue={-5} min={0} error="Value must be 0 or greater." />
      <NumberField {...args} label="Read-only" value={42} readOnly hint="Contact your admin to change this." onChange={() => {}} />
      <NumberField {...args} label="Disabled"  defaultValue={42} disabled />
    </div>
  ),
};
