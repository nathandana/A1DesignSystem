const SIZES = [
  { name: "xxs", value: "4px" },
  { name: "xs",  value: "8px" },
  { name: "sm",  value: "12px" },
  { name: "md",  value: "16px" },
  { name: "lg",  value: "24px" },
  { name: "xl",  value: "40px" },
  { name: "xxl", value: "64px" },
];

const DIMENSIONS = [
  { suffix: "",   label: "All",    property: "padding / margin" },
  { suffix: "t",  label: "Top",    property: "padding-top / margin-top" },
  { suffix: "b",  label: "Bottom", property: "padding-bottom / margin-bottom" },
  { suffix: "l",  label: "Left",   property: "padding-left / margin-left" },
  { suffix: "r",  label: "Right",  property: "padding-right / margin-right" },
  { suffix: "x",  label: "X",      property: "padding-left + right / margin-left + right" },
  { suffix: "y",  label: "Y",      property: "padding-top + bottom / margin-top + bottom" },
];

const cellStyle = {
  padding: "10px 16px",
  fontSize: "var(--semantic-font-size-body-sm)",
  fontFamily: "monospace",
  borderBottom: "1px solid var(--semantic-color-border-subtle)",
  color: "var(--semantic-color-text-default)",
  verticalAlign: "middle",
};

const headStyle = {
  ...cellStyle,
  fontFamily: "var(--component-paragraph-font-family)",
  fontWeight: 600,
  color: "var(--semantic-color-text-muted)",
  fontSize: "var(--semantic-font-size-body-xs)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  background: "var(--semantic-color-surface-panel)",
};

