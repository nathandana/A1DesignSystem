import { useGlobals } from "storybook/preview-api";
import a1LightTheme from "../../../../system/themes/a1-light/theme.json";
import accessibleTheme from "../../../../system/themes/accessible/theme.json";
import heritageTheme from "../../../../system/themes/heritage/theme.json";

export default {
  title: "Foundations/Themes",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

// ─── Runtime helpers ──────────────────────────────────────────────────────────

function getRootVars() {
  const computed = getComputedStyle(document.documentElement);
  const vars = {};
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === ":root") {
          for (let i = 0; i < rule.style.length; i++) {
            const prop = rule.style[i];
            if (prop.startsWith("--")) vars[prop] = computed.getPropertyValue(prop).trim();
          }
        }
      }
    } catch (_) {}
  }
  return vars;
}

function resolve(raw, rootVars) {
  if (!raw) return raw;
  const m = raw.match(/^var\((--[^,)]+)(?:,[^)]+)?\)$/);
  return m ? (rootVars[m[1].trim()] ?? raw) : raw;
}

function isColor(v) {
  return /^#[0-9a-f]{3,8}$/i.test(v) || /^rgba?\(/.test(v) || /^hsl/.test(v);
}

// ─── Visual primitives ────────────────────────────────────────────────────────

function Swatch({ value }) {
  return (
    <span style={{
      display: "inline-block",
      width: 13, height: 13,
      borderRadius: 3,
      background: value,
      border: "1px solid rgba(0,0,0,.15)",
      flexShrink: 0,
      verticalAlign: "middle",
    }} />
  );
}

function ValueCell({ raw, rootVars }) {
  const resolved = resolve(raw, rootVars);
  const showSwatch = isColor(resolved);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      {showSwatch && <Swatch value={resolved} />}
      <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--semantic-color-text-muted)" }}>
        {resolved || "—"}
      </span>
    </span>
  );
}

function BaseCell({ prop, rootVars }) {
  if (!prop.startsWith("--")) {
    return <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--semantic-color-text-muted)" }}>—</span>;
  }
  const value = rootVars[prop];
  if (!value) {
    return <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--semantic-color-border-default)" }}>not set</span>;
  }
  return <ValueCell raw={value} rootVars={rootVars} />;
}

// ─── Selector block ───────────────────────────────────────────────────────────

