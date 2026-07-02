import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { DARK_MODE_VARIABLES, LIGHT_MODE_VARIABLES } from "../system/color-modes.mjs";
import { readTheme } from "../system/theme-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const tokenFile = join(rootDir, "build/json/tokens.json");
const packageDir = join(rootDir, "packages/pure");
const distDir = join(packageDir, "dist");

const themes = [
  {
    id: "light",
    name: "Light",
    fileName: "a1-light.css",
    themeFile: join(rootDir, "system/themes/a1-light/theme.json"),
  },
  {
    id: "accessible",
    name: "Accessible",
    fileName: "a1-accessible.css",
    themeFile: join(rootDir, "system/themes/accessible/theme.json"),
  },
  {
    id: "heritage",
    name: "Heritage",
    fileName: "a1-heritage.css",
    themeFile: join(rootDir, "system/themes/heritage/theme.json"),
  },
  {
    id: "fresh",
    name: "Fresh",
    fileName: "a1-fresh.css",
    themeFile: join(rootDir, "system/themes/fresh/theme.json"),
  },
];

function toKebab(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function flattenTokens(object, prefix = [], out = {}) {
  for (const [key, value] of Object.entries(object ?? {})) {
    const next = [...prefix, toKebab(key)];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenTokens(value, next, out);
    } else {
      out[`--${next.join("-")}`] = value;
    }
  }
  return out;
}

function readThemeOverrides(themeFile) {
  if (!existsSync(themeFile)) return {};

  const theme = readTheme(themeFile);
  const overrides = {};

  for (const { declarations } of theme.selectors) {
    for (const [key, value] of Object.entries(declarations ?? {})) {
      if (key.startsWith("--")) overrides[key] = value;
    }
  }

  return overrides;
}

function shouldIncludeVariable(name) {
  if (name.startsWith("--component-pagination-")) return false;
  return name.startsWith("--");
}

function declarations(vars, names = Object.keys(vars)) {
  return names
    .filter((name) => vars[name] !== undefined)
    .sort()
    .map((name) => `  ${name}: ${vars[name]};`)
    .join("\n");
}

function themeCss(theme) {
  const rawTokens = JSON.parse(readFileSync(tokenFile, "utf8"));
  const baseVars = Object.fromEntries(
    Object.entries(flattenTokens(rawTokens)).filter(([name]) => shouldIncludeVariable(name)),
  );
  const themeVars = {
    ...baseVars,
    ...readThemeOverrides(theme.themeFile),
  };

  return `/**
 * A1 ${theme.name} HTML/CSS theme.
 * Generated from Style Dictionary tokens. Do not edit directly.
 */

:root {
${declarations(themeVars)}
}

@media (prefers-color-scheme: dark) {
  :root:not(.a1-theme-light) {
    color-scheme: dark;
${declarations(DARK_MODE_VARIABLES, LIGHT_MODE_VARIABLES)}
  }
}

.a1-theme-dark {
  color-scheme: dark;
${declarations(DARK_MODE_VARIABLES, LIGHT_MODE_VARIABLES)}
}

.a1-theme-light {
  color-scheme: light;
${declarations(themeVars, LIGHT_MODE_VARIABLES)}
}
`;
}

