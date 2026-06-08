import { useState } from "react";
import { ChoiceGroup } from "./ChoiceGroup.jsx";
import { Button } from "../button/Button.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";

const meta = {
  title: "Components/Inputs/Choice Group",
  component: ChoiceGroup,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Choose an option",
    size: "default",
    multiple: false,
    required: false,
  },
  argTypes: {
    size:     { control: "inline-radio", options: ["compact", "default", "comfortable"] },
    columns:  { control: "object" },
    multiple: { control: "boolean" },
    required: { control: "boolean" },
    hint:     { control: "text" },
    error:    { control: "text" },
    success:  { control: "text" },
    label:    { control: "text" },
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
  {
    value: "starter",
    label: "Starter",
    subtext: "Up to 3 users · 5 GB",
    icon: "deployed_code",
  },
  {
    value: "professional",
    label: "Professional",
    subtext: "Up to 25 users · 50 GB",
    icon: "rocket_launch",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    subtext: "Unlimited · 1 TB",
    icon: "domain",
  },
];

const FEATURE_OPTIONS = [
  { value: "analytics",     label: "Analytics",     subtext: "Usage reports and insights",      icon: "bar_chart" },
  { value: "api",           label: "API access",     subtext: "REST and GraphQL endpoints",      icon: "api" },
  { value: "sso",           label: "SSO",            subtext: "Single sign-on via SAML / OIDC",  icon: "passkey" },
  { value: "audit",         label: "Audit log",      subtext: "30-day activity history",         icon: "history" },
];

const SIMPLE_OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
  { value: "d", label: "Option D" },
];

const ICON_ONLY_OPTIONS = [
  { value: "light", label: "Light", icon: "light_mode" },
  { value: "dark",  label: "Dark",  icon: "dark_mode" },
  { value: "auto",  label: "Auto",  icon: "brightness_auto" },
];

/* Options without subtext */
const PLAN_OPTIONS_NO_SUBTEXT = [
  { value: "starter",      label: "Starter",       icon: "deployed_code" },
  { value: "professional", label: "Professional",   icon: "rocket_launch" },
  { value: "enterprise",   label: "Enterprise",     icon: "domain" },
];

/* Options without icons or subtext */
const LABEL_ONLY_OPTIONS = [
  { value: "email",   label: "Email" },
  { value: "sms",     label: "SMS" },
  { value: "push",    label: "Push notification" },
  { value: "none",    label: "No notifications" },
];

/* ── Configurable ─────────────────────────────────────────────────────────── */

export const Configurable = {
  args: {
    options: PLAN_OPTIONS,
    defaultValue: "starter",
  },
  render: (args) => (
    <div>
      <ChoiceGroup {...args} />
    </div>
  ),
};

/* ── Single vs Multi ──────────────────────────────────────────────────────── */

export const SingleVsMulti = {
  name: "Single vs Multi",
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)" }}>
      <div>
        <p style={LABEL}>Single select (radio)</p>
        <ChoiceGroup
          {...args}
          label="Subscription plan"
          hint="Only one plan can be active at a time."
          multiple={false}
          defaultValue="professional"
          options={PLAN_OPTIONS}
        />
      </div>
      <div>
        <p style={LABEL}>Multi select (checkbox)</p>
        <ChoiceGroup
          {...args}
          label="Add-on features"
          hint="Select all the features you need."
          multiple
          defaultValue={["analytics", "api"]}
          options={FEATURE_OPTIONS}
        />
      </div>
    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-40)" }}>
      {(["compact", "default", "comfortable"]).map((sz) => (
        <div key={sz}>
          <p style={LABEL}>{sz}</p>
          <ChoiceGroup
            size={sz}
            label="Subscription plan"
            defaultValue="professional"
            options={PLAN_OPTIONS}
          />
        </div>
      ))}
    </div>
  ),
};

/* ── Columns ──────────────────────────────────────────────────────────────── */

export const Columns = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-40)" }}>

      <div>
        <p style={LABEL}>No columns — auto fill based on tile min-width</p>
        <ChoiceGroup
          label="Subscription plan"
          defaultValue="professional"
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>columns={1} — single column</p>
        <ChoiceGroup
          label="Subscription plan"
          columns={1}
          defaultValue="professional"
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>columns={3} — fixed 3 columns</p>
        <ChoiceGroup
          label="Add-on features"
          columns={3}
          multiple
          defaultValue={["analytics"]}
          options={FEATURE_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>
          {"columns={{ xs: 1, sm: 2, md: 3 }} — responsive (resize the window to see it change)"}
        </p>
        <ChoiceGroup
          label="Add-on features"
          hint="1 column on mobile · 2 from sm · 3 from md"
          columns={{ xs: 1, sm: 2, md: 3 }}
          multiple
          defaultValue={["analytics", "api"]}
          options={FEATURE_OPTIONS}
        />
      </div>

    </div>
  ),
};

/* ── Appointment picker ───────────────────────────────────────────────────── */

const UNAVAILABLE_TIMES = new Set(["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM"]);

