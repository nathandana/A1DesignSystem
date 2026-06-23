/* Width utilities — `a1-max-w-*` / `a1-min-w-*` (see width.css). */

const MAX_SIZES = [
  { cls: "a1-max-w-xs",   token: "--base-content-width-xs",  value: "28.5rem" },
  { cls: "a1-max-w-sm",   token: "--base-content-width-sm",  value: "40rem" },
  { cls: "a1-max-w-md",   token: "--base-content-width-md",  value: "50rem" },
  { cls: "a1-max-w-lg",   token: "--base-content-width-lg",  value: "60rem" },
  { cls: "a1-max-w-xl",   token: "--base-content-width-xl",  value: "70rem" },
  { cls: "a1-max-w-2xl",  token: "--base-content-width-2xl", value: "90rem" },
  { cls: "a1-max-w-full", token: "—",                        value: "100%" },
];

const MIN_SIZES = [
  { cls: "a1-min-w-0",  token: "—",                       value: "0" },
  { cls: "a1-min-w-xs", token: "--base-content-width-xs", value: "28.5rem" },
  { cls: "a1-min-w-sm", token: "--base-content-width-sm", value: "40rem" },
  { cls: "a1-min-w-md", token: "--base-content-width-md", value: "50rem" },
];

const wrap = { padding: "var(--base-spacing-40)" };
const code = { fontFamily: "monospace", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-default)" };
const muted = { fontFamily: "var(--component-paragraph-font-family)", fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-muted)" };
const titleStyle = { margin: "0 0 var(--base-spacing-8)", fontFamily: "var(--component-heading-font-family-heading)", fontSize: "var(--semantic-font-size-heading-sm)", fontWeight: "var(--component-heading-font-weight-heading)", color: "var(--semantic-color-text-default)" };

const bar = {
  blockSize: "var(--base-spacing-24)",
  background: "var(--semantic-color-action-background)",
  borderRadius: "var(--base-radius-sm)",
};

const meta = {
  title: "Utilities/Width",
  parameters: { layout: "fullscreen", controls: { disable: true } },
};
export default meta;

export const MaxWidth = {
  name: "Max width",
  render: () => (
    <div style={wrap}>
      <p style={titleStyle}>Max width — <code style={{ fontFamily: "monospace" }}>a1-max-w-*</code></p>
      <p style={{ ...muted, margin: "0 0 var(--base-spacing-24)" }}>
        Caps an element's inline size. The shared content-width scale (= Section <code style={{ fontFamily: "monospace" }}>contentWidth</code>),
        driven by <code style={{ fontFamily: "monospace" }}>--base-content-width-*</code> tokens, plus <code style={{ fontFamily: "monospace" }}>full</code> and <code style={{ fontFamily: "monospace" }}>none</code>.
        Each bar fills its container but is capped by the class.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
        {MAX_SIZES.map(({ cls, token, value }) => (
          <div key={cls} style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>
            <span style={muted}>
              <code style={code}>.{cls}</code> · {value}{token !== "—" ? ` · ${token}` : ""}
            </span>
            <div className={cls} style={bar} />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const MinWidth = {
  name: "Min width",
  render: () => (
    <div style={wrap}>
      <p style={titleStyle}>Min width — <code style={{ fontFamily: "monospace" }}>a1-min-w-*</code></p>
      <p style={{ ...muted, margin: "0 0 var(--base-spacing-24)" }}>
        Stops an element shrinking below a width. Same scale plus <code style={{ fontFamily: "monospace" }}>0</code> and <code style={{ fontFamily: "monospace" }}>full</code>.
        Each bar holds at least its minimum even though its flex container would otherwise shrink it.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)" }}>
        {MIN_SIZES.map(({ cls, token, value }) => (
          <div key={cls} style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-4)" }}>
            <span style={muted}>
              <code style={code}>.{cls}</code> · {value}{token !== "—" ? ` · ${token}` : ""}
            </span>
            <div style={{ display: "flex", maxInlineSize: "var(--base-content-width-sm)" }}>
              <div className={cls} style={bar} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
