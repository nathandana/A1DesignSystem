import { CreditCardField } from "./CreditCardField.jsx";

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
  title: "Components/Forms/Credit Card Field",
  component: CreditCardField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Card number",
    size: "default",
    required: false,
    disabled: false,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["comfortable", "default", "compact"],
    },
    error: { control: "text" },
    hint:  { control: "text" },
    label: { control: "text" },
  },
};

export default meta;

export const Configurable = {
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <CreditCardField {...args} hint="Start typing to detect your card type." />
    </div>
  ),
};

/* ── Basic ────────────────────────────────────────────────────────────────── */

export const Basic = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <CreditCardField label="Card number" hint="Start typing to detect your card type." />
    </div>
  ),
};

/* ── Card types ───────────────────────────────────────────────────────────── */

export const CardTypes = {
  name: "Card types",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", maxWidth: 400 }}>
      <CreditCardField label="Visa"       defaultValue="4111111111111111"  hint="Starts with 4" />
      <CreditCardField label="Mastercard" defaultValue="5500000000000004"  hint="Starts with 51–55 or 2221–2720" />
      <CreditCardField label="Amex"       defaultValue="371449635398431"   hint="Starts with 34 or 37 — 15 digits" />
      <CreditCardField label="Discover"   defaultValue="6011111111111117"  hint="Starts with 6011, 622, 644–649 or 65" />
    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", maxWidth: 400 }}>
      <CreditCardField {...args} label="Default" />
      <CreditCardField {...args} label="Required" required hint="Required to complete your purchase." />
      <CreditCardField {...args} label="Error" defaultValue="1234" error="Enter a valid card number." />
      <CreditCardField {...args} label="Disabled" disabled />
    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 400 }}>
      <div>
        <p style={LABEL_STYLE}>Comfortable</p>
        <CreditCardField size="comfortable" label="Card number" />
      </div>
      <div>
        <p style={LABEL_STYLE}>Default</p>
        <CreditCardField size="default" label="Card number" />
      </div>
      <div>
        <p style={LABEL_STYLE}>Compact</p>
        <CreditCardField size="compact" label="Card number" />
      </div>
    </div>
  ),
};
