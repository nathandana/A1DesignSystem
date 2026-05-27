import { List, ListItem } from "./List.jsx";
import { Inverse } from "../inverse/Inverse.jsx";

const meta = {
  title: "Components/Typography/List",
  component: List,
  tags: ["autodocs"],
  args: {
    size: "md",
    color: "default",
  },
  argTypes: {
    as: {
      control: "inline-radio",
      options: ["ul", "ol"],
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    color: {
      control: "inline-radio",
      options: ["default", "muted"],
    },
    icon: {
      control: "text",
      description: "Material Symbol name — switches to icon variant when set",
    },
  },
};

export default meta;

// ─── Shared copy ─────────────────────────────────────────────────────────────

const SHORT = [
  "Design tokens ensure visual consistency.",
  "Semantic color roles adapt to light and dark mode.",
  "All components meet WCAG 2.1 AA contrast requirements.",
];

const LONG = [
  "Design tokens form the shared language between designers and engineers — every color, spacing value, radius, and motion duration is a named contract that any theme can override without touching component code.",
  "Semantic color roles like surface-page, text-default, and border-subtle automatically resolve to the correct value in light mode, dark mode, and any custom theme, so components never need to know which context they're in.",
  "All interactive components are keyboard-navigable and include visible focus indicators that meet WCAG 2.1 AA requirements across every color theme, including the high-contrast accessible theme.",
  "Motion primitives respect the prefers-reduced-motion media query by collapsing duration tokens to 0ms, so users who are sensitive to animation get instant state changes without any special component logic.",
];

// ─── Configurable ─────────────────────────────────────────────────────────────

export const Configurable = {
  render: (args) => (
    <List {...args}>
      {SHORT.map((item) => (
        <ListItem key={item}>{item}</ListItem>
      ))}
    </List>
  ),
};

// ─── Size scale ───────────────────────────────────────────────────────────────

export const SizeScale = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "600px" }}>
      {["xs", "sm", "md", "lg", "xl"].map((size) => (
        <div key={size} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <span style={{ width: "28px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)", flexShrink: 0, paddingTop: "2px" }}>
            {size}
          </span>
          <List size={size}>
            {SHORT.map((item) => <ListItem key={item}>{item}</ListItem>)}
          </List>
        </div>
      ))}
    </div>
  ),
};

// ─── Ordered ──────────────────────────────────────────────────────────────────

export const Ordered = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "600px" }}>
      {["xs", "sm", "md", "lg", "xl"].map((size) => (
        <div key={size} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <span style={{ width: "28px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)", flexShrink: 0, paddingTop: "2px" }}>
            {size}
          </span>
          <List as="ol" size={size}>
            {SHORT.map((item) => <ListItem key={item}>{item}</ListItem>)}
          </List>
        </div>
      ))}
    </div>
  ),
};

// ─── Icon variant ─────────────────────────────────────────────────────────────

export const IconVariant = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "600px" }}>
      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>check_circle — feature list</p>
        <List icon="check_circle">
          <ListItem>Unlimited design tokens with full theme support</ListItem>
          <ListItem>Dark mode out of the box, driven by semantic tokens</ListItem>
          <ListItem>Accessible components tested against WCAG 2.1 AA</ListItem>
          <ListItem>Motion primitives that respect reduced-motion preferences</ListItem>
        </List>
      </div>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Size scale with check icon</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {["xs", "sm", "md", "lg", "xl"].map((size) => (
            <div key={size} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <span style={{ width: "28px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)", flexShrink: 0, paddingTop: "2px" }}>
                {size}
              </span>
              <List icon="check" size={size}>
                <ListItem>Design tokens ensure visual consistency.</ListItem>
                <ListItem>Dark mode adapts automatically.</ListItem>
              </List>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ─── Wrapping ─────────────────────────────────────────────────────────────────

export const Wrapping = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "520px" }}>
      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Unordered — long items</p>
        <List>
          {LONG.map((item) => <ListItem key={item}>{item}</ListItem>)}
        </List>
      </div>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Ordered — long items</p>
        <List as="ol">
          {LONG.map((item) => <ListItem key={item}>{item}</ListItem>)}
        </List>
      </div>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Icon — long items</p>
        <List icon="check_circle">
          {LONG.map((item) => <ListItem key={item}>{item}</ListItem>)}
        </List>
      </div>
    </div>
  ),
};

// ─── Nested ───────────────────────────────────────────────────────────────────

