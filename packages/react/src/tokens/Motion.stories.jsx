import { useState } from "react";
import { getAllTokens } from "./_shared.jsx";

// ── Token data ────────────────────────────────────────────────────────────────

const DURATIONS = [
  { token: "--semantic-motion-duration-instant", label: "instant", desc: "No animation — instant feedback" },
  { token: "--semantic-motion-duration-quick",   label: "quick",   desc: "Micro-interactions, tooltips" },
  { token: "--semantic-motion-duration-fast",    label: "fast",    desc: "Hover and active state changes" },
  { token: "--semantic-motion-duration-normal",  label: "normal",  desc: "Standard UI transitions" },
  { token: "--semantic-motion-duration-slow",    label: "slow",    desc: "Panel entrances and exits" },
  { token: "--semantic-motion-duration-slower",  label: "slower",  desc: "Elaborate or full-page animations" },
  { token: "--semantic-motion-duration-slowest", label: "slowest", desc: "Full-page transitions and onboarding" },
];

const EASINGS = [
  {
    token: "--semantic-motion-easing-linear",
    label: "linear",
    desc: "Constant speed throughout",
    p: null,
  },
  {
    token: "--semantic-motion-easing-standard",
    label: "standard",
    desc: "General-purpose — slight acceleration then deceleration",
    p: [0.4, 0, 0.2, 1],
  },
  {
    token: "--semantic-motion-easing-enter",
    label: "enter",
    desc: "Decelerates to rest — for elements entering the screen",
    p: [0, 0, 0.2, 1],
  },
  {
    token: "--semantic-motion-easing-exit",
    label: "exit",
    desc: "Accelerates away — for elements leaving the screen",
    p: [0.4, 0, 1, 1],
  },
  {
    token: "--semantic-motion-easing-expressive",
    label: "expressive",
    desc: "Springy overshoot — adds personality to prominent moments",
    p: [0.34, 1.56, 0.64, 1],
  },
  {
    token: "--semantic-motion-easing-sharp",
    label: "sharp",
    desc: "Symmetric and crisp — for deliberate, controlled UI",
    p: [0.4, 0, 0.6, 1],
  },
];

// ── Easing curve SVG ──────────────────────────────────────────────────────────