const meta = {
  title: "Utilities/Spacing",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export default meta;

/* ── Scale reference ──────────────────────────────────────────────────────── */

export const Scale = {
  name: "Spacing scale",
  render: () => (
    <div style={{ padding: "var(--base-spacing-xl)" }}>
      <div style={{ marginBottom: "var(--base-spacing-lg)" }}>
        <p style={{ margin: "0 0 var(--base-spacing-xs)", fontFamily: "var(--component-heading-font-family-heading)", fontSize: "var(--semantic-font-size-heading-sm)", fontWeight: "var(--component-heading-font-weight-heading)", color: "var(--semantic-color-text-default)" }}>
          Spacing scale
        </p>
        <p style={{ margin: 0, fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>
          All values are driven by <code style={{ fontFamily: "monospace" }}>--base-spacing-*</code> tokens.
          Classes follow the pattern <code style={{ fontFamily: "monospace" }}>a1-{"{p|m}"}{"{dimension?}"}-{"{size}"}</code>.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-sm)" }}>
        {SIZES.map(({ name, value }) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "var(--base-spacing-md)" }}>
            <code style={{ fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)", width: "36px", flexShrink: 0 }}>
              {name}
            </code>
            <div
              style={{
                height: "24px",
                width: value,
                background: "var(--semantic-color-action-surface)",
                border: "1px solid var(--semantic-color-action-border)",
                borderRadius: "2px",
                flexShrink: 0,
              }}
            />
            <code style={{ fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>
              {value}
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
};

/* ── Padding reference ────────────────────────────────────────────────────── */

export const Padding = {
  name: "Padding classes",
  render: () => (
    <div style={{ padding: "var(--base-spacing-xl)" }}>
      <p style={{ margin: "0 0 var(--base-spacing-lg)", fontFamily: "var(--component-heading-font-family-heading)", fontSize: "var(--semantic-font-size-heading-sm)", fontWeight: "var(--component-heading-font-weight-heading)", color: "var(--semantic-color-text-default)" }}>
        Padding
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--semantic-color-surface-page)", border: "1px solid var(--semantic-color-border-subtle)", borderRadius: "var(--base-radius-lg)", overflow: "hidden" }}>
        <thead>
          <tr>
            <th style={headStyle}>Dimension</th>
            {SIZES.map(s => <th key={s.name} style={{ ...headStyle, textAlign: "center" }}>{s.name}<br /><span style={{ fontWeight: 400, opacity: 0.7 }}>{s.value}</span></th>)}
          </tr>
        </thead>
        <tbody>
          {DIMENSIONS.map(({ suffix, label, property }) => (
            <tr key={suffix}>
              <td style={{ ...cellStyle, fontFamily: "var(--component-paragraph-font-family)" }}>
                <strong>{label}</strong>
                <br />
                <span style={{ fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>{property}</span>
              </td>
              {SIZES.map(s => (
                <td key={s.name} style={{ ...cellStyle, textAlign: "center", color: "var(--semantic-color-action-background)" }}>
                  {`a1-p${suffix}-${s.name}`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/* ── Margin reference ─────────────────────────────────────────────────────── */

export const Margin = {
  name: "Margin classes",
  render: () => (
    <div style={{ padding: "var(--base-spacing-xl)" }}>
      <p style={{ margin: "0 0 var(--base-spacing-lg)", fontFamily: "var(--component-heading-font-family-heading)", fontSize: "var(--semantic-font-size-heading-sm)", fontWeight: "var(--component-heading-font-weight-heading)", color: "var(--semantic-color-text-default)" }}>
        Margin
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--semantic-color-surface-page)", border: "1px solid var(--semantic-color-border-subtle)", borderRadius: "var(--base-radius-lg)", overflow: "hidden" }}>
        <thead>
          <tr>
            <th style={headStyle}>Dimension</th>
            {SIZES.map(s => <th key={s.name} style={{ ...headStyle, textAlign: "center" }}>{s.name}<br /><span style={{ fontWeight: 400, opacity: 0.7 }}>{s.value}</span></th>)}
          </tr>
        </thead>
        <tbody>
          {DIMENSIONS.map(({ suffix, label, property }) => (
            <tr key={suffix}>
              <td style={{ ...cellStyle, fontFamily: "var(--component-paragraph-font-family)" }}>
                <strong>{label}</strong>
                <br />
                <span style={{ fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>{property}</span>
              </td>
              {SIZES.map(s => (
                <td key={s.name} style={{ ...cellStyle, textAlign: "center", color: "var(--semantic-color-action-background)" }}>
                  {`a1-m${suffix}-${s.name}`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/* ── Live demo ────────────────────────────────────────────────────────────── */

export const Demo = {
  name: "Live demo",
  argTypes: {
    property: {
      control: "inline-radio",
      options: ["padding", "margin"],
    },
    dimension: {
      control: "select",
      options: DIMENSIONS.map(d => d.suffix || "all"),
    },
    size: {
      control: "select",
      options: SIZES.map(s => s.name),
    },
  },
  args: {
    property: "padding",
    dimension: "all",
    size: "md",
  },
  render: ({ property, dimension, size }) => {
    const prop = property === "padding" ? "p" : "m";
    const dim = dimension === "all" ? "" : dimension;
    const cls = `a1-${prop}${dim}-${size}`;
    const token = `--base-spacing-${size}`;

    return (
      <div style={{ padding: "var(--base-spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--base-spacing-xl)" }}>
        <div>
          <p style={{ margin: "0 0 var(--base-spacing-xs)", fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-lg)", color: "var(--semantic-color-action-background)", fontWeight: 600 }}>
            .{cls}
          </p>
          <p style={{ margin: 0, fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" }}>
            Token: <code style={{ fontFamily: "monospace" }}>{token}</code>
          </p>
        </div>

        <div style={{ display: "flex", gap: "var(--base-spacing-xl)", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Padding demo */}
          {property === "padding" && (
            <div style={{ position: "relative" }}>
              <div
                className={cls}
                style={{
                  background: "var(--semantic-color-action-surface)",
                  border: "1px dashed var(--semantic-color-action-border)",
                  borderRadius: "var(--base-radius-lg)",
                  display: "inline-block",
                }}
              >
                <div style={{
                  background: "var(--semantic-color-surface-page)",
                  border: "1px solid var(--semantic-color-border-subtle)",
                  borderRadius: "var(--base-radius-control)",
                  padding: "var(--base-spacing-sm) var(--base-spacing-md)",
                  fontFamily: "var(--component-paragraph-font-family)",
                  fontSize: "var(--semantic-font-size-body-sm)",
                  color: "var(--semantic-color-text-muted)",
                  whiteSpace: "nowrap",
                }}>
                  Content
                </div>
              </div>
              <p style={{ margin: "var(--base-spacing-xs) 0 0", fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>
                Shaded area = applied padding
              </p>
            </div>
          )}

          {/* Margin demo */}
          {property === "margin" && (
            <div style={{ background: "var(--semantic-color-surface-raised)", borderRadius: "var(--base-radius-lg)", padding: "var(--base-spacing-xs)" }}>
              <div
                className={cls}
                style={{
                  background: "var(--semantic-color-surface-page)",
                  border: "1px solid var(--semantic-color-border-subtle)",
                  borderRadius: "var(--base-radius-control)",
                  padding: "var(--base-spacing-sm) var(--base-spacing-md)",
                  fontFamily: "var(--component-paragraph-font-family)",
                  fontSize: "var(--semantic-font-size-body-sm)",
                  color: "var(--semantic-color-text-muted)",
                  display: "inline-block",
                }}
              >
                Content
              </div>
              <p style={{ margin: "var(--base-spacing-xs) 0 0", fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)" }}>
                Shaded surround = applied margin
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
};
