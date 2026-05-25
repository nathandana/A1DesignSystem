import { ZipField, ZIP_MASKS } from "./ZipField.jsx";
import { TextField } from "./TextField.jsx";

const meta = {
  title: "Components/Forms/Input Zip",
  component: ZipField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "ZIP code",
    size: "default",
    labelPosition: "above",
    required: false,
    disabled: false,
    mask: ZIP_MASKS.zip5,
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
    mask:  { control: "text" },
    error: { control: "text" },
    hint:  { control: "text" },
    label: { control: "text" },
  },
};

export default meta;

export const Configurable = {
  render: (args) => <ZipField {...args} />,
};

/* ── Formats ──────────────────────────────────────────────────────────────── */

export const Formats = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)" }}>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>5-digit ZIP</p>
        <ZipField label="ZIP code" mask={ZIP_MASKS.zip5} hint="e.g. 90210" />
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>ZIP+4</p>
        <ZipField label="ZIP+4 code" mask={ZIP_MASKS.zip9} hint="e.g. 90210-1234" />
      </div>

    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)" }}>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Comfortable</p>
        <ZipField size="comfortable" label="ZIP code" />
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Default</p>
        <ZipField size="default" label="ZIP code" />
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Compact</p>
        <ZipField size="compact" label="ZIP code" />
      </div>

    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size", "mask"] } },
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--base-spacing-24)", flexWrap: "wrap" }}>
      <ZipField {...args} label="Default" />
      <ZipField {...args} label="Required" required />
      <ZipField {...args} label="Error" defaultValue="123" error="Enter a valid ZIP code." />
      <ZipField {...args} label="Disabled" disabled />
    </div>
  ),
};

/* ── In a form row ────────────────────────────────────────────────────────── */

export const InFormRow = {
  name: "In a form row",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", gap: "var(--base-spacing-16)", flexWrap: "wrap", alignItems: "flex-start", maxWidth: 560 }}>
      <div style={{ flex: "1 1 200px" }}>
        <TextField label="City" required />
      </div>
      <ZipField label="ZIP code" required />
    </div>
  ),
};
