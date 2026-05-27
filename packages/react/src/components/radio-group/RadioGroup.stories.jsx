import { useState } from "react";
import { RadioGroup } from "./RadioGroup.jsx";
import { Fieldset } from "../fieldset/Fieldset.jsx";
import { TextField } from "../field/TextField.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";
import { Button } from "../button/Button.jsx";

const meta = {
  title: "Components/Forms/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Options",
    size: "default",
    required: false,
    disabled: false,
    inline: false,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["comfortable", "default", "compact"],
    },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    inline:   { control: "boolean" },
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

const PLAN_OPTIONS = [
  { value: "starter",      label: "Starter",      hint: "Up to 3 users · 5 GB storage" },
  { value: "professional", label: "Professional",  hint: "Up to 25 users · 50 GB storage" },
  { value: "enterprise",   label: "Enterprise",    hint: "Unlimited users · 1 TB storage" },
  { value: "legacy",       label: "Legacy plan",   disabled: true },
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
    defaultValue: "a",
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <RadioGroup {...args} />
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
        <RadioGroup
          {...args}
          label="Subscription plan"
          hint="Choose the plan that fits your team."
          defaultValue="professional"
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>No hints</p>
        <RadioGroup
          {...args}
          label="Delivery method"
          defaultValue="standard"
          options={[
            { value: "standard",  label: "Standard shipping" },
            { value: "express",   label: "Express shipping" },
            { value: "overnight", label: "Overnight shipping" },
            { value: "pickup",    label: "In-store pickup" },
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
        <RadioGroup
          {...args}
          label="Subscription plan"
          hint="Choose the plan that fits your team."
          defaultValue="professional"
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Required</p>
        <RadioGroup
          {...args}
          label="Subscription plan"
          hint="You must select a plan to continue."
          required
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Error</p>
        <RadioGroup
          {...args}
          label="Subscription plan"
          error="Select a plan to continue."
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Disabled</p>
        <RadioGroup
          {...args}
          label="Subscription plan"
          hint="Plan changes are locked during your trial."
          disabled
          defaultValue="professional"
          options={PLAN_OPTIONS}
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
            <RadioGroup
              size={sz}
              label="Subscription plan"
              hint="Choose the plan that fits your team."
              defaultValue="professional"
              options={PLAN_OPTIONS}
            />
            <RadioGroup
              size={sz}
              label="Subscription plan"
              required
              options={SIMPLE_OPTIONS}
            />
            <RadioGroup
              size={sz}
              label="Subscription plan"
              error="Select a plan to continue."
              options={SIMPLE_OPTIONS}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ── Inline ───────────────────────────────────────────────────────────────── */

export const Inline = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 560 }}>

      <div>
        <p style={LABEL}>Default</p>
        <RadioGroup
          {...args}
          inline
          label="Delivery method"
          defaultValue="standard"
          options={[
            { value: "standard",  label: "Standard" },
            { value: "express",   label: "Express" },
            { value: "overnight", label: "Overnight" },
          ]}
        />
      </div>

      <div>
        <p style={LABEL}>With hints</p>
        <RadioGroup
          {...args}
          inline
          label="Subscription plan"
          defaultValue="professional"
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Required</p>
        <RadioGroup
          {...args}
          inline
          required
          label="Subscription plan"
          options={SIMPLE_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Error</p>
        <RadioGroup
          {...args}
          inline
          label="Subscription plan"
          error="Select a plan to continue."
          options={SIMPLE_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Disabled</p>
        <RadioGroup
          {...args}
          inline
          disabled
          label="Subscription plan"
          defaultValue="professional"
          options={PLAN_OPTIONS}
        />
      </div>

    </div>
  ),
};

/* ── In a form ────────────────────────────────────────────────────────────── */

function PlanForm() {
  const [plan, setPlan] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!plan) {
      setError("Select a plan to continue.");
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  return submitted ? (
    <p style={{ fontFamily: "var(--component-paragraph-font-family)", color: "var(--semantic-color-text-default)" }}>
      Signed up for: {plan}.{" "}
      <button
        style={{ background: "none", border: "none", padding: 0, color: "inherit", textDecoration: "underline", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}
        onClick={() => { setSubmitted(false); setPlan(null); }}
      >
        Change
      </button>
    </p>
  ) : (
    <form style={{ maxWidth: 560 }} onSubmit={handleSubmit} onReset={() => { setPlan(null); setError(null); }}>
      <Fieldset legend="Sign up" markRequired>
        <TextField label="Full name" autoComplete="name" required />
        <RadioGroup
          label="Subscription plan"
          hint="You can change your plan at any time."
          error={error}
          required
          value={plan}
          onChange={(v) => { setPlan(v); if (v) setError(null); }}
          options={PLAN_OPTIONS}
        />
        <ButtonContainer align="start">
          <Button type="submit" variant="primary">Continue</Button>
          <Button type="reset" variant="secondary">Reset</Button>
        </ButtonContainer>
      </Fieldset>
    </form>
  );
}

export const InAForm = {
  name: "In a form",
  parameters: { controls: { include: [] } },
  render: () => <PlanForm />,
};