function SelectorBlock({ selector, properties, rootVars }) {
  const entries = Object.entries(properties);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 10 }}>
        {selector.split(",").map((s) => (
          <code key={s} style={{
            display: "inline-block",
            fontFamily: "monospace",
            fontSize: "0.72rem",
            background: "var(--semantic-color-surface-raised)",
            border: "1px solid var(--semantic-color-border-subtle)",
            borderRadius: 4,
            padding: "2px 7px",
            marginRight: 6,
            marginBottom: 4,
            color: "var(--semantic-color-text-default)",
          }}>
            {s.trim()}
          </code>
        ))}
      </div>

      <div style={{ border: "1px solid var(--semantic-color-border-subtle)", borderRadius: 6, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
          <thead>
            <tr>
              <th style={TH}>Property</th>
              <th style={TH}>Base (:root)</th>
              <th style={{ ...TH, borderRight: "none" }}>Override</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([prop, raw], i) => (
              <tr key={prop} style={{ background: i % 2 === 0 ? "transparent" : "var(--semantic-color-surface-panel)" }}>
                <td style={TD}>
                  <code style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--semantic-color-text-default)" }}>
                    {prop}
                  </code>
                </td>
                <td style={TD}><BaseCell prop={prop} rootVars={rootVars} /></td>
                <td style={{ ...TD, borderRight: "none" }}>
                  <ValueCell raw={raw} rootVars={rootVars} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TH = {
  padding: "8px 12px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "0.72rem",
  color: "var(--semantic-color-text-muted)",
  background: "var(--semantic-color-surface-panel)",
  borderBottom: "1px solid var(--semantic-color-border-subtle)",
  borderRight: "1px solid var(--semantic-color-border-subtle)",
};

const TD = {
  padding: "6px 12px",
  borderBottom: "1px solid var(--semantic-color-border-subtle)",
  borderRight: "1px solid var(--semantic-color-border-subtle)",
  verticalAlign: "middle",
};

// ─── Live preview ─────────────────────────────────────────────────────────────

function LivePreview() {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap", alignItems: "flex-start" }}>
      {/* Surfaces */}
      {[
        ["Page", "var(--semantic-color-surface-page)"],
        ["Panel", "var(--semantic-color-surface-panel)"],
        ["Raised", "var(--semantic-color-surface-raised)"],
      ].map(([label, bg]) => (
        <div key={label} style={{
          background: bg,
          border: "1px solid var(--semantic-color-border-subtle)",
          borderRadius: 8,
          padding: "12px 16px",
          fontSize: "0.75rem",
          color: "var(--semantic-color-text-muted)",
          minWidth: 72,
          textAlign: "center",
        }}>
          {label}
        </div>
      ))}

      {/* Text samples */}
      <div style={{
        border: "1px solid var(--semantic-color-border-subtle)",
        borderRadius: 8,
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--semantic-color-text-default)" }}>Default text</span>
        <span style={{ fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Muted text</span>
        <span style={{ fontSize: "0.75rem", color: "var(--semantic-color-text-accent)" }}>Accent text</span>
      </div>

      {/* Action */}
      <div style={{
        background: "var(--semantic-color-action-background)",
        color: "var(--semantic-color-action-foreground)",
        borderRadius: 8,
        padding: "10px 18px",
        fontSize: "0.875rem",
        fontWeight: 600,
        border: "1px solid var(--semantic-color-action-border)",
        alignSelf: "center",
      }}>
        Action
      </div>

      {/* Status dots */}
      <div style={{
        border: "1px solid var(--semantic-color-border-subtle)",
        borderRadius: 8,
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}>
        {[
          ["Info",    "var(--semantic-color-status-info-background)"],
          ["Error",   "var(--semantic-color-status-error-background)"],
          ["Warning", "var(--semantic-color-status-warn-background)"],
          ["Success", "var(--semantic-color-status-success-background)"],
        ].map(([label, bg]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.72rem", color: "var(--semantic-color-text-muted)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: bg, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Per-theme story layout ───────────────────────────────────────────────────

function ThemeStory({ theme, className }) {
  const [globals] = useGlobals();
  const isDark = globals?.colorScheme === "dark";

  const rootVars = getRootVars();
  const selectors = Object.entries(theme.selectors ?? {});
  const overrideCount = selectors.reduce((n, [, props]) => n + Object.keys(props).length, 0);

  // Apply the theme class AND, when dark mode is active, a1-theme-dark on the
  // same element so dark vars (higher source order in color-scheme.css) win.
  const classes = [className, isDark && "a1-theme-dark"].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={classes}
      style={{
        padding: "40px 48px",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        background: "var(--semantic-color-surface-page)",
        color: "var(--semantic-color-text-default)",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700 }}>{theme.name}</h1>
        <span style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "var(--semantic-color-text-muted)",
          background: "var(--semantic-color-surface-raised)",
          border: "1px solid var(--semantic-color-border-subtle)",
          borderRadius: 99,
          padding: "1px 8px",
        }}>
          {overrideCount} override{overrideCount !== 1 ? "s" : ""}
        </span>
      </div>

      {theme.description && (
        <p style={{ margin: "0 0 32px", fontSize: "0.875rem", color: "var(--semantic-color-text-muted)", maxWidth: 600 }}>
          {theme.description}
        </p>
      )}

      <LivePreview />

      <h2 style={{ margin: "0 0 20px", fontSize: "1rem", fontWeight: 600 }}>Token overrides</h2>
      <p style={{ margin: "0 0 24px", fontSize: "0.8125rem", color: "var(--semantic-color-text-muted)", maxWidth: 600 }}>
        Properties this theme overrides, compared against the base <code style={{ fontFamily: "monospace" }}>:root</code> values.
      </p>

      {selectors.map(([selector, properties]) => (
        <SelectorBlock
          key={selector}
          selector={selector}
          properties={properties}
          rootVars={rootVars}
        />
      ))}

      {Object.keys(theme.labels ?? {}).length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "1rem", fontWeight: 600 }}>Label overrides</h2>
          <div style={{ border: "1px solid var(--semantic-color-border-subtle)", borderRadius: 6, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
              <thead>
                <tr>
                  <th style={TH}>Key</th>
                  <th style={{ ...TH, borderRight: "none" }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(theme.labels).map(([key, value], i) => (
                  <tr key={key} style={{ background: i % 2 === 0 ? "transparent" : "var(--semantic-color-surface-panel)" }}>
                    <td style={TD}>
                      <code style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--semantic-color-text-default)" }}>{key}</code>
                    </td>
                    <td style={{ ...TD, borderRight: "none", color: "var(--semantic-color-text-muted)", fontSize: "0.72rem" }}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Base = {
  name: "Base",
  render: () => <ThemeStory theme={a1LightTheme} className="" />,
};

export const Accessible = {
  name: "Accessible",
  render: () => <ThemeStory theme={accessibleTheme} className="a1-theme-accessible" />,
};

export const Heritage = {
  name: "Heritage",
  render: () => <ThemeStory theme={heritageTheme} className="a1-theme-heritage" />,
};