function componentCss() {
  return `/**
 * A1 HTML/CSS button styles.
 * Generated from Style Dictionary tokens. Do not edit directly.
 */

.a1-body {
  box-sizing: border-box;
  min-block-size: 100vh;
  margin: 0;
  background: var(--semantic-color-surface-page);
  color: var(--semantic-color-text-default);
  font-family: var(--component-paragraph-font-family, var(--component-button-font-family));
  font-size: var(--semantic-font-size-body-md);
  font-weight: var(--component-paragraph-font-weight, var(--semantic-font-weight-body));
  line-height: var(--semantic-font-line-height-body);
}

.a1-body *,
.a1-body *::before,
.a1-body *::after {
  box-sizing: border-box;
}

.a1-button {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--a1-button-gap, var(--component-button-gap));
  min-block-size: var(--a1-button-height, var(--component-button-min-height));
  border-width: var(--a1-button-border-width, var(--component-button-border-width));
  border-style: solid;
  border-color: var(--a1-button-border);
  border-radius: var(--a1-button-border-radius, var(--component-button-border-radius));
  padding-block: var(--component-button-padding-block);
  padding-inline: var(--a1-button-padding-inline, var(--component-button-padding-inline));
  background: var(--a1-button-background);
  color: var(--a1-button-foreground);
  font-family: var(--component-button-font-family);
  font-size: var(--a1-button-font-size, var(--component-button-font-size));
  font-weight: var(--a1-button-font-weight, var(--component-button-font-weight));
  line-height: var(--component-button-font-line-height);
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--semantic-motion-duration-normal) var(--semantic-motion-easing-standard),
    border-color var(--semantic-motion-duration-normal) var(--semantic-motion-easing-standard),
    color var(--semantic-motion-duration-normal) var(--semantic-motion-easing-standard);
}

.a1-button-icon,
.a1-link-icon,
.a1-badge-icon,
.a1-banner-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: currentColor;
  line-height: 1;
}

.a1-button-icon,
.a1-button .a1-icon {
  inline-size: var(--a1-button-icon-size, var(--component-button-icon-size));
  block-size: var(--a1-button-icon-size, var(--component-button-icon-size));
  font-size: var(--a1-button-icon-size, var(--component-button-icon-size));
}

.a1-button-icon svg,
.a1-link-icon svg,
.a1-badge-icon svg,
.a1-banner-icon svg,
.a1-icon svg,
.a1-icon-button svg {
  inline-size: 100%;
  block-size: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.a1-button:hover:not(:disabled):not([aria-disabled="true"]) {
  background: var(--a1-button-background-hover);
  border-color: var(--a1-button-border-hover);
  color: var(--a1-button-foreground-hover);
}

.a1-button:active:not(:disabled):not([aria-disabled="true"]) {
  background: var(--a1-button-background-pressed);
  border-color: var(--a1-button-border-pressed);
  color: var(--a1-button-foreground-pressed);
}

.a1-button:focus-visible {
  outline: var(--component-button-focus-ring-width) solid var(--component-button-focus-ring);
  outline-offset: var(--component-button-focus-ring-offset);
}

.a1-button:disabled,
.a1-button[aria-disabled="true"] {
  opacity: var(--component-button-disabled-opacity);
  cursor: not-allowed;
}

.a1-button-primary {
  --a1-button-background: var(--component-button-primary-background);
  --a1-button-background-hover: var(--component-button-primary-background-hover);
  --a1-button-background-pressed: var(--component-button-primary-background-pressed);
  --a1-button-foreground: var(--component-button-primary-foreground);
  --a1-button-foreground-hover: var(--component-button-primary-foreground-hover);
  --a1-button-foreground-pressed: var(--component-button-primary-foreground-pressed);
  --a1-button-border: var(--component-button-primary-border);
  --a1-button-border-hover: var(--component-button-primary-border);
  --a1-button-border-pressed: var(--component-button-primary-border);
  --a1-button-border-width: var(--component-button-primary-border-width);
}

.a1-button-secondary {
  --a1-button-background: var(--component-button-secondary-background);
  --a1-button-background-hover: var(--component-button-secondary-background-hover);
  --a1-button-background-pressed: var(--component-button-secondary-background-pressed);
  --a1-button-foreground: var(--component-button-secondary-foreground);
  --a1-button-foreground-hover: var(--component-button-secondary-foreground-hover);
  --a1-button-foreground-pressed: var(--component-button-secondary-foreground-pressed);
  --a1-button-border: var(--component-button-secondary-border);
  --a1-button-border-hover: var(--component-button-secondary-border-hover);
  --a1-button-border-pressed: var(--component-button-secondary-border-pressed);
  --a1-button-border-width: var(--component-button-secondary-border-width);
}

.a1-button-tertiary {
  --a1-button-background: var(--component-button-tertiary-background);
  --a1-button-background-hover: var(--component-button-tertiary-background-hover);
  --a1-button-background-pressed: var(--component-button-tertiary-background-pressed);
  --a1-button-foreground: var(--component-button-tertiary-foreground);
  --a1-button-foreground-hover: var(--component-button-tertiary-foreground-hover);
  --a1-button-foreground-pressed: var(--component-button-tertiary-foreground-pressed);
  --a1-button-border: var(--component-button-tertiary-border);
  --a1-button-border-hover: var(--component-button-tertiary-border-hover);
  --a1-button-border-pressed: var(--component-button-tertiary-border-pressed);
  --a1-button-border-width: var(--component-button-tertiary-border-width);
}

.a1-button-small {
  --a1-button-height: var(--component-button-small-height);
  --a1-button-font-size: var(--semantic-font-size-body-sm);
  --a1-button-font-weight: var(--base-font-weight-medium);
  --a1-button-border-radius: var(--component-button-small-border-radius);
  --a1-button-padding-inline: var(--base-spacing-8);
  --a1-button-gap: var(--base-spacing-6);
  --a1-button-icon-size: var(--component-button-small-icon-size);
}

.a1-button-medium {
  --a1-button-font-size: var(--component-button-font-size);
  --a1-button-font-weight: var(--base-font-weight-semibold);
  --a1-button-icon-size: var(--component-button-medium-icon-size);
}

.a1-button-large {
  --a1-button-height: var(--component-button-large-height);
  --a1-button-font-size: var(--semantic-font-size-body-lg);
  --a1-button-font-weight: var(--base-font-weight-extra-bold);
  --a1-button-border-radius: var(--base-radius-lg);
  --a1-button-padding-inline: var(--base-spacing-20);
  --a1-button-icon-size: var(--component-button-large-icon-size);
}

.a1-button-large.a1-button-secondary {
  --a1-button-border-width: var(--component-button-large-secondary-border-width);
}

.a1-button-pill {
  --a1-button-border-radius: var(--component-button-pill-border-radius);
}

.a1-heading,
.a1-display,
.a1-paragraph {
  margin-block: 0;
}

.a1-heading {
  color: var(--semantic-color-text-default);
  font-family: var(--component-heading-font-family-heading);
  font-size: var(--a1-heading-size, var(--semantic-font-size-heading-md));
  font-weight: var(--component-heading-font-weight-heading);
  line-height: var(--component-heading-font-line-height-heading);
}

.a1-display {
  color: var(--semantic-color-text-default);
  font-family: var(--component-heading-font-family-display);
  font-size: var(--a1-display-size, var(--semantic-font-size-display-lg));
  font-weight: var(--component-heading-font-weight-display);
  line-height: var(--component-heading-font-line-height-display);
}

.a1-heading-xs {
  --a1-heading-size: var(--semantic-font-size-heading-xs);
}

.a1-heading-sm,
.a1-heading-small {
  --a1-heading-size: var(--semantic-font-size-heading-sm);
}

.a1-heading-md {
  --a1-heading-size: var(--semantic-font-size-heading-md);
}

.a1-heading-lg,
.a1-heading-large {
  --a1-heading-size: var(--semantic-font-size-heading-lg);
}

.a1-heading-xl {
  --a1-heading-size: var(--semantic-font-size-heading-xl);
}

.a1-heading-xxl {
  --a1-heading-size: var(--semantic-font-size-heading-xxl);
}

.a1-display-sm {
  --a1-display-size: var(--semantic-font-size-display-sm);
}

.a1-display-md {
  --a1-display-size: var(--semantic-font-size-display-md);
}

.a1-display-lg {
  --a1-display-size: var(--semantic-font-size-display-lg);
}

.a1-display-xl,
.a1-display-large {
  --a1-display-size: var(--semantic-font-size-display-xl);
}

.a1-display-xxl {
  --a1-display-size: var(--semantic-font-size-display-xxl);
}

.a1-paragraph {
  color: var(--semantic-color-text-default);
  font-family: var(--component-paragraph-font-family, var(--component-button-font-family));
  font-size: var(--a1-paragraph-size, var(--semantic-font-size-body-md));
  font-weight: var(--component-paragraph-font-weight, var(--semantic-font-weight-body));
  line-height: var(--semantic-font-line-height-body);
}

.a1-paragraph-muted {
  color: var(--semantic-color-text-muted);
}

.a1-paragraph-xs {
  --a1-paragraph-size: var(--semantic-font-size-body-xs);
}

.a1-paragraph-sm,
.a1-paragraph-small {
  --a1-paragraph-size: var(--semantic-font-size-body-sm);
}

.a1-paragraph-md {
  --a1-paragraph-size: var(--semantic-font-size-body-md);
}

.a1-paragraph-lg,
.a1-paragraph-large {
  --a1-paragraph-size: var(--semantic-font-size-body-lg);
}

.a1-paragraph-xl {
  --a1-paragraph-size: var(--semantic-font-size-body-xl);
}

.a1-link {
  display: inline-flex;
  align-items: baseline;
  gap: var(--component-link-icon-gap);
  color: var(--component-link-color);
  text-decoration-line: underline;
  text-underline-offset: var(--component-link-underline-offset);
}

.a1-link-icon {
  inline-size: 1em;
  block-size: 1em;
}

.a1-link:hover {
  color: var(--component-link-color-hover);
}

.a1-link:active {
  color: var(--component-link-color-pressed);
}

.a1-link:focus-visible {
  outline: var(--component-link-focus-ring-width) solid var(--component-button-focus-ring);
  outline-offset: var(--component-link-focus-ring-offset);
  border-radius: var(--component-link-focus-ring-radius);
}

.a1-section {
  box-sizing: border-box;
  inline-size: 100%;
  display: grid;
  gap: var(--a1-section-gap, var(--semantic-spacing-gap-md));
  padding-block: var(--a1-section-padding-block, var(--base-spacing-64));
  padding-inline: var(--a1-section-padding-inline, var(--base-spacing-40));
  background: var(--a1-section-background, var(--a1-section-surface, transparent));
  color: var(--semantic-color-text-default);
  --a1-section-surface: transparent;
  --a1-section-gradient-color: transparent;
  --a1-section-gradient-width: var(--component-section-gradient-center-width);
  --a1-section-gradient-height: var(--component-section-gradient-center-height);
  --a1-section-gradient-anchor: center;
  --a1-section-gradient-strength: var(--component-section-gradient-strength);
}

.a1-section-surface-page,
.a1-section--surface-page {
  --a1-section-surface: var(--semantic-color-surface-page);
  --a1-section-background: var(--a1-section-surface);
}

.a1-section-panel {
  --a1-section-background: var(--semantic-color-surface-panel);
}

.a1-section-surface-panel,
.a1-section--surface-panel {
  --a1-section-surface: var(--semantic-color-surface-panel);
  --a1-section-background: var(--a1-section-surface);
}

.a1-section-raised {
  --a1-section-background: var(--semantic-color-surface-raised);
}

.a1-section-surface-raised,
.a1-section--surface-raised {
  --a1-section-surface: var(--semantic-color-surface-raised);
  --a1-section-background: var(--a1-section-surface);
}

.a1-section-inverse {
  color-scheme: dark;
  --a1-section-background: var(--semantic-color-surface-inverse);
  --semantic-color-text-default: var(--semantic-color-text-inverse);
  --semantic-color-text-muted: var(--base-color-neutral-300);
  --a1-section-gradient-strength: var(--component-section-gradient-strength-inverse);
}

.a1-section-gap-xs,
.a1-section--gap-xs {
  --a1-section-gap: var(--semantic-spacing-gap-xs);
}

.a1-section-gap-sm,
.a1-section--gap-sm {
  --a1-section-gap: var(--semantic-spacing-gap-sm);
}

.a1-section-gap-md,
.a1-section--gap-md {
  --a1-section-gap: var(--semantic-spacing-gap-md);
}

.a1-section-gap-lg,
.a1-section--gap-lg {
  --a1-section-gap: var(--semantic-spacing-gap-lg);
}

.a1-section-padding-none,
.a1-section--padding-none {
  --a1-section-padding-block: 0;
  --a1-section-padding-inline: 0;
}

.a1-section-padding-sm,
.a1-section--padding-sm {
  --a1-section-padding-block: var(--base-spacing-32);
  --a1-section-padding-inline: var(--base-spacing-24);
}

.a1-section-padding-md,
.a1-section--padding-md {
  --a1-section-padding-block: var(--base-spacing-64);
  --a1-section-padding-inline: var(--base-spacing-40);
}

.a1-section-padding-lg,
.a1-section--padding-lg {
  --a1-section-padding-block: var(--base-spacing-96);
  --a1-section-padding-inline: var(--base-spacing-64);
}

.a1-section-height-screen,
.a1-section--height-screen {
  min-block-size: 100svh;
}

.a1-section-inner,
.a1-section__inner {
  box-sizing: border-box;
  inline-size: 100%;
  margin-inline: auto;
}

.a1-section-inner-xs,
.a1-section__inner--xs {
  max-inline-size: 28.5rem;
}

.a1-section-inner-sm,
.a1-section__inner--sm {
  max-inline-size: 40rem;
}

.a1-section-inner-md,
.a1-section__inner--md {
  max-inline-size: 50rem;
}

.a1-section-inner-lg,
.a1-section__inner--lg {
  max-inline-size: 60rem;
}

.a1-section-inner-xl,
.a1-section__inner--xl {
  max-inline-size: 70rem;
}

.a1-section-inner-2xl,
.a1-section__inner--2xl {
  max-inline-size: 90rem;
}

.a1-section-gradient-accent,
.a1-section--gradient-accent {
  --a1-section-gradient-color: var(--semantic-color-action-background);
}

.a1-section-gradient-highlight,
.a1-section--gradient-highlight {
  --a1-section-gradient-color: var(--component-section-gradient-highlight);
}

.a1-section-gradient-info,
.a1-section--gradient-info {
  --a1-section-gradient-color: var(--semantic-color-status-info-background);
}

.a1-section-gradient-success,
.a1-section--gradient-success {
  --a1-section-gradient-color: var(--semantic-color-status-success-background);
}

.a1-section-gradient-warn,
.a1-section--gradient-warn {
  --a1-section-gradient-color: var(--semantic-color-status-warn-background);
}

.a1-section-gradient-top,
.a1-section-gradient-top-right,
.a1-section-gradient-right,
.a1-section-gradient-bottom-right,
.a1-section-gradient-bottom,
.a1-section-gradient-bottom-left,
.a1-section-gradient-left,
.a1-section-gradient-top-left,
.a1-section--gradient-top,
.a1-section--gradient-top-right,
.a1-section--gradient-right,
.a1-section--gradient-bottom-right,
.a1-section--gradient-bottom,
.a1-section--gradient-bottom-left,
.a1-section--gradient-left,
.a1-section--gradient-top-left {
  --a1-section-gradient-width: var(--component-section-gradient-edge-width);
  --a1-section-gradient-height: var(--component-section-gradient-edge-height);
}

.a1-section-gradient-top,
.a1-section--gradient-top {
  --a1-section-gradient-anchor: top center;
}

.a1-section-gradient-top-right,
.a1-section--gradient-top-right {
  --a1-section-gradient-anchor: top right;
}

.a1-section-gradient-right,
.a1-section--gradient-right {
  --a1-section-gradient-anchor: right center;
}

.a1-section-gradient-bottom-right,
.a1-section--gradient-bottom-right {
  --a1-section-gradient-anchor: bottom right;
}

.a1-section-gradient-bottom,
.a1-section--gradient-bottom {
  --a1-section-gradient-anchor: bottom center;
}

.a1-section-gradient-bottom-left,
.a1-section--gradient-bottom-left {
  --a1-section-gradient-anchor: bottom left;
}

.a1-section-gradient-left,
.a1-section--gradient-left {
  --a1-section-gradient-anchor: left center;
}

.a1-section-gradient-top-left,
.a1-section--gradient-top-left {
  --a1-section-gradient-anchor: top left;
}

.a1-section-gradient-center,
.a1-section--gradient-center {
  --a1-section-gradient-anchor: center;
}

.a1-section[class*="a1-section-gradient-"],
.a1-section[class*="a1-section--gradient-"] {
  background:
    radial-gradient(
      ellipse var(--a1-section-gradient-width) var(--a1-section-gradient-height) at var(--a1-section-gradient-anchor),
      color-mix(in srgb, var(--a1-section-gradient-color) calc(var(--a1-section-gradient-strength) * 1%), transparent) 0%,
      transparent calc(var(--component-section-gradient-fade) * 1%)
    ),
    var(--a1-section-surface, var(--semantic-color-surface-page));
}

/* Background image: overlay scrim → image → surface colour. Set the image via
   an inline custom property on the section element:
   style="--a1-section-bg-image: url('...')". Do not combine with a gradient
   class — the image owns the background stack. */
.a1-section.a1-section-bg-image,
.a1-section.a1-section--has-bg-image {
  --a1-section-bg-size: cover;
  --a1-section-bg-position: center;
  --a1-section-bg-repeat: no-repeat;
  --a1-section-bg-overlay: transparent;
  --a1-section-bg-overlay-strength: var(--component-section-background-overlay-strength-md);
  background-image:
    linear-gradient(var(--a1-section-bg-overlay), var(--a1-section-bg-overlay)),
    var(--a1-section-bg-image);
  background-size: auto, var(--a1-section-bg-size);
  background-position: center, var(--a1-section-bg-position);
  background-repeat: no-repeat, var(--a1-section-bg-repeat);
  background-color: var(--a1-section-background, var(--a1-section-surface, transparent));
}

/* Fit: cover (default) crops to fill; contain letterboxes; tile repeats at natural size. */
.a1-section-bg-fit-contain,
.a1-section--bg-fit-contain {
  --a1-section-bg-size: contain;
}

.a1-section-bg-fit-tile,
.a1-section--bg-fit-tile {
  --a1-section-bg-size: auto;
  --a1-section-bg-repeat: repeat;
}

/* Focal point kept in view when the image is cropped or anchored. */
.a1-section-bg-pos-top, .a1-section--bg-pos-top { --a1-section-bg-position: top center; }
.a1-section-bg-pos-bottom, .a1-section--bg-pos-bottom { --a1-section-bg-position: bottom center; }
.a1-section-bg-pos-left, .a1-section--bg-pos-left { --a1-section-bg-position: left center; }
.a1-section-bg-pos-right, .a1-section--bg-pos-right { --a1-section-bg-position: right center; }
.a1-section-bg-pos-top-left, .a1-section--bg-pos-top-left { --a1-section-bg-position: top left; }
.a1-section-bg-pos-top-right, .a1-section--bg-pos-top-right { --a1-section-bg-position: top right; }
.a1-section-bg-pos-bottom-left, .a1-section--bg-pos-bottom-left { --a1-section-bg-position: bottom left; }
.a1-section-bg-pos-bottom-right, .a1-section--bg-pos-bottom-right { --a1-section-bg-position: bottom right; }

/* Overlay scrim: darkens or lightens the image so content above keeps contrast. */
.a1-section-bg-overlay-darken,
.a1-section-bg-overlay-lighten,
.a1-section--bg-overlay-darken,
.a1-section--bg-overlay-lighten {
  --a1-section-bg-overlay: color-mix(
    in srgb,
    var(--a1-section-bg-overlay-color) calc(var(--a1-section-bg-overlay-strength) * 1%),
    transparent
  );
}

.a1-section-bg-overlay-darken,
.a1-section--bg-overlay-darken {
  --a1-section-bg-overlay-color: var(--component-section-background-overlay-darken);
}

.a1-section-bg-overlay-lighten,
.a1-section--bg-overlay-lighten {
  --a1-section-bg-overlay-color: var(--component-section-background-overlay-lighten);
}

.a1-section-bg-overlay-strength-sm,
.a1-section--bg-overlay-strength-sm {
  --a1-section-bg-overlay-strength: var(--component-section-background-overlay-strength-sm);
}

.a1-section-bg-overlay-strength-md,
.a1-section--bg-overlay-strength-md {
  --a1-section-bg-overlay-strength: var(--component-section-background-overlay-strength-md);
}

.a1-section-bg-overlay-strength-lg,
.a1-section--bg-overlay-strength-lg {
  --a1-section-bg-overlay-strength: var(--component-section-background-overlay-strength-lg);
}

@media (max-width: 1024px) {
  .a1-section-padding-sm,
  .a1-section--padding-sm {
    --a1-section-padding-block: var(--base-spacing-24);
    --a1-section-padding-inline: var(--base-spacing-16);
  }

  .a1-section-padding-md,
  .a1-section--padding-md {
    --a1-section-padding-block: var(--base-spacing-40);
    --a1-section-padding-inline: var(--base-spacing-24);
  }

  .a1-section-padding-lg,
  .a1-section--padding-lg {
    --a1-section-padding-block: var(--base-spacing-64);
    --a1-section-padding-inline: var(--base-spacing-40);
  }
}

@media (max-width: 640px) {
  .a1-section-padding-sm,
  .a1-section--padding-sm {
    --a1-section-padding-block: var(--base-spacing-16);
    --a1-section-padding-inline: var(--base-spacing-12);
  }

  .a1-section-padding-md,
  .a1-section--padding-md {
    --a1-section-padding-block: var(--base-spacing-24);
    --a1-section-padding-inline: var(--base-spacing-16);
  }

  .a1-section-padding-lg,
  .a1-section--padding-lg {
    --a1-section-padding-block: var(--base-spacing-40);
    --a1-section-padding-inline: var(--base-spacing-24);
  }
}

.a1-stack,
.a1-card,
.a1-empty-state,
.a1-side-nav,
.a1-fieldset,
.a1-form-group {
  display: grid;
  gap: var(--a1-stack-gap, var(--semantic-spacing-gap-md));
}

.a1-stack-small {
  --a1-stack-gap: var(--semantic-spacing-gap-sm);
}

.a1-stack-large {
  --a1-stack-gap: var(--semantic-spacing-gap-lg);
}

.a1-cluster,
.a1-button-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--semantic-spacing-gap-sm);
}

.a1-button-container-end {
  justify-content: flex-end;
}

.a1-grid {
  display: grid;
  gap: var(--semantic-spacing-gap-md);
  grid-template-columns: repeat(auto-fit, minmax(var(--base-spacing-128), 1fr));
}

.a1-inset {
  padding: var(--base-spacing-24);
}

.a1-bleed {
  margin-inline: var(--base-spacing-neg-24);
}

.a1-spacer {
  block-size: var(--semantic-spacing-gap-md);
}

.a1-page-layout {
  display: grid;
  gap: var(--component-page-layout-gap);
  grid-template-columns: var(--component-page-layout-sidebar-width) minmax(0, 1fr);
}

.a1-card {
  padding: var(--component-card-padding);
  border: var(--component-card-border-width) solid var(--semantic-color-border-subtle);
  border-radius: var(--component-card-border-radius);
  background: var(--semantic-color-surface-panel);
  box-shadow: var(--component-card-shadow);
}

.a1-card-raised {
  background: var(--semantic-color-surface-raised);
}

.a1-blockquote {
  margin: 0;
  padding-block: var(--component-blockquote-padding-block);
  padding-inline: var(--component-blockquote-padding-inline);
  border-inline-start: var(--component-blockquote-border-width) solid var(--semantic-color-action-border);
  border-radius: var(--component-blockquote-border-radius);
  background: var(--semantic-color-surface-panel);
  color: var(--semantic-color-text-default);
}

.a1-blockquote cite {
  display: block;
  margin-block-start: var(--semantic-spacing-gap-sm);
  color: var(--semantic-color-text-muted);
  font-weight: var(--component-blockquote-cite-font-weight);
}

.a1-list {
  margin-block: 0;
  padding-inline-start: var(--base-spacing-24);
  color: var(--semantic-color-text-default);
  font-family: var(--component-paragraph-font-family, var(--component-button-font-family));
  font-size: var(--a1-list-font-size, var(--semantic-font-size-body-md));
  line-height: var(--semantic-font-line-height-body);
}

.a1-list li + li {
  margin-block-start: var(--a1-list-gap, var(--base-spacing-8));
}

.a1-list-plain {
  padding-inline-start: 0;
  list-style: none;
}

.a1-list-ordered {
  list-style: decimal;
}

.a1-list-unordered {
  list-style: disc;
}

.a1-list-compact {
  --a1-list-gap: var(--base-spacing-4);
  --a1-list-font-size: var(--semantic-font-size-body-sm);
}

.a1-list-large {
  --a1-list-gap: var(--base-spacing-12);
  --a1-list-font-size: var(--semantic-font-size-body-lg);
}

.a1-divider {
  border: 0;
  border-block-start: var(--component-divider-size-xs) solid var(--semantic-color-border-subtle);
  margin-block: var(--semantic-spacing-gap-md);
}

.a1-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--base-spacing-4);
  inline-size: fit-content;
  min-block-size: var(--base-spacing-24);
  padding-block: var(--component-message-badge-padding-block);
  padding-inline: var(--component-message-badge-padding-inline);
  border: var(--component-message-badge-border-width) solid var(--a1-badge-border, transparent);
  border-radius: var(--component-message-badge-border-radius);
  background: var(--a1-badge-background, var(--semantic-color-text-muted));
  color: var(--a1-badge-foreground, var(--semantic-color-text-inverse));
  font-family: var(--component-button-font-family);
  font-size: var(--semantic-font-size-body-sm);
  font-weight: var(--component-message-badge-font-weight);
  line-height: var(--component-message-badge-line-height);
}

.a1-badge-icon,
.a1-badge .a1-icon {
  inline-size: var(--component-message-badge-icon-size);
  block-size: var(--component-message-badge-icon-size);
  font-size: var(--component-message-badge-icon-size);
}

.a1-badge-info {
  --a1-badge-background: var(--semantic-color-status-info-background);
  --a1-badge-foreground: var(--semantic-color-status-info-foreground);
}

.a1-badge-success {
  --a1-badge-background: var(--semantic-color-status-success-background);
  --a1-badge-foreground: var(--semantic-color-status-success-foreground);
}

.a1-badge-warning {
  --a1-badge-background: var(--semantic-color-status-warn-background);
  --a1-badge-foreground: var(--semantic-color-status-warn-foreground);
}

.a1-badge-error {
  --a1-badge-background: var(--semantic-color-status-error-background);
  --a1-badge-foreground: var(--semantic-color-status-error-foreground);
}

.a1-badge-subtle {
  --a1-badge-background: var(--semantic-color-surface-raised);
  --a1-badge-foreground: var(--semantic-color-text-muted);
  --a1-badge-border: var(--semantic-color-border-default);
}

.a1-banner {
  display: flex;
  align-items: flex-start;
  gap: var(--semantic-spacing-gap-sm);
  padding: var(--component-message-banner-padding);
  border: var(--component-message-banner-border-width) solid var(--a1-banner-border, var(--semantic-color-border-default));
  border-radius: var(--component-message-banner-border-radius);
  background: var(--a1-banner-background, var(--semantic-color-surface-panel));
  color: var(--a1-banner-foreground, var(--semantic-color-text-default));
}

.a1-banner-icon,
.a1-banner .a1-icon {
  inline-size: var(--component-message-banner-icon-size);
  block-size: var(--component-message-banner-icon-size);
  margin-block-start: var(--component-message-banner-icon-margin-top);
  font-size: var(--component-message-banner-icon-size);
}

.a1-banner-info {
  --a1-banner-background: var(--semantic-color-status-info-surface);
  --a1-banner-border: var(--semantic-color-status-info-border);
}

.a1-banner-success {
  --a1-banner-background: var(--semantic-color-status-success-surface);
  --a1-banner-border: var(--semantic-color-status-success-border);
}

.a1-banner-warning {
  --a1-banner-background: var(--semantic-color-status-warn-surface);
  --a1-banner-border: var(--semantic-color-status-warn-border);
}

.a1-banner-error {
  --a1-banner-background: var(--semantic-color-status-error-surface);
  --a1-banner-border: var(--semantic-color-status-error-border);
}

.a1-empty-state {
  justify-items: center;
  max-inline-size: var(--component-message-empty-state-max-width-page);
  padding-block: var(--base-spacing-32);
  padding-inline: var(--base-spacing-24);
  text-align: center;
}

.a1-empty-state-icon,
.a1-notification-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--component-button-pill-border-radius);
}

.a1-empty-state-icon {
  inline-size: var(--component-message-empty-state-wrap-size-section);
  block-size: var(--component-message-empty-state-wrap-size-section);
  background: var(--semantic-color-action-surface);
  color: var(--semantic-color-text-accent);
  font-size: var(--component-message-empty-state-icon-size-section);
}

.a1-notification {
  display: inline-flex;
  align-items: center;
  min-block-size: var(--component-notification-height);
  padding-inline: var(--component-notification-padding-inline);
  border-radius: var(--component-button-pill-border-radius);
  background: var(--semantic-color-status-error-background);
  color: var(--semantic-color-status-error-foreground);
  font-size: var(--component-notification-font-size);
  font-weight: var(--component-notification-font-weight);
  line-height: var(--component-message-badge-line-height);
}

.a1-notification-dot {
  inline-size: var(--component-notification-dot-size);
  block-size: var(--component-notification-dot-size);
  padding-inline: 0;
}

.a1-icon,
.a1-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.a1-icon {
  inline-size: var(--a1-icon-size, var(--component-icon-button-icon-size));
  block-size: var(--a1-icon-size, var(--component-icon-button-icon-size));
  color: currentColor;
  font-size: var(--a1-icon-size, var(--component-icon-button-icon-size));
  line-height: 1;
  overflow: hidden;
  flex-shrink: 0;
  white-space: nowrap;
  vertical-align: -0.125em;
  text-align: center;
  direction: ltr;
}

.a1-icon-button {
  inline-size: var(--component-icon-button-size);
  block-size: var(--component-icon-button-size);
  border: var(--component-button-secondary-border-width) solid transparent;
  border-radius: var(--component-icon-button-border-radius);
  background: transparent;
  color: var(--semantic-color-text-default);
  cursor: pointer;
}

.a1-icon-button .a1-icon,
.a1-icon-button-icon {
  --a1-icon-size: var(--component-icon-button-icon-size);
  inline-size: var(--component-icon-button-icon-size);
  block-size: var(--component-icon-button-icon-size);
}

.a1-icon-button:hover {
  background: var(--semantic-color-surface-panel);
}

.a1-icon-button:focus-visible {
  outline: var(--component-icon-button-focus-ring-width) solid var(--component-button-focus-ring);
  outline-offset: var(--component-icon-button-focus-ring-offset);
}

.a1-field,
.a1-select,
.a1-textarea {
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: var(--component-field-default-height);
  padding-inline: var(--component-field-default-padding-inline);
  border: var(--component-field-border-width) solid var(--semantic-color-border-default);
  border-radius: var(--component-field-default-border-radius);
  background: var(--semantic-color-surface-field);
  color: var(--semantic-color-text-default);
  font: inherit;
}

.a1-textarea {
  min-block-size: var(--component-field-comfortable-height);
  padding-block: var(--component-field-textarea-padding-block);
}

.a1-field:hover,
.a1-select:hover,
.a1-textarea:hover {
  border-color: var(--component-field-hover-border-color);
  background: var(--component-field-hover-background);
}

.a1-field:focus-visible,
.a1-select:focus-visible,
.a1-textarea:focus-visible,
.a1-checkbox:focus-visible,
.a1-radio:focus-visible,
.a1-switch-input:focus-visible + .a1-switch-track {
  outline: var(--component-field-focus-ring-width) solid var(--component-field-focus-ring-color);
  outline-offset: var(--component-field-focus-ring-offset);
}

.a1-label {
  display: grid;
  gap: var(--component-field-default-gap);
  color: var(--semantic-color-text-default);
  font-family: var(--component-button-font-family);
  font-size: var(--semantic-font-size-body-sm);
  font-weight: var(--component-field-label-font-weight);
}

.a1-field-row {
  display: grid;
  gap: var(--semantic-spacing-gap-sm);
  grid-template-columns: var(--component-field-side-label-width) minmax(0, 1fr);
  align-items: start;
}

.a1-help-text {
  color: var(--semantic-color-text-muted);
  font-size: var(--semantic-font-size-body-sm);
  font-weight: var(--semantic-font-weight-body);
}

.a1-fieldset {
  margin: 0;
  padding: var(--base-spacing-16);
  border: var(--component-field-border-width) solid var(--semantic-color-border-subtle);
  border-radius: var(--component-card-border-radius);
}

.a1-fieldset legend {
  padding-inline: var(--base-spacing-4);
  font-weight: var(--component-field-label-font-weight);
}

.a1-check-row,
.a1-radio-row,
.a1-switch {
  display: flex;
  align-items: center;
  gap: var(--component-checkbox-group-gap);
  padding-block: var(--component-checkbox-group-row-padding-block);
  padding-inline: var(--component-checkbox-group-row-padding-inline);
}

.a1-checkbox-group,
.a1-radio-group {
  display: grid;
  gap: var(--component-checkbox-group-group-gap);
  margin: 0;
  padding: var(--base-spacing-16);
  border: var(--component-field-border-width) solid var(--semantic-color-border-subtle);
  border-radius: var(--component-card-border-radius);
}

.a1-radio-group {
  gap: var(--component-radio-group-group-gap);
}

.a1-checkbox-group legend,
.a1-radio-group legend {
  padding-inline: var(--base-spacing-4);
  font-weight: var(--component-field-label-font-weight);
}

.a1-checkbox-group-items,
.a1-radio-group-items {
  display: grid;
  gap: var(--component-checkbox-group-item-gap);
  margin-block-start: var(--component-checkbox-group-items-top-gap);
}

.a1-radio-group-items {
  gap: var(--component-radio-group-item-gap);
  margin-block-start: var(--component-radio-group-items-top-gap);
}

.a1-checkbox,
.a1-radio {
  inline-size: var(--component-checkbox-group-box-size);
  block-size: var(--component-checkbox-group-box-size);
  accent-color: var(--semantic-color-action-background);
}

.a1-radio {
  inline-size: var(--component-radio-group-control-size);
  block-size: var(--component-radio-group-control-size);
}

.a1-switch-input {
  position: absolute;
  opacity: 0;
}

.a1-switch-track {
  display: inline-flex;
  align-items: center;
  inline-size: var(--component-switch-track-width);
  block-size: var(--component-switch-track-height);
  padding: var(--component-switch-gap);
  border-radius: var(--component-button-pill-border-radius);
  background: var(--semantic-color-border-strong);
}

.a1-switch-track::before {
  content: "";
  inline-size: var(--component-switch-thumb-size);
  block-size: var(--component-switch-thumb-size);
  border-radius: var(--component-button-pill-border-radius);
  background: var(--semantic-color-surface-field);
  box-shadow: var(--component-switch-thumb-shadow);
  transition: transform var(--semantic-motion-duration-fast) var(--semantic-motion-easing-standard);
}

.a1-switch-input:checked + .a1-switch-track {
  background: var(--semantic-color-action-background);
}

.a1-switch-input:checked + .a1-switch-track::before {
  transform: translateX(calc(var(--component-switch-track-width) - var(--component-switch-thumb-size) - (var(--component-switch-gap) * 2)));
}

.a1-accordion {
  border: var(--component-data-table-border-width) solid var(--semantic-color-border-subtle);
  border-radius: var(--component-accordion-border-radius);
  background: var(--semantic-color-surface-panel);
}

.a1-accordion summary {
  min-block-size: var(--component-accordion-trigger-height-md);
  padding-inline: var(--component-accordion-padding-inline-md);
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: var(--base-font-weight-semibold);
}

.a1-accordion-body {
  padding: var(--component-accordion-padding-inline-lg);
  border-block-start: var(--component-data-table-border-width) solid var(--semantic-color-border-subtle);
}

.a1-table {
  inline-size: 100%;
  border-collapse: collapse;
  color: var(--semantic-color-text-default);
  font-family: var(--component-button-font-family);
  font-size: var(--component-data-table-density-default-font-size);
}

.a1-table th,
.a1-table td {
  padding-block: var(--component-data-table-density-default-cell-padding-block);
  padding-inline: var(--component-data-table-density-default-cell-padding-inline);
  border-block-end: var(--component-data-table-border-width) solid var(--semantic-color-border-subtle);
  text-align: start;
}

.a1-table th {
  background: var(--semantic-color-surface-panel);
  font-weight: var(--component-data-table-header-font-weight);
}

.a1-definition-list {
  container-type: inline-size;
  margin: 0;
  color: var(--semantic-color-text-default);
  font-family: var(--component-paragraph-font-family);
}

.a1-definition-list-small {
  --a1-definition-list-gap: var(--component-definition-list-gap-sm);
  --a1-definition-list-row-gap: var(--component-definition-list-row-gap-sm);
  --a1-definition-list-column-gap: var(--component-definition-list-column-gap-sm);
  --a1-definition-list-font-size: var(--semantic-font-size-body-sm);
}

.a1-definition-list-medium {
  --a1-definition-list-gap: var(--component-definition-list-gap-md);
  --a1-definition-list-row-gap: var(--component-definition-list-row-gap-md);
  --a1-definition-list-column-gap: var(--component-definition-list-column-gap-md);
  --a1-definition-list-font-size: var(--semantic-font-size-body-md);
}

.a1-definition-list-large {
  --a1-definition-list-gap: var(--component-definition-list-gap-lg);
  --a1-definition-list-row-gap: var(--component-definition-list-row-gap-lg);
  --a1-definition-list-column-gap: var(--component-definition-list-column-gap-lg);
  --a1-definition-list-font-size: var(--semantic-font-size-body-lg);
}

.a1-definition-list-item {
  min-inline-size: 0;
}

.a1-definition-list-label,
.a1-definition-list-value {
  min-inline-size: 0;
  margin: 0;
  font-size: var(--a1-definition-list-font-size, var(--semantic-font-size-body-md));
  line-height: var(--semantic-font-line-height-body);
}

.a1-definition-list-label {
  font-weight: var(--component-definition-list-label-font-weight);
  color: var(--semantic-color-text-muted);
}

.a1-definition-list-value {
  display: flex;
  align-items: flex-start;
  gap: var(--component-definition-list-copy-gap);
  color: var(--semantic-color-text-default);
}

.a1-definition-list-value-content {
  flex: 1 1 auto;
  min-inline-size: 0;
}

.a1-definition-list-column {
  display: flex;
  flex-direction: column;
  gap: var(--a1-definition-list-gap, var(--component-definition-list-gap-md));
}

.a1-definition-list-column .a1-definition-list-item {
  display: flex;
  flex-direction: column;
  gap: var(--a1-definition-list-row-gap, var(--component-definition-list-row-gap-md));
}

.a1-definition-list-row {
  display: flex;
  flex-direction: column;
  gap: var(--a1-definition-list-row-gap, var(--component-definition-list-row-gap-md));
}

.a1-definition-list-row .a1-definition-list-item {
  display: grid;
  grid-template-columns: var(--a1-definition-list-label-column) minmax(0, 1fr);
  column-gap: var(--a1-definition-list-column-gap, var(--component-definition-list-column-gap-md));
  align-items: start;
}

.a1-definition-list-label-auto {
  --a1-definition-list-label-column: max-content;
}

.a1-definition-list-label-fixed {
  --a1-definition-list-label-column: clamp(
    var(--component-definition-list-label-width-min),
    var(--component-definition-list-label-width-preferred),
    var(--component-definition-list-label-width-max)
  );
}

@container (max-width: 240px) {
  .a1-definition-list-row .a1-definition-list-item {
    display: flex;
    flex-direction: column;
    gap: var(--a1-definition-list-row-gap, var(--component-definition-list-row-gap-md));
  }
}

.a1-breadcrumb,
.a1-top-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--semantic-spacing-gap-xs);
}

.a1-breadcrumb {
  color: var(--semantic-color-text-muted);
  font-size: var(--semantic-font-size-body-sm);
}

.a1-side-nav {
  inline-size: var(--component-menu-width);
  padding: var(--base-spacing-8);
  border: var(--component-menu-border-width) solid var(--semantic-color-border-subtle);
  border-radius: var(--component-card-border-radius);
  background: var(--semantic-color-surface-panel);
  list-style: none;
  margin: 0;
}

.a1-side-nav-item {
  display: flex;
  align-items: center;
  gap: var(--component-side-nav-item-gap);
  min-block-size: var(--component-side-nav-item-height);
  padding-inline: var(--component-side-nav-item-padding-inline);
  border-radius: var(--component-side-nav-item-border-radius);
  color: var(--semantic-color-text-default);
  text-decoration: none;
}

.a1-side-nav-item:hover {
  background: var(--semantic-color-surface-raised);
}

.a1-side-nav-item[aria-current="page"] {
  background: var(--semantic-color-action-surface);
  color: var(--semantic-color-text-accent);
  font-weight: var(--component-side-nav-item-active-font-weight);
}

.a1-top-header {
  min-block-size: var(--component-side-nav-header-min-height);
  padding-inline: var(--base-spacing-16);
  border-block-end: var(--component-side-nav-border-width) solid var(--semantic-color-border-subtle);
  background: var(--semantic-color-surface-page);
}

.a1-system-banner {
  padding-block: var(--component-message-banner-padding);
  padding-inline: var(--base-spacing-24);
  background: var(--semantic-color-action-surface);
  color: var(--semantic-color-text-accent);
}

.a1-figure {
  margin: 0;
}

.a1-figure img {
  max-inline-size: 100%;
  border-radius: var(--component-card-border-radius);
}

.a1-figure figcaption {
  margin-block-start: var(--base-spacing-8);
  color: var(--semantic-color-text-muted);
  font-size: var(--semantic-font-size-body-sm);
}

.a1-inline-code,
.a1-kbd {
  padding-block: var(--component-inline-padding-block);
  padding-inline: var(--component-inline-padding-inline);
  border-radius: var(--component-inline-border-radius);
  background: var(--semantic-color-surface-panel);
  font-family: var(--component-inline-font-family-mono);
  font-size: var(--component-inline-code-font-size);
}

@media (prefers-reduced-motion: reduce) {
  .a1-button {
    transition-duration: var(--semantic-motion-duration-instant);
  }
}
`;
}

