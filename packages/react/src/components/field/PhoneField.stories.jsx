import { PhoneField } from "./PhoneField.jsx";

const meta = {
  title: "Components/Forms/Input Phone",
  component: PhoneField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Phone number",
    hint: "Include your country code.",
    size: "default",
    labelPosition: "above",
    required: false,
    disabled: false,
    mask: "#-###-###-####",
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
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <PhoneField {...args} />
    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 480 }}>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Comfortable</p>
        <PhoneField size="comfortable" label="Phone number" hint="Include your country code." />
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Default</p>
        <PhoneField size="default" label="Phone number" hint="Include your country code." />
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Compact</p>
        <PhoneField size="compact" label="Phone number" />
      </div>

    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 480 }}>

      <PhoneField {...args} label="Default" hint="Include your country code." />

      <PhoneField {...args} label="Required" hint="We'll only use this for account alerts." required />

      <PhoneField {...args} label="Error" defaultValue="123" error="Enter a complete phone number." />

      <PhoneField {...args} label="Disabled" disabled />

    </div>
  ),
};

/* ── Country formats ──────────────────────────────────────────────────────── */

export const CountryFormats = {
  name: "Country formats",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-20)", maxWidth: 480 }}>

      <PhoneField
        label="United States"
        hint="e.g. 1-800-555-1234"
        mask="#-###-###-####"
      />

      <PhoneField
        label="United Kingdom"
        hint="e.g. 07700 900123"
        mask="##### ######"
      />

      <PhoneField
        label="Australia"
        hint="e.g. 0412 345 678"
        mask="#### ### ###"
      />

      <PhoneField
        label="Brazil"
        hint="e.g. (11) 98765-4321"
        mask="(##) #####-####"
      />

      <PhoneField
        label="Germany"
        hint="e.g. 030 12345678"
        mask="### ########"
      />

    </div>
  ),
};
