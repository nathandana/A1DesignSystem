import { FieldRow } from "./FieldRow.jsx";
import { Fieldset } from "../fieldset/Fieldset.jsx";
import { TextField } from "../field/TextField.jsx";
import { SelectField } from "../field/SelectField.jsx";
import { ZipField } from "../field/ZipField.jsx";
import { PhoneField } from "../field/PhoneField.jsx";
import { DateField } from "../field/DateField.jsx";

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

const meta = {
  title: "Components/Forms/Field Row",
  component: FieldRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;

const LABEL = { fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-12)" };

/* ── Label above (default) ────────────────────────────────────────────────── */

export const LabelAbove = {
  name: "Label above",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>

      <div>
        <p style={LABEL}>Two fields</p>
        <Fieldset>
          <FieldRow>
            <TextField label="First name" autoComplete="given-name" required />
            <TextField label="Last name" autoComplete="family-name" required />
          </FieldRow>
        </Fieldset>
      </div>

      <div>
        <p style={LABEL}>Three fields</p>
        <Fieldset>
          <FieldRow>
            <TextField label="City" autoComplete="address-level2" required />
            <SelectField label="State" autoComplete="address-level1">
              <option value="">—</option>
              {US_STATES.map(([abbr, name]) => (
                <option key={abbr} value={abbr}>{abbr} — {name}</option>
              ))}
            </SelectField>
            <ZipField label="ZIP" autoComplete="postal-code" />
          </FieldRow>
        </Fieldset>
      </div>

      <div>
        <p style={LABEL}>Fixed-width alongside flexible</p>
        <Fieldset>
          <FieldRow>
            <TextField label="Card number" inputMode="numeric" />
            <DateField label="Expiry" />
            <TextField label="CVV" inputMode="numeric" style={{ maxWidth: 90 }} />
          </FieldRow>
        </Fieldset>
      </div>

    </div>
  ),
};

/* ── Side labels — auto-stacks ────────────────────────────────────────────── */

export const LabelSide = {
  name: "Label side — auto-stacks",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: "var(--base-spacing-40)" }}>

      <div>
        <p style={LABEL}>FieldRow inside a side-label fieldset stacks automatically</p>
        <Fieldset legend="Billing address" labelPosition="side">
          <TextField label="Street address" autoComplete="street-address" />
          <FieldRow>
            <TextField label="City" autoComplete="address-level2" required />
            <SelectField label="State" autoComplete="address-level1">
              <option value="">—</option>
              {US_STATES.map(([abbr, name]) => (
                <option key={abbr} value={abbr}>{abbr} — {name}</option>
              ))}
            </SelectField>
            <ZipField label="ZIP" autoComplete="postal-code" />
          </FieldRow>
          <PhoneField label="Phone" autoComplete="tel" />
        </Fieldset>
      </div>

    </div>
  ),
};

/* ── All sizes ────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-48)" }}>
      {["comfortable", "default", "compact"].map(size => (
        <div key={size}>
          <p style={LABEL}>{size}</p>
          <Fieldset size={size} style={{ maxWidth: 800 }}>
            <FieldRow>
              <TextField label="First name" autoComplete="given-name" required />
              <TextField label="Last name" autoComplete="family-name" required />
            </FieldRow>
            <FieldRow>
              <TextField label="City" autoComplete="address-level2" />
              <SelectField label="State" autoComplete="address-level1">
                <option value="">—</option>
                {US_STATES.slice(0, 8).map(([abbr, name]) => (
                  <option key={abbr} value={abbr}>{abbr} — {name}</option>
                ))}
              </SelectField>
              <ZipField label="ZIP" autoComplete="postal-code" />
            </FieldRow>
          </Fieldset>
        </div>
      ))}
    </div>
  ),
};
