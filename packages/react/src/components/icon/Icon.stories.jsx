import { useEffect, useState } from "react";
import { Icon } from "./Icon.jsx";
import { clearCustomIconFont, registerCustomIconFont } from "./customIconRegistry.js";
import { ICON_OPTIONS, requiredIconArgType } from "../../storybook/icon-controls.js";

const variantControls = {
  weight: {
    control: { type: "range", min: 100, max: 700, step: 100 },
    description: "Stroke weight (100–700)"
  },
  grade: {
    control: { type: "range", min: -50, max: 200, step: 25 },
    description: "Grade — fine-tunes weight without affecting space (-50–200)"
  },
  opticalSize: {
    control: { type: "select" },
    options: [20, 24, 40, 48],
    description: "Optical size — should match rendered px size for sharpest rendering"
  },
  fill: {
    control: "select",
    options: [null, 0, 1],
    labels: { null: "Theme default", 0: "Outlined (0)", 1: "Filled (1)" },
    description: "Fill — null lets the active theme decide (a1Light=outlined, a1Accessible=filled)"
  }
};

const ENGINE_STORY_FONT = "data:font/ttf;base64,T1RUTwAJAIAAAwAQQ0ZGILt35egAAATIAAABJk9TLzJJRFWJAAABAAAAAGBjbWFwwBIgOwAABHQAAAA0aGVhZC/DAIMAAACcAAAANmhoZWEDVANVAAAA1AAAACRobXR4B9AAAAAABfAAAAAIbWF4cAACUAAAAAD4AAAABm5hbWVT3ULkAAABYAAAAxJwb3N0AAMAAAAABKgAAAAgAAEAAAABAAA/q+zTXw889QADA+gAAAAA5mLedAAAAADmYt50ACkAEAO+AqsAAAADAAIAAAAAAAAAAQAAA1L/agAAA+gAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAIAAFAAAAIAAAADA+gB9AAFAAACigK7AAAAjAKKArsAAAHfADEBAgAAAAAAAAAAAAAAAAAAAAEQAAAAAAAAAAAAAABYWFhYAEDgAeABA1L/agAAAqsAEAAAAAEAAAAAAakCqwAAAAAAAAAAACIBngABAAAAAAAAAAEAAgABAAAAAAABABUAAAABAAAAAAACAAcAPwABAAAAAAADAB8BFwABAAAAAAAEAB0AVAABAAAAAAAFAAsA9gABAAAAAAAGABkAqwABAAAAAAAHAAEAAgABAAAAAAAIAAEAAgABAAAAAAAJAAEAAgABAAAAAAAKAAEAAgABAAAAAAALAAEAAgABAAAAAAAMAAEAAgABAAAAAAANAAEAAgABAAAAAAAOAAEAAgABAAAAAAAQABUAAAABAAAAAAARAAcAPwADAAEECQAAAAIAGQADAAEECQABACoAFQADAAEECQACAA4ARgADAAEECQADAD4BNgADAAEECQAEADoAcQADAAEECQAFABYBAQADAAEECQAGADIAxAADAAEECQAHAAIAGQADAAEECQAIAAIAGQADAAEECQAJAAIAGQADAAEECQAKAAIAGQADAAEECQALAAIAGQADAAEECQAMAAIAGQADAAEECQANAAIAGQADAAEECQAOAAIAGQADAAEECQAQACoAFQADAAEECQARAA4ARkExIEN1c3RvbSBJY29ucyBTdG9yeQBBADEAIABDAHUAcwB0AG8AbQAgAEkAYwBvAG4AcwAgAFMAdABvAHIAeVJlZ3VsYXIAUgBlAGcAdQBsAGEAckExIEN1c3RvbSBJY29ucyBTdG9yeSBSZWd1bGFyAEEAMQAgAEMAdQBzAHQAbwBtACAASQBjAG8AbgBzACAAUwB0AG8AcgB5ACAAUgBlAGcAdQBsAGEAckExQ3VzdG9tSWNvbnNTdG9yeVJlZ3VsYXIAQQAxAEMAdQBzAHQAbwBtAEkAYwBvAG4AcwBTAHQAbwByAHkAUgBlAGcAdQBsAGEAclZlcnNpb24gMC4xAFYAZQByAHMAaQBvAG4AIAAwAC4AMSA6QTEgQ3VzdG9tIEljb25zIFN0b3J5IFJlZ3VsYXIAIAA6AEEAMQAgAEMAdQBzAHQAbwBtACAASQBjAG8AbgBzACAAUwB0AG8AcgB5ACAAUgBlAGcAdQBsAGEAcgAAAAAAAQADAAEAAAAMAAQAKAAAAAYABAABAAIAAOAB//8AAAAA4AH//wAAIAAAAQAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAEAQABAQEaQTFDdXN0b21JY29uc1N0b3J5UmVndWxhcgABAQEn+BsA+BwC+B0D+B4Ei5v55vp8BR0AAACiDx0AAAClEYsdAAABJhIABQEBDCk+RUtWZXJzaW9uIDAuMUExIEN1c3RvbSBJY29ucyBTdG9yeSBSZWd1bGFyQTEgQ3VzdG9tIEljb25zIFN0b3J5UmVndWxhcmVuZ2luZQAAAAGLAAIBAQR8+nwO+nz3uPk/FYs4BfcRiwWLOAX7EYsFNzcFi/sRBTiLBYv3EQU4iwWL++EF3osFi/cRBd6LBYv7EQX3EYsF3zgF9+GLBYv3OgXeiwWL+xEF9xGLBYv4NQX7EYsFi/sRBTiLBYv3OwX7josFi94F9xGLBYveBfvhiwUOAAAD6AAAA+gAAA==";

