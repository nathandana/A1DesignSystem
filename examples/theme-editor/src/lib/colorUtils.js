import { oklch, formatHex, clampChroma } from "culori";

export const RAMP_STOPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

export const RAMP_NAMES = ["neutral", "accent", "info", "error", "warn", "success"];

export const RAMP_LABELS = {
  neutral: "Neutral",
  accent:  "Accent",
  info:    "Info",
  error:   "Error",
  warn:    "Warning",
  success: "Success",
};

export const DEFAULT_COLORS = {
  neutral: "#64748b",
  accent:  "#7c3aed",
  info:    "#2563eb",
  error:   "#dc2626",
  warn:    "#d97706",
  success: "#16a34a",
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ease(t, exp) {
  return Math.pow(Math.max(0, Math.min(1, t)), exp);
}

function stopToHex(l, c, h) {
  const color = clampChroma(
    { mode: "oklch", l: Math.max(0, Math.min(1, l)), c: Math.max(0, c), h },
    "oklch",
    "rgb"
  );
  return formatHex(color);
}

export function generateColorRamp(hex500) {
  const parsed = oklch(hex500);
  if (!parsed) return null;

  const { l: L500, c: C500, h: H500 = 0 } = parsed;

  const L_LIGHT = 0.990;
  const L_DARK  = 0.040;

  const ramp = { 500: hex500 };

  // Light side: 400 is closest to 500, 0 is farthest
  const lightOrder = [400, 300, 200, 100, 50, 0];
  lightOrder.forEach((stop, i) => {
    const t = (i + 1) / lightOrder.length;
    const L = lerp(L500, L_LIGHT, ease(t, 0.80));
    const C = C500 * Math.max(0.01, 1 - ease(t, 1.10));
    ramp[stop] = stopToHex(L, C, H500);
  });

  // Dark side: 600 is closest to 500, 1000 is farthest
  const darkOrder = [600, 700, 800, 900, 1000];
  darkOrder.forEach((stop, i) => {
    const t = (i + 1) / darkOrder.length;
    const L = lerp(L500, L_DARK, ease(t, 0.80));
    const C = C500 * Math.max(0.01, 1 - ease(t, 1.40));
    ramp[stop] = stopToHex(L, C, H500);
  });

  return ramp;
}

export function allRampsToCssVars(colorMap) {
  const vars = {};
  for (const [rampName, hex] of Object.entries(colorMap)) {
    const ramp = generateColorRamp(hex);
    if (!ramp) continue;
    for (const stop of RAMP_STOPS) {
      vars[`--base-color-${rampName}-${stop}`] = ramp[stop];
    }
  }
  return vars;
}

export function generateCssString(colorMap) {
  const vars = allRampsToCssVars(colorMap);
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  return `:root {\n${lines.join("\n")}\n}`;
}
