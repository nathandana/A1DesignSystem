/**
 * Compile a theme spec (6 colour ramps + fonts + roundness) into the full set of
 * A1 CSS custom properties — base-colour ramps plus the semantic/component
 * mappings (surfaces, text, borders, action, status, buttons, fonts, radii). The
 * same map drives the live preview (inline style) and the exported theme.json.
 */
import { generateColorRamp, RAMP_NAMES, RAMP_STOPS, type RampName } from './themeColors';

/** A full ramp: a hex per stop (0…1000). */
export type Ramp = Record<number, string>;

export interface ThemeFonts {
  display: string;
  heading: string;
  body: string;
}

export interface ThemeFontWeights {
  display: number;
  heading: number;
  body: number;
}

export type RoleScale = Record<string, number>; // step → rem
export interface ThemeFontSizes {
  display: RoleScale;
  heading: RoleScale;
  body: RoleScale;
}
export interface ThemeTextColors {
  default: string;
  muted: string;
  accent: string;
  inverse: string;
}

export interface SemanticColorModes {
  standard: string; // ramp ref "<ramp>:<stop>" or a hex
  inverse: string;
}
export type SemanticColors = Record<string, SemanticColorModes>;

export interface ThemeSpec {
  ramps: Record<RampName, Ramp>; // full 12-stop ramps (editable per value)
  fonts: ThemeFonts;
  fontWeights?: ThemeFontWeights; // per-role font weight (100…900)
  fontSizes?: ThemeFontSizes; // per-role size scale (step → rem)
  textColors?: ThemeTextColors; // overrides for the semantic text colours
  semanticColors?: SemanticColors; // ramp refs per semantic token (standard + inverse)
  icon?: ThemeIconSettings; // Material Symbols variation axes
  roundness: number; // px used for base-radius-md; others derived
}

export interface ThemeIconSettings {
  fill: boolean;
  weight: number;
  grade: number;
  opticalSize: number;
}

/** Resolve a ramp reference ("accent:500") to a base-colour CSS var; pass through hex / var(). */
export function rampRefToVar(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  if (ref.startsWith('#') || ref.startsWith('var(') || ref.startsWith('rgb') || ref.startsWith('hsl')) return ref;
  const [ramp, stop] = ref.split(':');
  if (!ramp || stop === undefined) return undefined;
  return `var(--base-color-${ramp}-${stop})`;
}

/** The inverse semantic-colour var map (for the theme's `.a1-inverse` scope and the inverse preview). */
export function inverseSemanticVars(semanticColors?: SemanticColors): Record<string, string> {
  const out: Record<string, string> = {};
  if (!semanticColors) return out;
  for (const [key, modes] of Object.entries(semanticColors)) {
    const v = rampRefToVar(modes.inverse);
    if (v) out[`--semantic-color-${key}`] = v;
  }
  return out;
}

/** Expand a -500 hex into a full ramp (OKLCH-generated). */
export function rampFrom500(hex500: string): Ramp {
  return generateColorRamp(hex500) ?? {};
}

/** Build full ramps for every ramp from a map of -500 hexes. */
export function rampsFrom500(map: Record<RampName, string>): Record<RampName, Ramp> {
  const out = {} as Record<RampName, Ramp>;
  for (const name of RAMP_NAMES) out[name] = rampFrom500(map[name]);
  return out;
}

const fallback = {
  body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  heading: "Georgia, Cambria, 'Times New Roman', serif",
  display: "Georgia, Cambria, serif",
};

/** A CSS font-family stack from a single family name + a category fallback. */
export function fontStack(family: string, kind: keyof typeof fallback): string {
  if (!family) return fallback[kind];
  return `'${family}', ${fallback[kind]}`;
}

function round(n: number): string {
  return `${Math.max(0, Math.round(n))}px`;
}

