import { SelectField } from "./SelectField.jsx";

const COUNTRIES = (
  <>
    <option value="">Select a country</option>
    <option value="au">Australia</option>
    <option value="ca">Canada</option>
    <option value="fr">France</option>
    <option value="de">Germany</option>
    <option value="jp">Japan</option>
    <option value="nz">New Zealand</option>
    <option value="uk">United Kingdom</option>
    <option value="us">United States</option>
  </>
);

const TIMEZONES = (
  <>
    <option value="">Select a timezone</option>
    <optgroup label="Americas">
      <option value="america/new_york">Eastern Time (UTC−5)</option>
      <option value="america/chicago">Central Time (UTC−6)</option>
      <option value="america/denver">Mountain Time (UTC−7)</option>
      <option value="america/los_angeles">Pacific Time (UTC−8)</option>
    </optgroup>
    <optgroup label="Europe">
      <option value="europe/london">London (UTC+0)</option>
      <option value="europe/paris">Paris (UTC+1)</option>
      <option value="europe/helsinki">Helsinki (UTC+2)</option>
    </optgroup>
    <optgroup label="Asia Pacific">
      <option value="asia/tokyo">Tokyo (UTC+9)</option>
      <option value="australia/sydney">Sydney (UTC+10)</option>
    </optgroup>
  </>
);

const meta = {
  title: "Components/Forms/Select",
  component: SelectField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Country",
    hint: "Select the country you reside in.",
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
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <SelectField {...args}>{COUNTRIES}</SelectField>
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
        <SelectField size="comfortable" label="Country" hint="Select the country you reside in.">{COUNTRIES}</SelectField>
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Default</p>
        <SelectField size="default" label="Country" hint="Select the country you reside in.">{COUNTRIES}</SelectField>
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" }}>Compact</p>
        <SelectField size="compact" label="Country">{COUNTRIES}</SelectField>
      </div>

    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", maxWidth: 480 }}>

      <SelectField {...args} label="Default" hint="Select your preferred option.">{COUNTRIES}</SelectField>

      <SelectField {...args} label="Required" hint="This field must be completed." required>{COUNTRIES}</SelectField>

      <SelectField {...args} label="Error" error="Please select a valid option." defaultValue="">{COUNTRIES}</SelectField>

      <SelectField {...args} label="Disabled" disabled>{COUNTRIES}</SelectField>

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
          <SelectField {...args} labelPosition="above" label="Country">{COUNTRIES}</SelectField>
          <SelectField {...args} labelPosition="above" label="Timezone">{TIMEZONES}</SelectField>
        </div>
      </div>

      <div>
        <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-16)" }}>Side</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
          <SelectField {...args} labelPosition="side" label="Country">{COUNTRIES}</SelectField>
          <SelectField {...args} labelPosition="side" label="Timezone">{TIMEZONES}</SelectField>
        </div>
      </div>

    </div>
  ),
};

/* ── With option groups ───────────────────────────────────────────────────── */

export const OptionGroups = {
  name: "Option groups",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <SelectField label="Timezone" hint="All times are shown in the selected timezone.">{TIMEZONES}</SelectField>
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
      { label: "Required",  required: true, hint: "Required" },
      { label: "Error",     error: "Select a valid option." },
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
                  <SelectField size={size} {...f}>{COUNTRIES}</SelectField>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
