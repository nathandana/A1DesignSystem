// ─── JSON token source imports ────────────────────────────────────────────────
import breakpoint       from "../../../../system/tokens/breakpoint.json";
import motion          from "../../../../system/tokens/motion.json";
import colorRamp        from "../../../../system/tokens/color-ramp.json";
import componentNotification from "../../../../system/tokens/component/notification.json";
import componentButton  from "../../../../system/tokens/component/button.json";
import componentCard    from "../../../../system/tokens/component/card.json";
import componentCheckboxGroup from "../../../../system/tokens/component/checkbox-group.json";
import componentDialog  from "../../../../system/tokens/component/dialog.json";
import componentDivider from "../../../../system/tokens/component/divider.json";
import componentField   from "../../../../system/tokens/component/field.json";
import componentIconBtn from "../../../../system/tokens/component/icon-button.json";
import componentInline  from "../../../../system/tokens/component/inline.json";
import componentLink    from "../../../../system/tokens/component/link.json";
import componentMenu    from "../../../../system/tokens/component/menu.json";
import componentMsg     from "../../../../system/tokens/component/message.json";
import componentPag     from "../../../../system/tokens/component/pagination.json";
import componentRadioGroup from "../../../../system/tokens/component/radio-group.json";
import componentSeg     from "../../../../system/tokens/component/segmented.json";
import componentTab     from "../../../../system/tokens/component/tab.json";
import componentPageLayout from "../../../../system/tokens/component/page-layout.json";
import componentSwitch  from "../../../../system/tokens/component/switch.json";
import shadow           from "../../../../system/tokens/shadow.json";
import spacing          from "../../../../system/tokens/spacing.json";
import typography       from "../../../../system/tokens/typography.json";

// ─── Token path → CSS var name ────────────────────────────────────────────────

function camelToKebab(s) {
  return s.replace(/([A-Z])/g, (c) => "-" + c.toLowerCase());
}

function pathToCssVar(path) {
  return "--" + path.split(".").map(camelToKebab).join("-");
}

// ─── Build reference map ──────────────────────────────────────────────────────

function flattenRefs(obj, path = "") {
  const refs = {};
  if (obj && typeof obj === "object") {
    if ("$value" in obj) {
      const val = obj.$value;
      if (typeof val === "string" && val.startsWith("{") && val.endsWith("}")) {
        refs[pathToCssVar(path)] = pathToCssVar(val.slice(1, -1));
      }
    } else {
      for (const [key, value] of Object.entries(obj)) {
        Object.assign(refs, flattenRefs(value, path ? `${path}.${key}` : key));
      }
    }
  }
  return refs;
}

const SOURCE_FILES = [
  breakpoint, motion, colorRamp, componentNotification, componentButton, componentCard, componentDialog,
  componentCheckboxGroup, componentDivider, componentField, componentIconBtn, componentInline,
  componentLink, componentMenu, componentMsg, componentPag, componentRadioGroup, componentSeg,
  componentTab, componentPageLayout, componentSwitch, shadow, spacing, typography,
];

export const TOKEN_REFS = SOURCE_FILES.reduce(
  (acc, file) => Object.assign(acc, flattenRefs(file)),
  {}
);

// ─── Read all live token values (theme-aware) ─────────────────────────────────

export function getAllTokens() {
  const names = new Set();
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === ":root") {
          const style = rule.style;
          for (let i = 0; i < style.length; i++) {
            const prop = style[i];
            if (prop.startsWith("--")) names.add(prop);
          }
        }
      }
    } catch (_) {}
  }
  const computed = getComputedStyle(document.documentElement);
  const vars = {};
  for (const name of names) {
    vars[name] = computed.getPropertyValue(name).trim();
  }
  return vars;
}

const EXCLUDE = ["--base-space-", "--base-font-", "--base-shadow-", "--brand-", "--theme-"];

export function shouldInclude(key) {
  return !EXCLUDE.some((prefix) => key.startsWith(prefix));
}

// ─── Value display ────────────────────────────────────────────────────────────

