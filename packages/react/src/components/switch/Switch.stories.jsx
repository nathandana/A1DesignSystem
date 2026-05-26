import { useState } from "react";
import { Switch } from "./Switch.jsx";
import { Fieldset } from "../fieldset/Fieldset.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";
import { Button } from "../button/Button.jsx";

const meta = {
  title: "Components/Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Enable notifications",
    size: "default",
    labelPosition: "end",
    disabled: false,
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["comfortable", "default", "compact"],
    },
    labelPosition: {
      control: "inline-radio",
      options: ["end", "start"],
    },
    disabled: { control: "boolean" },
    hint:     { control: "text" },
    error:    { control: "text" },
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
  marginBottom: "var(--base-spacing-8)",
};

/* ── Configurable ─────────────────────────────────────────────────────────── */

export const Configurable = {
  render: (args) => <Switch {...args} />,
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)" }}>
      {["comfortable", "default", "compact"].map(sz => (
        <div key={sz}>
          <p style={LABEL}>{sz}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
            <Switch size={sz} label="Enable notifications" />
            <Switch size={sz} label="Enable notifications" defaultChecked />
            <Switch size={sz} label="Enable notifications" disabled />
            <Switch size={sz} label="Enable notifications" defaultChecked disabled />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */

export const States = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-20)" }}>

      <div>
        <p style={LABEL}>Default (off)</p>
        <Switch {...args} label="Enable notifications" />
      </div>

      <div>
        <p style={LABEL}>Default (on)</p>
        <Switch {...args} label="Enable notifications" defaultChecked />
      </div>

      <div>
        <p style={LABEL}>With hint</p>
        <Switch {...args} label="Marketing emails" hint="Receive updates about new features and promotions." />
      </div>

      <div>
        <p style={LABEL}>Error</p>
        <Switch {...args} label="Accept terms" error="You must accept the terms to continue." />
      </div>

      <div>
        <p style={LABEL}>Disabled (off)</p>
        <Switch {...args} label="Enable notifications" disabled />
      </div>

      <div>
        <p style={LABEL}>Disabled (on)</p>
        <Switch {...args} label="Enable notifications" defaultChecked disabled />
      </div>

    </div>
  ),
};

/* ── Label position ───────────────────────────────────────────────────────── */

export const LabelPosition = {
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-20)" }}>

      <div>
        <p style={LABEL}>Label end (default)</p>
        <Switch {...args} label="Enable notifications" />
      </div>

      <div>
        <p style={LABEL}>Label start</p>
        <Switch {...args} label="Enable notifications" labelPosition="start" />
      </div>

      <div>
        <p style={LABEL}>Label start — checked</p>
        <Switch {...args} label="Enable notifications" labelPosition="start" defaultChecked />
      </div>

    </div>
  ),
};

/* ── Without label ────────────────────────────────────────────────────────── */

export const WithoutLabel = {
  name: "Without label",
  parameters: { controls: { include: ["size", "disabled"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>

      <div>
        <p style={LABEL}>Standalone (requires aria-label)</p>
        <div style={{ display: "flex", gap: "var(--base-spacing-16)", alignItems: "center" }}>
          <Switch {...args} aria-label="Enable dark mode" />
          <Switch {...args} aria-label="Enable dark mode" defaultChecked />
          <Switch {...args} aria-label="Enable dark mode" disabled />
        </div>
      </div>

      <div>
        <p style={LABEL}>In a settings row</p>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--base-spacing-16)",
          padding: "var(--base-spacing-12) var(--base-spacing-16)",
          borderRadius: "var(--base-radius-md)",
          border: "1px solid var(--semantic-color-border-subtle)",
          maxWidth: 360,
        }}>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-md)", color: "var(--semantic-color-text-default)" }}>
              Dark mode
            </p>
            <p style={{ margin: 0, fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>
              Switch between light and dark themes
            </p>
          </div>
          <Switch {...args} aria-label="Toggle dark mode" />
        </div>
      </div>

    </div>
  ),
};

/* ── In a form ────────────────────────────────────────────────────────────── */

function SettingsForm() {
  const [settings, setSettings] = useState({
    notifications: true,
    marketing: false,
    twoFactor: false,
  });
  const [saved, setSaved] = useState(false);

  function toggle(key) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  return (
    <form
      style={{ maxWidth: 400 }}
      onSubmit={(e) => { e.preventDefault(); setSaved(true); }}
    >
      <Fieldset legend="Notification settings">
        <Switch
          label="Email notifications"
          hint="Receive updates directly in your inbox."
          checked={settings.notifications}
          onChange={() => toggle("notifications")}
        />
        <Switch
          label="Marketing emails"
          hint="Promotions, tips, and announcements."
          checked={settings.marketing}
          onChange={() => toggle("marketing")}
        />
        <Switch
          label="Two-factor authentication"
          hint="Adds an extra layer of security to your account."
          checked={settings.twoFactor}
          onChange={() => toggle("twoFactor")}
        />
        <ButtonContainer align="start">
          <Button type="submit" variant="primary">Save settings</Button>
        </ButtonContainer>
        {saved && (
          <p style={{ margin: 0, fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>
            Settings saved.
          </p>
        )}
      </Fieldset>
    </form>
  );
}

export const InAForm = {
  name: "In a form",
  parameters: { controls: { include: [] } },
  render: () => <SettingsForm />,
};
