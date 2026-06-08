import { useState, useEffect } from "react";
import { StatusBar } from "./StatusBar.jsx";

export default {
  title: "Components/Feedback/Status Bar",
  component: StatusBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    value: 45,
    max: 100,
    size: "md",
    indeterminate: false,
  },
  argTypes: {
    size:          { control: "inline-radio", options: ["sm", "md", "lg"] },
    labelPosition: { control: "inline-radio", options: ["above", "below", "before", "after"] },
    indeterminate: { control: "boolean" },
    value:         { control: { type: "range", min: 0, max: 100, step: 1 } },
    max:           { control: "number" },
    label:         { control: "text" },
  },
};

const LABEL = {
  fontFamily: "var(--component-paragraph-font-family)",
  fontSize: "var(--semantic-font-size-body-xs)",
  fontWeight: 600,
  color: "var(--semantic-color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "var(--base-spacing-12)",
};

/* ── Configurable ─────────────────────────────────────────────────────────── */

export const Configurable = {
  args: {
    label: "Individual medical deductible",
    labelPosition: "above",
    value: 450,
    max: 1500,
  },
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <StatusBar {...args} />
    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 480 }}>
      {(["sm", "md", "lg"]).map((sz) => (
        <div key={sz}>
          <p style={LABEL}>{sz}</p>
          <StatusBar size={sz} value={60} label={`${sz} — 60%`} />
        </div>
      ))}
    </div>
  ),
};

/* ── Label positions ──────────────────────────────────────────────────────── */

export const LabelPositions = {
  name: "Label positions",
  parameters: { controls: { include: ["size", "value"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 480 }}>

      <div>
        <p style={LABEL}>above (default)</p>
        <StatusBar {...args} label="Storage used" value={args.value} labelPosition="above" />
      </div>

      <div>
        <p style={LABEL}>below</p>
        <StatusBar {...args} label="Storage used" value={args.value} labelPosition="below" />
      </div>

      <div>
        <p style={LABEL}>before</p>
        <StatusBar {...args} label="Storage" value={args.value} labelPosition="before" />
      </div>

      <div>
        <p style={LABEL}>after</p>
        <StatusBar {...args} value={args.value} label={`${args.value}%`} labelPosition="after" />
      </div>

    </div>
  ),
  args: { value: 60 },
};

/* ── Indeterminate (loading) ──────────────────────────────────────────────── */

export const Indeterminate = {
  name: "Indeterminate (loading)",
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 480 }}>

      <div>
        <p style={LABEL}>No label — pause/play appears after 3 s</p>
        <StatusBar {...args} indeterminate aria-label="Loading" />
      </div>

      <div>
        <p style={LABEL}>With label — pause/play appears after 3 s</p>
        <StatusBar {...args} indeterminate label="Uploading files…" />
      </div>

      <div>
        <p style={LABEL}>All sizes</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
          <StatusBar size="sm" indeterminate aria-label="Loading small" />
          <StatusBar size="md" indeterminate aria-label="Loading medium" />
          <StatusBar size="lg" indeterminate aria-label="Loading large" />
        </div>
      </div>

    </div>
  ),
};

/* ── Animated value ───────────────────────────────────────────────────────── */

function AnimatedDemo() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (value >= 100) return;
    const t = setTimeout(() => setValue((v) => Math.min(100, v + 7)), 300);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", maxWidth: 480 }}>
      <StatusBar
        value={value}
        label={value < 100 ? `Installing… ${value}%` : "Installation complete"}
      />
      <button
        style={{
          alignSelf: "flex-start",
          fontFamily: "var(--component-paragraph-font-family)",
          fontSize: "var(--semantic-font-size-body-sm)",
          cursor: "pointer",
        }}
        onClick={() => setValue(0)}
      >
        Restart
      </button>
    </div>
  );
}

export const Animated = {
  name: "Animated value",
  parameters: { controls: { include: [] } },
  render: () => <AnimatedDemo />,
};

/* ── Rich label ──────────────────────────────────────────────────────────────*/

export const RichLabel = {
  name: "Rich label",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 480 }}>

      <div>
        <p style={LABEL}>Bold value inline</p>
        <StatusBar
          value={450}
          max={1500}
          label={
            <span>
              Individual medical deductible&nbsp;
              <strong style={{ fontWeight: "var(--base-font-weight-semibold)" }}>$450</strong>
              {" of $1,500"}
            </span>
          }
        />
      </div>

      <div>
        <p style={LABEL}>Two-line label with muted subtext</p>
        <StatusBar
          value={73}
          label={
            <span>
              <span style={{ display: "block" }}>Storage</span>
              <span style={{ display: "block", color: "var(--semantic-color-text-muted)", fontSize: "var(--semantic-font-size-body-xs)" }}>
                73 GB of 100 GB used
              </span>
            </span>
          }
        />
      </div>

    </div>
  ),
};

/* ── RTL ──────────────────────────────────────────────────────────────────── */

export const RTL = {
  name: "RTL (right-to-left)",
  parameters: { controls: { include: [] } },
  render: () => (
    <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 480 }}>

      <div>
        <p style={{ ...LABEL, textAlign: "right" }}>Determinate — fills from right</p>
        <StatusBar value={60} label="٦٠٪ مكتمل" />
      </div>

      <div>
        <p style={{ ...LABEL, textAlign: "right" }}>Indeterminate — sweeps right to left</p>
        <StatusBar indeterminate label="جارٍ التحميل…" />
      </div>

      <div>
        <p style={{ ...LABEL, textAlign: "right" }}>Label before (inline-start = right in RTL)</p>
        <StatusBar value={40} label="٤٠٪" labelPosition="before" />
      </div>

    </div>
  ),
};

/* ── Real-world examples ──────────────────────────────────────────────────── */

export const Examples = {
  name: "Real-world examples",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-32)", maxWidth: 480 }}>

      <div>
        <p style={LABEL}>Deductible tracker</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
          <StatusBar value={450} max={1500} label="Individual medical deductible  $450 of $1,500" />
          <StatusBar value={0}   max={3000} label="Family medical deductible  $0 of $3,000" />
        </div>
      </div>

      <div>
        <p style={LABEL}>Storage usage (label after)</p>
        <StatusBar value={73} label="73% used" labelPosition="after" />
      </div>

      <div>
        <p style={LABEL}>Upload progress (label before)</p>
        <StatusBar size="sm" value={38} label="38%" labelPosition="before" />
      </div>

    </div>
  ),
};
