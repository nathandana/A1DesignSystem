import { DEFAULT_COLORS, generateColorRamp, RAMP_NAMES, RAMP_STOPS } from "./colorUtils.js";

const STORAGE_KEY = "a1-ds-themes";
const ACTIVE_KEY  = "a1-ds-active-theme";

function defaultTheme() {
  return { id: "default", name: "Default", colors: { ...DEFAULT_COLORS } };
}

export function loadThemes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return [defaultTheme()];
}

export function saveThemes(themes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
}

export function loadActiveId(themes) {
  const stored = localStorage.getItem(ACTIVE_KEY);
  if (stored && themes.some((t) => t.id === stored)) return stored;
  return themes[0].id;
}

export function saveActiveId(id) {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function createTheme(name, colors = DEFAULT_COLORS) {
  return { id: crypto.randomUUID(), name, colors: { ...colors } };
}

// Returns a JSON object with base color tokens and any component token overrides.
// allOverrides shape: { [componentId]: { light: { "--var": value }, dark: { ... } } }
export function exportThemeJson(theme, allOverrides = {}) {
  const base = { color: {} };
  for (const rampName of RAMP_NAMES) {
    const ramp = generateColorRamp(theme.colors[rampName]);
    if (!ramp) continue;
    base.color[rampName] = {};
    for (const stop of RAMP_STOPS) {
      base.color[rampName][String(stop)] = ramp[stop];
    }
  }

  const result = { base };

  // Flatten per-component overrides into { light: {}, dark: {} }
  const flat = {};
  for (const modeMap of Object.values(allOverrides)) {
    for (const [mode, tokens] of Object.entries(modeMap)) {
      if (!flat[mode]) flat[mode] = {};
      Object.assign(flat[mode], tokens);
    }
  }

  // Only emit modes that have at least one entry
  const overrides = {};
  for (const [mode, tokens] of Object.entries(flat)) {
    if (Object.keys(tokens).length > 0) overrides[mode] = tokens;
  }
  if (Object.keys(overrides).length > 0) result.overrides = overrides;

  return result;
}
