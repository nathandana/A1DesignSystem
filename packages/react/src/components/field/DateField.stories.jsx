import { DateField } from "./DateField.jsx";

const meta = {
  title: "Components/Forms/Input Date",
  component: DateField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Date of birth",
    hint: "You must be 18 or older to register.",
    size: "default",
    labelPosition: "above",
    required: false,
    disabled: false,
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
    error: { control: "text" },
    hint:  { control: "text" },
    label: { control: "text" },
  },
};

export default meta;

export const Configurable = {
  render: (args) => <DateField {...args} />,
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)" }}>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Comfortable</p>
        <DateField size="comfortable" label="Date of birth" hint="DD / MM / YYYY" />
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Default</p>
        <DateField size="default" label="Date of birth" hint="DD / MM / YYYY" />
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Compact</p>
        <DateField size="compact" label="Date of birth" />
      </div>

    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>

      <DateField {...args} label="Default" hint="Select a date." />

      <DateField {...args} label="Required" hint="This field must be completed." required />

      <DateField {...args} label="Error" error="Enter a valid date." defaultValue="2099-99-99" />

      <DateField {...args} label="Disabled" disabled />

    </div>
  ),
};

/* ── In a form row ────────────────────────────────────────────────────────── */

export const InFormRow = {
  name: "In a form row",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-20)", maxWidth: 560 }}>
      <div style={{ display: "flex", gap: "var(--base-spacing-16)", flexWrap: "wrap" }}>
        <DateField label="Start date" hint="Inclusive" required />
        <DateField label="End date"   hint="Inclusive" />
      </div>
      <DateField label="Date of birth" hint="You must be 18 or older." required />
    </div>
  ),
};
