const meta = {
  title: "How to Use",
  parameters: { layout: "padded", controls: { disable: true } },
};

export default meta;

// ─── Shared styles ────────────────────────────────────────────────────────────

const s = {
  page: { maxWidth: 760, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui, sans-serif" },
  h1: { fontSize: 32, fontWeight: 700, margin: "0 0 8px" },
  lead: { color: "#6b7280", margin: "0 0 56px", fontSize: 15, lineHeight: 1.6 },
  h2: { fontSize: 20, fontWeight: 700, margin: "0 0 12px", paddingTop: 40, borderTop: "1px solid #e5e7eb" },
  h3: { fontSize: 15, fontWeight: 600, margin: "20px 0 8px", color: "#111827" },
  p: { fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 12px" },
  pre: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    padding: "14px 16px",
    fontSize: 13,
    fontFamily: "ui-monospace, monospace",
    overflowX: "auto",
    margin: "0 0 16px",
    lineHeight: 1.6,
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13, margin: "0 0 20px" },
  th: { textAlign: "left", padding: "8px 12px", background: "#f3f4f6", fontWeight: 600, borderBottom: "1px solid #e5e7eb" },
  td: { padding: "8px 12px", borderBottom: "1px solid #f3f4f6", verticalAlign: "top", lineHeight: 1.5 },
  tag: {
    display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11,
    fontWeight: 600, background: "#ede9fe", color: "#5b21b6", marginRight: 4,
  },
  note: {
    background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6,
    padding: "12px 16px", fontSize: 13, color: "#1e40af", margin: "0 0 16px", lineHeight: 1.6,
  },
};

// ─── Key files table data ─────────────────────────────────────────────────────

const keyFiles = [
  { path: "packages/react/src/index.js", desc: "Main export — import all components from here" },
  { path: "packages/react/src/components/", desc: "Individual component source files (JSX + CSS)" },
  { path: "system/tokens/", desc: "Source token JSON files — base, semantic, component layers" },
  { path: "build/css/tokens.css", desc: "Generated CSS custom properties (output of Style Dictionary)" },
  { path: "build/json/tokens.json", desc: "Generated flat token JSON for tooling" },
  { path: "packages/react/src/color-scheme.css", desc: "Light and dark color scheme overrides" },
  { path: ".storybook/", desc: "Storybook configuration (main.js, preview.js)" },
  { path: "examples/portfolio/", desc: "Portfolio site built entirely with A1 components" },
  { path: "CLAUDE.md", desc: "AI usage guidance — system prompt, component inventory, rules" },
];

const tokenLayers = [
  { layer: "Base", example: "--base-color-neutral-500, --base-spacing-16", desc: "Raw values. Never reference directly in components." },
  { layer: "Semantic", example: "--semantic-color-text-default, --semantic-spacing-component-gap", desc: "Meaningful aliases. Use in component CSS." },
  { layer: "Component", example: "--a1-button-padding-block, --a1-field-border-color", desc: "Per-component overrides. Defined in system/tokens/component/." },
];

const commands = [
  { cmd: "npm run storybook", desc: "Start Storybook dev server at localhost:6006" },
  { cmd: "npm run build-tokens", desc: "Regenerate CSS and JSON from source token JSON files" },
  { cmd: "npm run build", desc: "Build the React package (Vite)" },
  { cmd: "npm run dev:portfolio", desc: "Start the portfolio example app" },
  { cmd: "node scripts/screenshot-a1-retake.mjs", desc: "Re-capture Storybook screenshots (requires Storybook running)" },
];

// ─── Page component ───────────────────────────────────────────────────────────

function HowToUsePage() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>How to Use A1 Design System</h1>
      <p style={s.lead}>
        A1 is a React component library built on a layered token system. Components are designed to be
        used directly from <code>packages/react/src/index.js</code>. Tokens drive all visual decisions.
        AI assistance is a first-class part of the workflow.
      </p>

      {/* ── Installation ────────────────────────────────────────────────── */}
      <h2 style={s.h2}>Installation</h2>
      <p style={s.p}>
        The package is not yet published to npm. Import directly from the local source using the
        index file.
      </p>
      <pre style={s.pre}>{`// From within the monorepo:
import { Button, Heading, Section } from "../../packages/react/src/index.js";

// Or via the build output once published:
import { Button, Heading, Section } from "@a1ds/react";`}</pre>
      <p style={s.p}>
        CSS tokens must be loaded globally. Include the generated token file and color scheme overrides
        in your app entry point or HTML.
      </p>
      <pre style={s.pre}>{`import "../../build/css/tokens.css";
import "../../packages/react/src/color-scheme.css";`}</pre>

      {/* ── Token Layers ────────────────────────────────────────────────── */}
      <h2 style={s.h2}>Token Layers</h2>
      <p style={s.p}>
        A1 uses a three-layer token system. Always consume semantic tokens in component CSS.
        Never reference base tokens directly.
      </p>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Layer</th>
            <th style={s.th}>Example</th>
            <th style={s.th}>Purpose</th>
          </tr>
        </thead>
        <tbody>
          {tokenLayers.map((row) => (
            <tr key={row.layer}>
              <td style={{ ...s.td, fontWeight: 600 }}>{row.layer}</td>
              <td style={{ ...s.td, fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#6b7280" }}>{row.example}</td>
              <td style={s.td}>{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Key Files ───────────────────────────────────────────────────── */}
      <h2 style={s.h2}>Key Files</h2>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Path</th>
            <th style={s.th}>Purpose</th>
          </tr>
        </thead>
        <tbody>
          {keyFiles.map((row) => (
            <tr key={row.path}>
              <td style={{ ...s.td, fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>{row.path}</td>
              <td style={s.td}>{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Theming ─────────────────────────────────────────────────────── */}
      <h2 style={s.h2}>Theming</h2>
      <p style={s.p}>
        Apply a theme by adding a <code>data-theme</code> attribute to the root element.
        Light and dark color schemes are handled automatically via <code>prefers-color-scheme</code>
        and can be overridden with <code>data-color-scheme</code>.
      </p>
      <pre style={s.pre}>{`<html data-theme="default" data-color-scheme="dark">
  <!-- ... -->
</html>`}</pre>
      <p style={s.p}>
        New themes are defined by overriding semantic token values in <code>color-scheme.css</code>.
        Component tokens cascade from semantic tokens, so theme changes propagate automatically.
      </p>

      {/* ── AI Workflow ──────────────────────────────────────────────────── */}
      <h2 style={s.h2}>Using A1 with AI</h2>
      <p style={s.p}>
        A1 is designed to be used with AI tools. The system has explicit rules that AI can follow,
        apply, and be evaluated against. Start every AI session by loading the system context.
      </p>

      <h3 style={s.h3}>System Prompt Template</h3>
      <pre style={s.pre}>{`You are working within the A1 Design System. Follow these rules exactly:

1. Use only components exported from packages/react/src/index.js
2. Do not invent new components, patterns, or CSS classes
3. Use semantic tokens (--semantic-*) for all color and spacing references
4. Build a priority guide before any layout — establish content importance first
5. Ensure every interactive element has focus states, ARIA labels, and keyboard support
6. Use Section > Stack/Grid > components as the standard page composition model
7. Reference CLAUDE.md for the full component inventory and usage rules

Before generating any layout, state the content priority order: what is most important,
what supports it, what is secondary, and what should be deferred or removed.`}</pre>

      <h3 style={s.h3}>Priority Guide First</h3>
      <p style={s.p}>
        Before any layout work, define content priority. This prevents AI from defaulting to
        visually balanced layouts that bury the primary action.
      </p>
      <pre style={s.pre}>{`Priority guide for: [page name]

1. PRIMARY: [most important user goal or action]
2. REQUIRED BEFORE ACTION: [information the user needs first]
3. SUPPORTING: [secondary context]
4. TERTIARY: [low-priority items — consider deferring or removing]`}</pre>

      <h3 style={s.h3}>Evaluation Checklist</h3>
      <p style={s.p}>Use this checklist to evaluate any AI-generated output before accepting it.</p>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 2 }}>
        {[
          "Hierarchy — Is the primary action visually dominant? Is content ordered by importance?",
          "Components — Are only A1 components used? No custom CSS, invented patterns, or workarounds?",
          "Tokens — Are semantic tokens used for all color and spacing? No hardcoded values?",
          "Accessibility — Do all inputs have labels? Are focus states visible? Are icons described?",
          "Responsive — Does layout work at xs, sm, md, and lg breakpoints?",
          "Interaction states — Are hover, active, disabled, focus, and loading states handled?",
          "Semantic HTML — Are headings in the correct order? Is ARIA used correctly?",
          "Scalability — Does this work with real content length? What breaks at 2× content?",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ color: "#9ca3af", fontSize: 16, flexShrink: 0, marginTop: 1 }}>☐</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* ── Dev Commands ────────────────────────────────────────────────── */}
      <h2 style={s.h2}>Dev Commands</h2>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Command</th>
            <th style={s.th}>What it does</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((row) => (
            <tr key={row.cmd}>
              <td style={{ ...s.td, fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>{row.cmd}</td>
              <td style={s.td}>{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Contributing ────────────────────────────────────────────────── */}
      <h2 style={s.h2}>Contributing a Component</h2>
      <p style={s.p}>Each new component follows this structure:</p>
      <pre style={s.pre}>{`packages/react/src/components/my-component/
  MyComponent.jsx      ← component logic + props
  my-component.css     ← component styles using semantic tokens
  MyComponent.stories.jsx  ← Storybook stories`}</pre>
      <p style={s.p}>After creating the files:</p>
      <ol style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, paddingLeft: 20, margin: "0 0 12px" }}>
        <li>Export the component from <code>packages/react/src/index.js</code></li>
        <li>Add component tokens to <code>system/tokens/component/my-component.json</code> if needed</li>
        <li>Run <code>npm run build-tokens</code> to regenerate CSS</li>
        <li>Write at least one Storybook story that shows all major variants</li>
        <li>Add an entry to the Changelog</li>
      </ol>

      <div style={s.note}>
        <strong>AI tip:</strong> When asking AI to build a new component, provide the component name,
        props interface, and variant list upfront. Reference an existing similar component as a
        structural model. Always verify the output uses semantic tokens and follows A1 naming conventions.
      </div>
    </div>
  );
}

export const Guide = {
  name: "Guide",
  render: () => <HowToUsePage />,
};
