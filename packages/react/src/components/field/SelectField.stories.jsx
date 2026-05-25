import { useState } from "react";
import { SelectField } from "./SelectField.jsx";

const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
];

// Shows abbreviation when selected; "VT — Vermont" inside the open dropdown.
function CombinedStateSelect(props) {
  const [value, setValue]     = useState("");
  const [focused, setFocused] = useState(false);

  const overlay = value && !focused ? (
    <div className="a1-field__mask-overlay" aria-hidden="true">
      <span className="a1-field__mask-typed">{value}</span>
    </div>
  ) : null;

  return (
    <SelectField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      inputOverlay={overlay}
      {...props}
    >
      <option value="">—</option>
      {US_STATES.map(([abbr, name]) => (
        <option key={abbr} value={abbr}>{abbr} — {name}</option>
      ))}
    </SelectField>
  );
}

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

/* ── US State select ──────────────────────────────────────────────────────── */

const LABEL_STYLE = { fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" };

export const StateSelect = {
  name: "State select",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", gap: "var(--base-spacing-40)", flexWrap: "wrap", alignItems: "flex-start" }}>

      <div>
        <p style={LABEL_STYLE}>Abbreviation only</p>
        <SelectField label="State" autoComplete="address-level1" style={{ minWidth: 90 }}>
          <option value="">—</option>
          {US_STATES.map(([abbr]) => (
            <option key={abbr} value={abbr}>{abbr}</option>
          ))}
        </SelectField>
      </div>

      <div>
        <p style={LABEL_STYLE}>Combined — abbr when selected</p>
        <CombinedStateSelect label="State" autoComplete="address-level1" style={{ minWidth: 90 }} />
        <p style={{ ...LABEL_STYLE, marginTop: "var(--base-spacing-8)", textTransform: "none", letterSpacing: 0, fontWeight: 400, fontSize: "var(--semantic-font-size-body-xs)" }}>
          Dropdown shows "VT — Vermont"; closed shows "VT"
        </p>
      </div>

      <div>
        <p style={LABEL_STYLE}>Full name</p>
        <SelectField label="State" autoComplete="address-level1" style={{ minWidth: 180 }}>
          <option value="">—</option>
          {US_STATES.map(([abbr, name]) => (
            <option key={abbr} value={abbr}>{name}</option>
          ))}
        </SelectField>
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