const meta = {
  title: "Foundations/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: {
    name: "star",
    weight: 400,
    grade: 0,
    opticalSize: 24,
    fill: null
  },
  argTypes: {
    name: {
      ...requiredIconArgType("A1 icon registry name")
    },
    size: {
      control: "inline-radio",
      options: [undefined, "xs", "sm", "md", "lg", "xl", "jumbo", "xJumbo"],
    },
    color: {
      control: "inline-radio",
      options: [undefined, "muted", "accent", "inverse", "success", "error", "warn", "info"],
    },
    ...variantControls
  }
};

export default meta;

export const Configurable = {};

export const CustomFont = {
  name: "Custom font",
  args: { name: "custom:engine", size: "xl" },
  render: (args) => {
    useEffect(() => {
      registerCustomIconFont({
        fontUrl: ENGINE_STORY_FONT,
        fontFamily: "A1 Custom Icons Story",
        mappings: { "custom:engine": 0xe001 },
      });
      return clearCustomIconFont;
    }, []);
    return <Icon {...args} />;
  },
};

export const Explorer = {
  parameters: { controls: { include: ["weight", "grade", "opticalSize", "fill"] } },
  render: ({ weight, grade, opticalSize, fill }) => {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState("star");
    const filtered = query
      ? ICON_OPTIONS.filter(n => n.includes(query.toLowerCase().replace(/\s+/g, "_")))
      : ICON_OPTIONS;

    return (
      <div style={{ width: 680 }}>
        {/* Search bar + preview */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px"
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <span
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "18px",
                color: "var(--semantic-color-text-muted)",
                pointerEvents: "none"
              }}
            >
              <Icon name="search" opticalSize={20} />
            </span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search icons…"
              style={{
                width: "100%",
                boxSizing: "border-box",
                height: "36px",
                padding: "0 12px 0 36px",
                border: "1px solid var(--semantic-color-border-default)",
                borderRadius: "var(--base-radius-control)",
                fontFamily: "var(--component-paragraph-font-family)",
                fontSize: "var(--semantic-font-size-body-sm)",
                color: "var(--semantic-color-text-default)",
                background: "var(--semantic-color-surface-page)",
                outline: "none"
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              border: "1px solid var(--semantic-color-border-subtle)",
              borderRadius: "var(--base-radius-control)",
              background: "var(--semantic-color-surface-panel)",
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: "28px", color: "var(--semantic-color-action-background)" }}>
              <Icon name={active} weight={weight} grade={grade} opticalSize={opticalSize} fill={fill} />
            </span>
            <span
              style={{
                fontSize: "var(--semantic-font-size-body-xs)",
                color: "var(--semantic-color-text-muted)",
                fontFamily: "monospace"
              }}
            >
              {active}
            </span>
          </div>
        </div>

        {/* Results count */}
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "var(--semantic-font-size-body-xs)",
            color: "var(--semantic-color-text-muted)"
          }}
        >
          {filtered.length} icon{filtered.length !== 1 ? "s" : ""}
          {query ? ` matching "${query}"` : ""}
        </p>

        {/* Icon grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
            gap: "4px",
            maxHeight: "480px",
            overflowY: "auto"
          }}
        >
          {filtered.map(name => (
            <button
              key={name}
              type="button"
              onClick={() => setActive(name)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                padding: "10px 6px",
                border: "1px solid",
                borderColor: name === active
                  ? "var(--semantic-color-action-background)"
                  : "transparent",
                borderRadius: "var(--base-radius-control)",
                background: name === active
                  ? "var(--semantic-color-action-surface)"
                  : "transparent",
                cursor: "pointer",
                color: "var(--semantic-color-text-default)"
              }}
            >
              <span style={{ fontSize: "24px" }}>
                <Icon name={name} weight={weight} grade={grade} opticalSize={opticalSize} fill={fill} />
              </span>
              <span
                style={{
                  fontSize: "9px",
                  color: "var(--semantic-color-text-muted)",
                  textAlign: "center",
                  wordBreak: "break-all",
                  lineHeight: 1.3,
                  fontFamily: "monospace"
                }}
              >
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }
};

export const FontVariations = {
  name: "Font Variations",
  parameters: { controls: { include: [] } },
  render: () => {
    const icon = "star";
    const row = (label, icons) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
        <span style={{ fontSize: "var(--semantic-font-size-body-xs)", color: "var(--semantic-color-text-muted)", fontFamily: "var(--component-paragraph-font-family)" }}>
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {icons.map(({ label: l, ...props }) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: "52px" }}>
              <span style={{ fontSize: "32px" }}>
                <Icon name={icon} {...props} />
              </span>
              <span style={{ fontSize: "10px", color: "var(--semantic-color-text-muted)", fontFamily: "monospace" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div style={{ padding: "8px 0" }}>
        {row("Weight (wght)", [100, 200, 300, 400, 500, 600, 700].map(w => ({ label: String(w), weight: w, opticalSize: 32 })))}
        {row("Grade (GRAD)", [-50, -25, 0, 50, 100, 150, 200].map(g => ({ label: String(g), grade: g, opticalSize: 32 })))}
        {row("Fill (FILL)", [
          { label: "0 (outlined)", fill: 0, opticalSize: 32 },
          { label: "1 (filled)",   fill: 1, opticalSize: 32 }
        ])}
        {row("Optical Size (opsz)", [20, 24, 40, 48].map(o => ({ label: `${o}px`, opticalSize: o })))}
      </div>
    );
  }
};

export const SizeInheritance = {
  name: "Size — inherits from parent",
  parameters: { controls: { include: ["weight", "grade", "fill"] } },
  render: ({ weight, grade, fill }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      {[16, 20, 24, 32, 40, 48].map(size => (
        <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: size }}>
            <Icon name="star" weight={weight} grade={grade} opticalSize={size} fill={fill} />
          </span>
          <span style={{ fontSize: "11px", color: "var(--semantic-color-text-muted)" }}>{size}px</span>
        </div>
      ))}
    </div>
  )
};

export const Sizes = {
  name: "Sizes (size prop)",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
      {[
        { size: "xs",    label: "xs (16px)" },
        { size: "sm",    label: "sm (20px)" },
        { size: "md",    label: "md (24px)" },
        { size: "lg",    label: "lg (32px)" },
        { size: "xl",    label: "xl (40px)" },
        { size: "jumbo", label: "jumbo (64px)" },
        { size: "xJumbo", label: "xJumbo (96px)" },
      ].map(({ size, label }) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <Icon name="star" size={size === "md" ? undefined : size} />
          <span style={{ fontSize: "11px", color: "var(--semantic-color-text-muted)", fontFamily: "monospace" }}>{label}</span>
        </div>
      ))}
    </div>
  )
};

export const Colors = {
  name: "Colors (color prop)",
  parameters: { controls: { include: [] } },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
      {[
        { color: undefined, label: "default" },
        { color: "muted",   label: "muted" },
        { color: "accent",  label: "accent" },
        { color: "success", label: "success" },
        { color: "error",   label: "error" },
        { color: "warn",    label: "warn" },
        { color: "info",    label: "info" },
      ].map(({ color, label }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <Icon name="favorite" size="xl" color={color} />
          <span style={{ fontSize: "11px", color: "var(--semantic-color-text-muted)" }}>{label}</span>
        </div>
      ))}
    </div>
  )
};

export const InverseColors = {
  name: "Colors — inverse",
  parameters: { controls: { include: [] }, backgrounds: { default: "dark" } },
  render: () => (
    <div
      data-theme="a1-light"
      style={{
        background: "var(--semantic-color-surface-inverse)",
        padding: "var(--base-spacing-24)",
        borderRadius: "var(--base-radius-lg)",
        display: "flex",
        gap: "20px",
        alignItems: "center"
      }}
    >
      <Icon name="check_circle" size="xl" color="inverse" />
      <span style={{ fontSize: "var(--semantic-font-size-body-sm)", color: "var(--semantic-color-text-inverse)", fontFamily: "var(--component-paragraph-font-family)" }}>
        Use <code>color="inverse"</code> on dark surfaces
      </span>
    </div>
  )
};

export const ColorInheritance = {
  name: "Color — inherits from parent",
  parameters: { controls: { include: ["weight", "grade", "opticalSize", "fill"] } },
  render: ({ weight, grade, opticalSize, fill }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "32px" }}>
      {[
        { color: "var(--semantic-color-text-default)",            label: "default" },
        { color: "var(--semantic-color-text-muted)",              label: "muted" },
        { color: "var(--semantic-color-action-background)",       label: "action" },
        { color: "var(--semantic-color-status-error-background)", label: "error" },
        { color: "var(--semantic-color-status-success-background)", label: "success" },
        { color: "var(--semantic-color-status-warn-background)",  label: "warn" },
      ].map(({ color, label }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ color }}>
            <Icon name="favorite" weight={weight} grade={grade} opticalSize={opticalSize} fill={fill} />
          </span>
          <span style={{ fontSize: "11px", color: "var(--semantic-color-text-muted)" }}>{label}</span>
        </div>
      ))}
    </div>
  )
};
