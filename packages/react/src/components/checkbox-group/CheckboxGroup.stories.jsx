import { useState } from "react";
import { CheckboxGroup } from "./CheckboxGroup.jsx";
import { Fieldset } from "../fieldset/Fieldset.jsx";
import { TextField } from "../field/TextField.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";
import { Button } from "../button/Button.jsx";

const meta = {
  title: "Components/Forms/Checkbox Group",
  component: CheckboxGroup,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Preferences",
    size: "default",
    required: false,
    disabled: false,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["comfortable", "default", "compact"],
    },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    hint:  { control: "text" },
    error: { control: "text" },
    label: { control: "text" },
  },
};

export default meta;

const LABEL = {
  fontFamily: "var(--component-paragraph-font-family)",
  fontSize: "var(--semantic-font-size-body-xs)",
  fontWeight: 600,
  color: "var(--semantic-color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "var(--base-spacing-12)",
};

const CONTACT_OPTIONS = [
  { value: "email", label: "Email", hint: "Daily digest at 9 am" },
  { value: "sms",   label: "SMS",   hint: "Standard rates may apply" },
  { value: "push",  label: "Push notifications" },
  { value: "post",  label: "Post mail", disabled: true },
];

const SIMPLE_OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
];

/* ── Configurable ─────────────────────────────────────────────────────────── */

export const Configurable = {
  args: {
    options: SIMPLE_OPTIONS,
    defaultValue: ["a"],
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <CheckboxGroup {...args} />
    </div>
  ),
};

/* ── Options ──────────────────────────────────────────────────────────────── */

export const Options = {
  name: "Options",
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 400 }}>

      <div>
        <p style={LABEL}>With hints</p>
        <CheckboxGroup
          {...args}
          label="Notification channels"
          hint="Select how you'd like to be contacted."
          defaultValue={["email"]}
          options={CONTACT_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>No hints</p>
        <CheckboxGroup
          {...args}
          label="Dietary requirements"
          defaultValue={[]}
          options={[
            { value: "veg",    label: "Vegetarian" },
            { value: "vegan",  label: "Vegan" },
            { value: "gf",     label: "Gluten-free" },
            { value: "halal",  label: "Halal" },
            { value: "kosher", label: "Kosher" },
          ]}
        />
      </div>

    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 400 }}>

      <div>
        <p style={LABEL}>Default</p>
        <CheckboxGroup
          {...args}
          label="Notification channels"
          hint="Select all that apply."
          defaultValue={["email"]}
          options={CONTACT_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Required</p>
        <CheckboxGroup
          {...args}
          label="Notification channels"
          hint="You must select at least one."
          required
          defaultValue={[]}
          options={CONTACT_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Error</p>
        <CheckboxGroup
          {...args}
          label="Notification channels"
          error="Select at least one notification method."
          defaultValue={[]}
          options={CONTACT_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Disabled</p>
        <CheckboxGroup
          {...args}
          label="Notification channels"
          hint="Not available in your current plan."
          disabled
          defaultValue={["email"]}
          options={CONTACT_OPTIONS}
        />
      </div>

    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-40)", maxWidth: 400 }}>
      {["comfortable", "default", "compact"].map(sz => (
        <div key={sz}>
          <p style={LABEL}>{sz}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-20)" }}>
            <CheckboxGroup
              size={sz}
              label="Notification channels"
              hint="Select all that apply."
              defaultValue={["email"]}
              options={CONTACT_OPTIONS}
            />
            <CheckboxGroup
              size={sz}
              label="Notification channels"
              required
              defaultValue={[]}
              options={SIMPLE_OPTIONS}
            />
            <CheckboxGroup
              size={sz}
              label="Notification channels"
              error="Select at least one option."
              defaultValue={[]}
              options={SIMPLE_OPTIONS}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ── In a form ────────────────────────────────────────────────────────────── */

function ContactForm() {
  const [channels, setChannels] = useState(["email"]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (channels.length === 0) {
      setError("Select at least one notification method.");
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  return submitted ? (
    <p style={{ fontFamily: "var(--component-paragraph-font-family)", color: "var(--semantic-color-text-default)" }}>
      Saved! Notifications via: {channels.join(", ")}.{" "}
      <button
        style={{ background: "none", border: "none", padding: 0, color: "inherit", textDecoration: "underline", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}
        onClick={() => setSubmitted(false)}
      >
        Edit
      </button>
    </p>
  ) : (
    <form style={{ maxWidth: 560 }} onSubmit={handleSubmit} onReset={() => { setChannels(["email"]); setError(null); }}>
      <Fieldset legend="Notification preferences" markRequired>
        <TextField label="Email address" type="email" autoComplete="email" required />
        <CheckboxGroup
          label="Notification channels"
          hint="We'll only contact you through your chosen channels."
          error={error}
          required
          value={channels}
          onChange={(v) => { setChannels(v); if (v.length > 0) setError(null); }}
          options={CONTACT_OPTIONS}
        />
        <ButtonContainer align="start">
          <Button type="submit" variant="primary">Save preferences</Button>
          <Button type="reset" variant="secondary">Reset</Button>
        </ButtonContainer>
      </Fieldset>
    </form>
  );
}

export const InAForm = {
  name: "In a form",
  parameters: { controls: { include: [] } },
  render: () => <ContactForm />,
};
