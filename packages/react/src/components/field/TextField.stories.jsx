import { TextField } from "./TextField.jsx";

const meta = {
  title: "Components/Forms/Input Text",
  component: TextField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Email address",
    hint: "We'll only use this to send you account notifications.",
    size: "default",
    labelPosition: "above",
    required: false,
    disabled: false,
    readOnly: false,
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
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <TextField {...args} />
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
        <TextField size="comfortable" label="Full name" hint="As it appears on your ID." />
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Default</p>
        <TextField size="default" label="Full name" hint="As it appears on your ID." />
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Compact</p>
        <TextField size="compact" label="Full name" hint="As it appears on your ID." />
      </div>

    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 480 }}>

      <TextField {...args} label="Default" hint="Hint text provides additional context." />

      <TextField {...args} label="Required" hint="This field must be completed before submitting." required />

      <TextField {...args} label="Error" defaultValue="not-an-email" error="Enter a valid email address." />

      <TextField {...args} label="Read-only" value="jane.smith@example.com" readOnly hint="Contact your administrator to change this." onChange={() => {}} />

      <TextField {...args} label="Disabled" hint="This field is not available right now." disabled />

    </div>
  ),
};

/* ── Label position ───────────────────────────────────────────────────────── */

export const LabelPosition = {
  name: "Label position",
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 560 }}>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-16)" }}>Above</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <TextField {...args} labelPosition="above" label="First name" />
          <TextField {...args} labelPosition="above" label="Last name" />
          <TextField {...args} labelPosition="above" label="Email" hint="We'll never share your email." required />
        </div>
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-16)" }}>Side</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <TextField {...args} labelPosition="side" label="First name" />
          <TextField {...args} labelPosition="side" label="Last name" />
          <TextField {...args} labelPosition="side" label="Email" hint="We'll never share your email." required />
        </div>
      </div>

    </div>
  ),
};

/* ── Hint messages ────────────────────────────────────────────────────────── */

export const HintMessages = {
  name: "Hint messages",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-20)", maxWidth: 480 }}>
      <TextField label="Username"      hint="3–20 characters. Letters, numbers and underscores only." />
      <TextField label="Password"      type="password" hint="Minimum 8 characters with at least one number and symbol." />
      <TextField label="Date of birth" hint="You must be 18 or older to register." />
      <TextField label="Phone number"  hint="Include your country code for international numbers." />
      <TextField label="Promo code"    hint="Optional. Applied at checkout." />
    </div>
  ),
};

/* ── Required badge (comfortable) ─────────────────────────────────────────── */

export const RequiredBadge = {
  name: "Required badge",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 480 }}>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Comfortable — badge</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <TextField size="comfortable" label="Full name" hint="As it appears on your ID." required />
          <TextField size="comfortable" label="Email address" hint="We'll use this to contact you." required />
        </div>
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Default — asterisk</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <TextField size="default" label="Full name" hint="As it appears on your ID." required />
          <TextField size="compact" label="Email address" required />
        </div>
      </div>

    </div>
  ),
};

/* ── All sizes × states ───────────────────────────────────────────────────── */

export const SizesAndStates = {
  name: "Sizes × states",
  parameters: { controls: { include: [] } },
  render: () => {
    const sizes = ["comfortable", "default", "compact"];
    const fields = [
      { label: "Default" },
      { label: "Required",  required: true, hint: "Required field" },
      { label: "Error",     defaultValue: "bad-value", error: "Enter a valid value." },
      { label: "Read-only", value: "jane@example.com", readOnly: true, onChange: () => {} },
      { label: "Disabled",  disabled: true },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-40)" }}>
        {sizes.map(size => (
          <div key={size}>
            <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-16)" }}>{size}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--base-spacing-16)" }}>
              {fields.map(f => (
                <div key={f.label} style={{ flex: "1 1 180px", minWidth: 0 }}>
                  <TextField size={size} {...f} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
