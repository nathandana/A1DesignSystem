const meta = {
  title: "Foundations/Breakpoints",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export default meta;

// ─── Breakpoint definitions ───────────────────────────────────────────────────

const BREAKPOINTS = [
  { name: "xs", min: 0,    max: 480,  minVar: null,                   maxVar: "--breakpoint-xs-max" },
  { name: "sm", min: 481,  max: 640,  minVar: "--breakpoint-sm-min",  maxVar: "--breakpoint-sm-max" },
  { name: "md", min: 641,  max: 1024, minVar: "--breakpoint-md-min",  maxVar: "--breakpoint-md-max" },
  { name: "lg", min: 1025, max: 1440, minVar: "--breakpoint-lg-min",  maxVar: "--breakpoint-lg-max" },
  { name: "xl", min: 1441, max: null, minVar: "--breakpoint-xl-min",  maxVar: null },
];

// For proportional widths in the scale bar — cap xl visually at 1600
const SCALE_MAX = 1600;

const PALETTE = [
  "var(--semantic-color-action-surface)",
  "var(--semantic-color-status-info-surface)",
  "var(--semantic-color-status-success-surface)",
  "var(--semantic-color-status-warn-surface)",
  "var(--semantic-color-status-error-surface)",
];

const BORDER = [
  "var(--semantic-color-action-border)",
  "var(--semantic-color-status-info-border)",
  "var(--semantic-color-status-success-border)",
  "var(--semantic-color-status-warn-border)",
  "var(--semantic-color-status-error-border)",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useViewportWidth() {
  if (typeof window === "undefined") return 0;
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

function activeBreakpoint(w) {
  if (w <= 480)  return "xs";
  if (w <= 640)  return "sm";
  if (w <= 1024) return "md";
  if (w <= 1440) return "lg";
  return "xl";
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  page: {
    padding: "40px 48px",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    background: "var(--semantic-color-surface-page)",
    color: "var(--semantic-color-text-default)",
    minHeight: "100vh",
  },
  h1:   { margin: "0 0 8px", fontSize: "1.75rem", fontWeight: 700 },
  lead: { margin: "0 0 40px", fontSize: "0.875rem", color: "var(--semantic-color-text-muted)" },
  h2: {
    margin: "0 0 4px", fontSize: "0.75rem", fontWeight: 700,
    color: "var(--semantic-color-text-muted)",
  },
  divider: { margin: "8px 0 20px", border: "none", borderTop: "1px solid var(--semantic-color-border-subtle)" },
  section: { marginBottom: "48px" },
  table:   { width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" },
  th: {
    padding: "8px 12px", textAlign: "left", fontWeight: 600, fontSize: "0.75rem",
    color: "var(--semantic-color-text-muted)",
    borderBottom: "1px solid var(--semantic-color-border-subtle)",
    background: "var(--semantic-color-surface-panel)",
  },
  td: { padding: "9px 12px", borderBottom: "1px solid var(--semantic-color-border-subtle)", verticalAlign: "middle" },
  mono: { fontFamily: "monospace", fontSize: "0.75rem" },
};

// ─── Components ───────────────────────────────────────────────────────────────

function ScaleBar({ viewportWidth }) {
  const active = activeBreakpoint(viewportWidth);
  return (
    <div style={{ display: "flex", borderRadius: "10px", overflow: "hidden", height: "56px", border: "1px solid var(--semantic-color-border-subtle)" }}>
      {BREAKPOINTS.map((bp, i) => {
        const width = bp.max
          ? ((Math.min(bp.max, SCALE_MAX) - bp.min) / SCALE_MAX) * 100
          : ((SCALE_MAX - bp.min) / SCALE_MAX) * 100;
        const isActive = active === bp.name;
        return (
          <div
            key={bp.name}
            style={{
              width: `${width}%`,
              minWidth: 0,
              background: isActive ? BORDER[i] : PALETTE[i],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s",
              borderRight: i < BREAKPOINTS.length - 1 ? `1px solid var(--semantic-color-border-subtle)` : "none",
            }}
          >
            <span style={{
              fontSize: "0.75rem", fontWeight: isActive ? 700 : 500,
              color: isActive ? "var(--semantic-color-surface-page)" : "var(--semantic-color-text-muted)",
              overflow: "hidden", whiteSpace: "nowrap",
            }}>
              {bp.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ViewportIndicator({ viewportWidth }) {
  const active = activeBreakpoint(viewportWidth);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "10px",
      background: "var(--semantic-color-surface-panel)",
      border: "1px solid var(--semantic-color-border-subtle)",
      borderRadius: "8px", padding: "10px 16px", marginBottom: "20px",
    }}>
      <span style={{ fontSize: "0.8125rem", color: "var(--semantic-color-text-muted)" }}>
        Viewport
      </span>
      <span style={{ fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 700, color: "var(--semantic-color-text-default)" }}>
        {viewportWidth}px
      </span>
      <span style={{ fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>→</span>
      <span style={{
        fontFamily: "monospace", fontSize: "0.8125rem", fontWeight: 700,
        background: "var(--semantic-color-action-background)",
        color: "var(--semantic-color-action-foreground)",
        borderRadius: "4px", padding: "2px 8px",
      }}>
        {active}
      </span>
    </div>
  );
}

function MediaQueryCell({ bp }) {
  const only = bp.min && bp.max
    ? `(min-width: ${bp.min}px) and (max-width: ${bp.max}px)`
    : bp.max
      ? `(max-width: ${bp.max}px)`
      : `(min-width: ${bp.min}px)`;
  const up = `(min-width: ${bp.min}px)`;
  const down = bp.max ? `(max-width: ${bp.max}px)` : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
        <span style={{ ...S.mono, color: "var(--semantic-color-text-muted)", width: "72px", flexShrink: 0 }}>only</span>
        <code style={{ ...S.mono, color: "var(--semantic-color-text-default)" }}>{only}</code>
      </div>
      {bp.min > 0 && (
        <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
          <span style={{ ...S.mono, color: "var(--semantic-color-text-muted)", width: "72px", flexShrink: 0 }}>up</span>
          <code style={{ ...S.mono, color: "var(--semantic-color-text-default)" }}>{up}</code>
        </div>
      )}
      {down && (
        <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
          <span style={{ ...S.mono, color: "var(--semantic-color-text-muted)", width: "72px", flexShrink: 0 }}>down</span>
          <code style={{ ...S.mono, color: "var(--semantic-color-text-default)" }}>{down}</code>
        </div>
      )}
    </div>
  );
}

function CustomMediaCell({ bp }) {
  const lines = [];
  if (bp.min && bp.max) lines.push(`--bp-${bp.name}`, `--bp-${bp.name}-up`, `--bp-${bp.name}-down`);
  else if (bp.max)      lines.push(`--bp-${bp.name}`, `--bp-${bp.name}-down`);
  else                  lines.push(`--bp-${bp.name}`, `--bp-${bp.name}-up`);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
      {lines.map(l => (
        <code key={l} style={{ ...S.mono, color: "var(--semantic-color-action-background)" }}>@media ({l})</code>
      ))}
    </div>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────

import React from "react";

export const Breakpoints = {
  name: "Breakpoints",
  render: () => {
    const vw = useViewportWidth();
    return (
      <div style={S.page}>
        <h1 style={S.h1}>Breakpoints</h1>
        <p style={S.lead}>
          Five viewport ranges defined as CSS custom properties and <code style={S.mono}>@custom-media</code> rules.
          CSS vars are in <code style={S.mono}>tokens.css</code>; <code style={S.mono}>@custom-media</code> rules are in <code style={S.mono}>breakpoints.css</code> (requires postcss-custom-media).
          Resize the Storybook preview to see the active breakpoint update.
        </p>

        {/* Live indicator */}
        <div style={S.section}>
          <h2 style={S.h2}>Live viewport</h2>
          <hr style={S.divider} />
          <ViewportIndicator viewportWidth={vw} />
          <ScaleBar viewportWidth={vw} />
        </div>

        {/* Reference table */}
        <div style={S.section}>
          <h2 style={S.h2}>Reference</h2>
          <hr style={S.divider} />
          <table style={S.table}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: "60px" }}>Name</th>
                <th style={S.th}>Range</th>
                <th style={S.th}>CSS custom properties</th>
                <th style={S.th}>Raw media query</th>
                <th style={S.th}>@custom-media name</th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map((bp, i) => (
                <tr key={bp.name} style={{ background: i % 2 === 0 ? "transparent" : "var(--semantic-color-surface-panel)" }}>
                  <td style={S.td}>
                    <code style={{ ...S.mono, fontWeight: 700 }}>{bp.name}</code>
                  </td>
                  <td style={S.td}>
                    <span style={{ ...S.mono, color: "var(--semantic-color-text-muted)" }}>
                      {bp.min}px – {bp.max ? `${bp.max}px` : "∞"}
                    </span>
                  </td>
                  <td style={S.td}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      {bp.minVar && (
                        <code style={{ ...S.mono, color: "var(--semantic-color-text-default)" }}>{bp.minVar}</code>
                      )}
                      {bp.maxVar && (
                        <code style={{ ...S.mono, color: "var(--semantic-color-text-default)" }}>{bp.maxVar}</code>
                      )}
                    </div>
                  </td>
                  <td style={S.td}>
                    <MediaQueryCell bp={bp} />
                  </td>
                  <td style={S.td}>
                    <CustomMediaCell bp={bp} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Usage note */}
        <div style={S.section}>
          <h2 style={S.h2}>Usage</h2>
          <hr style={S.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: "0.8125rem", fontWeight: 600, color: "var(--semantic-color-text-default)" }}>
                CSS (with postcss-custom-media)
              </p>
              <pre style={{
                margin: 0, padding: "16px", borderRadius: "8px",
                background: "var(--semantic-color-surface-panel)",
                border: "1px solid var(--semantic-color-border-subtle)",
                fontSize: "0.75rem", fontFamily: "monospace",
                color: "var(--semantic-color-text-default)",
                overflowX: "auto",
              }}>{`@media (--bp-md-up) {
  .container { max-width: 1024px; }
}

@media (--bp-xs) {
  .sidebar { display: none; }
}`}</pre>
            </div>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: "0.8125rem", fontWeight: 600, color: "var(--semantic-color-text-default)" }}>
                JavaScript
              </p>
              <pre style={{
                margin: 0, padding: "16px", borderRadius: "8px",
                background: "var(--semantic-color-surface-panel)",
                border: "1px solid var(--semantic-color-border-subtle)",
                fontSize: "0.75rem", fontFamily: "monospace",
                color: "var(--semantic-color-text-default)",
                overflowX: "auto",
              }}>{`const mdMin = getComputedStyle(document.documentElement)
  .getPropertyValue("--breakpoint-md-min");
// → "641px"

const isMd = window.matchMedia(
  \`(min-width: \${mdMin})\`
).matches;`}</pre>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
