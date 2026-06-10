import { useState, useEffect } from "react";
import { CircularProgress } from "./CircularProgress.jsx";
import { Icon } from "../icon/Icon.jsx";

export default {
  title: "Components/Feedback/Circular Progress",
  component: CircularProgress,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    value: 21,
    max: 100,
    size: "md",
    indeterminate: false,
  },
  argTypes: {
    size:          { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    indeterminate: { control: "boolean" },
    value:         { control: { type: "range", min: 0, max: 100, step: 1 } },
    max:           { control: "number" },
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
  render: (args) => (
    <CircularProgress {...args} aria-label={`${args.value}% complete`}>
      {args.size !== "xs" && (
        <>
          <span style={{
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-lg)",
            fontWeight: "var(--base-font-weight-bold)",
            color: "var(--semantic-color-text-default)",
            lineHeight: 1,
          }}>
            {args.value}%
          </span>
          <span style={{
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-xs)",
            color: "var(--semantic-color-text-muted)",
            marginTop: "var(--base-spacing-4)",
          }}>
            complete
          </span>
        </>
      )}
    </CircularProgress>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */

export const Sizes = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--base-spacing-32)" }}>
      {(["xs", "sm", "md", "lg"]).map((sz) => {
        const pct = 65;
        return (
          <div key={sz} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--base-spacing-8)" }}>
            <p style={{ ...LABEL, marginBottom: 0 }}>{sz}</p>
            <CircularProgress size={sz} value={pct} aria-label={`${pct}%`}>
              {sz !== "xs" && (
                <span style={{
                  fontFamily: "var(--component-paragraph-font-family)",
                  fontSize: sz === "sm" ? "var(--semantic-font-size-body-xs)" : "var(--semantic-font-size-body-sm)",
                  fontWeight: "var(--base-font-weight-semibold)",
                  color: "var(--semantic-color-text-default)",
                }}>
                  {pct}%
                </span>
              )}
            </CircularProgress>
          </div>
        );
      })}
    </div>
  ),
};

/* ── With custom inner content ────────────────────────────────────────────── */

export const WithInnerContent = {
  name: "Custom inner content",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--base-spacing-32)" }}>

      <div>
        <p style={LABEL}>Percentage + label</p>
        <CircularProgress size="lg" value={21} aria-label="21% complete">
          <span style={{
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-xl)",
            fontWeight: "var(--base-font-weight-bold)",
            color: "var(--semantic-color-text-default)",
            lineHeight: 1,
          }}>21%</span>
          <span style={{
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-xs)",
            color: "var(--semantic-color-text-muted)",
            marginTop: "var(--base-spacing-4)",
          }}>complete</span>
        </CircularProgress>
      </div>

      <div>
        <p style={LABEL}>Icon + status</p>
        <CircularProgress size="md" value={100} aria-label="Upload complete">
          <Icon
  color="info"
  fill={null}
  grade={0}
  name="check"
  opticalSize={24}
  size="xl"
  weight={400}
/>
        </CircularProgress>
      </div>

      <div>
        <p style={LABEL}>Compact text</p>
        <CircularProgress size="sm" value={72} aria-label="72% synced">
          <span style={{
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-xs)",
            fontWeight: "var(--base-font-weight-semibold)",
            color: "var(--semantic-color-text-default)",
          }}>72%</span>
        </CircularProgress>
      </div>

    </div>
  ),
};

/* ── xs — content after ring ──────────────────────────────────────────────── */

export const XsWithAfterContent = {
  name: "xs — content after ring",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>

      <div>
        <p style={LABEL}>Determinate with label after</p>
        <CircularProgress size="xs" value={45} aria-label="45% synced">
          <span style={{
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-sm)",
            color: "var(--semantic-color-text-default)",
          }}>45% synced</span>
        </CircularProgress>
      </div>

      <div>
        <p style={LABEL}>Indeterminate with label after</p>
        <CircularProgress size="xs" indeterminate aria-label="Uploading…">
          <span style={{
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-sm)",
            color: "var(--semantic-color-text-muted)",
          }}>Uploading…</span>
        </CircularProgress>
      </div>

    </div>
  ),
};

/* ── Indeterminate (loading) ──────────────────────────────────────────────── */