function EasingCurve({ p, size = 52 }) {
  const s = size;
  const vPad = 14;
  const vb = `0 ${-vPad} ${s} ${s + vPad * 2}`;
  const sharedProps = { width: s, height: s, viewBox: vb, style: { overflow: "visible", flexShrink: 0 } };

  if (!p) {
    return (
      <svg {...sharedProps}>
        <rect x={0} y={0} width={s} height={s} fill="none" stroke="var(--semantic-color-border-subtle)" strokeWidth="0.75" rx="2" />
        <line x1={0} y1={s} x2={s} y2={0} stroke="var(--semantic-color-text-accent)" strokeWidth="1.5" />
      </svg>
    );
  }

  const [p1x, p1y, p2x, p2y] = p;
  const cp1x = p1x * s;
  const cp1y = (1 - p1y) * s;
  const cp2x = p2x * s;
  const cp2y = (1 - p2y) * s;

  return (
    <svg {...sharedProps}>
      <rect x={0} y={0} width={s} height={s} fill="none" stroke="var(--semantic-color-border-subtle)" strokeWidth="0.75" rx="2" />
      <line x1={0} y1={s} x2={cp1x} y2={cp1y} stroke="var(--semantic-color-border-subtle)" strokeWidth="1" strokeDasharray="2 2" />
      <line x1={s} y1={0} x2={cp2x} y2={cp2y} stroke="var(--semantic-color-border-subtle)" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx={cp1x} cy={cp1y} r={2.5} fill="var(--semantic-color-text-muted)" />
      <circle cx={cp2x} cy={cp2y} r={2.5} fill="var(--semantic-color-text-muted)" />
      <path
        d={`M 0 ${s} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${s} 0`}
        fill="none"
        stroke="var(--semantic-color-text-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Animated track ────────────────────────────────────────────────────────────

function AnimTrack({ durationToken, easingToken, animKey }) {
  return (
    <div style={{
      position: "relative",
      flex: "1 1 auto",
      height: "2px",
      background: "var(--semantic-color-border-subtle)",
      borderRadius: "1px",
      margin: "0 4px",
      minWidth: 0,
    }}>
      <div
        key={animKey}
        style={{
          position: "absolute",
          top: "-5px",
          left: "0",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "var(--semantic-color-text-accent)",
          animation: `a1-motion-slide var(${durationToken}) var(${easingToken}) both`,
        }}
      />
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({ title, description, action }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
        <h2 style={S.h2}>{title}</h2>
        {action}
      </div>
      <p style={S.sectionDesc}>{description}</p>
      <hr style={S.divider} />
    </div>
  );
}

// ── Replay button ─────────────────────────────────────────────────────────────

function ReplayBtn({ onClick, label = "Replay" }) {
  return (
    <button onClick={onClick} style={S.btn}>{label}</button>
  );
}

// ── Duration section ──────────────────────────────────────────────────────────

function DurationSection({ allVars }) {
  const [keys, setKeys] = useState(DURATIONS.map(() => 0));
  const replay = (i) => setKeys((prev) => prev.map((k, j) => (j === i ? k + 1 : k)));
  const replayAll = () => setKeys((prev) => prev.map((k) => k + 1));

  return (
    <section style={S.section}>
      <SectionHeader
        title="DURATION"
        description="T-shirt sized timing steps. All demo animations use the standard easing curve."
        action={<ReplayBtn onClick={replayAll} label="Replay all" />}
      />
      <div style={S.tableHead}>
        <span style={{ ...S.colToken }}>Token</span>
        <span style={{ ...S.colValue }}>Value</span>
        <span style={{ flex: "1 1 auto", fontSize: "0.7rem", color: "var(--semantic-color-text-muted)" }}>Animation</span>
      </div>
      {DURATIONS.map(({ token, label, desc }, i) => {
        const value = allVars[token] ?? "—";
        const isInstant = value === "0ms";
        return (
          <div key={token} style={S.row}>
            <div style={S.colToken}>
              <span style={S.mono}>{token}</span>
              <span style={S.rowDesc}>{desc}</span>
            </div>
            <span style={{ ...S.colValue, ...S.mono }}>{value}</span>
            {isInstant ? (
              <span style={{ flex: "1 1 auto", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)", fontStyle: "italic" }}>
                No transition
              </span>
            ) : (
              <>
                <AnimTrack
                  durationToken={token}
                  easingToken="--semantic-motion-easing-standard"
                  animKey={keys[i]}
                />
                <ReplayBtn onClick={() => replay(i)} />
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}

// ── Easing section ─────────────────────────────────────────────────────────────

function EasingSection({ allVars }) {
  const [animKey, setAnimKey] = useState(0);
  const playAll = () => setAnimKey((k) => k + 1);
  const slowDur = allVars["--semantic-motion-duration-slowest"] ?? "750ms";

  return (
    <section style={S.section}>
      <SectionHeader
        title="EASING"
        description={`Named curves that define the character of a transition. All demos run at the slowest duration (${slowDur}) so differences are clearly visible.`}
        action={<ReplayBtn onClick={playAll} label="Play all" />}
      />
      <div style={{ ...S.tableHead, paddingLeft: "68px" }}>
        <span style={S.colToken}>Token</span>
        <span style={S.colValue}>Value</span>
        <span style={{ flex: "1 1 auto", fontSize: "0.7rem", color: "var(--semantic-color-text-muted)" }}>Animation</span>
      </div>
      {EASINGS.map(({ token, label, desc, p }) => {
        const value = allVars[token] ?? "—";
        return (
          <div key={token} style={{ ...S.row, alignItems: "center" }}>
            <div style={{ flexShrink: 0, marginRight: "16px" }}>
              <EasingCurve p={p} size={52} />
            </div>
            <div style={S.colToken}>
              <span style={S.mono}>{token}</span>
              <span style={S.rowDesc}>{desc}</span>
            </div>
            <span style={{ ...S.colValue, ...S.mono, fontSize: "0.7rem" }}>{value}</span>
            <AnimTrack
              durationToken="--semantic-motion-duration-slowest"
              easingToken={token}
              animKey={animKey}
            />
          </div>
        );
      })}
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function MotionPage() {
  const allVars = getAllTokens();

  return (
    <>
      <style>{`
        @keyframes a1-motion-slide {
          from { left: 0; }
          to   { left: calc(100% - 12px); }
        }
      `}</style>
      <div style={S.page}>
        <h1 style={S.h1}>Motion</h1>
        <p style={S.lead}>
          Animation primitives for timing and easing. Reference these tokens in CSS transitions
          to build consistent, themeable motion across all components.
        </p>
        <DurationSection allVars={allVars} />
        <EasingSection allVars={allVars} />
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const S = {
  page: {
    padding: "40px 48px",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    background: "var(--semantic-color-surface-page)",
    color: "var(--semantic-color-text-default)",
    minHeight: "100vh",
    maxWidth: "960px",
  },
  h1:   { margin: "0 0 8px", fontSize: "1.75rem", fontWeight: 700 },
  lead: { margin: "0 0 48px", fontSize: "0.875rem", color: "var(--semantic-color-text-muted)" },
  section: { marginBottom: "56px" },
  h2: {
    margin: 0, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em",
    color: "var(--semantic-color-text-muted)",
  },
  sectionDesc: {
    margin: "4px 0 12px", fontSize: "0.8125rem", color: "var(--semantic-color-text-muted)",
  },
  divider: { margin: "0 0 0", border: "none", borderTop: "1px solid var(--semantic-color-border-subtle)" },
  tableHead: {
    display: "flex", alignItems: "center", gap: "16px",
    padding: "6px 12px",
    background: "var(--semantic-color-surface-panel)",
    borderBottom: "1px solid var(--semantic-color-border-subtle)",
    fontSize: "0.7rem", fontWeight: 600, color: "var(--semantic-color-text-muted)",
  },
  row: {
    display: "flex", alignItems: "center", gap: "16px",
    padding: "12px",
    borderBottom: "1px solid var(--semantic-color-border-subtle)",
  },
  colToken: {
    width: "296px", flexShrink: 0,
    display: "flex", flexDirection: "column", gap: "2px",
  },
  colValue: {
    width: "172px", flexShrink: 0,
    color: "var(--semantic-color-text-muted)",
  },
  mono: { fontFamily: "monospace", fontSize: "0.75rem" },
  rowDesc: { fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" },
  btn: {
    flexShrink: 0,
    padding: "4px 10px",
    fontSize: "0.75rem",
    fontFamily: "inherit",
    cursor: "pointer",
    border: "1px solid var(--semantic-color-border-default)",
    borderRadius: "4px",
    background: "var(--semantic-color-surface-raised)",
    color: "var(--semantic-color-text-default)",
    lineHeight: "1.5",
  },
};

// ── Export ────────────────────────────────────────────────────────────────────

export default {
  title: "Foundations/Motion",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Story = {
  name: "Motion",
  render: () => <MotionPage />,
};