const APPOINTMENT_SLOTS = (() => {
  const slots = [];
  for (let h = 8; h <= 16; h++) {
    for (const m of [0, 30]) {
      if (h === 16 && m === 30) continue;
      const h12    = h > 12 ? h - 12 : h;
      const period = h < 12 ? "AM" : "PM";
      const label  = `${h12}:${m === 0 ? "00" : "30"} ${period}`;
      slots.push({
        value:    `${h}:${m === 0 ? "00" : "30"}`,
        label,
        ...(UNAVAILABLE_TIMES.has(label) ? { disabled: true } : {}),
      });
    }
  }
  return slots;
})();

function toColumnMajor(items, cols) {
  const rows = Math.ceil(items.length / cols);
  const result = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = col * rows + row;
      if (idx < items.length) result.push(items[idx]);
    }
  }
  return result;
}

const MORNING_SLOTS   = APPOINTMENT_SLOTS.filter(s => parseInt(s.value) < 12);
const AFTERNOON_SLOTS = APPOINTMENT_SLOTS.filter(s => parseInt(s.value) >= 12);

export const AppointmentPicker = {
  name: "Appointment picker",
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <ChoiceGroup
      {...args}
      label="Select an appointment time"
      hint="Tuesday, 10 June"
      columns={{ xs: 1, md: 2, lg: 4 }}
      sections={[
        { label: "Morning",   options: MORNING_SLOTS },
        { label: "Afternoon", options: AFTERNOON_SLOTS },
      ]}
    />
  ),
};

/* ── Content variants ─────────────────────────────────────────────────────── */

export const ContentVariants = {
  name: "Content variants",
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-40)" }}>

      <div>
        <p style={LABEL}>Icon + label + subtext</p>
        <ChoiceGroup
          {...args}
          label="Subscription plan"
          hint="Choose the plan that fits your team."
          defaultValue="professional"
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Icon + label (no subtext)</p>
        <ChoiceGroup
          {...args}
          label="Subscription plan"
          defaultValue="professional"
          options={PLAN_OPTIONS_NO_SUBTEXT}
        />
      </div>

      <div>
        <p style={LABEL}>Label + subtext (no icon)</p>
        <ChoiceGroup
          {...args}
          label="Preferred contact method"
          hint="We'll reach out using this method for account updates."
          options={[
            { value: "email", label: "Email",             subtext: "Sent to your registered address" },
            { value: "sms",   label: "SMS",               subtext: "Requires a verified phone number" },
            { value: "push",  label: "Push notification", subtext: "Via the mobile app" },
            { value: "none",  label: "None",              subtext: "Opt out of all notifications" },
          ]}
        />
      </div>

      <div>
        <p style={LABEL}>Label only (no icon, no subtext)</p>
        <ChoiceGroup
          {...args}
          label="Preferred contact method"
          options={LABEL_ONLY_OPTIONS}
        />
      </div>

    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)" }}>

      <div>
        <p style={LABEL}>Default</p>
        <ChoiceGroup
          {...args}
          label="Subscription plan"
          hint="Choose the plan that fits your team."
          defaultValue="professional"
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Required</p>
        <ChoiceGroup
          {...args}
          label="Subscription plan"
          hint="You must select a plan to continue."
          required
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Error</p>
        <ChoiceGroup
          {...args}
          label="Subscription plan"
          error="Select a plan to continue."
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Success</p>
        <ChoiceGroup
          {...args}
          label="Subscription plan"
          success="Great choice — your plan has been updated."
          defaultValue="professional"
          options={PLAN_OPTIONS}
        />
      </div>

      <div>
        <p style={LABEL}>Disabled options</p>
        <ChoiceGroup
          {...args}
          label="Subscription plan"
          hint="Some plans are unavailable for your account type."
          defaultValue="professional"
          options={[
            ...PLAN_OPTIONS,
            { value: "legacy", label: "Legacy", subtext: "No longer available", icon: "block", disabled: true },
          ]}
        />
      </div>

    </div>
  ),
};

/* ── Controlled ───────────────────────────────────────────────────────────── */

function ControlledDemo() {
  const [plan, setPlan] = useState(null);
  const [features, setFeatures] = useState([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)" }}>
      <ChoiceGroup
        label="Subscription plan"
        hint="Controlled single-select."
        value={plan}
        onChange={setPlan}
        options={PLAN_OPTIONS}
      />
      <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)", margin: 0 }}>
        Selected plan: {plan ?? "none"}
      </p>
      <ChoiceGroup
        label="Add-on features"
        hint="Controlled multi-select."
        multiple
        value={features}
        onChange={setFeatures}
        options={FEATURE_OPTIONS}
      />
      <p style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)", margin: 0 }}>
        Selected features: {features.length ? features.join(", ") : "none"}
      </p>
      <ButtonContainer align="start">
        <Button variant="secondary" size="sm" onClick={() => { setPlan(null); setFeatures([]); }}>
          Reset
        </Button>
      </ButtonContainer>
    </div>
  );
}

export const Controlled = {
  parameters: { controls: { include: [] } },
  render: () => <ControlledDemo />,
};