export const Indeterminate = {
  name: "Indeterminate (loading)",
  parameters: { controls: { include: ["size"] } },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--base-spacing-32)" }}>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--base-spacing-8)" }}>
        <p style={{ ...LABEL, marginBottom: 0 }}>No inner content</p>
        <CircularProgress size={args.size} indeterminate aria-label="Loading" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--base-spacing-8)" }}>
        <p style={{ ...LABEL, marginBottom: 0 }}>With inner content</p>
        {args.size !== "xs"
          ? (
            <CircularProgress size={args.size} indeterminate aria-label="Processing">
              <span style={{
                fontFamily: "var(--component-paragraph-font-family)",
                fontSize: "var(--semantic-font-size-body-xs)",
                color: "var(--semantic-color-text-muted)",
              }}>Loading…</span>
            </CircularProgress>
          ) : (
            <CircularProgress size="xs" indeterminate aria-label="Processing">
              <span style={{
                fontFamily: "var(--component-paragraph-font-family)",
                fontSize: "var(--semantic-font-size-body-sm)",
                color: "var(--semantic-color-text-muted)",
              }}>Loading…</span>
            </CircularProgress>
          )
        }
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-12)" }}>
        <p style={{ ...LABEL, marginBottom: 0 }}>All sizes</p>
        {["xs", "sm", "md", "lg"].map((sz) => (
          <div key={sz} style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-8)" }}>
            <CircularProgress size={sz} indeterminate aria-label={`Loading ${sz}`} />
            <span style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>{sz}</span>
          </div>
        ))}
      </div>

    </div>
  ),
};

/* ── Animated value ───────────────────────────────────────────────────────── */

function AnimatedDemo() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (value >= 100) return;
    const t = setTimeout(() => setValue((v) => Math.min(100, v + 3)), 200);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", alignItems: "flex-start" }}>
      <CircularProgress size="lg" value={value} aria-label={`${value}% uploaded`}>
        <span style={{
          fontFamily: "var(--component-paragraph-font-family)",
          fontSize: "var(--semantic-font-size-body-xl)",
          fontWeight: "var(--base-font-weight-bold)",
          color: "var(--semantic-color-text-default)",
          lineHeight: 1,
        }}>{value}%</span>
        <span style={{
          fontFamily: "var(--component-paragraph-font-family)",
          fontSize: "var(--semantic-font-size-body-xs)",
          color: "var(--semantic-color-text-muted)",
          marginTop: "var(--base-spacing-4)",
        }}>
          {value < 100 ? "uploading" : "complete"}
        </span>
      </CircularProgress>
      <button
        style={{
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

/* ── Real-world examples ──────────────────────────────────────────────────── */

export const Examples = {
  name: "Real-world examples",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--base-spacing-32)" }}>

      <div>
        <p style={LABEL}>Storage used</p>
        <CircularProgress size="lg" value={73} aria-label="73% storage used">
          <span style={{
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-xl)",
            fontWeight: "var(--base-font-weight-bold)",
            color: "var(--semantic-color-text-default)",
            lineHeight: 1,
          }}>73%</span>
          <span style={{
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-xs)",
            color: "var(--semantic-color-text-muted)",
            marginTop: "var(--base-spacing-4)",
          }}>used</span>
        </CircularProgress>
      </div>

      <div>
        <p style={LABEL}>Steps complete</p>
        <CircularProgress size="md" value={3} max={5} aria-label="3 of 5 steps complete">
          <span style={{
            fontFamily: "var(--component-paragraph-font-family)",
            fontSize: "var(--semantic-font-size-body-sm)",
            fontWeight: "var(--base-font-weight-semibold)",
            color: "var(--semantic-color-text-default)",
          }}>3 / 5</span>
        </CircularProgress>
      </div>

      <div>
        <p style={LABEL}>Inline loading (xs)</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-8)" }}>
          <CircularProgress size="xs" indeterminate aria-label="Saving">
            <span style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>Saving changes…</span>
          </CircularProgress>
          <CircularProgress size="xs" value={88} aria-label="88% synced">
            <span style={{ fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-default)" }}>88% synced</span>
          </CircularProgress>
        </div>
      </div>

    </div>
  ),
};