/** The full CSS-variable map for a theme spec. */
export function compileThemeVars(spec: ThemeSpec): Record<string, string> {
  const vars: Record<string, string> = {};

  // 1. Base colour ramps (use the editable per-stop values directly).
  for (const name of RAMP_NAMES) {
    const ramp = spec.ramps[name];
    if (!ramp) continue;
    for (const stop of RAMP_STOPS) if (ramp[stop]) vars[`--base-color-${name}-${stop}`] = ramp[stop];
  }
  const n = (stop: number) => `var(--base-color-neutral-${stop})`;
  const a = (stop: number) => `var(--base-color-accent-${stop})`;

  // 2. Surfaces, text, borders (driven by the neutral ramp).
  vars['--semantic-color-text-default'] = n(900);
  vars['--semantic-color-text-muted'] = n(500);
  vars['--semantic-color-text-inverse'] = '#ffffff';
  vars['--semantic-color-text-accent'] = a(600);
  vars['--semantic-color-surface-page'] = n(0);
  vars['--semantic-color-surface-card'] = '#ffffff';
  vars['--semantic-color-surface-field'] = '#ffffff';
  vars['--semantic-color-surface-panel'] = n(0);
  vars['--semantic-color-surface-raised'] = n(50);
  vars['--semantic-color-border-subtle'] = n(100);
  vars['--semantic-color-border-default'] = n(200);
  vars['--semantic-color-border-strong'] = n(300);

  // 3. Action (accent ramp).
  vars['--semantic-color-action-background'] = a(500);
  vars['--semantic-color-action-background-hover'] = a(600);
  vars['--semantic-color-action-background-pressed'] = a(700);
  vars['--semantic-color-action-foreground'] = a(0);
  vars['--semantic-color-action-foreground-pressed'] = a(100);
  vars['--semantic-color-action-surface'] = a(50);
  vars['--semantic-color-action-border'] = a(300);

  // 4. Status ramps.
  for (const s of ['error', 'warn', 'success', 'info'] as const) {
    const v = (stop: number) => `var(--base-color-${s}-${stop})`;
    vars[`--semantic-color-status-${s}-background`] = v(500);
    vars[`--semantic-color-status-${s}-surface`] = v(50);
    vars[`--semantic-color-status-${s}-border`] = v(300);
    vars[`--semantic-color-status-${s}-foreground`] = v(0);
  }

  // 5. Buttons (primary = action; secondary/tertiary = accent).
  vars['--component-button-primary-background'] = 'var(--semantic-color-action-background)';
  vars['--component-button-primary-background-hover'] = 'var(--semantic-color-action-background-hover)';
  vars['--component-button-primary-background-pressed'] = 'var(--semantic-color-action-background-pressed)';
  vars['--component-button-primary-foreground'] = a(0);
  vars['--component-button-primary-foreground-hover'] = a(50);
  vars['--component-button-primary-foreground-pressed'] = a(100);
  vars['--component-button-primary-border'] = 'var(--semantic-color-action-background)';
  vars['--component-button-secondary-background'] = a(0);
  vars['--component-button-secondary-background-hover'] = a(50);
  vars['--component-button-secondary-background-pressed'] = a(100);
  vars['--component-button-secondary-foreground'] = a(600);
  vars['--component-button-secondary-foreground-hover'] = a(700);
  vars['--component-button-secondary-foreground-pressed'] = a(800);
  vars['--component-button-secondary-border'] = a(500);
  vars['--component-button-secondary-border-hover'] = a(700);
  vars['--component-button-secondary-border-pressed'] = a(800);
  vars['--component-button-tertiary-background'] = 'transparent';
  vars['--component-button-tertiary-background-hover'] = a(50);
  vars['--component-button-tertiary-background-pressed'] = a(100);
  vars['--component-button-tertiary-foreground'] = a(600);
  vars['--component-button-tertiary-foreground-hover'] = a(700);
  vars['--component-button-tertiary-foreground-pressed'] = a(800);
  vars['--component-button-tertiary-border'] = 'transparent';
  vars['--component-button-tertiary-border-hover'] = a(50);
  vars['--component-button-tertiary-border-pressed'] = a(100);
  vars['--component-button-focus-ring'] = a(300);

  // 6. Radii (from roundness).
  const r = spec.roundness;
  vars['--base-radius-sm'] = round(r * 0.5);
  vars['--base-radius-md'] = round(r);
  vars['--base-radius-lg'] = round(r * 1.4);
  vars['--base-radius-xl'] = round(r * 1.8);
  vars['--component-card-border-radius'] = round(r * 1.6);
  vars['--component-dialog-border-radius'] = round(r * 2);

  // 7. Fonts.
  vars['--component-button-font-family'] = fontStack(spec.fonts.body, 'body');
  vars['--component-paragraph-font-family'] = fontStack(spec.fonts.body, 'body');
  vars['--component-heading-font-family-heading'] = fontStack(spec.fonts.heading, 'heading');
  vars['--component-heading-font-family-display'] = fontStack(spec.fonts.display, 'display');

  // 8. Font weights (per role) — set the semantic tier plus the component vars
  // the previewed Heading/Paragraph actually read.
  const w = spec.fontWeights;
  if (w) {
    vars['--semantic-font-weight-display'] = String(w.display);
    vars['--semantic-font-weight-heading'] = String(w.heading);
    vars['--semantic-font-weight-body'] = String(w.body);
    vars['--component-heading-font-weight-display'] = String(w.display);
    vars['--component-heading-font-weight-heading'] = String(w.heading);
    vars['--component-paragraph-font-weight'] = String(w.body);
    vars['--component-button-font-weight'] = String(w.body);
  }

  // 9. Font-size scale (per role) → --semantic-font-size-{role}-{step}.
  const fs = spec.fontSizes;
  if (fs) {
    for (const role of ['display', 'heading', 'body'] as const) {
      const scale = fs[role];
      if (!scale) continue;
      for (const [step, rem] of Object.entries(scale)) {
        if (typeof rem === 'number') vars[`--semantic-font-size-${role}-${step}`] = `${rem}rem`;
      }
    }
  }

  // 10. Text-colour overrides.
  const tc = spec.textColors;
  if (tc) {
    vars['--semantic-color-text-default'] = tc.default;
    vars['--semantic-color-text-muted'] = tc.muted;
    vars['--semantic-color-text-accent'] = tc.accent;
    vars['--semantic-color-text-inverse'] = tc.inverse;
  }

  // 11. Semantic-colour layer (standard mode) — ramp refs override the derived
  // semantics above. Inverse mode is emitted separately (see inverseSemanticVars).
  const sc = spec.semanticColors;
  if (sc) {
    for (const [key, modes] of Object.entries(sc)) {
      const v = rampRefToVar(modes.standard);
      if (v) vars[`--semantic-color-${key}`] = v;
    }
  }

  // 12. Icon variation axes (Material Symbols) applied to all icons.
  const ic = spec.icon;
  if (ic) {
    vars['--a1-icon-fill'] = ic.fill ? '1' : '0';
    vars['--a1-icon-weight'] = String(ic.weight);
    vars['--a1-icon-grade'] = String(ic.grade);
    vars['--base-icon-optical-size'] = String(ic.opticalSize);
  }

  return vars;
}

/** Build a drop-in theme.json string for `system/themes/`. */
export function themeJsonString(spec: ThemeSpec, meta: { name: string; description?: string }): string {
  const slug = (meta.name || 'custom').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'custom';
  const selector = `.a1-theme-${slug}`;
  const vars = compileThemeVars(spec);
  const inverse = inverseSemanticVars(spec.semanticColors);
  const selectors: Record<string, Record<string, string>> = { [selector]: vars };
  if (Object.keys(inverse).length) selectors[`${selector} .a1-inverse`] = inverse;
  return JSON.stringify({
    name: meta.name || 'Custom',
    description: meta.description || '',
    selectors,
    labels: {},
  }, null, 2);
}
