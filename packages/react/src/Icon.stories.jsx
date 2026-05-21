import { useState } from "react";
import { Icon } from "./Icon.jsx";

const ICONS = [
  // Navigation
  "home", "menu", "close", "arrow_back", "arrow_forward", "arrow_upward", "arrow_downward",
  "chevron_right", "chevron_left", "expand_more", "expand_less", "more_horiz", "more_vert",
  "first_page", "last_page", "navigate_next", "navigate_before", "unfold_more", "subdirectory_arrow_right",
  // Actions
  "add", "remove", "delete", "edit", "save", "copy", "content_cut", "content_paste",
  "undo", "redo", "search", "filter_list", "sort", "refresh", "sync",
  "download", "upload", "share", "open_in_new", "link", "launch",
  "settings", "tune", "build", "construction", "drag_indicator",
  // Communication
  "mail", "chat", "comment", "forum", "send", "reply", "forward",
  "call", "video_call", "notifications", "notification_add", "alarm",
  "schedule", "calendar_today", "event", "today",
  // Content
  "article", "description", "note", "notes", "subject", "list",
  "view_list", "grid_view", "dashboard", "feed",
  "photo", "image", "camera", "play_circle", "pause_circle",
  "movie", "music_note", "headphones", "volume_up", "volume_off",
  // Status & Feedback
  "check", "check_circle", "cancel", "error", "warning", "info", "help",
  "flag", "report", "block", "verified", "new_releases",
  "star", "star_border", "favorite", "favorite_border", "bookmark", "bookmark_border",
  "thumb_up", "thumb_down", "mood", "sentiment_satisfied", "sentiment_dissatisfied",
  // People & Security
  "person", "group", "groups", "account_circle", "manage_accounts", "badge",
  "lock", "lock_open", "security", "shield", "key", "fingerprint",
  "visibility", "visibility_off", "admin_panel_settings",
  // Data & Charts
  "bar_chart", "trending_up", "trending_down", "analytics", "insights",
  "data_usage", "pie_chart", "show_chart", "leaderboard",
  // Objects & Misc
  "bolt", "star_rate", "rocket_launch", "local_fire_department", "celebration",
  "emoji_events", "workspace_premium", "label", "tag", "sell",
  "receipt", "paid", "savings", "shopping_cart", "storefront",
  "palette", "brush", "auto_fix_high", "auto_awesome", "magic_button",
  "cloud", "cloud_upload", "cloud_download", "storage", "memory",
  "computer", "phone_iphone", "tablet", "monitor", "keyboard",
  "dark_mode", "light_mode", "wb_sunny", "nights_stay", "language",
  "public", "location_on", "map", "navigation", "explore",
];

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

const meta = {
  title: "Components/Icon",
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
      control: "select",
      options: ICONS,
      description: "Material Symbols icon name"
    },
    ...variantControls
  }
};

export default meta;

export const Configurable = {};

export const Explorer = {
  parameters: { controls: { include: ["weight", "grade", "opticalSize", "fill"] } },
  render: ({ weight, grade, opticalSize, fill }) => {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState("star");
    const filtered = query
      ? ICONS.filter(n => n.includes(query.toLowerCase().replace(/\s+/g, "_")))
      : ICONS;

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
