import { TextField } from "./TextField.jsx";
import { PhoneField } from "./PhoneField.jsx";
import { ZipField, ZIP_MASKS } from "./ZipField.jsx";
import { CreditCardField } from "./CreditCardField.jsx";
import { NumberField } from "./NumberField.jsx";
import { TimeField } from "./TimeField.jsx";

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

/* ── Phone number ─────────────────────────────────────────────────────────── */

const LABEL_STYLE = { fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" };

export const PhoneNumber = {
  name: "Phone number",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 480 }}>

      <div>
        <p style={LABEL_STYLE}>Default US format</p>
        <PhoneField label="Phone number" hint="Include your country code." />
      </div>

      <div>
        <p style={LABEL_STYLE}>States</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <PhoneField label="Default" hint="Include your country code." />
          <PhoneField label="Required" hint="We'll only use this for account alerts." required />
          <PhoneField label="Error" defaultValue="123" error="Enter a complete phone number." />
          <PhoneField label="Disabled" disabled />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>Country formats</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <PhoneField label="United States" hint="e.g. 1-800-555-1234" mask="#-###-###-####" />
          <PhoneField label="United Kingdom" hint="e.g. 07700 900123" mask="##### ######" />
          <PhoneField label="Australia" hint="e.g. 0412 345 678" mask="#### ### ###" />
          <PhoneField label="Brazil" hint="e.g. (11) 98765-4321" mask="(##) #####-####" />
          <PhoneField label="Germany" hint="e.g. 030 12345678" mask="### ########" />
        </div>
      </div>

    </div>
  ),
};

/* ── ZIP code ─────────────────────────────────────────────────────────────── */

export const ZipCode = {
  name: "ZIP code",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)" }}>

      <div>
        <p style={LABEL_STYLE}>Formats</p>
        <div style={{ display: "flex", gap: "var(--base-spacing-24)", flexWrap: "wrap" }}>
          <ZipField label="5-digit ZIP" mask={ZIP_MASKS.zip5} hint="e.g. 90210" />
          <ZipField label="ZIP+4" mask={ZIP_MASKS.zip9} hint="e.g. 90210-1234" />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>States</p>
        <div style={{ display: "flex", gap: "var(--base-spacing-24)", flexWrap: "wrap" }}>
          <ZipField label="Default" />
          <ZipField label="Required" required />
          <ZipField label="Error" defaultValue="123" error="Enter a valid ZIP code." />
          <ZipField label="Disabled" disabled />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>In a form row</p>
        <div style={{ display: "flex", gap: "var(--base-spacing-16)", flexWrap: "wrap", alignItems: "flex-start", maxWidth: 560 }}>
          <div style={{ flex: "1 1 200px" }}>
            <TextField label="City" required />
          </div>
          <ZipField label="ZIP code" required />
        </div>
      </div>

    </div>
  ),
};

/* ── Credit card ──────────────────────────────────────────────────────────── */

export const CreditCard = {
  name: "Credit card",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 480 }}>

      <div>
        <p style={LABEL_STYLE}>Card number</p>
        <CreditCardField label="Card number" hint="Start typing to detect your card type." />
      </div>

      <div>
        <p style={LABEL_STYLE}>Card types</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <CreditCardField label="Visa" defaultValue="4111111111111111" hint="Starts with 4" />
          <CreditCardField label="Mastercard" defaultValue="5500000000000004" hint="Starts with 51–55 or 2221–2720" />
          <CreditCardField label="Amex" defaultValue="371449635398431" hint="Starts with 34 or 37 — 15 digits" />
          <CreditCardField label="Discover" defaultValue="6011111111111117" hint="Starts with 6011, 622, 644–649 or 65" />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>States</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <CreditCardField label="Default" />
          <CreditCardField label="Required" required hint="Required to complete your purchase." />
          <CreditCardField label="Error" defaultValue="1234" error="Enter a valid card number." />
          <CreditCardField label="Disabled" disabled />
        </div>
      </div>

    </div>
  ),
};

/* ── Number ───────────────────────────────────────────────────────────────── */

export const NumberInput = {
  name: "Number",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 480 }}>

      <div>
        <p style={LABEL_STYLE}>Basic</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <NumberField label="Quantity" hint="How many units?" min={1} max={99} defaultValue={1} />
          <NumberField label="Price" hint="USD" min={0} step={0.01} defaultValue={9.99} />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>States</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <NumberField label="Default"  hint="Enter a number." min={0} />
          <NumberField label="Required" hint="This field must be completed." min={1} required />
          <NumberField label="Error"    defaultValue={-5} min={0} error="Value must be 0 or greater." />
          <NumberField label="Disabled" defaultValue={42} disabled />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>Sizes</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <NumberField size="comfortable" label="Quantity" min={1} defaultValue={1} />
          <NumberField size="default"     label="Quantity" min={1} defaultValue={1} />
          <NumberField size="compact"     label="Quantity" min={1} defaultValue={1} />
        </div>
      </div>

    </div>
  ),
};

/* ── Time ─────────────────────────────────────────────────────────────────── */

export const TimeInput = {
  name: "Time",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)" }}>

      <div>
        <p style={LABEL_STYLE}>Basic</p>
        <div style={{ display: "flex", gap: "var(--base-spacing-16)", flexWrap: "wrap" }}>
          <TimeField label="Start time" hint="HH:MM" defaultValue="09:00" />
          <TimeField label="End time"   hint="HH:MM" defaultValue="17:00" />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>With range constraint</p>
        <TimeField label="Appointment time" hint="Available 8 am – 6 pm." min="08:00" max="18:00" />
      </div>

      <div>
        <p style={LABEL_STYLE}>States</p>
        <div style={{ display: "flex", gap: "var(--base-spacing-16)", flexWrap: "wrap", alignItems: "flex-start" }}>
          <TimeField label="Default"  hint="Select a time." />
          <TimeField label="Required" required />
          <TimeField label="Error"    error="Select a valid time." />
          <TimeField label="Disabled" defaultValue="09:00" disabled />
        </div>
      </div>

      <div>
        <p style={LABEL_STYLE}>Sizes</p>
        <div style={{ display: "flex", gap: "var(--base-spacing-16)", flexWrap: "wrap", alignItems: "flex-start" }}>
          <TimeField size="comfortable" label="Start time" defaultValue="09:00" />
          <TimeField size="default"     label="Start time" defaultValue="09:00" />
          <TimeField size="compact"     label="Start time" defaultValue="09:00" />
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
