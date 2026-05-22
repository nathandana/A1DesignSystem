const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export default meta;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function isLightColor(hex) {
  if (!hex || !hex.startsWith("#")) return true;
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

// ─── Color ramp data ──────────────────────────────────────────────────────────

const STEPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

const PALETTES = [
  { name: "Neutral", prefix: "--base-color-neutral" },
  { name: "Accent",  prefix: "--base-color-accent" },
  { name: "Info",    prefix: "--base-color-info" },
  { name: "Success", prefix: "--base-color-success" },
  { name: "Warn",    prefix: "--base-color-warn" },
  { name: "Error",   prefix: "--base-color-error" },
];

// ─── Semantic color groups ────────────────────────────────────────────────────

const SEMANTIC_GROUPS = [
  {
    name: "Text",
    tokens: [
      "--semantic-color-text-default",
      "--semantic-color-text-muted",
      "--semantic-color-text-inverse",
    ],
  },
  {
    name: "Surface",
    tokens: [
      "--semantic-color-surface-page",
      "--semantic-color-surface-panel",
      "--semantic-color-surface-raised",
      "--semantic-color-surface-inverse",
    ],
  },
  {
    name: "Border",
    tokens: [
      "--semantic-color-border-subtle",
      "--semantic-color-border-default",
      "--semantic-color-border-strong",
    ],
  },
  {
    name: "Action",
    tokens: [
      "--semantic-color-action-background",
      "--semantic-color-action-background-hover",
      "--semantic-color-action-background-pressed",
      "--semantic-color-action-foreground",
      "--semantic-color-action-surface",
      "--semantic-color-action-border",
    ],
  },
  {
    name: "Status — Info",
    tokens: [
      "--semantic-color-status-info-background",
      "--semantic-color-status-info-surface",
      "--semantic-color-status-info-border",
      "--semantic-color-status-info-foreground",
    ],
  },
  {
    name: "Status — Success",
    tokens: [
      "--semantic-color-status-success-background",
      "--semantic-color-status-success-surface",
      "--semantic-color-status-success-border",
      "--semantic-color-status-success-foreground",
    ],
  },
  {
    name: "Status — Warn",
    tokens: [
      "--semantic-color-status-warn-background",
      "--semantic-color-status-warn-surface",
      "--semantic-color-status-warn-border",
      "--semantic-color-status-warn-foreground",
    ],
  },
  {
    name: "Status — Error",
    tokens: [
      "--semantic-color-status-error-background",
      "--semantic-color-status-error-surface",
      "--semantic-color-status-error-border",
      "--semantic-color-status-error-foreground",
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const S = {
  page: {
    padding: "40px 48px",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    background: "var(--semantic-color-surface-page)",
    color: "var(--semantic-color-text-default)",
    minHeight: "100vh",
  },
  h1: {
    margin: "0 0 8px",
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "var(--semantic-color-text-default)",
  },
  lead: {
    margin: "0 0 48px",
    fontSize: "0.875rem",
    color: "var(--semantic-color-text-muted)",
  },
  section: { marginBottom: "56px" },
  h2: {
    margin: "0 0 4px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--semantic-color-text-muted)",
  },
  divider: {
    margin: "8px 0 20px",
    border: "none",
    borderTop: "1px solid var(--semantic-color-border-subtle)",
  },
};

function RampRow({ name, prefix }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: "8px", color: "var(--semantic-color-text-default)" }}>
        {name}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, borderRadius: "8px", overflow: "hidden" }}>
        {STEPS.map((step) => {
          const varName = `${prefix}-${step}`;
          const value = cssVar(varName);
          const light = isLightColor(value);
          return (
            <div
              key={step}
              title={`${varName}: ${value}`}
              style={{
                height: "72px",
                background: `var(${varName})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "6px 2px",
                gap: "2px",
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: 600, color: light ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.7)" }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}>
        {STEPS.map((step) => {
          const value = cssVar(`${prefix}-${step}`);
          return (
            <div key={step} style={{ paddingTop: "4px", textAlign: "center", minWidth: 0, overflow: "hidden" }}>
              <span style={{ fontSize: "9px", color: "var(--semantic-color-text-muted)", fontFamily: "monospace", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ColorSwatch({ tokenName }) {
  const value = cssVar(tokenName);
  const light = isLightColor(value);
  const label = tokenName.replace("--semantic-color-", "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
      <div
        style={{
          height: "64px",
          borderRadius: "6px",
          background: `var(${tokenName})`,
          border: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "flex-end",
          padding: "6px 8px",
        }}
      >
        <span style={{ fontSize: "10px", fontWeight: 600, color: light ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.65)" }}>
          {value}
        </span>
      </div>
      <div>
        <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--semantic-color-text-default)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {label}
        </div>
        <div style={{ fontSize: "10px", color: "var(--semantic-color-text-muted)", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {tokenName}
        </div>
      </div>
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const ColorRamps = {
  name: "Color Ramps",
  render: () => (
    <div style={S.page}>
      <h1 style={S.h1}>Color Ramps</h1>
      <p style={S.lead}>Base color palettes — full 0–1000 scale for each hue.</p>

      <div style={S.section}>
        {PALETTES.map((p) => (
          <RampRow key={p.name} name={p.name} prefix={p.prefix} />
        ))}
      </div>
    </div>
  ),
};

export const SemanticColors = {
  name: "Semantic Colors",
  render: () => (
    <div style={S.page}>
      <h1 style={S.h1}>Semantic Colors</h1>
      <p style={S.lead}>Intent-mapped colors — use these in components, never the base ramps directly.</p>

      {SEMANTIC_GROUPS.map((group) => (
        <div key={group.name} style={S.section}>
          <h2 style={S.h2}>{group.name}</h2>
          <hr style={S.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
            {group.tokens.map((t) => (
              <ColorSwatch key={t} tokenName={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