function iconSvg(name) {
  const paths = {
    alert: "<path d='M12 9v4'/><path d='M12 17h.01'/><path d='M10.3 4.3 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z'/>",
    arrow: "<path d='M5 12h14'/><path d='m13 6 6 6-6 6'/>",
    check: "<path d='m20 6-11 11-5-5'/>",
    link: "<path d='M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1'/><path d='M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1'/>",
    settings: "<path d='M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z'/><path d='M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z'/>",
    spark: "<path d='m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z'/><path d='m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z'/>",
  };

  return `<svg class="a1-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] ?? paths.spark}</svg>`;
}

function html() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>A1 HTML/CSS Button</title>
    <link rel="stylesheet" href="./a1-base.css">
    <link rel="stylesheet" href="./a1-light.css">
  </head>
  <body class="a1-body">
    <main class="a1-stack a1-stack-large">
      <section class="a1-section a1-section-surface-panel a1-section-padding-lg a1-section-gap-md a1-section-gradient-accent a1-section-gradient-bottom-right">
        <div class="a1-section-inner a1-section-inner-xl a1-stack">
          <p class="a1-badge a1-badge-info"><span class="a1-badge-icon" aria-hidden="true">${iconSvg("spark")}</span>Pure HTML/CSS</p>
          <h1 class="a1-display a1-display-large">A1 components</h1>
          <p class="a1-paragraph a1-paragraph-large">Semantic HTML elements styled with A1 design tokens.</p>
        </div>
      </section>

      <section class="a1-section a1-section-padding-md a1-section-gap-lg">
        <h2 class="a1-heading">Buttons</h2>
        <div class="a1-cluster" aria-label="Primary buttons">
          <button class="a1-button a1-button-primary a1-button-small"><span class="a1-button-icon" aria-hidden="true">${iconSvg("check")}</span>Small primary</button>
          <button class="a1-button a1-button-primary a1-button-medium"><span class="a1-button-icon" aria-hidden="true">${iconSvg("check")}</span>Medium primary</button>
          <button class="a1-button a1-button-primary a1-button-large">Large primary<span class="a1-button-icon" aria-hidden="true">${iconSvg("arrow")}</span></button>
        </div>

        <div class="a1-cluster" aria-label="Secondary buttons">
          <button class="a1-button a1-button-secondary a1-button-small">Small secondary</button>
          <button class="a1-button a1-button-secondary a1-button-medium">Medium secondary</button>
          <button class="a1-button a1-button-secondary a1-button-large">Large secondary</button>
        </div>

        <div class="a1-cluster" aria-label="Tertiary buttons">
          <button class="a1-button a1-button-tertiary a1-button-small">Small tertiary</button>
          <button class="a1-button a1-button-tertiary a1-button-medium">Medium tertiary</button>
          <button class="a1-button a1-button-tertiary a1-button-large">Large tertiary</button>
        </div>

        <div class="a1-cluster" aria-label="Button states">
          <button class="a1-button a1-button-primary a1-button-medium a1-button-pill">Pill button</button>
          <button class="a1-button a1-button-primary a1-button-medium" disabled>Disabled</button>
          <a class="a1-button a1-button-secondary a1-button-medium" href="#"><span class="a1-button-icon" aria-hidden="true">${iconSvg("link")}</span>Button link</a>
          <button class="a1-icon-button" aria-label="Settings"><span class="a1-icon a1-icon-button-icon" aria-hidden="true">${iconSvg("settings")}</span></button>
        </div>
      </section>

      <section class="a1-section a1-section-surface-raised a1-section-padding-md a1-section-gap-lg">
        <div class="a1-section-inner a1-section-inner-lg a1-stack">
          <h2 class="a1-heading">Typography</h2>
          <div class="a1-stack">
            <h1 class="a1-heading a1-heading-xxl">Heading XXL</h1>
            <h2 class="a1-heading a1-heading-xl">Heading XL</h2>
            <h3 class="a1-heading a1-heading-lg">Heading LG</h3>
            <h4 class="a1-heading a1-heading-md">Heading MD</h4>
            <h5 class="a1-heading a1-heading-sm">Heading SM</h5>
            <h6 class="a1-heading a1-heading-xs">Heading XS</h6>
          </div>
          <p class="a1-paragraph a1-paragraph-xl">Paragraph XL for introductory copy.</p>
          <p class="a1-paragraph">Paragraph MD for standard body content with <a class="a1-link" href="#"><span class="a1-link-icon" aria-hidden="true">${iconSvg("link")}</span>links</a>, <code class="a1-inline-code">inline code</code>, and <kbd class="a1-kbd">Esc</kbd>.</p>
          <p class="a1-paragraph a1-paragraph-sm a1-paragraph-muted">Paragraph SM muted for supporting details.</p>
          <ul class="a1-list a1-list-unordered">
            <li>Unordered list item</li>
            <li>Second unordered item</li>
            <li>Third unordered item</li>
          </ul>
          <ol class="a1-list a1-list-ordered a1-list-compact">
            <li>Ordered compact item</li>
            <li>Second ordered item</li>
            <li>Third ordered item</li>
          </ol>
        </div>
      </section>

      <section class="a1-section a1-section-surface-raised a1-section-padding-sm a1-section-gap-sm">
        <h2 class="a1-heading">Content</h2>
        <blockquote class="a1-blockquote">
          <p class="a1-paragraph">Good interfaces are agreements made visible.</p>
          <cite>Design system note</cite>
        </blockquote>
        <hr class="a1-divider">
        <figure class="a1-figure">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 240'%3E%3Crect width='640' height='240' fill='%23e1e8f3'/%3E%3Cpath d='M80 160 220 80l120 80 80-48 140 88H80z' fill='%237c3aed' opacity='.65'/%3E%3C/svg%3E" alt="Abstract token landscape">
          <figcaption>Figure and caption using semantic HTML.</figcaption>
        </figure>
      </section>

      <section class="a1-section a1-section-padding-md">
        <h2 class="a1-heading">Surfaces and messages</h2>
        <div class="a1-grid">
          <article class="a1-card">
            <span class="a1-badge a1-badge-success"><span class="a1-badge-icon" aria-hidden="true">${iconSvg("check")}</span>Ready</span>
            <h3 class="a1-heading a1-heading-small">Card</h3>
            <p class="a1-paragraph a1-paragraph-muted">Cards use panel surfaces, borders, radius, and shadow tokens.</p>
          </article>
          <aside class="a1-banner a1-banner-warning" role="status">
            <span class="a1-banner-icon" aria-hidden="true">${iconSvg("alert")}</span>
            <div>
              <strong>Banner</strong>
              <p class="a1-paragraph">A semantic status message.</p>
            </div>
          </aside>
          <div class="a1-empty-state">
            <span class="a1-empty-state-icon" aria-hidden="true">+</span>
            <h3 class="a1-heading a1-heading-small">Empty state</h3>
            <p class="a1-paragraph a1-paragraph-muted">Nothing here yet.</p>
          </div>
        </div>
      </section>

      <section class="a1-section a1-section-surface-panel a1-section-padding-md a1-section-gap-lg">
        <h2 class="a1-heading">Forms</h2>
        <form class="a1-stack" action="#">
          <label class="a1-label">
            Name
            <input class="a1-field" type="text" value="Ada Lovelace">
            <span class="a1-help-text">Use standard form controls.</span>
          </label>
          <label class="a1-label">
            Category
            <select class="a1-select">
              <option>Research</option>
              <option>Design</option>
            </select>
          </label>
          <label class="a1-label">
            Notes
            <textarea class="a1-textarea">Token-driven textarea.</textarea>
          </label>
          <fieldset class="a1-checkbox-group">
            <legend>Checkbox group</legend>
            <div class="a1-checkbox-group-items">
              <label class="a1-check-row"><input class="a1-checkbox" type="checkbox" checked> Include examples</label>
              <label class="a1-check-row"><input class="a1-checkbox" type="checkbox"> Include annotations</label>
            </div>
          </fieldset>
          <fieldset class="a1-radio-group">
            <legend>Radio group</legend>
            <div class="a1-radio-group-items">
              <label class="a1-radio-row"><input class="a1-radio" type="radio" name="mode" checked> Standard mode</label>
              <label class="a1-radio-row"><input class="a1-radio" type="radio" name="mode"> Compact mode</label>
            </div>
          </fieldset>
          <fieldset class="a1-fieldset">
            <legend>Switch</legend>
            <label class="a1-switch"><input class="a1-switch-input" type="checkbox" checked><span class="a1-switch-track"></span> Publish</label>
          </fieldset>
        </form>
      </section>

      <section class="a1-section a1-section-padding-md">
        <h2 class="a1-heading">Navigation</h2>
        <nav class="a1-breadcrumb" aria-label="Breadcrumb">
          <a class="a1-link" href="#">Home</a>
          <span>/</span>
          <a class="a1-link" href="#">Components</a>
          <span>/</span>
          <span>HTML CSS</span>
        </nav>
        <nav class="a1-side-nav" aria-label="Side navigation">
          <a class="a1-side-nav-item" aria-current="page" href="#">Overview</a>
          <a class="a1-side-nav-item" href="#">Examples</a>
          <a class="a1-side-nav-item" href="#">Guidelines</a>
        </nav>
      </section>

      <section class="a1-section a1-section-surface-raised a1-section-padding-md a1-section-gap-md">
        <h2 class="a1-heading">Controls and disclosure</h2>
        <details class="a1-accordion" open>
          <summary>Accordion summary</summary>
          <div class="a1-accordion-body">
            <p class="a1-paragraph">Native disclosure with A1 styling.</p>
          </div>
        </details>
      </section>

      <section class="a1-section a1-section-padding-md">
        <h2 class="a1-heading">Data</h2>
        <table class="a1-table">
          <thead>
            <tr><th>Component</th><th>Status</th><th>Package</th></tr>
          </thead>
          <tbody>
            <tr><td>Button</td><td><span class="a1-badge a1-badge-success">Ready</span></td><td>HTML/CSS</td></tr>
            <tr><td>Accordion</td><td><span class="a1-badge a1-badge-info">Native</span></td><td>HTML/CSS</td></tr>
          </tbody>
        </table>
        <dl class="a1-definition-list a1-definition-list-row a1-definition-list-medium a1-definition-list-label-fixed">
          <div class="a1-definition-list-item">
            <dt class="a1-definition-list-label">Component</dt>
            <dd class="a1-definition-list-value"><span class="a1-definition-list-value-content">Definition List</span></dd>
          </div>
          <div class="a1-definition-list-item">
            <dt class="a1-definition-list-label">Use for</dt>
            <dd class="a1-definition-list-value"><span class="a1-definition-list-value-content">Semantic label/value pairs</span></dd>
          </div>
        </dl>
      </section>
    </main>
  </body>
</html>
`;
}

if (!existsSync(tokenFile)) {
  throw new Error("Missing build/json/tokens.json. Run npm run build:tokens first.");
}

mkdirSync(distDir, { recursive: true });

writeFileSync(join(distDir, "a1-base.css"), componentCss());

for (const theme of themes) {
  writeFileSync(join(distDir, theme.fileName), themeCss(theme));
}

writeFileSync(join(distDir, "index.html"), html());

console.log(`✔︎ HTML/CSS package (base CSS + ${themes.length} theme CSS files + index.html)`);
