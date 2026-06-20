/**
 * Saved custom themes (localStorage). Each theme holds full 12-stop colour ramps,
 * three fonts, and a roundness — the editable shape behind the theme editor. The
 * Theme editor lists these as cards (like Projects) and opens one for editing.
 */
import { DEFAULT_RAMPS, type RampName } from './themeColors';
import { appendHistory } from '../services/historyDb';
import { rampsFrom500, type Ramp, type ThemeFonts } from './themeCompile';

const KEY = 'a1-themes';

export interface FontWeights {
  display: number;
  heading: number;
  body: number;
}

/**
 * Per-role typographic refinements. These are **preview-only** tuning in the
 * theme editor — they are NOT compiled into the theme tokens / theme.json. In
 * particular `textTransform: 'uppercase'` is a flagged accessibility concern and
 * is never emitted into A1 design-system output (see the "never uppercase"
 * system law); the editor surfaces a warning when it is selected.
 */
export interface TypeAdvanced {
  fontSynthesis: 'auto' | 'none';
  fontSynthesisWeight: 'auto' | 'none';
  fontSynthesisStyle: 'auto' | 'none';
  fontSynthesisSmallCaps: 'auto' | 'none';
  fontKerning: 'auto' | 'normal' | 'none';
  fontOpticalSizing: 'auto' | 'none';
  fontSizeAdjust: number; // ex-height × 100; 0 = none
  textRendering: 'auto' | 'optimizeLegibility' | 'optimizeSpeed' | 'geometricPrecision';
  webkitFontSmoothing: 'auto' | 'antialiased' | 'none';
  mozOsxFontSmoothing: 'auto' | 'grayscale';
}

export interface TypeRoleStyle {
  letterSpacing: number; // em × 100 (kept small); 0 = normal
  fontStyle: 'normal' | 'italic';
  textTransform: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  advanced: TypeAdvanced;
}
export interface TypeStyles {
  display: TypeRoleStyle;
  heading: TypeRoleStyle;
  body: TypeRoleStyle;
}

/** Per-role size scale (step → rem), mirroring the A1 `--semantic-font-size-{role}-{step}` tokens. */
export type RoleScale = Record<string, number>;
export interface FontSizes {
  display: RoleScale;
  heading: RoleScale;
  body: RoleScale;
}
export interface TextColors {
  default: string;
  muted: string;
  accent: string;
  inverse: string;
}

/** Ordered scale steps per role — the token suffixes for `--semantic-font-size-{role}-{step}`. */
export const SCALE_STEPS: Record<'display' | 'heading' | 'body', string[]> = {
  display: ['x-jumbo', 'jumbo', 'xxl', 'xl', 'lg', 'md', 'sm'],
  heading: ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'],
  body: ['xl', 'lg', 'md', 'sm', 'xs', '2xs', '3xs'],
};
export const DEFAULT_FONT_SIZES: FontSizes = {
  display: { 'x-jumbo': 6, jumbo: 4.5, xxl: 3.5, xl: 2.5, lg: 2, md: 1.75, sm: 1.5 },
  heading: { xxl: 2.5, xl: 2, lg: 1.75, md: 1.5, sm: 1.25, xs: 1.125 },
  body: { xl: 1.25, lg: 1.125, md: 1, sm: 0.875, xs: 0.75, '2xs': 0.625, '3xs': 0.5 },
};
export const DEFAULT_TEXT_COLORS: TextColors = {
  default: '#060b14',
  muted: '#64748b',
  accent: '#7c3aed',
  inverse: '#ffffff',
};

/** Material Symbols variation axes applied to all icons. */
export interface IconSettings {
  fill: boolean;       // FILL 0 | 1
  weight: number;      // wght 100…700
  grade: number;       // GRAD -50…200
  opticalSize: number; // opsz 20 | 24 | 40 | 48
}
export const DEFAULT_ICON_SETTINGS: IconSettings = { fill: false, weight: 400, grade: 0, opticalSize: 24 };

/**
 * The semantic colour layer. Each semantic token (keyed by the suffix after
 * `--semantic-color-`) maps to a **ramp reference** (`"<ramp>:<stop>"`, e.g.
 * `"accent:500"`) for the **standard** mode and another for the **inverse**
 * (dark-island) mode. The editor picks these from the ramp; the compiler emits
 * the standard values on the theme selector and the inverse values on the
 * theme's `.a1-inverse` scope.
 */
export interface SemanticColorModes {
  standard: string; // ramp ref "<ramp>:<stop>" (or a hex)
  inverse: string;
}
export type SemanticColors = Record<string, SemanticColorModes>;