function isColor(value) {
  return /^#[0-9a-fA-F]{3,8}$/.test(value) || value.startsWith("rgb") || value.startsWith("hsl");
}

function isShadow(value) {
  return value.includes("rgba") && value.includes("px");
}

function ResolvedValue({ value }) {
  if (isColor(value)) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <span style={{
          display: "inline-block", width: "12px", height: "12px",
          borderRadius: "3px", background: value,
          border: "1px solid rgba(0,0,0,0.12)", flexShrink: 0,
        }} />
        <span style={{ color: "var(--semantic-color-text-muted)" }}>{value}</span>
      </span>
    );
  }
  if (isShadow(value)) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
        <span style={{
          display: "inline-block", width: "18px", height: "12px", borderRadius: "3px",
          background: "var(--semantic-color-surface-page)", boxShadow: value,
          border: "1px solid rgba(0,0,0,0.06)", flexShrink: 0,
        }} />
        <span style={{ color: "var(--semantic-color-text-muted)", maxWidth: "340px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value}
        </span>
      </span>
    );
  }
  return <span style={{ color: "var(--semantic-color-text-muted)" }}>{value}</span>;
}

function ValueCell({ tokenName, value }) {
  const refVar = TOKEN_REFS[tokenName];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      {refVar ? (
        <>
          <span style={{
            fontFamily: "monospace", fontSize: "0.7rem",
            background: "var(--semantic-color-surface-raised)",
            color: "var(--semantic-color-text-default)",
            border: "1px solid var(--semantic-color-border-default)",
            borderRadius: "4px", padding: "1px 6px", whiteSpace: "nowrap",
          }}>
            {refVar}
          </span>
          <span style={{ color: "var(--semantic-color-border-strong)", fontSize: "0.7rem" }}>→</span>
          <ResolvedValue value={value} />
        </>
      ) : (
        <ResolvedValue value={value} />
      )}
    </span>
  );
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
  section:  { marginBottom: "40px" },
  h2: {
    margin: "0 0 4px", fontSize: "0.75rem", fontWeight: 700,
    color: "var(--semantic-color-text-muted)",
  },
  divider: { margin: "8px 0 0", border: "none", borderTop: "1px solid var(--semantic-color-border-subtle)" },
  table:   { width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" },
  th: {
    padding: "8px 12px", textAlign: "left", fontWeight: 600, fontSize: "0.75rem",
    color: "var(--semantic-color-text-muted)",
    borderBottom: "1px solid var(--semantic-color-border-subtle)",
    background: "var(--semantic-color-surface-panel)",
  },
  td:   { padding: "7px 12px", borderBottom: "1px solid var(--semantic-color-border-subtle)", verticalAlign: "middle" },
  name: { fontFamily: "monospace", fontSize: "0.75rem", color: "var(--semantic-color-text-default)" },
};

function TokenTable({ tokens, allVars }) {
  return (
    <table style={S.table}>
      <thead>
        <tr>
          <th style={{ ...S.th, width: "40%" }}>Token</th>
          <th style={S.th}>Value</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((key, i) => (
          <tr key={key} style={{ background: i % 2 === 0 ? "transparent" : "var(--semantic-color-surface-panel)" }}>
            <td style={{ ...S.td, ...S.name }}>{key}</td>
            <td style={S.td}>
              <ValueCell tokenName={key} value={allVars[key]} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Factory ──────────────────────────────────────────────────────────────────
// Creates a Storybook story object that renders a filtered token table.

export function tokenPage(title, description, ...matchFns) {
  const match = (k) => matchFns.some((fn) => fn(k));
  return {
    name: title,
    render: () => {
      const allVars = getAllTokens();
      const tokens = Object.keys(allVars).filter(shouldInclude).filter(match).sort();
      return (
        <div style={S.page}>
          <h1 style={S.h1}>{title}</h1>
          {description && <p style={S.lead}>{description}</p>}
          <TokenTable tokens={tokens} allVars={allVars} />
        </div>
      );
    },
  };
}