export const Nested = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px", maxWidth: "560px" }}>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Unordered — 4 levels (disc → circle → square → bordered square)</p>
        <List>
          <ListItem>
            Design system layers
            <List size="sm">
              <ListItem>
                Tokens
                <List size="sm">
                  <ListItem>
                    Base tokens
                    <List size="sm">
                      <ListItem>color-blue-500</ListItem>
                      <ListItem>spacing-4</ListItem>
                      <ListItem>radius-md</ListItem>
                    </List>
                  </ListItem>
                  <ListItem>Semantic tokens</ListItem>
                  <ListItem>Component tokens</ListItem>
                </List>
              </ListItem>
              <ListItem>Components</ListItem>
              <ListItem>Themes</ListItem>
            </List>
          </ListItem>
          <ListItem>Documentation</ListItem>
        </List>
      </div>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Ordered → ordered (2 levels)</p>
        <List as="ol">
          <ListItem>
            Install the package
            <List as="ol" size="sm">
              <ListItem>Run <code>npm install @a1/react</code></ListItem>
              <ListItem>Import the tokens CSS into your app entry point</ListItem>
              <ListItem>Wrap your root with a theme provider if needed</ListItem>
            </List>
          </ListItem>
          <ListItem>
            Configure your theme
            <List as="ol" size="sm">
              <ListItem>Copy the base theme JSON as a starting point</ListItem>
              <ListItem>Override semantic tokens to match your brand</ListItem>
            </List>
          </ListItem>
          <ListItem>Use components directly — no additional setup required</ListItem>
        </List>
      </div>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Ordered → unordered (2 levels)</p>
        <List as="ol">
          <ListItem>
            Choose a variant
            <List size="sm">
              <ListItem>Unordered for non-sequential content</ListItem>
              <ListItem>Ordered for steps and ranked items</ListItem>
              <ListItem>Icon for feature lists and status items</ListItem>
            </List>
          </ListItem>
          <ListItem>
            Pick a size to match surrounding body text
            <List size="sm">
              <ListItem>xs and sm for compact UIs and sidebars</ListItem>
              <ListItem>md for standard body copy contexts</ListItem>
              <ListItem>lg and xl for editorial and marketing layouts</ListItem>
            </List>
          </ListItem>
          <ListItem>Nest sparingly — two levels is the practical maximum</ListItem>
        </List>
      </div>

    </div>
  ),
};

// ─── Mixed ────────────────────────────────────────────────────────────────────

export const Mixed = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px", maxWidth: "560px" }}>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Per-item icon override — status list</p>
        <List icon="check_circle">
          <ListItem>All semantic color tokens defined</ListItem>
          <ListItem>Dark mode verified on every component</ListItem>
          <ListItem icon="warning">Motion audit incomplete — SideNav needs review</ListItem>
          <ListItem icon="cancel">Figma Code Connect not yet configured</ListItem>
          <ListItem icon="radio_button_unchecked">Accessibility testing in progress</ListItem>
        </List>
      </div>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Icon list → unordered sub-list</p>
        <List icon="folder">
          <ListItem>
            Tokens
            <List size="sm">
              <ListItem>base/color-ramp.json</ListItem>
              <ListItem>base/spacing.json</ListItem>
              <ListItem>semantic/motion.json</ListItem>
            </List>
          </ListItem>
          <ListItem>
            Components
            <List size="sm">
              <ListItem>button/button.css</ListItem>
              <ListItem>list/list.css</ListItem>
              <ListItem>side-nav/side-nav.css</ListItem>
            </List>
          </ListItem>
          <ListItem>
            Themes
            <List size="sm">
              <ListItem>a1-light/theme.json</ListItem>
              <ListItem>heritage/theme.json</ListItem>
              <ListItem>accessible/theme.json</ListItem>
            </List>
          </ListItem>
        </List>
      </div>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Unordered → icon sub-list</p>
        <List>
          <ListItem>
            Bundled primitives
            <List icon="check" size="sm">
              <ListItem>Spacing scale (1–128px)</ListItem>
              <ListItem>Type scale (xs–xl body, heading, display)</ListItem>
              <ListItem>Motion duration and easing tokens</ListItem>
              <ListItem>Semantic shadow tokens</ListItem>
            </List>
          </ListItem>
          <ListItem>
            Not included by default
            <List icon="close" size="sm">
              <ListItem>Custom illustration assets</ListItem>
              <ListItem>Data visualization color scales</ListItem>
            </List>
          </ListItem>
        </List>
      </div>

    </div>
  ),
};

// ─── Formatting ───────────────────────────────────────────────────────────────

export const Formatting = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "560px" }}>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Bold, italic, and inline code</p>
        <List>
          <ListItem>Use <strong>semantic color tokens</strong> — never hardcode hex values in components.</ListItem>
          <ListItem>Wrap the app root with <code>{"<ThemeProvider>"}</code> to enable theme switching at runtime.</ListItem>
          <ListItem>Motion durations are defined as <em>named scale steps</em>, not raw millisecond values.</ListItem>
          <ListItem><strong>Dark mode</strong> is handled automatically via <code>prefers-color-scheme</code> — no extra logic needed.</ListItem>
          <ListItem>The <em>expressive</em> easing curve is <strong>reserved for infrequent, high-delight moments</strong> only.</ListItem>
        </List>
      </div>

      <div>
        <p style={{ margin: "0 0 12px", fontSize: "0.75rem", color: "var(--semantic-color-text-muted)" }}>Ordered with inline formatting</p>
        <List as="ol">
          <ListItem>Run <code>npm install @a1/react</code> to add the package.</ListItem>
          <ListItem>Import <code>tokens.css</code> at your <strong>app entry point</strong> — this must come before any component styles.</ListItem>
          <ListItem>Use <em>semantic tokens</em> like <code>--semantic-color-text-default</code> rather than base tokens in component CSS.</ListItem>
          <ListItem>Override <strong>only the tokens you need</strong> — the default theme covers all required values.</ListItem>
        </List>
      </div>

    </div>
  ),
};

// ─── Color ────────────────────────────────────────────────────────────────────

export const Colors = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "560px" }}>
      <List color="default">
        {SHORT.map((item) => <ListItem key={item}>{item}</ListItem>)}
      </List>

      <List color="muted">
        {SHORT.map((item) => <ListItem key={item}>{item}</ListItem>)}
      </List>

      <Inverse style={{ padding: "16px", borderRadius: "8px" }}>
        <List>
          {SHORT.map((item) => <ListItem key={item}>{item}</ListItem>)}
        </List>
      </Inverse>
    </div>
  ),
};