/** UI grouping for the semantic editor: ordered groups → `[tokenKey, label]`. */
export const SEMANTIC_COLOR_GROUPS: { id: string; label: string; tokens: [string, string][] }[] = [
  { id: 'action', label: 'Action', tokens: [
    ['action-background', 'Background'],
    ['action-foreground', 'Foreground'],
    ['action-surface', 'Surface'],
    ['action-border', 'Border'],
  ] },
  { id: 'text', label: 'Text', tokens: [
    ['text-default', 'Default'],
    ['text-muted', 'Muted'],
    ['text-accent', 'Accent'],
  ] },
  { id: 'surface', label: 'Surface', tokens: [
    ['surface-page', 'Page'],
    ['surface-card', 'Card'],
    ['surface-raised', 'Raised'],
  ] },
  { id: 'border', label: 'Border', tokens: [
    ['border-subtle', 'Subtle'],
    ['border-default', 'Default'],
    ['border-strong', 'Strong'],
  ] },
  { id: 'status', label: 'Status', tokens: [
    ['status-info-background', 'Info background'],
    ['status-info-foreground', 'Info foreground'],
    ['status-success-background', 'Success background'],
    ['status-success-foreground', 'Success foreground'],
    ['status-warn-background', 'Warn background'],
    ['status-warn-foreground', 'Warn foreground'],
    ['status-error-background', 'Error background'],
    ['status-error-foreground', 'Error foreground'],
  ] },
];

export const DEFAULT_SEMANTIC_COLORS: SemanticColors = {
  'action-background': { standard: 'accent:500', inverse: 'accent:400' },
  'action-foreground': { standard: 'accent:0', inverse: 'accent:1000' },
  'action-surface': { standard: 'accent:50', inverse: 'accent:900' },
  'action-border': { standard: 'accent:300', inverse: 'accent:500' },
  'text-default': { standard: 'neutral:900', inverse: 'neutral:50' },
  'text-muted': { standard: 'neutral:500', inverse: 'neutral:300' },
  'text-accent': { standard: 'accent:600', inverse: 'accent:300' },
  'surface-page': { standard: 'neutral:0', inverse: 'neutral:900' },
  'surface-card': { standard: 'neutral:0', inverse: 'neutral:800' },
  'surface-raised': { standard: 'neutral:50', inverse: 'neutral:700' },
  'border-subtle': { standard: 'neutral:100', inverse: 'neutral:700' },
  'border-default': { standard: 'neutral:200', inverse: 'neutral:600' },
  'border-strong': { standard: 'neutral:300', inverse: 'neutral:400' },
  'status-info-background': { standard: 'info:500', inverse: 'info:400' },
  'status-info-foreground': { standard: 'info:0', inverse: 'neutral:900' },
  'status-success-background': { standard: 'success:500', inverse: 'success:400' },
  'status-success-foreground': { standard: 'success:0', inverse: 'neutral:900' },
  'status-warn-background': { standard: 'warn:500', inverse: 'warn:400' },
  'status-warn-foreground': { standard: 'warn:0', inverse: 'neutral:900' },
  'status-error-background': { standard: 'error:500', inverse: 'error:400' },
  'status-error-foreground': { standard: 'error:0', inverse: 'neutral:900' },
};

export interface StoredTheme {
  id: string;
  name: string;
  description: string;
  ramps: Record<RampName, Ramp>;
  fonts: ThemeFonts;
  fontWeights: FontWeights;
  typeStyles: TypeStyles;
  fontSizes: FontSizes;
  textColors: TextColors;
  semanticColors: SemanticColors;
  icon: IconSettings;
  roundness: number;
  createdAt: number;
  updatedAt: number;
}

const DEFAULT_FONTS: ThemeFonts = { display: 'Playfair Display', heading: 'Playfair Display', body: 'Inter' };
export const DEFAULT_FONT_WEIGHTS: FontWeights = { display: 700, heading: 700, body: 400 };
export const DEFAULT_TYPE_ADVANCED: TypeAdvanced = {
  fontSynthesis: 'auto',
  fontSynthesisWeight: 'auto',
  fontSynthesisStyle: 'auto',
  fontSynthesisSmallCaps: 'auto',
  fontKerning: 'auto',
  fontOpticalSizing: 'auto',
  fontSizeAdjust: 0,
  textRendering: 'auto',
  webkitFontSmoothing: 'auto',
  mozOsxFontSmoothing: 'auto',
};
const DEFAULT_ROLE_STYLE: TypeRoleStyle = {
  letterSpacing: 0,
  fontStyle: 'normal',
  textTransform: 'none',
  advanced: { ...DEFAULT_TYPE_ADVANCED },
};
export const DEFAULT_TYPE_STYLES: TypeStyles = {
  display: { ...DEFAULT_ROLE_STYLE },
  heading: { ...DEFAULT_ROLE_STYLE },
  body: { ...DEFAULT_ROLE_STYLE },
};

