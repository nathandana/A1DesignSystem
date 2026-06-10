import { StepTracker } from "./StepTracker.jsx";

const meta = {
  title: "Components/Feedback/Step Tracker",
  component: StepTracker,
  tags: ["autodocs"],
  args: { steps: 5, currentStep: 1, align: "left" },
  argTypes: {
    steps: { control: { type: "range", min: 2, max: 10, step: 1 } },
    currentStep: { control: { type: "range", min: 1, max: 10, step: 1 } },
    align: {
      control: "inline-radio",
      options: ["left", "center", "right", "full"],
    },
  },
};

export default meta;

export const Configurable = {};

export const Alignments = {
  name: "Alignments",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-24)", width: 320 }}>
      {["left", "center", "right", "full"].map((align) => (
        <div key={align}>
          <p style={{ margin: "0 0 var(--base-spacing-8)", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)", fontFamily: "monospace" }}>
            align="{align}"
          </p>
          <StepTracker steps={5} currentStep={2} align={align} />
        </div>
      ))}
    </div>
  ),
};

export const Positions = {
  name: "Step positions",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", width: 240 }}>
      {[1, 2, 3, 4, 5].map((step) => (
        <StepTracker key={step} steps={5} currentStep={step} />
      ))}
    </div>
  ),
};

export const StepCounts = {
  name: "Step counts",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
      {[3, 5, 7, 10].map((n) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-16)" }}>
          <span style={{ fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)", fontFamily: "monospace", width: 24, flexShrink: 0 }}>{n}</span>
          <StepTracker steps={n} currentStep={Math.ceil(n / 2)} />
        </div>
      ))}
    </div>
  ),
};

export const InCard = {
  name: "In a card — full alignment",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{
      width: 280,
      border: "1px solid var(--semantic-color-border-subtle)",
      borderRadius: "var(--component-card-border-radius)",
      padding: "var(--base-spacing-20)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--base-spacing-16)",
      background: "var(--semantic-color-surface-page)",
    }}>
      <p style={{ margin: 0, fontSize: "var(--semantic-font-size-body-sm)", fontFamily: "var(--component-paragraph-font-family)", color: "var(--semantic-color-text-default)", fontWeight: 600 }}>
        Step 2 of 4
      </p>
      <p style={{ margin: 0, fontSize: "var(--semantic-font-size-body-sm)", fontFamily: "var(--component-paragraph-font-family)", color: "var(--semantic-color-text-muted)" }}>
        Tell us about your project so we can personalise your experience.
      </p>
      <StepTracker steps={4} currentStep={2} align="full" />
    </div>
  ),
};
