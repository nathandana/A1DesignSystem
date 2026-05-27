import { useState } from "react";
import { Fieldset } from "./Fieldset.jsx";
import { FieldRow } from "../field-row/FieldRow.jsx";
import { TextField } from "../field/TextField.jsx";
import { SelectField } from "../field/SelectField.jsx";
import { ZipField } from "../field/ZipField.jsx";
import { PhoneField } from "../field/PhoneField.jsx";
import { Divider } from "../divider/Divider.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";
import { Button } from "../button/Button.jsx";
import { Banner } from "../banner/Banner.jsx";

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
  title: "Components/Forms/Fieldset",
  component: Fieldset,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    legend: "Contact information",
    markRequired: false,
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
    markRequired: { control: "boolean" },
    surface: { control: "boolean" },
    legend: { control: "text" },
  },
};

export default meta;

/* ── Contact form ─────────────────────────────────────────────────────────── */

export const ContactForm = {
  name: "Contact form",
  parameters: { controls: { include: ["size", "labelPosition", "markRequired"] } },
  render: (args) => (
    <form style={{ maxWidth: 800 }} onSubmit={(e) => e.preventDefault()}>
      <Fieldset
        legend="Contact information"
        markRequired={args.markRequired}
        size={args.size}
        labelPosition={args.labelPosition}
      >
        <TextField label="Full name" autoComplete="name" required />

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

        <Divider space="none" />

        <TextField label="Email address" type="email" autoComplete="email" required />

        <Divider space="none" />

        <PhoneField label="Phone number" hint="Optional — for account notifications only." />

        <ButtonContainer align="start">
          <Button type="submit" variant="primary">Submit</Button>
          <Button type="reset" variant="secondary">Reset</Button>
        </ButtonContainer>
      </Fieldset>
    </form>
  ),
};

/* ── With errors + banner ─────────────────────────────────────────────────── */

function ErrorForm() {
  const FIELDS = {
    "err-name":  { empty: "Full name is required." },
    "err-email": { empty: "Email address is required.", invalid: "Enter a valid email address." },
    "err-city":  { empty: "City is required." },
  };

  const [errors, setErrors] = useState({
    "err-name":  FIELDS["err-name"].empty,
    "err-email": FIELDS["err-email"].empty,
    "err-city":  FIELDS["err-city"].empty,
  });

  function validate(form) {
    const errs = {};
    const name  = form.elements["err-name"]?.value?.trim();
    const email = form.elements["err-email"]?.value?.trim();
    const city  = form.elements["err-city"]?.value?.trim();

    if (!name)                     errs["err-name"]  = FIELDS["err-name"].empty;
    if (!email)                    errs["err-email"] = FIELDS["err-email"].empty;
    else if (!email.includes("@")) errs["err-email"] = FIELDS["err-email"].invalid;
    if (!city)                     errs["err-city"]  = FIELDS["err-city"].empty;
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(e.target);
    setErrors(errs);
    if (Object.keys(errs).length === 0) alert("Form submitted successfully.");
  }

  const errorList = Object.entries(errors);

  return (
    <form
      style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}
      onSubmit={handleSubmit}
      onReset={() => setErrors({})}
    >
      {errorList.length > 0 && (
        <Banner status="error" title="Please fix the following errors before submitting.">
          <span style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>
            {errorList.map(([id, msg]) => (
              <a
                key={id}
                href={`#${id}`}
                style={{ color: "inherit", textDecoration: "underline" }}
                onClick={(e) => { e.preventDefault(); document.getElementById(id)?.focus(); }}
              >
                {msg}
              </a>
            ))}
          </span>
        </Banner>
      )}

      <Fieldset legend="Contact information" markRequired>
        <TextField
          id="err-name" name="err-name"
          label="Full name" autoComplete="name"
          required error={errors["err-name"]}
        />

        <TextField
          id="err-email" name="err-email"
          label="Email address" type="email" autoComplete="email"
          required error={errors["err-email"]}
        />

        <FieldRow>
          <TextField
            id="err-city" name="err-city"
            label="City" autoComplete="address-level2"
            required error={errors["err-city"]}
          />
          <ZipField label="ZIP" autoComplete="postal-code" />
        </FieldRow>

        <ButtonContainer align="start">
          <Button type="submit" variant="primary">Submit</Button>
          <Button type="reset" variant="secondary">Reset</Button>
        </ButtonContainer>
      </Fieldset>
    </form>
  );
}

export const WithErrors = {
  name: "With errors",
  parameters: { controls: { include: [] } },
  render: () => <ErrorForm />,
};

/* ── Size cascade ─────────────────────────────────────────────────────────── */

export const SizeCascade = {
  name: "Size cascade",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-48)" }}>
      {["comfortable", "default", "compact"].map(size => (
        <div key={size}>
          <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", fontWeight: 600, color: "var(--semantic-color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--base-spacing-16)" }}>
            {size}
          </p>
          <Fieldset legend="Account details" size={size} markRequired style={{ maxWidth: 800 }}>
            <FieldRow>
              <TextField label="First name" required />
              <TextField label="Last name" required />
            </FieldRow>
            <TextField label="Email address" type="email" required />
            <PhoneField label="Phone number" />
          </Fieldset>
        </div>
      ))}
    </div>
  ),
};

/* ── No legend ────────────────────────────────────────────────────────────── */

export const NoLegend = {
  name: "No legend",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ maxWidth: 800 }}>
      <Fieldset>
        <TextField label="Username" autoComplete="username" required />
        <TextField label="Password" type="password" autoComplete="new-password" required />
        <TextField label="Confirm password" type="password" autoComplete="new-password" required />
      </Fieldset>
    </div>
  ),
};

/* ── Surface ──────────────────────────────────────────────────────────────── */

export const Surface = {
  name: "Surface",
  parameters: { controls: { include: ["size", "labelPosition"] } },
  render: (args) => (
    <div style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>

      <Fieldset legend="Account details" surface markRequired size={args.size} labelPosition={args.labelPosition}>
        <FieldRow>
          <TextField label="First name" autoComplete="given-name" required />
          <TextField label="Last name" autoComplete="family-name" required />
        </FieldRow>
        <TextField label="Email address" type="email" autoComplete="email" required />
      </Fieldset>

      <Fieldset legend="Billing address" surface size={args.size} labelPosition={args.labelPosition}>
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
      </Fieldset>

      <Fieldset legend="Payment" surface size={args.size} labelPosition={args.labelPosition}>
        <TextField label="Name on card" autoComplete="cc-name" required />
        <FieldRow>
          <TextField label="Card number" autoComplete="cc-number" required />
          <TextField label="Expiry" autoComplete="cc-exp" style={{ maxWidth: 120 }} required />
          <TextField label="CVV" autoComplete="cc-csc" style={{ maxWidth: 90 }} required />
        </FieldRow>
      </Fieldset>

    </div>
  ),
};