function uid(): string {
  return `thm_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

type Listener = () => void;
const listeners = new Set<Listener>();
export function subscribeThemes(fn: Listener): () => void { listeners.add(fn); return () => listeners.delete(fn); }
function notify(): void { for (const fn of listeners) fn(); }

function read(): StoredTheme[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as StoredTheme[]) : null;
    if (Array.isArray(list) && list.length) return list;
  } catch { /* ignore */ }
  // Seed a starter theme on first run so the list isn't empty.
  const seed = makeTheme('Starter', 'A neutral starting point — duplicate and dial it in.');
  try { localStorage.setItem(KEY, JSON.stringify([seed])); } catch { /* ignore */ }
  return [seed];
}

function write(list: StoredTheme[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
  notify();
}

function makeTheme(name: string, description = ''): StoredTheme {
  const now = Date.now();
  return {
    id: uid(),
    name,
    description,
    ramps: rampsFrom500({ ...DEFAULT_RAMPS }),
    fonts: { ...DEFAULT_FONTS },
    fontWeights: { ...DEFAULT_FONT_WEIGHTS },
    typeStyles: {
      display: { ...DEFAULT_ROLE_STYLE, advanced: { ...DEFAULT_TYPE_ADVANCED } },
      heading: { ...DEFAULT_ROLE_STYLE, advanced: { ...DEFAULT_TYPE_ADVANCED } },
      body: { ...DEFAULT_ROLE_STYLE, advanced: { ...DEFAULT_TYPE_ADVANCED } },
    },
    fontSizes: {
      display: { ...DEFAULT_FONT_SIZES.display },
      heading: { ...DEFAULT_FONT_SIZES.heading },
      body: { ...DEFAULT_FONT_SIZES.body },
    },
    textColors: { ...DEFAULT_TEXT_COLORS },
    semanticColors: structuredClone(DEFAULT_SEMANTIC_COLORS),
    icon: { ...DEFAULT_ICON_SETTINGS },
    roundness: 8,
    createdAt: now,
    updatedAt: now,
  };
}

export function listThemes(): StoredTheme[] {
  return read().slice().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getTheme(id: string): StoredTheme | undefined {
  return read().find((t) => t.id === id);
}

export function createTheme(name = 'Untitled theme'): StoredTheme {
  const theme = makeTheme(name);
  write([...read(), theme]);
  return theme;
}

export function duplicateTheme(id: string): StoredTheme | undefined {
  const src = getTheme(id);
  if (!src) return undefined;
  const copy: StoredTheme = { ...src, id: uid(), name: `${src.name} copy`, createdAt: Date.now(), updatedAt: Date.now() };
  write([...read(), copy]);
  return copy;
}

// Debounced shared-history logging for theme edits (coalesce rapid control tweaks
// into one entry). Only user edits call updateTheme — cloud hydrate uses write()
// directly — so this never logs on sync.
const histTimers: Record<string, ReturnType<typeof setTimeout>> = {};
function logThemeHistory(id: string): void {
  clearTimeout(histTimers[id]);
  histTimers[id] = setTimeout(() => {
    const theme = getTheme(id);
    if (theme) appendHistory({ entityType: 'theme', entityId: id, label: `Edited ${theme.name}`, snapshot: JSON.stringify(theme) });
  }, 4000);
}

export function updateTheme(id: string, patch: Partial<Omit<StoredTheme, 'id' | 'createdAt'>>): void {
  write(read().map((t) => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t)));
  logThemeHistory(id);
}

export function deleteTheme(id: string): void {
  write(read().filter((t) => t.id !== id));
}

/** Every saved theme (for cloud backup). */
export function exportThemes(): StoredTheme[] {
  return read();
}

/** Restore themes from a cloud backup (upsert by id; local-only themes kept).
 *  Returns the number of incoming themes. */
export function importThemes(themes: StoredTheme[]): number {
  if (!Array.isArray(themes) || !themes.length) return 0;
  const byId = new Map(read().map((t) => [t.id, t]));
  for (const t of themes) if (t && t.id) byId.set(t.id, t);
  write([...byId.values()]);
  return themes.length;
}
